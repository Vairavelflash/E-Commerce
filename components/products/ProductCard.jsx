import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md transition p-4 bg-white">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-52 object-cover rounded-md"
      />

      <div className="mt-4">
        <h2 className="text-lg font-semibold">{product.name}</h2>

        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-green-600">
            ${product.price}
          </span>

          {product.stock > 0 ? (
            <span className="text-sm text-green-600">
              {product.stock} in stock
            </span>
          ) : (
            <span className="text-sm text-red-500">
              Out of Stock
            </span>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            disabled={product.stock === 0}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            Add to Cart
          </button>

          <Link
            href={`/products/${product.id}`}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}