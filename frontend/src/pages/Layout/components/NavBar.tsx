import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div>
      <nav>
        <Link to="/questions">Questions</Link>
        <Link to="/">User</Link>
      </nav>
    </div>
  );
}
