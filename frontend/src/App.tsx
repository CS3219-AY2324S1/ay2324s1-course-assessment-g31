import { AuthProvider } from "./context/AuthContext";
import { MatchingProvider } from "./context/MatchingContext";
import MainRouter from "./router/main";

// ES added a default
export default function App() {
  return (
    <AuthProvider>
      <MatchingProvider>
        <MainRouter />
      </MatchingProvider>
    </AuthProvider>
  );
}
