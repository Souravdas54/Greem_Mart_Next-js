"use client";

import React, { useEffect, useState } from 'react';
import {
    Star,
    ArrowLeft,
    ShoppingCart,
    Heart,
    Truck,
    Shield,
    RotateCcw,
    Sun,
    Droplets,
    Cloud,
    Minus,
    Plus,
    CheckCircle,
    CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getCart, updateCartItem, removeFromCart } from '@/app/api/cart.and.wishlist.endpoint';

interface CartItem {
    _id: string;
    userId: string;
    plantId: string;
    quantity: number;
    plant: {
        _id: string;
        name: string;
        scientificName: string;
        price: number;
        originalPrice?: number;
        images: string[];
        description: string;
        inStock: boolean;
        rating: number;
        reviews: number;
        discount?: number;
        nursery: string;
        careInstructions: {
            light: string;
            water: string;
            temperature: string;
        };
    };
    createdAt: string;
    updatedAt: string;
}

const CartItemDetailsPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const cartId = params.cartId as string;

    const [item, setItem] = useState<CartItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<number>(1);
    const [updating, setUpdating] = useState<boolean>(false);

    useEffect(() => {
        fetchCartItem();
    }, [cartId]);

    const fetchCartItem = async () => {
        try {
            setLoading(true);
            const items = await getCart();
            const foundItem = items.find(i => i._id === cartId);
            if (foundItem) {
                setItem(foundItem);
                setQuantity(foundItem.quantity);
            }
        } catch (error) {
            console.error('Failed to fetch cart item:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (newQuantity: number) => {
        if (!item || newQuantity < 1) return;
        setUpdating(true);
        try {
            await updateCartItem(item.plantId, newQuantity);
            setQuantity(newQuantity);
            setItem(prev => prev ? { ...prev, quantity: newQuantity } : null);
        } catch (error) {
            console.error('Failed to update quantity:', error);
        } finally {
            setUpdating(false);
        }
    };

    const handleRemoveItem = async () => {
        if (!item) return;
        try {
            await removeFromCart(item.plantId);
            router.push('/cart');
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    // Format delivery date
    const getDeliveryDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Item not found</h2>
                    <p className="text-gray-600 mb-6">The item you&apos;re looking for doesn&apos;t exist in your cart.</p>
                    <Link href="/cart">
                        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            Back to Cart
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/cart">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Product Details</h1>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left - Image */}
                        <div className="lg:w-1/2 p-6 lg:p-8">
                            <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square max-h-[500px]">
                                <img
                                    src={item.plant.images[0]}
                                    alt={item.plant.name}
                                    className="w-full h-full object-cover"
                                />
                                {item.plant.discount && (
                                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        {item.plant.discount}% OFF
                                    </div>
                                )}
                                {!item.plant.inStock && (
                                    <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        Out of Stock
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right - Details */}
                        <div className="lg:w-1/2 p-6 lg:p-8">
                            {/* Title */}
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">
                                {item.plant.name}
                            </h2>
                            <p className="text-gray-500 italic text-sm mb-3">
                                {item.plant.scientificName}
                            </p>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < Math.floor(item.plant.rating)
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                    {item.plant.rating} ({item.plant.reviews} reviews)
                                </span>
                            </div>

                            {/* Hot Deal Badge */}
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                <span className="text-red-600 font-semibold text-sm">🔥 Hot Deal</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-2xl font-bold text-red-600">
                                        ₹{item.plant.price}
                                    </span>
                                    {item.plant.originalPrice && (
                                        <span className="text-sm text-gray-400 line-through">
                                            ₹{item.plant.originalPrice}
                                        </span>
                                    )}
                                    {item.plant.discount && (
                                        <span className="text-sm font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                                            {item.plant.discount}% OFF
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* WOW DEAL */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                <span className="text-green-600 font-semibold text-sm">💎 WOW! DEAL</span>
                                <p className="text-sm text-gray-700 mt-1">
                                    Buy at ₹{item.plant.price} • Apply offers for maximum savings!
                                </p>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        disabled={quantity <= 1 || updating}
                                        className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Minus className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <span className="w-12 text-center font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        disabled={updating}
                                        className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Plus className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                                <span className="text-sm text-gray-500">
                                    Total: ₹{item.plant.price * quantity}
                                </span>
                            </div>

                            {/* Delivery Details */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Delivery details</h4>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p>📍 Location not set</p>
                                    <p>🚚 Delivery by {getDeliveryDate()}</p>
                                    <p className="text-xs text-gray-500">
                                        Order in 00h 33m 53s
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Fulfilled by {item.plant.nursery}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        ⭐ {item.plant.rating} ★ 1 year with Flipkart
                                    </p>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="flex flex-wrap gap-4 mb-6">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <RotateCcw className="w-4 h-4 text-green-600" />
                                    <span>10-Day Return</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CreditCard className="w-4 h-4 text-green-600" />
                                    <span>Cash on Delivery</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Shield className="w-4 h-4 text-green-600" />
                                    <span>Customer support</span>
                                </div>
                            </div>

                            {/* Care Instructions */}
                            <div className="bg-green-50 rounded-lg p-4 mb-6">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Care Instructions</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Sun className="w-4 h-4 text-yellow-600" />
                                        <span className="text-xs text-gray-600">{item.plant.careInstructions.light}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Droplets className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs text-gray-600">{item.plant.careInstructions.water}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Cloud className="w-4 h-4 text-gray-600" />
                                        <span className="text-xs text-gray-600">{item.plant.careInstructions.temperature}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                                <p className="text-sm text-gray-600">{item.plant.description}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => router.push('/cart')}
                                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Go to Cart
                                </button>
                                <button
                                    onClick={handleRemoveItem}
                                    className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl"
                                >
                                    Remove from Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItemDetailsPage;