"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingCart, Trash2, Minus, Plus, ChevronRight, Shield, RotateCcw, CreditCard, Truck, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getCart, removeFromCart, updateCartItem } from '../api/cart.and.wishlist.endpoint';

// Types
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

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

    // Fetch cart items
    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const items = await getCart();
            setCartItems(items);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    // Update quantity
    const handleQuantityChange = async (itemId: string, plantId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        setUpdatingItemId(itemId);
        try {
            await updateCartItem(plantId, newQuantity);
            // Update local state
            setCartItems(prev =>
                prev.map(item =>
                    item._id === itemId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
        } catch (error) {
            console.error('Failed to update quantity:', error);
        } finally {
            setUpdatingItemId(null);
        }
    };

    // Remove item from cart
    const handleRemoveItem = async (plantId: string) => {
        try {
            await removeFromCart(plantId);
            setCartItems(prev => prev.filter(item => item.plantId !== plantId));
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    // Calculate totals
    const calculateTotals = () => {
        let subtotal = 0;
        let totalDiscount = 0;
        let platformFee = 9;

        cartItems.forEach(item => {
            const price = item.plant.price;
            const quantity = item.quantity;
            subtotal += price * quantity;

            if (item.plant.originalPrice) {
                totalDiscount += (item.plant.originalPrice - price) * quantity;
            }
        });

        const total = subtotal + platformFee;
        const savings = subtotal + totalDiscount - total;

        return {
            subtotal,
            totalDiscount,
            platformFee,
            total,
            savings
        };
    };

    const totals = calculateTotals();

    // Format delivery date (3-5 days from now)
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
                    <p className="mt-4 text-gray-600">Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center mb-4">
                        <ShoppingCart className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Looks like you haven&apos;t added any plants to your cart yet.</p>
                    <Link href="/plant">
                        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg">
                            Start Shopping
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-600 from-0% via-white via-20% to-white to-100% py-8 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-15">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Link href="/plants" className="text-gray-600 hover:text-green-600">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Shopping Cart
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Side - Product List */}
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Cart Items */}
                            {cartItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                                >
                                    {/* Product Image */}
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={item.plant.images[0]}
                                            alt={item.plant.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/plant/${item.plantId}`}>
                                            <h3 className="text-base font-semibold text-gray-800 hover:text-green-600 transition-colors line-clamp-2">
                                                {item.plant.name}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-gray-500 italic">{item.plant.scientificName}</p>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-sm font-medium text-yellow-600">⭐ {item.plant.rating}</span>
                                            <span className="text-sm text-gray-400">({item.plant.reviews} reviews)</span>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-lg font-bold text-green-600">
                                                ₹{item.plant.price * item.quantity}
                                            </span>
                                            {item.plant.originalPrice && (
                                                <span className="text-sm text-gray-400 line-through">
                                                    ₹{item.plant.originalPrice * item.quantity}
                                                </span>
                                            )}
                                            {item.plant.discount && (
                                                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded">
                                                    {item.plant.discount}% OFF
                                                </span>
                                            )}
                                        </div>

                                        {/* Delivery Date */}
                                        <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                                            <Truck className="w-4 h-4 text-green-600" />
                                            <span>Delivery by {getDeliveryDate()}</span>
                                        </div>
                                    </div>

                                    {/* Quantity Controls & Remove */}
                                    <div className="flex items-center gap-3 ml-auto">
                                        <div className="flex items-center gap-1 border border-gray-300 rounded-lg">
                                            <button
                                                onClick={() => handleQuantityChange(item._id, item.plantId, item.quantity - 1)}
                                                disabled={item.quantity <= 1 || updatingItemId === item._id}
                                                className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Minus className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <span className="w-8 text-center font-semibold text-gray-800">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(item._id, item.plantId, item.quantity + 1)}
                                                disabled={updatingItemId === item._id}
                                                className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Plus className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => handleRemoveItem(item.plantId)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove from cart"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Continue Shopping */}
                            <div className="p-4 border-t border-gray-100">
                                <Link href="/plants">
                                    <button className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                                        <ArrowLeft className="w-4 h-4" />
                                        Continue Shopping
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Price Details */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Price Details</h2>

                            <div className="space-y-3">
                                {/* MRP */}
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">MRP (incl. of all taxes)</span>
                                    <span className="font-medium text-gray-800">₹{totals.subtotal.toFixed(2)}</span>
                                </div>

                                {/* Platform Fee */}
                                <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                                    <div>
                                        <span className="text-gray-600">Fees <span className="text-xs text-gray-400">^</span></span>
                                        <span className="text-xs text-gray-400 ml-1 block">Platform Fee</span>
                                    </div>
                                    <span className="font-medium text-gray-800">₹{totals.platformFee.toFixed(2)}</span>
                                </div>

                                {/* Discount */}
                                {totals.totalDiscount > 0 && (
                                    <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                                        <div>
                                            <span className="text-green-600">Discounts <span className="text-xs text-gray-400">^</span></span>
                                            <span className="text-xs text-gray-400 ml-1 block">Discount on MRP</span>
                                        </div>
                                        <span className="font-medium text-green-600">- ₹{totals.totalDiscount.toFixed(2)}</span>
                                    </div>
                                )}

                                {/* Total Amount */}
                                <div className="flex justify-between items-center pt-2 border-t-2 border-gray-200">
                                    <span className="text-base font-bold text-gray-800">Total Amount</span>
                                    <span className="text-xl font-bold text-green-600">₹{totals.total.toFixed(2)}</span>
                                </div>

                                {/* Savings */}
                                {totals.savings > 0 && (
                                    <div className="bg-green-50 rounded-lg p-3 mt-2">
                                        <p className="text-sm text-green-700 flex items-center gap-2">
                                            <span className="text-lg">💡</span>
                                            You&aops;ll save ₹{totals.savings.toFixed(2)} on this order!
                                        </p>
                                    </div>
                                )}

                                {/* Features */}
                                <div className="space-y-2 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <Shield className="w-4 h-4 text-green-600" />
                                        <span>Safe and secure payments</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <RotateCcw className="w-4 h-4 text-green-600" />
                                        <span>Easy returns</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <CreditCard className="w-4 h-4 text-green-600" />
                                        <span>100% Authentic products</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3 pt-4">
                                    <button className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl">
                                        Place Order
                                    </button>
                                    <button className="w-full py-3 border-2 border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-colors">
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;