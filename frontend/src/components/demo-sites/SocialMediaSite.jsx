import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Heart,
	MessageCircle,
	Share2,
	Send,
	Bookmark,
	MoreVertical,
	Image as ImageIcon,
	Smile,
} from "lucide-react";
import { SessionProvider, useSession } from "@/context/SessionContext";
import { InteractionProvider } from "@/context/InteractionContext";
import { useInteractionTracker } from "@/hooks/useInteractionTracker";
import { useWebsites } from "@/hooks/useWebsites";

const SocialMediaContent = ({ websiteId }) => {
	const navigate = useNavigate();
	const { currentSession, startSession, endSession } = useSession();
	const { trackClick, trackPageView } = useInteractionTracker();

	const [posts, setPosts] = useState([
		{
			id: "post_1",
			author: "Tech Enthusiast",
			username: "@techie_dev",
			avatar: "👨‍💻",
			content:
				"Just built an amazing AI-powered chatbot using GPT-4! The future is here and it's incredible. Can't wait to share the demo with you all! 🚀\n\n#AI #MachineLearning #TechInnovation",
			image: null,
			likes: 1234,
			comments: 145,
			shares: 67,
			bookmarks: 89,
			timestamp: "2 hours ago",
			liked: false,
			bookmarked: false,
		},
		{
			id: "post_2",
			author: "Design Guru",
			username: "@design_master",
			avatar: "🎨",
			content:
				"New UI design trends for 2024 - minimalism meets bold colors! Swipe to see my latest work. What do you think about this approach?\n\nLet me know in the comments! 💫",
			image: "🖼️",
			likes: 2189,
			comments: 267,
			shares: 123,
			bookmarks: 234,
			timestamp: "5 hours ago",
			liked: false,
			bookmarked: false,
		},
		{
			id: "post_3",
			author: "Code Ninja",
			username: "@code_warrior",
			avatar: "🥷",
			content:
				"💡 Pro tip for developers:\n\nAlways write clean, readable code. Your future self (and your teammates) will thank you!\n\nHere are my top 5 coding practices:\n1. Meaningful variable names\n2. Consistent formatting\n3. Comment complex logic\n4. Keep functions small\n5. Test your code\n\n#CodingTips #BestPractices",
			image: null,
			likes: 3456,
			comments: 189,
			shares: 234,
			bookmarks: 456,
			timestamp: "1 day ago",
			liked: false,
			bookmarked: false,
		},
		{
			id: "post_4",
			author: "Startup Founder",
			username: "@startup_life",
			avatar: "💼",
			content:
				"🎉 HUGE MILESTONE! \n\nLaunched my SaaS product today and got 100 users in the first hour! Dreams really do come true when you work hard and stay persistent.\n\nThank you to everyone who supported this journey! This is just the beginning 🚀\n\n#StartupSuccess #Entrepreneurship #SaaS",
			image: "📊",
			likes: 5678,
			comments: 320,
			shares: 456,
			bookmarks: 567,
			timestamp: "2 days ago",
			liked: false,
			bookmarked: false,
		},
		{
			id: "post_5",
			author: "Data Scientist",
			username: "@data_wizard",
			avatar: "📊",
			content:
				"Working on an exciting data visualization project! Here's a sneak peek at some insights from social media engagement patterns.\n\nThe correlation between posting time and engagement is fascinating! 📈\n\n#DataScience #Analytics #Visualization",
			image: "📉",
			likes: 892,
			comments: 78,
			shares: 45,
			bookmarks: 123,
			timestamp: "3 days ago",
			liked: false,
			bookmarked: false,
		},
		{
			id: "post_6",
			author: "Web Developer",
			username: "@webdev_pro",
			avatar: "👩‍💻",
			content:
				"Just finished a 48-hour coding marathon! Built a full-stack application with:\n\n✅ React frontend\n✅ Node.js backend\n✅ MongoDB database\n✅ Real-time features\n✅ User authentication\n\nCoffee count: Too many to count ☕😅\n\n#WebDev #Coding #FullStack",
			image: null,
			likes: 1567,
			comments: 134,
			shares: 89,
			bookmarks: 178,
			timestamp: "4 days ago",
			liked: false,
			bookmarked: false,
		},
	]);

	const [newPost, setNewPost] = useState("");
	const [showComments, setShowComments] = useState(null);
	const [commentText, setCommentText] = useState("");

	useEffect(() => {
		if (websiteId && !currentSession) {
			startSession(websiteId);
		}
		trackPageView("Social Media Feed");
		return () => {
			if (currentSession) {
				endSession("/demo/social");
			}
		};
	}, [websiteId]);

	const handleLike = (postId) => {
		setPosts(
			posts.map((post) => {
				if (post.id === postId) {
					const newLiked = !post.liked;
					trackClick(`like-${postId}`, "button", newLiked ? "Like" : "Unlike", {
						interactionType: newLiked ? "like" : "unlike",
						actionCategory: "engagement",
						entityData: {
							entityType: "post",
							entityId: postId,
							entityName: post.content.substring(0, 50),
							attributes: {
								likes: post.likes + (newLiked ? 1 : -1),
								comments: post.comments,
								shares: post.shares,
							},
						},
					});
					return {
						...post,
						liked: newLiked,
						likes: post.likes + (newLiked ? 1 : -1),
					};
				}
				return post;
			}),
		);
	};

	const handleBookmark = (postId) => {
		setPosts(
			posts.map((post) => {
				if (post.id === postId) {
					const newBookmarked = !post.bookmarked;
					trackClick(
						`bookmark-${postId}`,
						"button",
						newBookmarked ? "Bookmark" : "Unbookmark",
					);
					return {
						...post,
						bookmarked: newBookmarked,
						bookmarks: post.bookmarks + (newBookmarked ? 1 : -1),
					};
				}
				return post;
			}),
		);
	};

	const handleComment = (postId) => {
		setShowComments(showComments === postId ? null : postId);
		trackClick(`comment-${postId}`, "button", "Toggle Comments", {
			interactionType: "comment",
			actionCategory: "social",
			entityData: {
				entityType: "post",
				entityId: postId,
			},
		});
	};

	const handleShare = (postId) => {
		const post = posts.find((p) => p.id === postId);
		setPosts(
			posts.map((p) => (p.id === postId ? { ...p, shares: p.shares + 1 } : p)),
		);
		trackClick(`share-${postId}`, "button", "Share Post", {
			interactionType: "share",
			actionCategory: "social",
			entityData: {
				entityType: "post",
				entityId: postId,
				entityName: post.content.substring(0, 50),
			},
		});
	};

	const handleCreatePost = () => {
		if (!newPost.trim()) return;

		const post = {
			id: `post_${Date.now()}`,
			author: "You",
			username: "@you",
			avatar: "😊",
			content: newPost,
			image: null,
			likes: 0,
			comments: 0,
			shares: 0,
			bookmarks: 0,
			timestamp: "Just now",
			liked: false,
			bookmarked: false,
		};

		setPosts([post, ...posts]);
		setNewPost("");

		trackClick("create-post", "button", "Create Post", {
			interactionType: "post_create",
			actionCategory: "content_interaction",
		});
	};

	const handleSendComment = (postId) => {
		if (!commentText.trim()) return;

		setPosts(
			posts.map((post) =>
				post.id === postId ? { ...post, comments: post.comments + 1 } : post,
			),
		);

		setCommentText("");
		trackClick(`send-comment-${postId}`, "button", "Send Comment");
	};

	return (
		<div className="min-h-screen bg-gray-950">
			
			<header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-lg">
				<div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<button
							onClick={async () => {
								trackClick("back-button", "button", "Back to Demo Selection");
							
								if (currentSession) {
									await endSession("/demo/social");
								}
								navigate("/demo");
							}}
							className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white"
						>
							<ArrowLeft className="w-5 h-5" />
						</button>
						<h1 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
							SocialConnect
						</h1>
					</div>

					<div className="flex items-center gap-2">
						<button className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white">
							<Bookmark className="w-5 h-5" />
						</button>
					</div>
				</div>
			</header>

			<div className="max-w-3xl mx-auto px-4 py-8">
				
				<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg mb-6">
					<div className="flex items-start gap-4">
						<div className="text-4xl">😊</div>
						<div className="flex-1">
							<textarea
								value={newPost}
								onChange={(e) => setNewPost(e.target.value)}
								placeholder="What's on your mind?"
								className="w-full bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 rounded-xl p-4 outline-none focus:border-purple-500 transition resize-none"
								rows="3"
							/>
							<div className="flex items-center justify-between mt-3">
								<div className="flex gap-2">
									<button
										onClick={() =>
											trackClick("add-image", "button", "Add Image")
										}
										className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-purple-400"
									>
										<ImageIcon className="w-5 h-5" />
									</button>
									<button
										onClick={() =>
											trackClick("add-emoji", "button", "Add Emoji")
										}
										className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-purple-400"
									>
										<Smile className="w-5 h-5" />
									</button>
								</div>
								<button
									onClick={handleCreatePost}
									disabled={!newPost.trim()}
									className="px-6 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
								>
									Post
								</button>
							</div>
						</div>
					</div>
				</div>

				
				<div className="space-y-6">
					{posts.map((post) => (
						<div
							key={post.id}
							className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg hover:border-gray-700 transition"
						>
						
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-center gap-3">
									<div className="text-4xl">{post.avatar}</div>
									<div>
										<h3 className="font-bold text-white">{post.author}</h3>
										<div className="flex items-center gap-2">
											<p className="text-sm text-gray-500">{post.username}</p>
											<span className="text-gray-700">•</span>
											<p className="text-sm text-gray-500">{post.timestamp}</p>
										</div>
									</div>
								</div>
								<button
									onClick={() =>
										trackClick(`post-menu-${post.id}`, "button", "Post Menu")
									}
									className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-500 hover:text-gray-300"
								>
									<MoreVertical className="w-5 h-5" />
								</button>
							</div>

							
							<p className="text-gray-200 mb-4 leading-relaxed whitespace-pre-line">
								{post.content}
							</p>

							
							{post.image && (
								<div className="mb-4 bg-gray-800 rounded-xl p-12 text-center text-6xl">
									{post.image}
								</div>
							)}

							
							<div className="flex items-center gap-6 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-800">
								<span className="hover:text-pink-400 transition cursor-pointer">
									{post.likes.toLocaleString()} likes
								</span>
								<span className="hover:text-blue-400 transition cursor-pointer">
									{post.comments} comments
								</span>
								<span className="hover:text-green-400 transition cursor-pointer">
									{post.shares} shares
								</span>
								<span className="hover:text-yellow-400 transition cursor-pointer">
									{post.bookmarks} bookmarks
								</span>
							</div>

						
							<div className="grid grid-cols-4 gap-2">
								<button
									onClick={() => handleLike(post.id)}
									className={`flex items-center justify-center gap-2 py-2 rounded-xl font-semibold transition ${
										post.liked
											? "bg-pink-900/30 text-pink-400"
											: "hover:bg-gray-800 text-gray-400 hover:text-pink-400"
									}`}
								>
									<Heart
										className={`w-5 h-5 ${post.liked ? "fill-current" : ""}`}
									/>
									<span className="hidden sm:inline">Like</span>
								</button>
								<button
									onClick={() => handleComment(post.id)}
									className="flex items-center justify-center gap-2 py-2 rounded-xl font-semibold hover:bg-gray-800 text-gray-400 hover:text-blue-400 transition"
								>
									<MessageCircle className="w-5 h-5" />
									<span className="hidden sm:inline">Comment</span>
								</button>
								<button
									onClick={() => handleShare(post.id)}
									className="flex items-center justify-center gap-2 py-2 rounded-xl font-semibold hover:bg-gray-800 text-gray-400 hover:text-green-400 transition"
								>
									<Share2 className="w-5 h-5" />
									<span className="hidden sm:inline">Share</span>
								</button>
								<button
									onClick={() => handleBookmark(post.id)}
									className={`flex items-center justify-center gap-2 py-2 rounded-xl font-semibold transition ${
										post.bookmarked
											? "bg-yellow-900/30 text-yellow-400"
											: "hover:bg-gray-800 text-gray-400 hover:text-yellow-400"
									}`}
								>
									<Bookmark
										className={`w-5 h-5 ${post.bookmarked ? "fill-current" : ""}`}
									/>
									<span className="hidden sm:inline">Save</span>
								</button>
							</div>

							
							{showComments === post.id && (
								<div className="mt-4 pt-4 border-t border-gray-800">
									<div className="flex gap-3 mb-4">
										<div className="text-2xl">😊</div>
										<div className="flex-1 flex gap-2">
											<input
												type="text"
												value={commentText}
												onChange={(e) => setCommentText(e.target.value)}
												placeholder="Write a comment..."
												className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 rounded-xl outline-none focus:border-purple-500 transition"
											/>
											<button
												onClick={() => handleSendComment(post.id)}
												className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
											>
												<Send className="w-5 h-5" />
											</button>
										</div>
									</div>

									
									<div className="space-y-3">
										<div className="flex gap-3 bg-gray-800 p-3 rounded-xl">
											<div className="text-2xl">👤</div>
											<div>
												<p className="text-sm font-semibold text-white">
													Sample User
												</p>
												<p className="text-sm text-gray-400">
													Great post! Really helpful.
												</p>
												<div className="flex items-center gap-4 mt-1">
													<button className="text-xs text-gray-500 hover:text-pink-400">
														Like
													</button>
													<button className="text-xs text-gray-500 hover:text-blue-400">
														Reply
													</button>
													<span className="text-xs text-gray-600">2h</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					))}
				</div>

				
				<div className="mt-8 text-center">
					<button
						onClick={() => trackClick("load-more", "button", "Load More Posts")}
						className="px-8 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition font-semibold"
					>
						Load More Posts
					</button>
				</div>
			</div>
		</div>
	);
};

const SocialMediaSite = () => {
	const { websites, loading } = useWebsites();
	const socialWebsite = websites.find(
		(w) => w.type === "social" || w.category === "social",
	);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-950 flex items-center justify-center">
				<div className="text-white">Loading...</div>
			</div>
		);
	}

	if (!socialWebsite) {
		return (
			<div className="min-h-screen bg-gray-950 flex items-center justify-center">
				<div className="text-white">Social media site not found</div>
			</div>
		);
	}

	return (
		<SessionProvider>
			<InteractionProvider websiteId={socialWebsite._id}>
				<SocialMediaContent websiteId={socialWebsite._id} />
			</InteractionProvider>
		</SessionProvider>
	);
};

export default SocialMediaSite;
