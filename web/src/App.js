// external imports
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// internal imports
import Login from "./pages/Login";
import Loader from "components/Loader";
import Register from "./pages/Register";
import Calendar from "./pages/Calendar";
import Verify from "./pages/VerifyEmail";
import AppContextWrapper from "context/useApp";

//styles
import "react-multi-email/dist/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Calendar />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/verify-email",
    element: <Verify />,
  },
]);

function App() {
  return (
    <AppContextWrapper>
      <RouterProvider router={router} />
      <Loader />
    </AppContextWrapper>
  );
}

export default App;
