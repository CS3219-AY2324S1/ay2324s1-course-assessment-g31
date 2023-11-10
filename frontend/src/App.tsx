import { AuthProvider } from "./context/AuthContext";
import { CollaborationProvider } from "./context/CollaborationContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import { MatchingProvider } from "./context/MatchingContext";
import { NotificationProvider } from "./context/NotificationContext";
import { QuestionProvider } from "./context/QuestionContext";
import MainRouter from "./router/main";

// ES added a default
export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <MatchingProvider>
          <DarkModeProvider>
            <QuestionProvider>
              <CollaborationProvider>
                <MainRouter />
              </CollaborationProvider>
            </QuestionProvider>
          </DarkModeProvider>
        </MatchingProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
