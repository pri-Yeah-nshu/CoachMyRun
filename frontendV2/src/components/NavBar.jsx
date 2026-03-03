import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "◈" },
  { to: "/map", label: "Map", icon: "◎" },
  { to: "/aicoach", label: "AI Coach", icon: "✦" },
  { to: "/profile", label: "Profile", icon: "⊙" },
];

export default function NavBar() {
  return (
    <nav className="flex justify-evenly gap-8 mt-2">
      {links.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 pb-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "text-yellow-400 border-b-2 border-yellow-400"
                : "text-gray-500 hover:text-gray-300"
            }`
          }
        >
          <span className="text-base">{icon}</span>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
