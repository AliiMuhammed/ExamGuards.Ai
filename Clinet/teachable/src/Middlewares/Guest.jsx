import { Outlet, Navigate } from "react-router-dom";
import { getAuthUser } from "../Helper/Storage";

const Guest = () => {
  const auth = getAuthUser();
  return (
    <>
      {!auth ? (
        <Outlet />
      ) : (
        <Navigate
          to={`/${
            auth.data.data.user.role === "super admin"
              ? "admin"
              : auth.data.data.user.role
          }/home`}
        />
      )}
    </>
  );
};

export default Guest;
