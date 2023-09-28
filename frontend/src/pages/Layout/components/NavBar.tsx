import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div>
      <nav>
        <Link to="/questions" style={{ marginRight: "1rem" }}>
          Questions
        </Link>
        <Link to="/user/login" style={{ marginRight: "1rem" }}>
          User
        </Link>
        <Link to="/match" style={{ marginRight: "1rem" }}>
          Matching
        </Link>
      </nav>
    </div>
  );
}
