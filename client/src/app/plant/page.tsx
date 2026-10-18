"use client";

import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, Heart, ShoppingCart, Eye, Leaf, Sun, Cloud, Droplets, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { getAllPlants } from '../api/plant.endpoint';
import { addToCart, removeFromCart, getCart, addTowishlist, RemoveWhishlist } from '../api/cart.and.wishlist.endpoint';
import './plant.style.css'
import { useCart } from '../context/CartContext';
// Types
interface CareInstructionsInterface {
    light: string;
    water: string;
    temperature: string;
}

interface PlantInterface {
    _id: string;
    name: string;
    scientificName: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    images: string[];
    category: 'indoor' | 'outdoor' | 'succulent' | 'flowering';
    nursery: string;
    inStock: boolean;
    stockQuantity: number; // stock quantity
    isNewArrival: boolean;
    isFeatured: boolean;
    isPublished: boolean;  // publish status
    description: string;
    careInstructions: CareInstructionsInterface;
    discount?: number;

    tags?: string[]; // tags for better search
    sizes?: string[]; // sizes
    colors?: string[]; // colors

}

const PlantPage: React.FC = () => {
    // Sample plants data
    const [plant, setPlant] = useState<PlantInterface[]>([])

    // State for filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
    const [selectedNurseries, setSelectedNurseries] = useState<string[]>([]);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sortBy, setSortBy] = useState<string>('featured');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPlant, setSelectedPlant] = useState<PlantInterface | null>(null);
    // Cart
    const [cart, setCart] = useState<string[]>([]);
    const [cartLoadingId, setCartLoadingId] = useState<string | null>(null);
    // Wishlist
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [wishlistLoadingId, setWishlistLoadingId] = useState<string | null>(null);

    const plantsPerPage = 10;
    const { refreshCart } = useCart();

    useEffect(() => {
        const fetchPlant = async () => {
            try {
                const plantsalldata = await getAllPlants();

                if (Array.isArray(plantsalldata) && plantsalldata.length > 0) {
                    setPlant(plantsalldata)
                    console.log(plantsalldata)
                } else {
                    setPlant([])
                }
            } catch (error: unknown) {
                console.log("Error is Get all plants", error)
            }
        }
        fetchPlant()
    }, [])
    // Get unique nurseries for filter
    const nurseries = Array.from(new Set(plant.map(p => p.nursery)));

    // Filter plants
    const filteredPlants = plant.filter(plants => {
        const matchesSearch = plants.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plants.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || plants.category === selectedCategory;
        const matchesPrice = plants.price >= priceRange[0] && plants.price <= priceRange[1];
        const matchesNursery = selectedNurseries.length === 0 || selectedNurseries.includes(plants.nursery);
        const matchesStock = !inStockOnly || plants.inStock;

        return matchesSearch && matchesCategory && matchesPrice && matchesNursery && matchesStock;
    });

    // Sort plants
    const sortedPlants = [...filteredPlants].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'newest':
                return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
            case 'rating':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });

    // Pagination
    const indexOfLastPlant = currentPage * plantsPerPage;
    const indexOfFirstPlant = indexOfLastPlant - plantsPerPage;
    const currentPlants = sortedPlants.slice(indexOfFirstPlant, indexOfLastPlant);
    const totalPages = Math.ceil(sortedPlants.length / plantsPerPage);

    // ✅ ADD THIS DEBUG INFO
    // console.log('========== DEBUG PAGINATION ==========');
    // console.log('Total Plants:', sortedPlants.length);
    // console.log('Plants Per Page:', plantsPerPage);
    // console.log('Total Pages:', totalPages);
    // console.log('Current Page:', currentPage);
    // console.log('indexOfFirstPlant:', indexOfFirstPlant);
    // console.log('indexOfLastPlant:', indexOfLastPlant);
    // console.log('Current Plants:', currentPlants.length);
    // console.log('=======================================');

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, priceRange, selectedNurseries, inStockOnly, sortBy]);

    // Handlers
    const toggleWishlist = async (plantId: string) => {
        if (wishlistLoadingId === plantId) return;

        const isWishlist = wishlist.includes(plantId);
        setWishlistLoadingId(plantId);
        try {

            if (isWishlist) {
                await RemoveWhishlist(plantId);
                setWishlist(prev => prev.filter(id => id !== plantId))
            } else {
                await addTowishlist(plantId);
                setWishlist(prev => [...prev, plantId])
            }
        } catch (error) {
            console.error('Failed to update wishlist', error);
       
        } finally {
            setWishlistLoadingId(null);
        }

    };

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const cartItems = await getCart();
                setCart(cartItems.map(item => item.plantId));
            } catch (error) {
                // Likely not logged in yet, or request failed — leave cart empty, don't block the page
                console.log("Could not load cart", error);
            }
        };
        fetchCart();
    }, []);

    const toggleCart = async (plantId: string) => {
        if (cartLoadingId === plantId) return;

        const isInCart = cart.includes(plantId);
        setCartLoadingId(plantId)

        try {
            if (isInCart) {
                await removeFromCart(plantId);
                setCart(prev => prev.filter(id => id !== plantId));
                await refreshCart();
            } else {
                await addToCart(plantId, 1);
                setCart(prev => [...prev, plantId]);
                await refreshCart();
            }
        } catch (error) {
            console.log("Failed to update cart", error);
            // optionally show a toast here — state is left unchanged since the API call failed
        } finally {
            setCartLoadingId(null);
        }

        // setCart(prev =>
        //     prev.includes(plantId) ? prev.filter(id => id !== plantId) : [...prev, plantId]
        // );
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setPriceRange([0, 200]);
        setSelectedNurseries([]);
        setInStockOnly(false);
        setSortBy('featured');
        setCurrentPage(1);
    };

    const handleNurseryChange = (nursery: string) => {
        setSelectedNurseries(prev =>
            prev.includes(nursery) ? prev.filter(n => n !== nursery) : [...prev, nursery]
        );
    };

    // Console //
    console.log(cart)

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-600 from-0% via-white via-20% to-white to-100%">
            <div className="max-w-7xl mx-auto h-auto px-2 sm:px-6 lg:px-8 py-8">
                {/* Search and Filter Bar */}
                <div className="mb-8 space-y-4 mt-15">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search plants by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 text-gray-700 rounded-xl bg-white border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none shadow-sm"
                            />
                            <Search className="absolute left-4 top-3.5 text-green-500 w-5 h-5" />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-3 rounded-xl border text-black border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none bg-white shadow-sm"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="newest">Newest First</option>
                                <option value="rating">Top Rated</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
                        </div>

                        {/* Filter Toggle Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl border transition-all ${showFilters
                                ? 'bg-green-600 text-white border-green-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-green-500'
                                }`}
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                            <span>Filters</span>
                        </button>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-800">Filters</h3>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                                >
                                    Clear all
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Category Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="all">All Categories</option>
                                        <option value="indoor">Indoor Plants</option>
                                        <option value="outdoor">Outdoor Plants</option>
                                        <option value="succulent">Succulents</option>
                                        <option value="flowering">Flowering Plants</option>
                                    </select>
                                </div>

                                {/* Price Range Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="200"
                                            value={priceRange[0]}
                                            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                            className="w-full accent-green-600"
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max="200"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                            className="w-full accent-green-600"
                                        />
                                    </div>
                                </div>

                                {/* Nursery Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nursery</label>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {nurseries.map(nursery => (
                                            <label key={nursery} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedNurseries.includes(nursery)}
                                                    onChange={() => handleNurseryChange(nursery)}
                                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                />
                                                <span className="text-sm text-gray-600">{nursery}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Availability Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={inStockOnly}
                                            onChange={(e) => setInStockOnly(e.target.checked)}
                                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-sm text-gray-600">In Stock Only</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-6 flex justify-between items-center">
                    <p className="text-gray-600">
                        Showing <span className="font-semibold">{indexOfFirstPlant + 1}-{Math.min(indexOfLastPlant, sortedPlants.length)}</span> of{' '}
                        <span className="font-semibold">{sortedPlants.length}</span> plants
                    </p>
                </div>

                {/* Plant Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentPlants.map(plant => (
                        <div
                            key={plant._id}
                            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                        >
                            {/* Image Container */}
                            <div className="relative overflow-hidden h-64">
                                <img
                                    src={plant.images[0]}
                                    alt={plant.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {plant.isNewArrival && (
                                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                            New
                                        </span>
                                    )}
                                    {plant.discount && (
                                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                            -{plant.discount}%
                                        </span>
                                    )}
                                </div>


                                {/* Heart Button - Top Right (Visible on all screens) */}
                                {/* <div className='lg:hidden'> */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleWishlist(plant._id);
                                    }}
                                    disabled ={wishlistLoadingId === plant._id}
                                    className={`absolute top-4 right-4 p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110 z-10 ${wishlist.includes(plant._id)
                                        ? 'bg-red-500 text-white'
                                        : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white'
                                        }`}
                                    title="Add to Wishlist"
                                >
                                    <Heart className="w-5 h-5" />
                                </button>
                                {/* </div> */}

                                {/* Quick Action Buttons */}
                                {/* <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 bg-black/40 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                                    <button
                                        onClick={() => setSelectedPlant(plant)}
                                        className="bg-white p-3 rounded-full hover:bg-green-600 hover:text-white  text-gray-700 transition-all transform hover:scale-110 shadow-lg"
                                        title="View Details"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => toggleCart(plant?._id)}
                                        disabled={cartLoadingId === plant._id}
                                        className={`p-3 rounded-full transition-all transform hover:scale-110 shadow-lg ${cart.includes(plant?._id)
                                            ? 'bg-green-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-green-600 hover:text-white'
                                            }`}
                                        title="Add to Cart"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => toggleWishlist(plant._id)}
                                        className={`p-3 rounded-full transition-all transform hover:scale-110 shadow-lg ${wishlist.includes(plant?._id)
                                            ? 'bg-red-500 text-white'
                                            : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white'
                                            }`}
                                        title="Add to Wishlist"
                                    >
                                        <Heart className="w-5 h-5" />
                                    </button>
                                </div> */}

                                {/* Stock Status */}
                                {!plant.inStock && (
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <span className="bg-red-500 text-white text-sm px-3 py-1.5 rounded-full shadow-lg">
                                            Out of Stock
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Plant Info */}
                            <div className="p-5">
                                <div className="mb-3">
                                    <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{plant.name}</h3>
                                    <p className="text-sm text-gray-500 italic">{plant.scientificName}</p>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center mb-3">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(plant.rating)
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600 ml-2">({plant.reviews} reviews)</span>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plant.description}</p>

                                {/* Care Instructions Icons */}
                                <div className="flex items-center gap-4 mb-4 text-gray-500 text-sm">
                                    <div className="flex items-center gap-1" title="Light">
                                        <Sun className="w-4 h-4 text-yellow-500" />
                                        <span className="text-xs">{plant.careInstructions.light.split(' ')[0]}</span>
                                    </div>
                                    <div className="flex items-center gap-1" title="Water">
                                        <Droplets className="w-4 h-4 text-blue-500" />
                                        <span className="text-xs">Medium</span>
                                    </div>
                                    <div className="flex items-center gap-1" title="Temperature">
                                        <Cloud className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs">{plant.careInstructions.temperature.split('-')[0]}°C</span>
                                    </div>
                                </div>

                                {/* Price and Nursery */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-green-600">${plant.price}</span>
                                            {plant.originalPrice && (
                                                <span className="text-sm text-gray-400 line-through">${plant.originalPrice}</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{plant.nursery}</p>
                                    </div>

                                    {/* Add to Cart Button (Mobile) */}
                                    {/* Eye and Cart Buttons - Bottom Right (Visible on XS to LG only) */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedPlant(plant);
                                            }}
                                            className="p-2.5 bg-white text-gray-700 rounded-full shadow-md hover:bg-green-600 hover:text-white transition-all transform hover:scale-110"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleCart(plant._id);
                                            }}
                                            className={`p-2.5 rounded-full shadow-md transition-all transform hover:scale-110 ${cart.includes(plant._id)
                                                ? 'bg-green-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-green-600 hover:text-white'
                                                }`}
                                            title="Add to Cart"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {/* <button
                                        // onClick={() => toggleCart(plant.id)}
                                        className="lg:hidden p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-md"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                    </button> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12 flex flex-col items-center gap-6">
                        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-lg border border-gray-200">
                            {/* Previous Button - FIXED */}
                            <button
                                onClick={() => {
                                    setCurrentPage(prev => Math.max(prev - 1, 1));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={currentPage === 1}
                                className={`
                                    flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200
                                    ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                        : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg active:scale-95 border border-green-600'
                                    }
                                `}
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span>Previous</span>
                            </button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-2 px-2">
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    // Show first, last, and pages around current
                                    if (
                                        pageNum === 1 ||
                                        pageNum === totalPages ||
                                        Math.abs(pageNum - currentPage) <= 1
                                    ) {
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setCurrentPage(pageNum);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className={`
                                                    w-10 h-10 rounded-xl font-medium transition-all duration-200
                                                    ${currentPage === pageNum
                                                        ? 'bg-green-600 text-white shadow-md'
                                                        : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200 hover:border-green-300'
                                                    }
                                                `}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    }
                                    // Show dots for skipped pages
                                    if (
                                        (pageNum === 2 && currentPage > 3) ||
                                        (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                                    ) {
                                        return (
                                            <span key={i} className="text-gray-400 px-1">
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                            {/* Next Button - FIXED */}
                            <button
                                onClick={() => {
                                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={currentPage === totalPages}
                                className={`
                                    flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200
                                    ${currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                        : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg active:scale-95 border border-green-600'
                                    }
                                `}
                            >
                                <span>Next</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Load More Button - Alternative way to load more */}
                        {currentPage < totalPages && (
                            <button
                                onClick={() => {
                                    setCurrentPage(prev => prev + 1);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-base"
                            >
                                Load More Plants ({sortedPlants.length - (currentPage * plantsPerPage)} remaining)
                            </button>
                        )}
                    </div>
                )}

                {/* Load More Button (Alternative) */}
                {/* {currentPage < totalPages && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                        >
                            Load More Plants
                        </button>
                    </div>
                )} */}
            </div>

            {/* Plant Details Modal */}
            {selectedPlant && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">{selectedPlant.name}</h2>
                                <button
                                    onClick={() => setSelectedPlant(null)}
                                    className="p-2 hover:bg-gray-300 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Image */}
                                <div>
                                    <img
                                        src={selectedPlant.images[0]}
                                        alt={selectedPlant.name}
                                        className="w-full rounded-xl shadow-lg"
                                    />
                                </div>

                                {/* Details */}
                                <div>
                                    <p className="text-gray-600 italic mb-2">{selectedPlant.scientificName}</p>

                                    <div className="flex items-center mb-4">
                                        <div className="flex items-center mr-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${i < Math.floor(selectedPlant.rating)
                                                        ? 'text-yellow-400 fill-current'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-gray-600">{selectedPlant.rating} ({selectedPlant.reviews} reviews)</span>
                                    </div>

                                    <p className="text-gray-700 mb-6">{selectedPlant.description}</p>

                                    {/* Price */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl font-bold text-green-600">${selectedPlant.price}</span>
                                            {selectedPlant.originalPrice && (
                                                <>
                                                    <span className="text-xl text-gray-400 line-through">${selectedPlant.originalPrice}</span>
                                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                        Save ${(selectedPlant.originalPrice - selectedPlant.price).toFixed(2)}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Care Instructions */}
                                    <div className="bg-green-50 p-4 rounded-xl mb-6">
                                        <h3 className="font-semibold text-gray-800 mb-3">Care Instructions</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Sun className="w-4 h-4 text-yellow-600" />
                                                    <span className="font-medium">Light</span>
                                                </div>
                                                <p className="text-sm text-gray-600">{selectedPlant.careInstructions.light}</p>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Droplets className="w-4 h-4 text-blue-600" />
                                                    <span className="font-medium">Water</span>
                                                </div>
                                                <p className="text-sm text-gray-600">{selectedPlant.careInstructions.water}</p>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Cloud className="w-4 h-4 text-gray-600" />
                                                    <span className="font-medium">Temperature</span>
                                                </div>
                                                <p className="text-sm text-gray-600">{selectedPlant.careInstructions.temperature}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                toggleCart(selectedPlant._id);
                                                setSelectedPlant(null);
                                            }}
                                            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                            {cart.includes(selectedPlant._id) ? 'Remove from Cart' : 'Add to Cart'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                toggleWishlist(selectedPlant._id);
                                            }}
                                            className={`p-3 rounded-xl border-2 transition-all ${wishlist.includes(selectedPlant._id)
                                                ? 'border-red-500 bg-red-50 text-red-500'
                                                : 'border-gray-300 hover:border-red-500 hover:bg-red-50 text-gray-600 hover:text-red-500'
                                                }`}
                                        >
                                            <Heart className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Stock Status */}
                                    {!selectedPlant.inStock && (
                                        <p className="mt-4 text-red-600 font-semibold text-center">Currently Out of Stock</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlantPage;