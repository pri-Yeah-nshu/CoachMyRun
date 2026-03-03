import React, { createContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";

export const RunContext = createContext();

function RunProvider({ children }) {
  const [run, setRun] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/run/history", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Something went wrong!");
        } else {
          const output = await res.json();
          console.log(output);
          setRun(output.data.runs);
        }
      } catch (error) {
        console.error("Run check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <RunContext.Provider
      value={{
        run,
        setRun,
        loading,
      }}
    >
      {children}
    </RunContext.Provider>
  );
}

export default RunProvider;
