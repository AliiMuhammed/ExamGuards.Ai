import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Admin from "./Pages/Admin/Admin";
import Notfound from "./Pages/NotFound/Notfound";

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
    children: [],
    errorElement: <Notfound />,
  },
]);
