"use client";
import useFormState from "@/hooks/useFormState";
import { api } from "@/lib/api";
import { productSchema } from "@/lib/validators";

export default function ProductForm({ product, onClose }) {
  const form = useFormState(
    {
      name: product?.name || "",
      price: product?.price || 0,
      stock: product?.stock || 0,
      image_url: product?.image_url || "",
      description: product?.description || "",
      category_id: product?.category_id || null,
    },
    productSchema
  );

  async function submit(e) {
    e.preventDefault();
    const v = form.validate();
    if (!v.ok) return;
    try {
      if (product) {
        await api.put("/products/" + product.id, form.values);
      } else {
        await api.post("/products", form.values);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <form onSubmit={submit} className="bg-white p-4 rounded w-full max-w-lg">
        <h3 className="font-bold mb-2">
          {product ? "Edit" : "Create"} Product
        </h3>
        <input
          value={form.values.name}
          onChange={(e) => form.setField("name", e.target.value)}
          placeholder="Name"
          className="border p-2 rounded w-full mb-2"
        />
        {form.errors.name && (
          <div className="text-red-600">{form.errors.name}</div>
        )}
        <input
          value={form.values.price}
          onChange={(e) => form.setField("price", e.target.value)}
          placeholder="Price"
          className="border p-2 rounded w-full mb-2"
        />
        <input
          value={form.values.stock}
          onChange={(e) => form.setField("stock", e.target.value)}
          placeholder="Stock"
          className="border p-2 rounded w-full mb-2"
        />
        <input
          value={form.values.image_url}
          onChange={(e) => form.setField("image_url", e.target.value)}
          placeholder="Image URL"
          className="border p-2 rounded w-full mb-2"
        />
        <textarea
          value={form.values.description}
          onChange={(e) => form.setField("description", e.target.value)}
          placeholder="Description"
          className="border p-2 rounded w-full mb-2"
        />
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border rounded"
          >
            Cancel
          </button>
          <button className="px-3 py-1 bg-black text-white rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
