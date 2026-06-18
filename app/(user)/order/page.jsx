import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function OrderDetailsPage() {
  return (
    <div className="container mx-auto max-w-6xl py-10 px-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Order #ORD-123456
          </h1>

          <p className="text-muted-foreground mt-1">
            Placed on June 18, 2026
          </p>
        </div>

        <h5 className="w-fit">
          Delivered
        </h5>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Left Side */}
        <div className="space-y-6">
          {/* Ordered Items */}
          <Card>
            <CardHeader>
              <CardTitle>
                Ordered Items
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex gap-4"
                >
                  <img
                    src="https://placehold.co/120"
                    alt="Product"
                    className="h-24 w-24 rounded-lg border object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">
                      Leather Jacket
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Premium genuine leather jacket
                    </p>

                    <div className="mt-2 flex gap-4 text-sm">
                      <span>Qty: 2</span>
                      <span>$149.00</span>
                    </div>
                  </div>

                  <div className="font-semibold">
                    $298.00
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

       
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>
                Order Summary
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>$447.00</span>
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
                <span>$477.00</span>
              </div>
            </CardContent>
          </Card>

      

          <Button className="w-full">
            Download Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}