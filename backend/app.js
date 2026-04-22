import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import connectDB from "./db.js";
import passport from "./config/passport.js";

configDotenv();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.use(passport.initialize());


import userRouter from "./routes/user.routes.js";
import google_authRouter from "./routes/google_auth.routes.js";
import websiteRouter from "./routes/website.routes.js";
import sessionRouter from "./routes/session.routes.js";
import interactionRouter from "./routes/interaction.routes.js";
import analyticsRouter from "./routes/analytics.route.js";


app.use("/api/auth", google_authRouter);
app.use("/api/user", userRouter);


app.use("/api/websites", websiteRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/interactions", interactionRouter);
app.use("/api/analytics", analyticsRouter);

app.get("/", (req, res) => {
	res.send("SmartScope API is running");
});


app.use((err, req, res, next) => {
	console.error('Error:', err);
	
	res.status(err.status || 500).json({
		success: false,
		message: err.message || 'Internal server error',
		...(process.env.NODE_ENV === 'development' && { stack: err.stack })
	});
});


app.use((req, res) => {
	res.status(404).json({
		success: false,
		message: 'Route not found'
	});
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

export default app;
