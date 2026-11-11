import { useState } from "react";
import { api } from "./api.js";

// One form used for both Login and Register
export default function AuthForm({ onSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await api(isRegister ? "/auth/register" : "/auth/login", "POST", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>{isRegister ? "Register" : "Login"}</h2>
      {isRegister && (
        <input name="name" placeholder="Name" value={form.name} onChange={change} required />
      )}
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} required />
      {error && <p className="error">{error}</p>}
      <button type="submit">{isRegister ? "Register" : "Login"}</button>
      <p className="link" onClick={() => { setIsRegister(!isRegister); setError(""); }}>
        {isRegister ? "Already have an account? Login" : "New user? Register"}
      </p>
    </form>
  );
}
