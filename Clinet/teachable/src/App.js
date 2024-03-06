import React from "react";
import { Outlet } from "react-router";
import NavBar from "./Shared/Components/NavBar";
import Footer from "./Shared/Components/Footer";
import MovetoTop from "./Shared/Components/MovetoTop";

function App() {
  return (
    <>
      <MovetoTop />
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
