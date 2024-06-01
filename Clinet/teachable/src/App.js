import React, { Suspense } from "react";
import { Outlet } from "react-router";
import MovetoTop from "./Shared/Components/MovetoTop";
import Backdrop from "./Shared/Components/Backdrop";
import MyToast from "./Shared/Components/MyToast";
import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <Suspense fallback={<Backdrop />}>
        <Outlet />
      </Suspense>
      <Link to={"/login"}>Login</Link>
      <MyToast />
      <MovetoTop />
    </>
  );
}

export default App;
