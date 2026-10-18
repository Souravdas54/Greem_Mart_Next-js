// contexts/CartContext.tsx
'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { getCart } from '@/app/api/cart.and.wishlist.endpoint';

interface CartContextType {
    cartCount: number;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
    cartCount: 0,
    refreshCart: async () => { },
});

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartCount, setCartCount] = useState<number>(0);
    const isMounted = useRef(true);

    // Core fetch logic — reusable, but NOT auto-called from the mount effect directly
    const fetchCartCount = useCallback(async () => {
        try {
            const accessToken = sessionStorage.getItem('accessToken');
            if (!accessToken) {
                if (isMounted.current) setCartCount(0);
                return;
            }

            const cart = await getCart();
            const totalItems = cart.reduce((accum: number, item: any) => accum + (item.quantity || 1), 0);
            console.log('Cart count', totalItems)

            if (isMounted.current) setCartCount(totalItems);
        } catch (error) {
            console.error('Error fetching cart count:', error);
            if (isMounted.current) setCartCount(0);
        }
    }, []);

    // Public method components can call after add/remove actions
    const refreshCart = useCallback(async () => {
        await fetchCartCount();
    }, [fetchCartCount]);

    // Mount effect — inline async IIFE instead of calling refreshCart by reference
    useEffect(() => {
        isMounted.current = true;

        (async () => {
            await fetchCartCount();
        })();

        return () => {
            isMounted.current = false;
        };
    }, [fetchCartCount]);

    return (
        <CartContext.Provider value={{ cartCount, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);