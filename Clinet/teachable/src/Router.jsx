import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Admin from "./Pages/Admin/Admin";
import Notfound from "./Pages/NotFound/Notfound";
import AdminHome from "./Pages/Admin/Components/Home/AdminHome";
import AdminStudents from "./Pages/Admin/Components/Students/AdminStudents";
import Login from "./Pages/Login/Login";
import AdminInstructors from "./Pages/Admin/Components/Instructors/AdminInstructors";
import Admins from "./Pages/Admin/Components/Admins/Admins";
import AdminCourses from "./Pages/Admin/Components/Courses/AdminCourses";
import UserProfile from "./Pages/Profile/UserProfile";
import RestPass from "./Pages/Login/components/RestPassword/RestPass";
import ForgetPassword from "./Pages/Login/components/ForgetPassword/ForgetPassword";
import Register from "./Pages/Register/Register";
import Instructor from "./Pages/Instructor/Instructor";
import Courses from "./Pages/Instructor/components/Courses/Courses";
import SingleCourse from "./Pages/Instructor/components/Courses/components/Single Course/SingleCourse";
import Guest from "./Middlewares/Guest";
import GuestProfile from "./Middlewares/GuestProfile";
import Role from "./Middlewares/Role";
import TestDownload from "./Pages/Test/TestDownload";
import CourseModules from "./Pages/Instructor/components/Courses/components/Single Course/components/Modules/CourseModules";
import CouresLec from "./Pages/Instructor/components/Courses/components/Single Course/components/Lectures/CouresLec";
import CourseAss from "./Pages/Instructor/components/Courses/components/Single Course/components/Assignments/CourseAss";
import CourseExams from "./Pages/Instructor/components/Courses/components/Single Course/components/Exams/CourseExams";
import SetGrades from "./Pages/Instructor/components/Courses/components/Single Course/components/Grades/SetGrades";
import { AddExam } from "./Pages/Instructor/components/Courses/components/Single Course/components/Exams/components/AddExam/AddExam";
import AllExams from "./Pages/Instructor/components/Courses/components/Single Course/components/Exams/components/AllExams/AllExams";
import VisibilityChangeComponent from "./Pages/VisibilityChangeComponent";
import SingleExam from "./Pages/Instructor/components/Courses/components/Single Course/components/Exams/components/SingleExam/SingleExam";
import UpdateExam from "./Pages/Instructor/components/Courses/components/Single Course/components/Exams/components/SingleExam/components/UpdateExam/UpdateExam";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <Guest />,
        children: [
          { path: "login", element: <Login /> },
          { path: "forgetPassword", element: <ForgetPassword /> },
          { path: "resetPassword/:token", element: <RestPass /> },
          { path: "register", element: <Register /> },
        ],
      },
      {
        element: <Role />,
        children: [
          {
            path: "admin",
            element: <Admin />,
            children: [
              { path: "home", element: <AdminHome /> },
              { path: "students", element: <AdminStudents /> },
              { path: "instructors", element: <AdminInstructors /> },
              { path: "admins", element: <Admins /> },
              { path: "courses", element: <AdminCourses /> },
              {
                element: <GuestProfile />,
                children: [{ path: "profile/:id", element: <UserProfile /> }],
              },
            ],
          },
          {
            path: "instructor",
            element: <Instructor />,
            children: [
              { path: "courses", element: <Courses /> },
              {
                path: "course/:id",
                element: <SingleCourse />,
                children: [
                  { path: "", element: <Navigate to="modules" /> }, // Default redirect
                  { path: "modules", element: <CourseModules /> },
                  { path: "lectures", element: <CouresLec /> },
                  { path: "assignments", element: <CourseAss /> },
                  { path: "setGrades", element: <SetGrades /> },
                  {
                    path: "exams",
                    element: <CourseExams />,
                    children: [
                      { path: "", element: <AllExams /> },
                      { path: "add", element: <AddExam /> },
                      {
                        path: ":Examid",
                        element: <SingleExam />,
                        children: [{ path: "update", element: <UpdateExam /> }],
                      },
                    ],
                  },
                ],
              },
              {
                element: <GuestProfile />,
                children: [{ path: "profile/:id", element: <UserProfile /> }],
              },
              {
                path: "test",
                element: <VisibilityChangeComponent />,
              },
            ],
          },
        ],
      },
      { path: "test", element: <TestDownload /> },
    ],
    errorElement: <Notfound />,
  },
]);
