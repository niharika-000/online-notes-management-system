import { useState } from "react";
import AuthForm from "./AuthForm.jsx";
import Notes from "./Notes.jsx";

export default function App() {
  // user is logged in if a token is saved in the browser
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  const logout = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  return (
    <div className="container">
      <h1>Online Notes</h1>
      {loggedIn ? (
        <Notes onLogout={logout} />
      ) : (
        <AuthForm onSuccess={() => setLoggedIn(true)} />
      )}
    </div>
  );
}
