import { Routes, Route } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import Dashboard from "../pages/Dashboard";
import TrackRun from "../pages/TrackRun";
import AICoach from "../pages/AICoach";
import History from "../pages/History";
import Login from "../pages/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="track" element={<TrackRun />} />
        <Route path="coach" element={<AICoach />} />
        <Route path="history" element={<History />} />
      </Route>
    </Routes>
  );
}
