import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Clock,
	Bookmark,
	Share2,
	Eye,
	ThumbsUp,
	Search,
	TrendingUp,
	Calendar,
} from "lucide-react";
import { SessionProvider, useSession } from "@/context/SessionContext";
import { InteractionProvider } from "@/context/InteractionContext";
import { useInteractionTracker } from "@/hooks/useInteractionTracker";
import { useWebsites } from "@/hooks/useWebsites";

const BlogContent = ({ websiteId }) => {
	const navigate = useNavigate();
	const { currentSession, startSession, endSession } = useSession();
	const { trackClick, trackPageView } = useInteractionTracker();

	const [selectedArticle, setSelectedArticle] = useState(null);
	const [bookmarks, setBookmarks] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [likes, setLikes] = useState({});

	const articles = [
		{
			id: "article_1",
			title: "The Future of AI in Web Development",
			excerpt:
				"Exploring how artificial intelligence is revolutionizing the way we build websites and web applications. From automated testing to intelligent code completion, AI is making developers more productive.",
			category: "Technology",
			readTime: "5 min read",
			image: "🤖",
			views: 12543,
			likes: 456,
			publishDate: "Dec 15, 2024",
			author: "Sarah Johnson",
			authorAvatar: "👩‍💻",
			content: `Artificial Intelligence is fundamentally reshaping the landscape of web development. As we move into 2024 and beyond, AI tools are becoming indispensable partners in the development process.

Machine learning models can now predict user behavior with unprecedented accuracy, optimize website performance automatically, and even generate production-ready code snippets. Tools like GitHub Copilot and ChatGPT are already transforming how developers work daily.

But AI's impact goes far beyond code generation. Intelligent testing frameworks can now identify bugs before they reach production, automated accessibility checkers ensure inclusive design, and AI-powered analytics provide deeper insights into user behavior than ever before.

The future of web development will be a symbiotic relationship between human creativity and AI efficiency. Developers who embrace these tools will find themselves more productive, creative, and able to focus on solving complex problems rather than repetitive tasks.

Key areas where AI is making the biggest impact:

1. Automated Code Generation: AI can write boilerplate code, suggest optimizations, and even refactor existing code to improve performance.

2. Intelligent Testing: Machine learning models can predict which parts of your application are most likely to break and focus testing efforts accordingly.

3. Personalization at Scale: AI enables websites to adapt to individual users in real-time, creating unique experiences for millions of visitors.

4. Performance Optimization: AI algorithms can analyze user behavior patterns and automatically optimize loading times, resource allocation, and caching strategies.

5. Security Enhancement: Machine learning models can detect and prevent security threats in real-time, identifying patterns that would be impossible for humans to spot.

As we look to the future, the question isn't whether AI will change web development - it's how quickly we can adapt to harness its full potential. The developers who thrive will be those who view AI as a powerful tool in their arsenal, not a replacement for human ingenuity.`,
		},
		{
			id: "article_2",
			title: "Mastering React Hooks in 2024",
			excerpt:
				"A comprehensive guide to understanding and using React Hooks effectively in modern applications. Learn the patterns and best practices that will make you a better React developer.",
			category: "Development",
			readTime: "8 min read",
			image: "⚛️",
			views: 18234,
			likes: 789,
			publishDate: "Dec 12, 2024",
			author: "Mike Chen",
			authorAvatar: "👨‍💼",
			content: `React Hooks transformed the way we write React components when they were introduced, and they continue to evolve. Understanding hooks deeply is crucial for any modern React developer.

The most commonly used hooks - useState and useEffect - are just the beginning. Custom hooks, useCallback, useMemo, and useContext form the foundation of advanced React patterns.

Let's dive deep into each hook and understand when and how to use them effectively.

**useState: Managing Component State**

The useState hook is the foundation of state management in functional components. While it seems simple, there are important patterns to understand:

- Functional updates: When new state depends on previous state, always use the functional form
- Multiple state variables: Break down complex state into multiple useState calls for better organization
- State initialization: Lazy initialization can improve performance for expensive calculations

**useEffect: Handling Side Effects**

Understanding the dependency array is crucial. Every variable used inside useEffect should be in the dependency array, or you risk stale closures and bugs.

Common pitfalls include:
- Missing dependencies leading to stale data
- Unnecessary re-renders from including too many dependencies
- Not cleaning up side effects properly

**Custom Hooks: Reusable Logic**

Custom hooks are where React's composability really shines. They let you extract component logic into reusable functions. Best practices include:

- Always prefix custom hooks with "use"
- Keep hooks focused on a single responsibility
- Return values in a consistent format
- Document complex hooks thoroughly

**Performance Optimization**

useCallback and useMemo are powerful tools, but overuse can make code harder to read without meaningful performance gains. Use them when:

- Passing callbacks to optimized child components
- Expensive calculations that don't need to run on every render
- Referential equality is important for dependency arrays

**Advanced Patterns**

Combining hooks creates powerful patterns:
- useReducer for complex state logic
- useContext for prop drilling solutions
- Custom hooks combining multiple primitive hooks

The key to mastering React Hooks is understanding that they're tools, not magic. Each hook solves specific problems, and knowing which tool to use when is what separates good React developers from great ones.`,
		},
		{
			id: "article_3",
			title: "Building Scalable Backend Systems",
			excerpt:
				"Best practices for designing backend architectures that can handle millions of users. Learn about microservices, caching strategies, and database optimization techniques.",
			category: "Backend",
			readTime: "10 min read",
			image: "🔧",
			views: 9876,
			likes: 432,
			publishDate: "Dec 10, 2024",
			author: "David Kumar",
			authorAvatar: "👨‍🔧",
			content: `Scalability isn't just about handling more traffic - it's about building systems that grow gracefully. A truly scalable backend can handle increased load without degrading performance or requiring complete rewrites.

**The Fundamentals of Scalable Architecture**

Before diving into specific technologies, understand these core principles:

1. Stateless Design: Each request should be independent. This enables horizontal scaling and makes your system more resilient.

2. Database Optimization: Your database is often the bottleneck. Proper indexing, query optimization, and connection pooling are essential.

3. Caching Strategy: Cache aggressively at multiple layers - database query results, API responses, and static content.

4. Asynchronous Processing: Move heavy operations to background jobs. Your API should respond quickly, processing heavy work asynchronously.

**Microservices vs Monoliths**

The microservices vs monolith debate continues, but the answer depends on your needs:

Monoliths are simpler to develop and deploy initially. They're perfect for:
- Small to medium teams
- Early-stage products
- Applications with tightly coupled features

Microservices offer flexibility and scalability but come with complexity:
- Each service can scale independently
- Different teams can work on different services
- Technology diversity is possible
- However, deployment, monitoring, and debugging become more complex

**Message Queues and Event-Driven Architecture**

Message queues (RabbitMQ, Kafka, Redis) decouple your services and enable asynchronous processing. They're essential for:
- Handling traffic spikes
- Background job processing
- Service-to-service communication
- Event sourcing patterns

**Database Scaling Strategies**

- Read Replicas: Distribute read traffic across multiple database instances
- Sharding: Partition data across multiple databases
- Caching: Redis or Memcached to reduce database load
- Connection Pooling: Reuse database connections efficiently

**Monitoring and Observability**

You can't scale what you can't measure. Implement:
- Application Performance Monitoring (APM)
- Distributed tracing
- Centralized logging
- Real-time alerting

**Load Balancing**

Distribute traffic across multiple servers:
- Round-robin for simple cases
- Least connections for variable load
- IP hash for session affinity
- Geographic routing for global applications

Building scalable systems is a journey, not a destination. Start simple, measure everything, and scale the bottlenecks as you grow.`,
		},
		{
			id: "article_4",
			title: "UI/UX Design Trends 2024",
			excerpt:
				"The latest design trends shaping user experiences in modern web applications. From bold typography to micro-interactions, discover what's defining great design.",
			category: "Design",
			readTime: "6 min read",
			image: "🎨",
			views: 15432,
			likes: 891,
			publishDate: "Dec 8, 2024",
			author: "Emma Martinez",
			authorAvatar: "👩‍🎨",
			content: `Design trends evolve rapidly, but 2024 is seeing a fascinating blend of bold experimentation and user-centric pragmatism. Let's explore what's shaping the future of digital design.

**Bold Typography Takes Center Stage**

Large, expressive typography isn't just a trend - it's a statement. Designers are using type as a primary design element, not just for conveying information but for creating visual impact.

Key approaches:
- Oversized headlines that command attention
- Creative font pairings that express brand personality
- Variable fonts that adapt to context
- Typography as illustration

**Dark Mode Evolution**

Dark mode is no longer optional - it's expected. But we're moving beyond simple color inversion:

- Thoughtful color palettes designed specifically for dark backgrounds
- Proper contrast ratios for accessibility
- Smooth transitions between light and dark modes
- Using darkness to create depth and hierarchy

**Micro-Interactions and Animations**

Subtle animations enhance user experience without being distracting:

- Loading states that inform and entertain
- Hover effects that provide feedback
- Scroll-triggered animations that guide attention
- Gesture-based interactions on mobile

**Minimalism Meets Functionality**

The trend toward minimalism continues, but with an important caveat - never sacrifice usability for aesthetics:

- Generous white space for breathing room
- Clear visual hierarchy
- Purposeful use of color
- Every element serves a function

**Accessibility-First Design**

Accessibility isn't a feature - it's a requirement. 2024 sees designers prioritizing:

- Sufficient color contrast ratios
- Keyboard navigation support
- Screen reader compatibility
- Clear focus indicators
- Flexible layouts that accommodate different needs

**3D Elements and Immersive Experiences**

WebGL and improved browser capabilities enable rich 3D experiences:

- Product visualization
- Interactive storytelling
- Immersive brand experiences
- But used judiciously - performance matters

**Neumorphism and Glassmorphism**

Soft UI trends continue evolving:

- Subtle shadows and highlights creating depth
- Frosted glass effects for layers
- Tactile, almost physical interfaces
- Balance between skeuomorphism and flat design

**Personalization and Adaptive Interfaces**

Designs that adapt to individual users:

- Content recommendations
- Layout preferences
- Accessibility adjustments
- Context-aware interfaces

**Sustainable Design**

Eco-conscious design considers:

- Performance optimization to reduce energy consumption
- Efficient image and video formats
- Dark modes to save battery
- Minimal, efficient code

The best designs in 2024 aren't following trends blindly - they're using these tools thoughtfully to create experiences that are both beautiful and functional. The goal isn't to be trendy; it's to solve real problems for real users.`,
		},
		{
			id: "article_5",
			title: "Getting Started with Machine Learning",
			excerpt:
				"A beginner-friendly introduction to machine learning concepts and practical applications. No PhD required!",
			category: "Technology",
			readTime: "7 min read",
			image: "🧠",
			views: 11234,
			likes: 567,
			publishDate: "Dec 5, 2024",
			author: "Alex Thompson",
			authorAvatar: "👨‍🔬",
			content: `Machine Learning seems intimidating, but it doesn't have to be. This guide breaks down complex concepts into digestible pieces anyone can understand.

**What is Machine Learning?**

At its core, machine learning is teaching computers to learn from data rather than explicitly programming every rule. Instead of telling a computer "if this, then that," we show it examples and let it figure out the patterns.

**Types of Machine Learning**

1. Supervised Learning: Learning from labeled examples
   - Classification: Categorizing data (spam detection, image recognition)
   - Regression: Predicting numbers (house prices, stock values)

2. Unsupervised Learning: Finding patterns in unlabeled data
   - Clustering: Grouping similar items
   - Dimensionality reduction: Simplifying complex data

3. Reinforcement Learning: Learning through trial and error
   - Game playing
   - Robotics
   - Recommendation systems

**Key Concepts Explained Simply**

Training Data: Examples you show the model
Features: Characteristics the model uses to make decisions
Model: The "brain" that makes predictions
Accuracy: How often the model is right

**Practical Applications**

Machine learning is everywhere:
- Email spam filters
- Netflix recommendations
- Voice assistants
- Fraud detection
- Medical diagnosis
- Self-driving cars

**Getting Started**

1. Learn Python basics
2. Understand statistics fundamentals
3. Start with scikit-learn library
4. Work on small projects
5. Join ML communities

**Common Pitfalls**

- Using too little data
- Overfitting to training data
- Ignoring data quality
- Choosing wrong algorithms
- Not validating results properly

**Your First ML Project**

Start simple:
1. Choose a clear problem
2. Gather quality data
3. Pick a simple algorithm
4. Train and test
5. Iterate and improve

Machine learning is a journey. Start small, learn continuously, and don't be afraid to experiment. The best way to learn is by doing!`,
		},
		{
			id: "article_6",
			title: "Cybersecurity Best Practices for Developers",
			excerpt:
				"Essential security practices every developer should know. Protect your applications and users from common vulnerabilities.",
			category: "Backend",
			readTime: "9 min read",
			image: "🔒",
			views: 8765,
			likes: 398,
			publishDate: "Dec 1, 2024",
			author: "Rachel Green",
			authorAvatar: "👩‍💼",
			content: `Security isn't optional - it's essential. Every line of code you write is a potential attack vector. Here's how to build secure applications from the ground up.

**The Security Mindset**

Think like an attacker. Ask yourself:
- What's the worst that could happen?
- Where is user input accepted?
- What data is most sensitive?
- Who should have access to what?

**Common Vulnerabilities (OWASP Top 10)**

1. Injection Attacks
   - SQL injection
   - Command injection
   - LDAP injection
   Prevention: Use parameterized queries, validate input

2. Broken Authentication
   - Weak passwords
   - Session management issues
   - Credential stuffing
   Prevention: Strong password policies, MFA, secure sessions

3. Sensitive Data Exposure
   - Unencrypted data transmission
   - Weak encryption
   - Exposed API keys
   Prevention: HTTPS everywhere, strong encryption, secret management

4. XML External Entities (XXE)
   Prevention: Disable external entity processing

5. Broken Access Control
   Prevention: Implement proper authorization checks

**Input Validation**

Never trust user input:
- Validate on both client and server
- Sanitize before processing
- Use allowlists, not denylists
- Encode output properly

**Authentication Best Practices**

- Use established libraries (don't roll your own crypto)
- Implement multi-factor authentication
- Use secure password hashing (bcrypt, Argon2)
- Implement account lockout after failed attempts
- Use secure session management

**API Security**

- Use HTTPS exclusively
- Implement rate limiting
- Use API keys properly
- Validate all inputs
- Return appropriate error messages (don't leak info)

**Database Security**

- Use parameterized queries
- Implement least privilege access
- Encrypt sensitive data
- Regular backups
- Monitor for suspicious activity

**Dependency Management**

- Keep dependencies updated
- Use security scanners
- Review dependency code
- Use lock files
- Monitor security advisories

**Security Headers**

Essential HTTP headers:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- X-XSS-Protection

**Logging and Monitoring**

- Log security events
- Don't log sensitive data
- Monitor for anomalies
- Set up alerts
- Regular security audits

**The Security Development Lifecycle**

- Threat modeling
- Secure code review
- Security testing
- Incident response planning
- Regular updates

Security is an ongoing process, not a one-time task. Stay informed about new threats, keep your skills updated, and always prioritize your users' security and privacy.`,
		},
	];

	const categories = ["all", "Technology", "Development", "Backend", "Design"];

	useEffect(() => {
		if (websiteId && !currentSession) {
			startSession(websiteId);
		}
		trackPageView("Blog Home");
		return () => {
			if (currentSession) {
				endSession("/demo/blog");
			}
		};
	}, [websiteId]);

	const handleArticleClick = (article) => {
		setSelectedArticle(article);
		trackClick(`article-${article.id}`, "card", article.title, {
			interactionType: "view",
			actionCategory: "content_interaction",
			entityData: {
				entityType: "article",
				entityId: article.id,
				entityName: article.title,
				attributes: {
					category: article.category,
					readTime: article.readTime,
				},
			},
		});
		trackPageView(`Article: ${article.title}`);
		window.scrollTo(0, 0);
	};

	const handleBookmark = (articleId) => {
		const isBookmarked = bookmarks.includes(articleId);
		if (isBookmarked) {
			setBookmarks(bookmarks.filter((id) => id !== articleId));
		} else {
			setBookmarks([...bookmarks, articleId]);
		}
		trackClick(
			`bookmark-${articleId}`,
			"button",
			isBookmarked ? "Remove Bookmark" : "Add Bookmark",
		);
	};

	const handleLike = (articleId) => {
		setLikes({ ...likes, [articleId]: !likes[articleId] });
		trackClick(
			`like-${articleId}`,
			"button",
			likes[articleId] ? "Unlike" : "Like",
		);
	};

	const filteredArticles = articles.filter((article) => {
		const matchesCategory =
			selectedCategory === "all" || article.category === selectedCategory;
		const matchesSearch =
			article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	if (selectedArticle) {
		return (
			<div className="min-h-screen bg-gray-950">
				<header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-lg">
					<div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
						<button
							onClick={() => {
								setSelectedArticle(null);
								trackClick("back-to-articles", "button", "Back to Articles");
							}}
							className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white"
						>
							<ArrowLeft className="w-5 h-5" />
							<span>Back to Articles</span>
						</button>

						<div className="flex items-center gap-2">
							<button
								onClick={() => handleBookmark(selectedArticle.id)}
								className={`p-2 rounded-lg transition ${
									bookmarks.includes(selectedArticle.id)
										? "bg-yellow-900/30 text-yellow-400"
										: "hover:bg-gray-800 text-gray-400 hover:text-yellow-400"
								}`}
							>
								<Bookmark
									className={`w-5 h-5 ${bookmarks.includes(selectedArticle.id) ? "fill-current" : ""}`}
								/>
							</button>
							<button
								onClick={() =>
									trackClick(
										`share-${selectedArticle.id}`,
										"button",
										"Share Article",
									)
								}
								className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-green-400"
							>
								<Share2 className="w-5 h-5" />
							</button>
						</div>
					</div>
				</header>

				<article className="max-w-4xl mx-auto px-4 py-12">
					<div className="text-8xl mb-8 text-center">
						{selectedArticle.image}
					</div>

					<div className="mb-6">
						<span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm font-semibold">
							{selectedArticle.category}
						</span>
					</div>

					<h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
						{selectedArticle.title}
					</h1>

					<div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-800">
						<div className="flex items-center gap-3">
							<div className="text-3xl">{selectedArticle.authorAvatar}</div>
							<div>
								<p className="text-white font-semibold">
									{selectedArticle.author}
								</p>
								<div className="flex items-center gap-3 text-sm text-gray-500">
									<span className="flex items-center gap-1">
										<Calendar className="w-3 h-3" />
										{selectedArticle.publishDate}
									</span>
									<span>•</span>
									<span className="flex items-center gap-1">
										<Clock className="w-3 h-3" />
										{selectedArticle.readTime}
									</span>
									<span>•</span>
									<span className="flex items-center gap-1">
										<Eye className="w-3 h-3" />
										{selectedArticle.views.toLocaleString()} views
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="prose prose-invert prose-lg max-w-none">
						<div className="text-gray-300 leading-relaxed text-lg space-y-6 whitespace-pre-line">
							{selectedArticle.content}
						</div>
					</div>

					<div className="mt-12 pt-8 border-t border-gray-800">
						<div className="flex items-center justify-between">
							<button
								onClick={() => handleLike(selectedArticle.id)}
								className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
									likes[selectedArticle.id]
										? "bg-pink-900/30 text-pink-400"
										: "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-pink-400"
								}`}
							>
								<ThumbsUp
									className={`w-5 h-5 ${likes[selectedArticle.id] ? "fill-current" : ""}`}
								/>
								{selectedArticle.likes + (likes[selectedArticle.id] ? 1 : 0)}{" "}
								Likes
							</button>

							<div className="flex gap-3">
								<button
									onClick={() => handleBookmark(selectedArticle.id)}
									className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
										bookmarks.includes(selectedArticle.id)
											? "bg-yellow-900/30 text-yellow-400"
											: "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-yellow-400"
									}`}
								>
									<Bookmark
										className={`w-5 h-5 ${bookmarks.includes(selectedArticle.id) ? "fill-current" : ""}`}
									/>
									{bookmarks.includes(selectedArticle.id)
										? "Bookmarked"
										: "Bookmark"}
								</button>
								<button
									onClick={() =>
										trackClick(
											`share-article-${selectedArticle.id}`,
											"button",
											"Share",
										)
									}
									className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-gray-400 rounded-xl font-semibold hover:bg-gray-700 hover:text-green-400 transition"
								>
									<Share2 className="w-5 h-5" />
									Share
								</button>
							</div>
						</div>
					</div>

					
					<div className="mt-16">
						<h2 className="text-2xl font-bold text-white mb-6">
							More Articles
						</h2>
						<div className="grid md:grid-cols-2 gap-6">
							{articles
								.filter(
									(a) =>
										a.id !== selectedArticle.id &&
										a.category === selectedArticle.category,
								)
								.slice(0, 2)
								.map((article) => (
									<div
										key={article.id}
										onClick={() => handleArticleClick(article)}
										className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-green-500 transition cursor-pointer group"
									>
										<div className="text-4xl mb-3">{article.image}</div>
										<h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition">
											{article.title}
										</h3>
										<p className="text-gray-400 text-sm">
											{article.excerpt.substring(0, 100)}...
										</p>
									</div>
								))}
						</div>
					</div>
				</article>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-950">
			<header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-lg">
				<div className="max-w-6xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-4">
							<button
								onClick={async () => {
									trackClick("back-button", "button", "Back to Demo Selection");
									
									if (currentSession) {
										await endSession("/demo/blog");
									}
									navigate("/demo");
								}}
								className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white"
							>
								<ArrowLeft className="w-5 h-5" />
							</button>
							<h1 className="text-2xl font-bold bg-linear-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
								TechBlog
							</h1>
						</div>

						<button
							onClick={() =>
								trackClick("bookmarks", "button", "View Bookmarks")
							}
							className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition"
						>
							<Bookmark className="w-4 h-4" />
							<span className="hidden sm:inline">
								Bookmarks ({bookmarks.length})
							</span>
						</button>
					</div>

					
					<div className="relative">
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search articles..."
							className="w-full px-6 py-3 pr-12 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:border-green-500 outline-none transition"
						/>
						<Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
					</div>
				</div>
			</header>

			<div className="max-w-6xl mx-auto px-4 py-12">
				
				<div className="text-center mb-16">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-500/20 rounded-full text-green-400 text-sm font-semibold mb-6">
						<TrendingUp className="w-4 h-4" />
						Latest Tech Insights
					</div>
					<h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
						Stay Updated with Technology
					</h2>
					<p className="text-gray-400 text-lg max-w-2xl mx-auto">
						Expert insights, tutorials, and analysis on web development, design,
						and emerging technologies
					</p>
				</div>

				
				<div className="flex flex-wrap gap-3 mb-12 justify-center">
					{categories.map((category) => (
						<button
							key={category}
							onClick={() => {
								setSelectedCategory(category);
								trackClick(
									`category-${category}`,
									"button",
									`Filter: ${category}`,
								);
							}}
							className={`px-6 py-3 rounded-xl font-semibold transition ${
								selectedCategory === category
									? "bg-green-600 text-white shadow-lg"
									: "bg-gray-900 border border-gray-800 text-gray-300 hover:border-green-500 hover:text-green-400"
							}`}
						>
							{category.charAt(0).toUpperCase() + category.slice(1)}
						</button>
					))}
				</div>

				
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{filteredArticles.map((article) => (
						<div
							key={article.id}
							onClick={() => handleArticleClick(article)}
							className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-green-500 transition cursor-pointer group"
						>
							<div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
								{article.image}
							</div>

							<div className="flex items-center justify-between mb-3">
								<span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-xs font-semibold">
									{article.category}
								</span>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleBookmark(article.id);
									}}
									className={`p-2 rounded-lg transition ${
										bookmarks.includes(article.id)
											? "text-yellow-400"
											: "text-gray-600 hover:text-yellow-400"
									}`}
								>
									<Bookmark
										className={`w-4 h-4 ${bookmarks.includes(article.id) ? "fill-current" : ""}`}
									/>
								</button>
							</div>

							<h3 className="text-xl font-bold mb-3 text-white group-hover:text-green-400 transition leading-tight">
								{article.title}
							</h3>

							<p className="text-gray-400 mb-4 text-sm leading-relaxed">
								{article.excerpt}
							</p>

							<div className="flex items-center justify-between pt-4 border-t border-gray-800">
								<div className="flex items-center gap-4 text-xs text-gray-500">
									<span className="flex items-center gap-1">
										<Clock className="w-3 h-3" />
										{article.readTime}
									</span>
									<span className="flex items-center gap-1">
										<Eye className="w-3 h-3" />
										{(article.views / 1000).toFixed(1)}k
									</span>
									<span className="flex items-center gap-1">
										<ThumbsUp className="w-3 h-3" />
										{article.likes}
									</span>
								</div>
							</div>

							<div className="flex items-center gap-2 mt-4">
								<div className="text-xl">{article.authorAvatar}</div>
								<div>
									<p className="text-xs font-semibold text-gray-300">
										{article.author}
									</p>
									<p className="text-xs text-gray-600">{article.publishDate}</p>
								</div>
							</div>
						</div>
					))}
				</div>

				{filteredArticles.length === 0 && (
					<div className="text-center py-20">
						<p className="text-gray-500 text-lg mb-4">No articles found</p>
						<button
							onClick={() => {
								setSearchQuery("");
								setSelectedCategory("all");
							}}
							className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
						>
							Clear Filters
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

const BlogSite = () => {
	const { websites, loading } = useWebsites();
	const blogWebsite = websites.find(
		(w) => w.type === "blog" || w.category === "content",
	);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-950 flex items-center justify-center">
				<div className="text-white">Loading...</div>
			</div>
		);
	}

	if (!blogWebsite) {
		return (
			<div className="min-h-screen bg-gray-950 flex items-center justify-center">
				<div className="text-white">Blog site not found</div>
			</div>
		);
	}

	return (
		<SessionProvider>
			<InteractionProvider websiteId={blogWebsite._id}>
				<BlogContent websiteId={blogWebsite._id} />
			</InteractionProvider>
		</SessionProvider>
	);
};

export default BlogSite;
