"use client";

import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, Heart, ShoppingCart, Eye, Leaf, Sun, Cloud, Droplets, ChevronLeft, ChevronRight, Star } from 'lucide-react';

// Types
interface Plant {
    id: number;
    name: string;
    scientificName: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    category: 'indoor' | 'outdoor' | 'succulent' | 'flowering';
    nursery: string;
    inStock: boolean;
    isNew: boolean;
    isFeatured: boolean;
    description: string;
    careInstructions: {
        light: string;
        water: string;
        temperature: string;
    };
    discount?: number;
}

const PlantPage: React.FC = () => {
    // Sample plants data
    const [plants] = useState<Plant[]>([
        {
            id: 1,
            name: 'Monstera Deliciosa',
            scientificName: 'Swiss Cheese Plant',
            price: 45.99,
            originalPrice: 59.99,
            rating: 4.8,
            reviews: 128,
            image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
            category: 'indoor',
            nursery: 'Green Paradise Nursery',
            inStock: true,
            isNew: false,
            isFeatured: true,
            description: 'Large, glossy leaves with natural holes, perfect for indoor decoration.',
            careInstructions: {
                light: 'Bright indirect light',
                water: 'Water when top 2 inches soil dry',
                temperature: '18-27°C'
            },
            discount: 23
        },
        {
            id: 2,
            name: 'Snake Plant',
            scientificName: 'Sansevieria Trifasciata',
            price: 25.99,
            rating: 4.9,
            reviews: 256,
            image: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            category: 'indoor',
            nursery: 'Urban Jungle',
            inStock: true,
            isNew: false,
            isFeatured: true,
            description: 'Air-purifying plant with striking upright leaves, very low maintenance.',
            careInstructions: {
                light: 'Low to bright indirect',
                water: 'Every 2-3 weeks',
                temperature: '15-29°C'
            }
        },
        {
            id: 3,
            name: 'Lavender',
            scientificName: 'Lavandula Angustifolia',
            price: 18.99,
            rating: 4.7,
            reviews: 89,
            image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80',
            category: 'outdoor',
            nursery: 'Blooms & Co.',
            inStock: true,
            isNew: true,
            isFeatured: false,
            description: 'Fragrant purple flowers, attracts pollinators, perfect for gardens.',
            careInstructions: {
                light: 'Full sun',
                water: 'Allow soil to dry between watering',
                temperature: '18-26°C'
            }
        },
        {
            id: 4,
            name: 'Fiddle Leaf Fig',
            scientificName: 'Ficus Lyrata',
            price: 79.99,
            originalPrice: 99.99,
            rating: 4.6,
            reviews: 167,
            image: 'https://images.unsplash.com/photo-1597055181308-e0f1e9d6f83c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
            category: 'indoor',
            nursery: 'Green Paradise Nursery',
            inStock: false,
            isNew: false,
            isFeatured: true,
            description: 'Popular indoor tree with large, fiddle-shaped leaves.',
            careInstructions: {
                light: 'Bright indirect light',
                water: 'Keep soil consistently moist',
                temperature: '18-24°C'
            },
            discount: 20
        },
        {
            id: 5,
            name: 'Succulent Collection',
            scientificName: 'Mixed Varieties',
            price: 34.99,
            rating: 4.9,
            reviews: 203,
            image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
            category: 'succulent',
            nursery: 'Desert Oasis',
            inStock: true,
            isNew: true,
            isFeatured: false,
            description: 'Set of 5 different succulent varieties in 2" pots.',
            careInstructions: {
                light: 'Bright light',
                water: 'Water sparingly, let soil dry',
                temperature: '18-29°C'
            }
        },
        {
            id: 6,
            name: 'Peace Lily',
            scientificName: 'Spathiphyllum',
            price: 29.99,
            rating: 4.8,
            reviews: 145,
            image: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
            category: 'indoor',
            nursery: 'Urban Jungle',
            inStock: true,
            isNew: false,
            isFeatured: false,
            description: 'Elegant white flowers, excellent air-purifying qualities.',
            careInstructions: {
                light: 'Low to medium light',
                water: 'Keep soil moist',
                temperature: '18-24°C'
            }
        }
    ]);

    // State for filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
    const [selectedNurseries, setSelectedNurseries] = useState<string[]>([]);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sortBy, setSortBy] = useState<string>('featured');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [cart, setCart] = useState<number[]>([]);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

    const plantsPerPage = 6;

    // Get unique nurseries for filter
    const nurseries = Array.from(new Set(plants.map(p => p.nursery)));

    // Filter plants
    const filteredPlants = plants.filter(plant => {
        const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || plant.category === selectedCategory;
        const matchesPrice = plant.price >= priceRange[0] && plant.price <= priceRange[1];
        const matchesNursery = selectedNurseries.length === 0 || selectedNurseries.includes(plant.nursery);
        const matchesStock = !inStockOnly || plant.inStock;

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
                return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
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

    // Handlers
    const toggleWishlist = (plantId: number) => {
        setWishlist(prev =>
            prev.includes(plantId) ? prev.filter(id => id !== plantId) : [...prev, plantId]
        );
    };

    const toggleCart = (plantId: number) => {
        setCart(prev =>
            prev.includes(plantId) ? prev.filter(id => id !== plantId) : [...prev, plantId]
        );
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setPriceRange([0, 200]);
        setSelectedNurseries([]);
        setInStockOnly(false);
        setSortBy('featured');
    };

    const handleNurseryChange = (nursery: string) => {
        setSelectedNurseries(prev =>
            prev.includes(nursery) ? prev.filter(n => n !== nursery) : [...prev, nursery]
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-500 to-white">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
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
                                className="w-full pl-12 pr-4 py-3 text-gray-700 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none shadow-sm"
                            />
                            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
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
                            key={plant.id}
                            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                        >
                            {/* Image Container */}
                            <div className="relative overflow-hidden h-64">
                                <img
                                    src={plant.image}
                                    alt={plant.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {plant.isNew && (
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

                                {/* Quick Action Buttons */}
                                <div className="absolute inset-0 bg-black- bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => setSelectedPlant(plant)}
                                        className="bg-white p-3 rounded-full hover:bg-green-600 hover:text-white transition-all transform hover:scale-110 shadow-lg"
                                        title="View Details"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => toggleCart(plant.id)}
                                        className={`p-3 rounded-full transition-all transform hover:scale-110 shadow-lg ${cart.includes(plant.id)
                                            ? 'bg-green-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-green-600 hover:text-white'
                                            }`}
                                        title="Add to Cart"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => toggleWishlist(plant.id)}
                                        className={`p-3 rounded-full transition-all transform hover:scale-110 shadow-lg ${wishlist.includes(plant.id)
                                            ? 'bg-red-500 text-white'
                                            : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white'
                                            }`}
                                        title="Add to Wishlist"
                                    >
                                        <Heart className="w-5 h-5" />
                                    </button>
                                </div>

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
                                    <button
                                        onClick={() => toggleCart(plant.id)}
                                        className="lg:hidden p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-md"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12 flex justify-center items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-lg transition-colors ${currentPage === i + 1
                                    ? 'bg-green-600 text-white'
                                    : 'border border-gray-300 hover:bg-green-50'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Load More Button (Alternative) */}
                {currentPage < totalPages && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                        >
                            Load More Plants
                        </button>
                    </div>
                )}
            </div>

            {/* Plant Details Modal */}
            {selectedPlant && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">{selectedPlant.name}</h2>
                                <button
                                    onClick={() => setSelectedPlant(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Image */}
                                <div>
                                    <img
                                        src={selectedPlant.image}
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
                                                toggleCart(selectedPlant.id);
                                                setSelectedPlant(null);
                                            }}
                                            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                            {cart.includes(selectedPlant.id) ? 'Remove from Cart' : 'Add to Cart'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                toggleWishlist(selectedPlant.id);
                                            }}
                                            className={`p-3 rounded-xl border-2 transition-all ${wishlist.includes(selectedPlant.id)
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