"use client";
import Header from "@/components/Header";
import { api, APICall } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AdminCategories() {
  const [category, setCategory] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image_url: "",
    description: "",
  });

  useEffect(() => {
    APICall
      .get("/categories")
      .then((r) => setCategory(r.data))
      .catch(console.error);
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({ name: "",  description: "" });
  }
  function openEdit(p) {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
    });
  }

  async function save() {
    try {
      if (editing) await APICall.put("/categories/" + editing.id, form);
      else await APICall.post("/categories", form);
      const r = await APICall.get("/categories");
      setCategory(r.data);
      setEditing(null);
      setForm({name:"",description:""})
    } catch (e) {
      alert("Save failed");
    }
  }

  async function remove(id) {
    if (!confirm("Delete?")) return;
    await APICall.delete("/categories/" + id);
    setCategory((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div>
      <main className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Category</h2>
          <button onClick={openCreate} className="px-3 py-1 border rounded">
            Create
          </button>
        </div>
        <div className="space-y-2">
          {category.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between border p-2 rounded"
            >
              <div>{p.name}</div>
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
            {editing ? "Edit" : "Create"} Category
          </h3>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            className="border p-2 mb-2 w-full rounded"
          />
          
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            className="border p-2 mb-2 w-full rounded"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {setEditing(null)
                setForm({name:"",description:""})
              }}
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
