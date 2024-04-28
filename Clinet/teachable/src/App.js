import React, { Suspense } from "react";
import { Outlet } from "react-router";
import MovetoTop from "./Shared/Components/MovetoTop";
import Backdrop from "./Shared/Components/Backdrop";
import MyToast from "./Shared/Components/MyToast";
import Footer from "./Shared/Components/Footer";

function App() {
  return (
    <>
      <Suspense fallback={<Backdrop />}>
        <Outlet />
        <Footer />
      </Suspense>
      <MyToast />
      <MovetoTop />
    </>
  );
}

export default App;
