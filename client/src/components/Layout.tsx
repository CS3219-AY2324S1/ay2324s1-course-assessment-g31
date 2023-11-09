import { useContext } from "react";
import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import Navbar from "./Navbar";

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
