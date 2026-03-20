import express from "express";
import {
	getAllWebsites,
	getWebsiteById,
	createWebsite,
} from "../controllers/website.controller.js";
import { verifyJWT, checkAdminPassKey } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.get("/", verifyJWT ,getAllWebsites);
router.get("/:id",verifyJWT, getWebsiteById);


router.post("/", checkAdminPassKey, createWebsite);

export default router;
