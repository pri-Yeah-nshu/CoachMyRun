import { useState } from "react";

export default function Rough() {
  async function registerUser() {
    const data = await fetch("http://localhost:3000/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        gender,
      }),
    });
    return data.json();
  }
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  //   const [user, setUser] = useState(null);
  const [gender, setGender] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    // setUser({ name, email, password, age, height, weight, gender });
    registerUser().then((data) => {
      console.log(data);
    });
  }
  return (
    <div>
      <form>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="number"
          placeholder="height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <input
          type="number"
          placeholder="weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <input
          type="number"
          placeholder="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          type="text"
          placeholder="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />
        <button
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          Register User
        </button>
      </form>
    </div>
  );
}
