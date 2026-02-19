import { useState } from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return token ? (
    <Dashboard token={token} logout={logout} />
  ) : (
    <Auth setToken={setToken} />
  );
}

export default App;
