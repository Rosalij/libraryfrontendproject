import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import BookPage from "./pages/BookPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import SingleBookPage from "./pages/SingleBookPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "/books",
        element: <BookPage /> // Book search page, public or protected
      },
      {
        path: "/book/:bookId",
        element: <SingleBookPage /> // Book info + reviews page
      },
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/register",
        element: <RegisterPage />
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        )
      }
    ]
  }
]);

export default router;
