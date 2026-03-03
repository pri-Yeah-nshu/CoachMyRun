import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [gender, setGender] = useState("others");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const authData = useContext(AuthContext);
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/auth/register",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            age: Number(age),
            height,
            weight,
            gender,
          }),
        },
      );

      const output = await response.json();

      if (!response.ok) {
        throw new Error(output.message || "Registration failed");
      }
      navigate("/");
      setName("");
      setAge("");
      setEmail("");
      setGender("");
      setPassword("");
      setHeight(null);
      setWeight(null);
      console.log("Registered successfully:", output);
      authData.setUser(output.data.user);
      // TODO: redirect to login or dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-black pt-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-white">Register</h2>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={name}
              placeholder="Enter your name..."
              className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              placeholder="Enter your email..."
              className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              placeholder="Enter your password..."
              className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Age
            </label>
            <input
              type="text"
              value={age}
              placeholder="Enter your age..."
              className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Height (cm)
            </label>
            <input
              type="number"
              value={height}
              placeholder="Enter your height..."
              className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              placeholder="Enter your weight..."
              className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          {/* Gender ✅ fixed label + fixed value binding */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Gender
            </label>
            <select
              value={gender}
              className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
              onChange={(e) => setGender(e.target.value)}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Others</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-semibold text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {loading ? "Registering..." : "Register ❤️‍🔥"}
          </button>
        </form>
        <div className="flex flex-col-reverse">
          <button
            onClick={() => {
              navigate("/login");
            }}
            className="cursor: pointer text-semibold"
          >
            Already have account?
          </button>
        </div>
      </div>
    </div>
  );
}
