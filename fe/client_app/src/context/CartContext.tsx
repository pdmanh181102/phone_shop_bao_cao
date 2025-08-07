"use client";
import { CartApi } from "@/api/client/cart_api";
import { AuthStorage } from "@/util/auth_storage";
import { createContext, useContext, useEffect, useState } from "react";

interface CartContextType {
  cartCount: number;
  refreshCart: () => Promise<void>; // ✅ Thêm dòng này
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  refreshCart: async () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = async () => {
    try {
      const data = await CartApi.readAllProduct(AuthStorage.getAccountUid()!);
      setCartCount(data.length);
    } catch (error) {
      console.error("Không thể load giỏ hàng:", error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
