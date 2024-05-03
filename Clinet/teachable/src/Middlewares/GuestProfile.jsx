import { Outlet, Navigate } from "react-router-dom";
import { getAuthUser } from "../Helper/Storage";

const GuestProfile = () => {
  const auth = getAuthUser();
  return <>{auth ? <Outlet /> : <Navigate to={"/"} />}</>;
};

export default GuestProfile;
