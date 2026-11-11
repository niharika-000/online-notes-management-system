import { useEffect, useState } from "react";
import { api } from "./api.js";

const empty = { title: "", content: "", category: "" };

export default function Notes({ onLogout }) {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null); // id of the note being edited
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  // Load notes from the backend (with search text and category filter)
  const loadNotes = async () => {
    const data = await api(
      "/notes?search=" + encodeURIComponent(search) + "&category=" + encodeURIComponent(category)
    );
    setNotes(data);
  };

  // Reload whenever the search text or category filter changes
  useEffect(() => {
    loadNotes().catch((err) => setError(err.message));
  }, [search, category]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Add a new note, or update one if we are editing
  const save = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api("/notes/" + editId, "PUT", form);
      else await api("/notes", "POST", form);
      setForm(empty);
      setEditId(null);
      setError("");
      loadNotes();
    } catch (err) {
      setError(err.message);
    }
  };

  const edit = (note) => {
    setEditId(note._id);
    setForm({ title: note.title, content: note.content, category: note.category });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    await api("/notes/" + id, "DELETE");
    loadNotes();
  };

  // Category list for the filter dropdown (taken from current notes)
  const categories = [...new Set(notes.map((n) => n.category))];

  return (
    <>
      <div className="top">
        <span>Hello, {localStorage.getItem("name")}</span>
        <button onClick={onLogout}>Logout</button>
      </div>

      <form className="card" onSubmit={save}>
        <h2>{editId ? "Edit Note" : "Add Note"}</h2>
        <input name="title" placeholder="Title" value={form.title} onChange={change} required />
        <input name="category" placeholder="Subject / Category (e.g. Maths)" value={form.category} onChange={change} />
        <textarea name="content" placeholder="Write your note here..." rows="4" value={form.content} onChange={change} />
        {error && <p className="error">{error}</p>}
        <button type="submit">{editId ? "Update" : "Add"}</button>
        {editId && (
          <button type="button" className="grey" onClick={() => { setEditId(null); setForm(empty); }}>
            Cancel
          </button>
        )}
      </form>

      <div className="filters">
        <input placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {notes.length === 0 && <p>No notes found.</p>}
      {notes.map((note) => (
        <div className="card note" key={note._id}>
          <h3>{note.title}</h3>
          <span className="tag">{note.category}</span>
          <p>{note.content}</p>
          <button onClick={() => edit(note)}>Edit</button>
          <button className="red" onClick={() => remove(note._id)}>Delete</button>
        </div>
      ))}
    </>
  );
}
