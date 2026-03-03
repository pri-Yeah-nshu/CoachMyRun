import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
// import ProtectedRoutes from "./ProtectedRoutes";

export default function AppLayout() {
  return (
    // <ProtectedRoutes>
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
    // </ProtectedRoutes>
  );
}
