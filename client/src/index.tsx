import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { CollaborationProvider } from "./context/CollaborationContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import { AuthProvider } from "./context/FirebaseAuthContext";
import { MatchingProvider } from "./context/MatchingContext";
import { NotificationProvider } from "./context/NotificationContext";
import { QuestionProvider } from "./context/QuestionContext";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <MatchingProvider>
            <DarkModeProvider>
              <QuestionProvider>
                <CollaborationProvider>
                  <App />
                </CollaborationProvider>
              </QuestionProvider>
            </DarkModeProvider>
          </MatchingProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
