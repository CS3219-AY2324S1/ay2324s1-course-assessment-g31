import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import LoginPage from "./pages/LoginPage/LoginPage";
import MatchPage from "./pages/MatchingPage/MatchPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import QuestionsPage from "./pages/QuestionsPage/QuestionsPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";

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
      <Route path="match" element={<MatchPage />} />
      <Route path="*" element={<h1>404</h1>} />~
    </Route>,
  ),
);

// TODO rename to routes and use createBrowserRouter from react-router-dom v6
function App() {
  return <RouterProvider router={router} />;
}

export default App;
