import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookPage from "./pages/BookPage";
import SingleBookPage from "./pages/SingleBookPage";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage"
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
                path: "/login",
                element: <LoginPage />
            },
             {
                path: "/register",
                element: (
                     <RegisterPage />
                )
            },
            {
                path: "/books",
                element: (
                    <ProtectedRoute>  <BookPage /></ProtectedRoute>
                )
            },
            {
                path: "/books/:id",
                element: (<ProtectedRoute><SingleBookPage /></ProtectedRoute>)
            },
            {
                path: "/profile",
                element: (<ProtectedRoute><ProfilePage /></ProtectedRoute>)
            },
            {
                path: "/reviews",
                element: (<ProtectedRoute><h1>Reviews</h1></ProtectedRoute>)
            }
        ]
    }

])
export default router;