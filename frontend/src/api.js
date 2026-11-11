// One helper to talk to the backend. Adds the login token automatically.
export async function api(path, method = "GET", body) {
  const res = await fetch("/api" + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token") || "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  // If the backend is not running, the reply is empty
  const text = await res.text();
  if (!text) throw new Error("Cannot reach the backend. Is it running on port 5000?");
  const data = JSON.parse(text);
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}
