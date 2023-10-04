import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div>
      <nav>
        <Link to="/questions">Questions</Link>
        <Link to="/">User</Link>
        {/* <Link to="/match" style={{ marginRight: "1rem" }}>
          Matching
        </Link> */}
      </nav>
    </div>
  );
}
