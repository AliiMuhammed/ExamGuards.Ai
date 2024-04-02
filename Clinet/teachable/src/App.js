import React, { Suspense } from "react";
import { Outlet } from "react-router";
import MovetoTop from "./Shared/Components/MovetoTop";
import Backdrop from "./Shared/Components/Backdrop";

const NavBar = React.lazy(() => import("./Shared/Components/NavBar"));
const Footer = React.lazy(() => import("./Shared/Components/Footer"));

function App() {
  return (
    <>
      <Suspense fallback={<Backdrop />}>
        <NavBar />
        <Outlet />
        <Footer />
      </Suspense>
      <MovetoTop />
    </>
  );
}

export default App;
