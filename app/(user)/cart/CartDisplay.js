import { APICall } from "@/lib/api";
import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";

export const CartDisplay = ({ cartData }) => {
  const { cart, items, total } = cartData;
  const { setTrigger } = useStore();

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(items || []);

    return () => {
      setCartItems([]);
    };
  }, [items]);

  const updateQuantity = (itemId, newQuantity) => {
    const updatedItems = cartItems.map((item) =>
      item.item_id === itemId
        ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity }
        : item
    );
    setCartItems(updatedItems);
  };

  const removeItem = (itemId) => {
    APICall.delete(`/cart/db/${cart?.id}`)
      .then((res) => setTrigger(new Date()))
      .catch((err) => console.error(err));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  async function checkout() {
    try {
      const res = await APICall.post("/orders", { cart_id: cart?.id });
      //   alert(JSON.stringify(res?.data));
    } catch (err) {
      console.error("Checkout Error", err);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-gray-600">{cartItems?.length} items in your cart</p>
      </div>

      {/* Cart Items */}
      <div className="space-y-6 mb-10">
        {cartItems?.map((item) => (
          <div
            key={item.item_id}
            className="flex items-center gap-6 p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200"
          >
            {/* Product Image */}
            <img
              src={item.image_url || "https://placehold.co/400"}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-xl shadow-lg"
            />

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Stock Available:{" "}
                <span className="font-medium text-green-600">{item.stock}</span>
              </p>

              {/* Price & Quantity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ${item.price}
                  </span>

                  {/* Quantity Controls */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-2">
                    {/* <button
                      onClick={() =>
                        updateQuantity(
                          item.item_id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="w-10 h-10 rounded-lg bg-white hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-600 hover:text-gray-900"
                    >
                      -
                    </button> */}
                    <span className="w-12 text-center text-lg font-semibold mx-3">
                      x {item.quantity}
                    </span>
                    {/* <button
                      onClick={() =>
                        updateQuantity(item.item_id, item.quantity + 1)
                      }
                      className="w-10 h-10 rounded-lg bg-white hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-600 hover:text-gray-900"
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button> */}
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ${item.subtotal}
                  </p>
                  <p className="text-sm text-gray-500">Subtotal</p>
                </div>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeItem(item.item_id)}
              className="w-12 h-12 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-all duration-200 flex items-center justify-center hover:scale-110"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Empty Cart State */}
      {cartItems?.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 5.5M7 13l-1.5 5.5M20 8H7M3 3h18M16 13h2a1 1 0 001-1V7a1 1 0 00-1-1h-2a1 1 0 00-1 1v5a1 1 0 001 1z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-600 mb-8">Add some items to get started!</p>
        </div>
      )}

      {/* Order Summary - Only show if cart has items */}
      {cartItems?.length > 0 && (
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-lg">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold">${calculateTotal()}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-700">Shipping:</span>
              <span className="text-green-600 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-700">Tax:</span>
              <span className="font-semibold">$0.00</span>
            </div>
          </div>

          {/* Total */}
          <div className="border-t-2 pt-6">
            <div className="flex justify-between items-center text-3xl font-bold">
              <span>Total:</span>
              <span className="text-blue-600">${calculateTotal()}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={checkout}
              className="flex-1 px-6 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Order →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
