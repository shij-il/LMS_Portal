import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="page-layout">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="main-content">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <div className="page-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
