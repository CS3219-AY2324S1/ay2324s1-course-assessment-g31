import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import QuestionsPage from "./pages/QuestionsPage/QuestionsPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import Layout from "./pages/Layout/Layout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="questions">
        <Route index element={<QuestionsPage />} />
      </Route>
      <Route path="user">
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      ~
    </Route>,
  ),
);

// TODO rename to routes and use createBrowserRouter from react-router-dom v6
function App() {
  return <RouterProvider router={router} />;
}

export default App;
