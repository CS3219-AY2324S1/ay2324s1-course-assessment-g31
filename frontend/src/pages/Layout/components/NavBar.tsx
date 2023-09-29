import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function NavBar() {
  const { currentUser } = useAuth();

  return (
    <div>
      <nav>
        <Link to="/questions">Questions</Link>
        <Link to="/">User</Link>
      </nav>
    </div>
  );
}
