import "./App.css";
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Register from "./pages/register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/login";
import BlankLayout from "./pages/blankLayout";
import Home from "./pages/home";
const router = createBrowserRouter([
  {
    path: "/auth",
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/",
    element: <BlankLayout />,
    children: [{ path: "/", element: <Home /> }],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
