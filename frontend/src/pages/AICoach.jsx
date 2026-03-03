import { useState } from "react";
import { getCoachingAdvice } from "../services/aiCoachService";

export default function AICoach() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleAsk = async () => {
    const reply = await getCoachingAdvice(input);
    setResponse(reply);
  };

  return (
    <div>
      <h2>AI Coach</h2>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask anything..."
      />
      <button onClick={handleAsk}>Ask</button>

      <p>{response}</p>
    </div>
  );
}
