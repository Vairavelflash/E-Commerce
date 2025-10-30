"use client";
import Header from "@/components/Header";
import { api, APICall } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image_url: "",
    description: "",
    category_id: "",
  });

  useEffect(() => {
    APICall.get("/products")
      .then((r) => setProducts(r.data))
      .catch(console.error);

    APICall.get("/categories")
      .then((r) => setCategories(r.data))
      .catch(console.error);
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({
      name: "",
      price: "",
      stock: "",
      image_url: "",
      description: "",
      category_id: "",
    });
  }
  function openEdit(p) {
    setEditing(p);
    setForm({
      name: p.name,
      price: p.price,
      stock: p.stock,
      image_url: p.image_url,
      description: p.description,
      category_id:p.category_id
    });
  }

  async function save() {
    try {
      if (editing) await APICall.put("/products/" + editing.id, form);
      else await APICall.post("/products", form);
      const r = await api.get("/products");
      setProducts(r.data);
      setEditing(null);
    } catch (e) {
      alert("Save failed");
    } finally {
      openCreate();
    }
  }

  async function remove(id) {
    if (!confirm("Delete?")) return;
    await APICall.delete("/products/" + id);
    setProducts((p) => p.filter((x) => x.id !== id));
  }
  console.log("first", form);
  return (
    <div>
      <main className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Products</h2>
          <button onClick={openCreate} className="px-3 py-1 border rounded">
            Create
          </button>
        </div>
        <div className="space-y-2">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between border p-2 rounded"
            >
              <div>{p.name}</div>
              <div>
                {categories.filter((i) => p?.category_id == i?.id)[0]?.name}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(p)}
                  className="px-2 py-1 border rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(p.id)}
                  className="px-2 py-1 border rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border p-4 rounded">
          <h3 className="font-bold mb-2">
            {editing ? "Edit" : "Create"} Product
          </h3>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            className="border p-2 mb-2 w-full rounded"
          />
          <input
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Price"
            className="border p-2 mb-2 w-full rounded"
          />
          <input
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            placeholder="Stock"
            className="border p-2 mb-2 w-full rounded"
          />
          <input
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            placeholder="Image URL"
            className="border p-2 mb-2 w-full rounded"
          />
          <select
            value={categories?.filter(
              (item) => (item?.id == form?.category_id)
            )[0]?.id}
            className="border p-2 mb-2 w-full rounded"
            placeholder="Select Category"
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          >
            {categories.length > 0 &&
              categories.map((item) => (
                <option key={item?.id} value={item?.id}>
                  {item?.name}
                </option>
              ))}
              
          </select>

          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            className="border p-2 mb-2 w-full rounded"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setEditing(null)}
              className="px-3 py-1 border rounded"
            >
              Clear
            </button>
            <button
              onClick={save}
              className="px-3 py-1 bg-black text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
