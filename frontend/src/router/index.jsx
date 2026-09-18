import { createBrowserRouter } from "react-router";
import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import NotFound from "../pages/NotFound.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <Home /> },
            { path: "*", element: <NotFound /> },


        ]
    }
])