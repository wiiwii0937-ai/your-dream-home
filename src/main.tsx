import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleTagManager } from "./components/GoogleTagManager";

createRoot(document.getElementById("root")!).render(
  <>
    <GoogleTagManager />
    <App />
  </>
);
