import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuestionsPage from "./pages/QuestionsPage/QuestionsPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
