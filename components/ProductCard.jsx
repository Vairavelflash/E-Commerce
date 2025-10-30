import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="border rounded p-3 flex flex-col">
      <img
        src={product.image_url || "https://placehold.co/400"}
        alt=""
        className="h-40 object-cover mb-2 rounded"
      />
      <h3 className="font-medium">{product.name}</h3>
      <p className="text-sm text-gray-600">₹{product.price}</p>
      <div className="mt-auto flex gap-2">
        <Link
          href={`/product/${product.id}`}
          className="px-3 py-1 border rounded"
        >
          View
        </Link>
      </div>
    </div>
  );
}
