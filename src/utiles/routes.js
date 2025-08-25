import { lazy } from "react";

export const HomePage = lazy(() => import("../pages/HomePage.jsx"));
export const YourPage = lazy(() => import("../pages/YourChannel.jsx"));
export const Login = lazy(() => import("../pages/Login.jsx"));
export const SignUp = lazy(() => import("../pages/SignUp.jsx"));
export const Video = lazy(() => import("../pages/Video.jsx"));
export const CreateChannel = lazy(() => import("../pages/CreateChannel.jsx"));
export const UplaodVideo = lazy(() => import("../pages/UplaodVideo.jsx"));
export const Error = lazy(() => import("../pages/Error.jsx"));
