"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/useOrder";

export default function OrderDetailsPage() {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }
  console.log("first", orders);
  return (
    <div className="container mx-auto max-w-6xl py-10 px-4 space-y-10">
      {/* Left Side */}
      {orders?.data.length > 0 &&
        orders?.data.map((order) => (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]" key={order?.id}>
            <div className="space-y-6" >
              {/* Ordered Items */}
              <Card>
                <CardHeader
                  className={"flex items-center justify-between w-full"}
                >
                  <CardTitle>
                    Order #{order?.orderNumber}
                    <p className=" text-sm text-muted-foreground mt-1">
                      Placed on {order?.created_at}
                    </p>
                  </CardTitle>
                  <h5 className="w-fit">{order?.status}</h5>
                </CardHeader>

                <CardContent className="space-y-5">
                  {order?.items?.length > 0 &&
                    order?.items.map((item) => (
                      <div key={item?.id} className="flex gap-4">
                        <img
                          src={
                            item?.productImageUrl || "https://placehold.co/120"
                          }
                          alt="Product"
                          className="h-24 w-24 rounded-lg border object-cover"
                        />

                        <div className="flex-1">
                          <h3 className="font-semibold">{item?.productName}</h3>

                          {/* <p className="text-sm text-muted-foreground">
                      Premium genuine leather jacket
                    </p> */}

                          <div className="mt-2 flex gap-4 text-sm">
                            <span>Qty: {item?.quantity}</span>
                            <span>${item.unitPrice}</span>
                          </div>
                        </div>

                        <div className="font-semibold">${item?.subtotal}</div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
            {/* Right Side */}
            <div className="space-y-4">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${order?.totalAmount}</span>
                  </div>

                  {/* <div className="flex justify-between">
                <span>Shipping</span>
                <span>$10.00</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>$20.00</span>
              </div> */}

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${order?.totalAmount}</span>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full">Download Invoice</Button>
            </div>
          </div>
        ))}
    </div>
  );
}
