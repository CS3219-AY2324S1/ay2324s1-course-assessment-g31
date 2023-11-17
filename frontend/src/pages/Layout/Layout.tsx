import { Outlet } from "react-router-dom";

import Footer from "./components/Footer";
import Navbar from "./components/NavBar";

function Layout() {
  return (
    <div className="min-h-full">
      <div className="py-0">
        <header>
          <Navbar />
        </header>
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
