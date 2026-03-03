import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function AppLayout() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <span>⚡</span>
          <h1>CoachMyRun</h1>
        </div>
        <NavBar />
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
