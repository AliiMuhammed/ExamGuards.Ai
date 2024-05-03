import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Admin from "./Pages/Admin/Admin";
import Notfound from "./Pages/NotFound/Notfound";
import AdminHome from "./Pages/Admin/Components/Home/AdminHome";
import AdminStudents from "./Pages/Admin/Components/Students/AdminStudents";
import Login from "./Pages/Login/Login";
import AdminInstructors from "./Pages/Admin/Components/Instructors/AdminInstructors";
import Admins from "./Pages/Admin/Components/ِAdmins/Admins";
import AdminCourses from "./Pages/Admin/Components/Courses/AdminCourses";
import AdminProfile from "./Pages/Admin/Components/Profile/AdminProfile";
import RestPass from "./Pages/Login/components/RestPassword/RestPass";
import ForgetPassword from "./Pages/Login/components/ForgetPassword/ForgetPassword";
import Register from "./Pages/Register/Register";
import Instructor from "./Pages/Instructor/Instructor";
import Courses from "./Pages/Instructor/components/Courses/Courses";
import SingleCourse from "./Pages/Instructor/components/Courses/components/Single Course/SingleCourse";
import Guest from "./Middlewares/Guest";
import GuestProfile from "./Middlewares/GuestProfile";
import Role from "./Middlewares/Role";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      //login routes
      {
        element: <Guest />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/forgetPassword",
            element: <ForgetPassword />,
          },
          {
            path: "/resetPassword/:token",
            element: <RestPass />,
          },
          {
            path: "/register",
            element: <Register />,
          },
        ],
      },
      {
        element: <Role />,
        children: [
          //admin routes
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
              {
                path: "/admin/instructors",
                element: <AdminInstructors />,
              },
              {
                path: "/admin/admins",
                element: <Admins />,
              },
              {
                path: "/admin/courses",
                element: <AdminCourses />,
              },
              {
                element: <GuestProfile />,
                children: [
                  {
                    path: "/admin/profile/:id",
                    element: <AdminProfile />,
                  },
                ],
              },
            ],
          },
          //instructor routes
          {
            path: "/instructor",
            element: <Instructor />,
            children: [
              {
                path: "/instructor/courses",
                element: <Courses />,
              },
              {
                path: "/instructor/course/:id",
                element: <SingleCourse />,
              },
            ],
          },
        ],
      },
    ],
    errorElement: <Notfound />,
  },
]);
