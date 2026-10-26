import { RouterProvider } from "react-router";
import { routes } from "./routes/AppRoutes";

export default function App() {
  return (
    <>
      <RouterProvider router={routes} ></RouterProvider>
    </>
  )
}
