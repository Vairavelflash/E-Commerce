"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  useAddToCart,
  useCart,
  useRemoveCartItem,
  useUpdateCartQuantity,
} from "@/hooks/useCart";
import { useGetProduct } from "@/hooks/useProducts";
import { useCheckout } from "@/hooks/useOrder";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useCart();

  const addMutation = useAddToCart();
  const updateMutation = useUpdateCartQuantity();
  const removeMutation = useRemoveCartItem();

  const checkoutMutation = useCheckout();

  // const cartItem = cart?.items?.find((item) => item.productId === product.id);

  // const quantity = cartItem?.quantity || 0;



  const handleIncrease = (cartItem) => {
      // const { data: product } = useGetProduct();
    
    // if (quantity >= product.stock) return;

    updateMutation.mutate({
      cartItemId: cartItem.id,
      quantity: cartItem?.quantity + 1,
    });
  };

  const handleDecrease = (cartItem) => {
    if (cartItem?.quantity === 1) {
      removeMutation.mutate(cartItem.id);
      return;
    }
    updateMutation.mutate({
      cartItemId: cartItem.id,
      quantity: cartItem?.quantity - 1,
    });
  };

  const handleRemove = (cartItem) => {
    removeMutation.mutate(cartItem.id);
    return;
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  console.log("first", cart);
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        {/* Cart Items */}
        <div className="space-y-4">
          {cart?.items.length > 0 &&
            cart?.items.map((item) => (
              <Card key={item?.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* Product Image */}
                    {/* <div className="h-28 w-28 overflow-hidden rounded-lg border">
                    <img
                      src={item?.product?.imageUrl ||"https://placehold.co/400"}
                      alt="Product"
                      className="h-full w-full object-cover"
                    />
                  </div> */}

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item?.name}</h3>

                      <p className="font-semibold mt-3">${item?.price} x {item?.quantity} = {item?.subtotal}</p>
                    </div>

                    {/* Quantity */}
                    <div className="flex flex-col items-end justify-between">
                      <Button variant="ghost" size="sm" onClick={() =>handleRemove(item)}>
                        Remove
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={()=>handleDecrease(item)}
                        >
                          -
                        </Button>

                        <span className="w-8 text-center font-medium">{item?.quantity}</span>

                        <Button
                          variant="outline"
                          size="icon"
                          // disabled={quantity >= product.stock}
                          onClick={() =>handleIncrease(item)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${cart?.total}</span>
              </div>

              <Button className="w-full" onClick={() =>checkoutMutation.mutate()}>Proceed to Checkout</Button>

              <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
