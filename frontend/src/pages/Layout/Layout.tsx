import { Outlet } from "react-router";
import Navbar2 from "./components/Navbar2";

export default function Layout() {
  return (
    <div>
      <Navbar2 />
      <Outlet />
    </div>
  );
}
