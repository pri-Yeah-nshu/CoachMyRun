import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="nav">
      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="/track">Track</NavLink>
      <NavLink to="/coach">AI Coach</NavLink>
      <NavLink to="/history">History</NavLink>
    </nav>
  );
}
