import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const authData = useContext(AuthContext);
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (!res.ok) {
        throw new Error(output.message || "Invalid credentials");
      }
      const output = await res.json();
      setEmail("");
      setPassword("");
      setError(null);
      authData.setUser(output.data.user);
      navigate("/");
      console.log(authData.user);
      console.log(output);
    } catch (err) {
      setError(err.message || "Something went wrong...");
    }
    setLoading(false);
    console.log("Email:", email);
    console.log("Password:", password);
  }
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-black pt-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-white">Login</h2>
        <p className="text-red-500 text-center font-semibold text-xl">
          {error}
        </p>
        <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
              placeholder="Enter your email..."
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Enter your password..."
              className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {!loading ? "Sign In❤️‍🔥" : "Loading..."}
          </button>
        </form>
        <div className="flex flex-col-reverse">
          <button
            onClick={() => {
              navigate("/signup");
            }}
            className="cursor: pointer text-semibold"
          >
            Create new account?
          </button>
        </div>
      </div>
    </div>
  );
}
// sign up component also i need to create for registering user
