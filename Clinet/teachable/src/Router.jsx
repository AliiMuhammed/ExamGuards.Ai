import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Admin from "./Pages/Admin/Admin";
import Notfound from "./Pages/NotFound/Notfound";
import AdminHome from "./Pages/Admin/Components/Home/AdminHome";
import AdminStudents from "./Pages/Admin/Components/Students/AdminStudents";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [],
    errorElement: <Notfound />,
  },
  {
    path: "/admin",
    element: <Admin />,
    children: [
      {
        path: "/admin/home",
        element: <AdminHome />,
        children: [],
      },
      {
        path: "/admin/students",
        element: <AdminStudents />,
      },
    ],
    errorElement: <Notfound />,
  },
]);
