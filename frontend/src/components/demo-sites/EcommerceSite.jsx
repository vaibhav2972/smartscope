import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	ShoppingCart,
	Heart,
	Search,
	X,
	Filter,
	Star,
	TrendingUp,
} from "lucide-react";
import { SessionProvider, useSession } from "@/context/SessionContext";
import { InteractionProvider } from "@/context/InteractionContext";
import { useInteractionTracker } from "@/hooks/useInteractionTracker";
import { useWebsites } from "@/hooks/useWebsites";

const EcommerceContent = ({ websiteId }) => {
	const navigate = useNavigate();
	const { currentSession, startSession, endSession } = useSession();
	const {
		trackClick,
		trackPageView,
		trackItemView,
		trackAddToCart,
		trackSearch,
	} = useInteractionTracker();

	const [cart, setCart] = useState([]);
	const [wishlist, setWishlist] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [priceRange, setPriceRange] = useState("all");
	const [sortBy, setSortBy] = useState("popular");
	const [showFilters, setShowFilters] = useState(false);

	const products = [
		{
			id: "prod_1",
			name: "Wireless Headphones Pro",
			price: 2999,
			category: "Electronics",
			image: "🎧",
			rating: 4.5,
			reviews: 234,
			inStock: true,
			discount: 10,
		},
		{
			id: "prod_2",
			name: "Smart Watch Ultra",
			price: 8999,
			category: "Electronics",
			image: "⌚",
			rating: 4.7,
			reviews: 456,
			inStock: true,
			discount: 15,
		},
		{
			id: "prod_3",
			name: "Premium Laptop Backpack",
			price: 1499,
			category: "Accessories",
			image: "🎒",
			rating: 4.3,
			reviews: 189,
			inStock: true,
			discount: 0,
		},
		{
			id: "prod_4",
			name: "USB-C Fast Charging Cable",
			price: 299,
			category: "Accessories",
			image: "🔌",
			rating: 4.0,
			reviews: 567,
			inStock: true,
			discount: 5,
		},
		{
			id: "prod_5",
			name: "Bluetooth Speaker Max",
			price: 3499,
			category: "Electronics",
			image: "🔊",
			rating: 4.6,
			reviews: 321,
			inStock: true,
			discount: 20,
		},
		{
			id: "prod_6",
			name: "Designer Phone Case",
			price: 499,
			category: "Accessories",
			image: "📱",
			rating: 4.2,
			reviews: 145,
			inStock: true,
			discount: 0,
		},
		{
			id: "prod_7",
			name: "Gaming Mouse RGB",
			price: 1999,
			category: "Electronics",
			image: "🖱️",
			rating: 4.8,
			reviews: 678,
			inStock: true,
			discount: 12,
		},
		{
			id: "prod_8",
			name: "Mechanical Keyboard",
			price: 4999,
			category: "Electronics",
			image: "⌨️",
			rating: 4.9,
			reviews: 890,
			inStock: true,
			discount: 18,
		},
		{
			id: "prod_9",
			name: "Webcam HD Pro",
			price: 2499,
			category: "Electronics",
			image: "📷",
			rating: 4.4,
			reviews: 234,
			inStock: true,
			discount: 8,
		},
		{
			id: "prod_10",
			name: "Portable Power Bank",
			price: 1299,
			category: "Accessories",
			image: "🔋",
			rating: 4.5,
			reviews: 445,
			inStock: false,
			discount: 0,
		},
		{
			id: "prod_11",
			name: "Wireless Earbuds",
			price: 1999,
			category: "Electronics",
			image: "🎵",
			rating: 4.6,
			reviews: 789,
			inStock: true,
			discount: 25,
		},
		{
			id: "prod_12",
			name: "Laptop Stand Aluminum",
			price: 899,
			category: "Accessories",
			image: "💻",
			rating: 4.3,
			reviews: 156,
			inStock: true,
			discount: 0,
		},
	];

	const categories = ["all", "Electronics", "Accessories"];
	const priceRanges = [
		{ id: "all", label: "All Prices" },
		{ id: "under1000", label: "Under ₹1000" },
		{ id: "1000-3000", label: "₹1000 - ₹3000" },
		{ id: "above3000", label: "Above ₹3000" },
	];

	useEffect(() => {
		if (websiteId && !currentSession) {
			startSession(websiteId);
		}
		trackPageView("E-commerce Home");
		return () => {
			if (currentSession) {
				endSession("/demo/ecommerce");
			}
		};
	}, [websiteId]);

	const handleAddToCart = (product) => {
		setCart([...cart, product]);
		trackAddToCart({
			id: product.id,
			name: product.name,
			price: product.price,
			category: product.category,
		});
		trackClick(`add-to-cart-${product.id}`, "button", "Add to Cart");
	};

	const handleRemoveFromCart = (productId) => {
		setCart(cart.filter((item) => item.id !== productId));
		trackClick(`remove-from-cart-${productId}`, "button", "Remove from Cart");
	};

	const handleAddToWishlist = (product) => {
		if (!wishlist.find((item) => item.id === product.id)) {
			setWishlist([...wishlist, product]);
			trackClick(`wishlist-${product.id}`, "button", "Add to Wishlist", {
				interactionType: "wishlist_add",
				actionCategory: "engagement",
				entityData: {
					entityType: "product",
					entityId: product.id,
					entityName: product.name,
				},
			});
		} else {
			setWishlist(wishlist.filter((item) => item.id !== product.id));
			trackClick(
				`remove-wishlist-${product.id}`,
				"button",
				"Remove from Wishlist",
			);
		}
	};

	const handleProductClick = (product) => {
		trackItemView({
			id: product.id,
			name: product.name,
			type: "product",
			attributes: {
				price: product.price,
				category: product.category,
				rating: product.rating,
			},
		});
		trackClick(`product-${product.id}`, "card", product.name);
	};

	const handleSearch = (e) => {
		e.preventDefault();
		const results = products.filter((p) =>
			p.name.toLowerCase().includes(searchQuery.toLowerCase()),
		);
		trackSearch(searchQuery, results.length);
		trackClick("search-button", "button", "Search");
	};

	const filterProducts = () => {
		let filtered = products.filter((product) => {
			const matchesCategory =
				selectedCategory === "all" || product.category === selectedCategory;
			const matchesSearch = product.name
				.toLowerCase()
				.includes(searchQuery.toLowerCase());

			let matchesPrice = true;
			if (priceRange === "under1000") matchesPrice = product.price < 1000;
			else if (priceRange === "1000-3000")
				matchesPrice = product.price >= 1000 && product.price <= 3000;
			else if (priceRange === "above3000") matchesPrice = product.price > 3000;

			return matchesCategory && matchesSearch && matchesPrice;
		});

		if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
		else if (sortBy === "price-high")
			filtered.sort((a, b) => b.price - a.price);
		else if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);

		return filtered;
	};

	const filteredProducts = filterProducts();
	const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
	const cartDiscount = cart.reduce(
		(sum, item) => sum + (item.price * item.discount) / 100,
		0,
	);

	return (
		<div className="min-h-screen bg-gray-950">
			
			<header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-lg">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-4">
							<button
								onClick={async () => {
									trackClick("back-button", "button", "Back to Demo Selection");
									
									if (currentSession) {
										await endSession("/demo/ecommerce");
									}
									navigate("/demo");
								}}
								className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white"
							>
								<ArrowLeft className="w-5 h-5" />
							</button>
							<h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
								ShopVibe
							</h1>
						</div>

						<div className="flex items-center gap-4">
							<button
								onClick={() => {
									trackClick("wishlist-icon", "button", "View Wishlist");
								}}
								className="relative p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-pink-400"
							>
								<Heart
									className={`w-5 h-5 ${wishlist.length > 0 ? "fill-current text-pink-400" : ""}`}
								/>
								{wishlist.length > 0 && (
									<span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
										{wishlist.length}
									</span>
								)}
							</button>
							<button
								onClick={() => trackClick("cart-icon", "button", "View Cart")}
								className="relative p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-blue-400"
							>
								<ShoppingCart className="w-5 h-5" />
								{cart.length > 0 && (
									<span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
										{cart.length}
									</span>
								)}
							</button>
						</div>
					</div>

					
					<form onSubmit={handleSearch}>
						<div className="relative">
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search products..."
								className="w-full px-6 py-3 pr-12 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition"
							/>
							<button
								type="submit"
								className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
							>
								<Search className="w-4 h-4" />
							</button>
						</div>
					</form>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 py-8">
				
				<div className="flex flex-wrap gap-4 mb-8 items-center">
					<button
						onClick={() => setShowFilters(!showFilters)}
						className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition"
					>
						<Filter className="w-4 h-4" />
						Filters
					</button>

					<select
						value={sortBy}
						onChange={(e) => {
							setSortBy(e.target.value);
							trackClick("sort-select", "select", e.target.value);
						}}
						className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl border border-gray-700 outline-none hover:border-blue-500 transition"
					>
						<option value="popular">Most Popular</option>
						<option value="price-low">Price: Low to High</option>
						<option value="price-high">Price: High to Low</option>
						<option value="rating">Highest Rated</option>
					</select>

					<div className="flex-1"></div>

					<span className="text-gray-400 text-sm">
						{filteredProducts.length} products found
					</span>
				</div>

				{showFilters && (
					<div className="mb-8 p-6 bg-gray-900 rounded-2xl border border-gray-800">
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h3 className="text-white font-semibold mb-3">Category</h3>
								<div className="flex flex-wrap gap-2">
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
											className={`px-4 py-2 rounded-xl font-semibold transition ${
												selectedCategory === category
													? "bg-blue-600 text-white"
													: "bg-gray-800 text-gray-300 hover:bg-gray-700"
											}`}
										>
											{category.charAt(0).toUpperCase() + category.slice(1)}
										</button>
									))}
								</div>
							</div>

							<div>
								<h3 className="text-white font-semibold mb-3">Price Range</h3>
								<div className="flex flex-wrap gap-2">
									{priceRanges.map((range) => (
										<button
											key={range.id}
											onClick={() => {
												setPriceRange(range.id);
												trackClick(`price-${range.id}`, "button", range.label);
											}}
											className={`px-4 py-2 rounded-xl font-semibold transition ${
												priceRange === range.id
													? "bg-blue-600 text-white"
													: "bg-gray-800 text-gray-300 hover:bg-gray-700"
											}`}
										>
											{range.label}
										</button>
									))}
								</div>
							</div>
						</div>
					</div>
				)}

				
				<div className="mb-8 p-6 bg-linear-to-r from-orange-600 to-red-600 rounded-2xl text-white">
					<div className="flex items-center gap-3 mb-2">
						<TrendingUp className="w-6 h-6" />
						<h2 className="text-2xl font-bold">Hot Deals Today!</h2>
					</div>
					<p className="text-orange-100">Up to 25% off on selected items</p>
				</div>

				
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{filteredProducts.map((product) => (
						<div
							key={product.id}
							onClick={() => handleProductClick(product)}
							className="bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-blue-500 transition cursor-pointer group relative overflow-hidden"
						>
							
							{product.discount > 0 && (
								<div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
									-{product.discount}%
								</div>
							)}

							
							{!product.inStock && (
								<div className="absolute top-3 left-3 bg-gray-700 text-gray-300 text-xs font-semibold px-2 py-1 rounded-lg z-10">
									Out of Stock
								</div>
							)}

							<div className="text-7xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">
								{product.image}
							</div>

							<h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition">
								{product.name}
							</h3>

							<p className="text-gray-500 text-sm mb-3">{product.category}</p>

							<div className="flex items-center gap-2 mb-3">
								<div className="flex items-center gap-1">
									<Star className="w-4 h-4 fill-current text-yellow-500" />
									<span className="text-sm text-gray-400">
										{product.rating}
									</span>
								</div>
								<span className="text-xs text-gray-600">
									({product.reviews} reviews)
								</span>
							</div>

							<div className="mb-4">
								{product.discount > 0 ? (
									<div className="flex items-center gap-2">
										<p className="text-2xl font-bold text-blue-400">
											₹
											{Math.round(product.price * (1 - product.discount / 100))}
										</p>
										<p className="text-sm text-gray-500 line-through">
											₹{product.price}
										</p>
									</div>
								) : (
									<p className="text-2xl font-bold text-blue-400">
										₹{product.price}
									</p>
								)}
							</div>

							<div className="flex gap-2">
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleAddToCart(product);
									}}
									disabled={!product.inStock}
									className={`flex-1 py-2 rounded-xl font-semibold transition ${
										product.inStock
											? "bg-blue-600 text-white hover:bg-blue-700"
											: "bg-gray-800 text-gray-600 cursor-not-allowed"
									}`}
								>
									{product.inStock ? "Add to Cart" : "Out of Stock"}
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleAddToWishlist(product);
									}}
									className={`p-2 rounded-xl transition ${
										wishlist.find((item) => item.id === product.id)
											? "bg-pink-600 text-white"
											: "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-pink-400"
									}`}
								>
									<Heart
										className={`w-5 h-5 ${wishlist.find((item) => item.id === product.id) ? "fill-current" : ""}`}
									/>
								</button>
							</div>
						</div>
					))}
				</div>

				{filteredProducts.length === 0 && (
					<div className="text-center py-20">
						<p className="text-gray-500 text-lg mb-4">No products found</p>
						<button
							onClick={() => {
								setSearchQuery("");
								setSelectedCategory("all");
								setPriceRange("all");
							}}
							className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
						>
							Clear Filters
						</button>
					</div>
				)}
			</div>

		
			{cart.length > 0 && (
				<div className="fixed bottom-0 right-0 m-4 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full max-h-96 overflow-y-auto">
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-white text-lg">
							Cart ({cart.length})
						</h3>
						<button
							onClick={() => {
								setCart([]);
								trackClick("clear-cart", "button", "Clear Cart");
							}}
							className="text-red-400 hover:text-red-300 transition"
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					<div className="space-y-3 mb-4">
						{cart.map((item, index) => (
							<div
								key={index}
								className="flex items-center justify-between bg-gray-800 p-3 rounded-xl"
							>
								<div className="flex items-center gap-3">
									<span className="text-2xl">{item.image}</span>
									<div>
										<p className="text-white text-sm font-semibold">
											{item.name}
										</p>
										<p className="text-blue-400 text-sm">₹{item.price}</p>
									</div>
								</div>
								<button
									onClick={() => handleRemoveFromCart(item.id)}
									className="text-gray-500 hover:text-red-400 transition"
								>
									<X className="w-4 h-4" />
								</button>
							</div>
						))}
					</div>

					<div className="border-t border-gray-800 pt-4 space-y-2 mb-4">
						<div className="flex justify-between text-sm text-gray-400">
							<span>Subtotal:</span>
							<span>₹{cartTotal}</span>
						</div>
						{cartDiscount > 0 && (
							<div className="flex justify-between text-sm text-green-400">
								<span>Discount:</span>
								<span>-₹{Math.round(cartDiscount)}</span>
							</div>
						)}
						<div className="flex justify-between text-lg font-bold text-white">
							<span>Total:</span>
							<span>₹{Math.round(cartTotal - cartDiscount)}</span>
						</div>
					</div>

					<button
						onClick={() => {
							trackClick("checkout-button", "button", "Proceed to Checkout", {
								interactionType: "checkout_start",
								actionCategory: "conversion",
							});
						}}
						className="w-full bg-linear-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition font-semibold shadow-lg"
					>
						Checkout
					</button>
				</div>
			)}
		</div>
	);
};

const EcommerceSite = () => {
	const { websites, loading } = useWebsites();
	const ecommerceWebsite = websites.find(
		(w) => w.type === "ecommerce" || w.category === "ecommerce",
	);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-950 flex items-center justify-center">
				<div className="text-white">Loading...</div>
			</div>
		);
	}

	if (!ecommerceWebsite) {
		return (
			<div className="min-h-screen bg-gray-950 flex items-center justify-center">
				<div className="text-white">E-commerce site not found</div>
			</div>
		);
	}

	return (
		<SessionProvider>
			<InteractionProvider websiteId={ecommerceWebsite._id}>
				<EcommerceContent websiteId={ecommerceWebsite._id} />
			</InteractionProvider>
		</SessionProvider>
	);
};

export default EcommerceSite;
