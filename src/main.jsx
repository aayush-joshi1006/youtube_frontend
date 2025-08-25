import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Provider } from "react-redux";

import { ToastContainer } from "react-toastify";

import "./index.css";

import App from "./App.jsx";

import appStore from "./utiles/appStore.js";

// import HomePage from "./pages/HomePage.jsx";
// import YourPage from "./pages/YourChannel.jsx";
// import Login from "./pages/Login.jsx";
// import SignUp from "./pages/SignUp.jsx";
// import Video from "./pages/Video.jsx";
// import CreateChannel from "./pages/CreateChannel.jsx";
// import UploadVideo from "./pages/UplaodVideo.jsx";
// import Error from "./pages/Error.jsx";
import {
  HomePage,
  YourPage,
  Login,
  SignUp,
  Video,
  CreateChannel,
  UplaodVideo,
  Error,
} from "./utiles/routes.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/channel/:id",
        element: <YourPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/video/:id",
        element: <Video />,
      },
      {
        path: "/createChannel",
        element: <CreateChannel />,
      },
      {
        path: "/upload",
        element: <UplaodVideo />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      <RouterProvider router={router} />
    </Provider>
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  </StrictMode>
);
