import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoutes/AuthProtectedRoute";
import RouteLoadingFallback from "../components/RouteLoadingFallback";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    HydrateFallback: RouteLoadingFallback,
    children: [
      {
        index: true,
        HydrateFallback: RouteLoadingFallback,
        lazy: async () => {
          const { default: Home } = await import("../pages/Home/Home");
          return { Component: Home };
        },
      },
      {
        path: "projects",
        HydrateFallback: RouteLoadingFallback,
        lazy: async () => {
          const { default: ProjectsPage } = await import(
            "../pages/Projects/Projects"
          );
          return { Component: ProjectsPage };
        },
      },
    ],
  },
  {
    path: "/login",
    HydrateFallback: RouteLoadingFallback,
    lazy: async () => {
      const { default: Login } = await import("../pages/login/Login");
      return { Component: Login };
    },
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        HydrateFallback: RouteLoadingFallback,
        lazy: async () => {
          const { default: Dashboard } = await import(
            "../pages/Dashboard/Dashboard"
          );
          return { Component: Dashboard };
        },
      },
    ],
  },
  {
    path: "*",
    HydrateFallback: RouteLoadingFallback,
    lazy: async () => {
      const { default: Notfound } = await import("../pages/Notfound/Notfound");
      return { Component: Notfound };
    },
  },
]);
