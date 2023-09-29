import { AuthProvider } from "./context/AuthContext";
import RouterCompon from "./router/routerComp";

// ES added a default
export default function App() {
  return (
    <AuthProvider>
      <RouterCompon />
    </AuthProvider>
  );
}
