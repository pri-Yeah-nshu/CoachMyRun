import React, { useState, useContext, Children } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { io } from "socket.io-client";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Rough from "./components/Rough";
import Signup from "./components/Signup";
import { AuthContext } from "./context/AuthProvider";
import NavBar from "../src/components/NavBar";
import AppLayout from "./components/AppLayout";
import Map from "./components/Map";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./components/Profile";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { useEffect } from "react";
function App() {
  const authData = useContext(AuthContext);
  const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },

    {
      path: "/",
      element: (
        <ProtectedRoutes>
          <AppLayout />
        </ProtectedRoutes>
      ),
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "map",
          element: <Map />,
        },
        {
          path: "coach",
          element: <h1>AI Coach</h1>,
        },
        {
          path: "*",
          element: <PageNotFound />,
        },
      ],
    },

    // global fallback
    { path: "*", element: <PageNotFound /> },
  ]);
  const socket = io("http://localhost:3000");
  useEffect(() => {
    socket.on("connect", () => {
      console.log(`"connected ${socket.id}"`);
    });
    socket.on("welcome", (e) => {
      console.log(e);
    });
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
