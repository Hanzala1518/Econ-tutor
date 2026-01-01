import { useState } from "react";
import Dashboard from "@/pages/Dashboard";
import Workspace from "@/pages/Workspace";
import { AnimatePresence } from "framer-motion";

type View = "dashboard" | "workspace";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedNotebook, setSelectedNotebook] = useState<string>("");

  const handleSelectNotebook = (notebookId: string) => {
    setSelectedNotebook(notebookId);
    setCurrentView("workspace");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
  };

  return (
    <AnimatePresence mode="wait">
      {currentView === "dashboard" ? (
        <Dashboard key="dashboard" onSelectNotebook={handleSelectNotebook} />
      ) : (
        <Workspace 
          key="workspace" 
          onBack={handleBackToDashboard} 
          notebookId={selectedNotebook}
        />
      )}
    </AnimatePresence>
  );
}
