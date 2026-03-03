import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
export default function Header() {
  const navigate = useNavigate();
  const authData = useContext(AuthContext);
  const [error, setError] = useState("");
  async function handleLogout() {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
      const output = await res.json();
      navigate("/login");
      console.log(output.message);
    } catch (err) {
      console.log(err.message);
      setError("Something went wrong!");
    }
  }

  return (
    <div className="flex flex-col">
      <div className="bg-gray-800 text-white p-8 flex flex-col items-center justify-between md:flex-row">
        <div className="flex items-center space-x-4">
          <span className=" text-3xl drop-shadow-[0_0_10px_rgba(255,100,0,0.9)] animate-pulse">
            ⚡
          </span>
          <h1 className="text-yellow-400 text-3xl font-black uppercase tracking-widest drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]">
            CoachMyRun
          </h1>
        </div>
        <span className="flex items-center space-x-4 mt-4 md:mt-0">
          <h2 className="text-sm font-bold text-amber-400">
            {authData.user ? "Welcome, " + authData.user.name + "👋" : null}
          </h2>
          {authData.user ? (
            <button
              className="bg-red-500 text-gray-800 px-2 rounded mt-2 md:mt-0"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : null}
        </span>
      </div>
      <div>{authData.user ? <NavBar /> : null}</div>
    </div>
  );
}
