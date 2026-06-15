import { useState } from "react";

import Sidebar from "../components/layout/Sidebar";

import Navbar from "../components/layout/Navbar";

import Footer from "../components/layout/Footer";

function MainLayout({ children }) {

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const toggleSidebar = () => {

    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen selection:bg-brand/30">

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Right Side */}
      <div className="flex-1 flex flex-col md:ml-64">

        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main
          className="
            flex-1
            p-4
            md:p-6
            lg:p-8
            overflow-auto
          "
        >

          {children}

        </main>

        {/* Footer */}
        <Footer />

      </div>

    </div>
  );
}

export default MainLayout;