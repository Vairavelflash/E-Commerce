"use client";
import Header from "@/components/Header";
import { useStore } from "@/store/useStore";
import { api, APICall } from "@/lib/api";
import { useEffect, useState } from "react";
import { CartDisplay } from "./CartDisplay";

export default function CartPage() {
  const { cart, cartId, setTrigger, trigger } = useStore();
  const [cartData, setCartData] = useState(null);

  async function fetchCart() {
    try {
      if (cartId) {
        const res = await APICall.get(`/cart/db/${cartId}`);
        setCartData(res?.data);
      }
    } catch (err) {
      console.log(err);
      // setCartData([])
    } 
  }

  useEffect(() => {
    fetchCart();
  }, [cartId,trigger]);
 
  return (
    <div>
      <main className="max-w-2xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Cart</h2>
        <div className="space-y-2">
          {cartData && <CartDisplay cartData={cartData} />}
        </div>
      </main>
    </div>
  );
}
