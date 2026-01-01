import { useState } from "react";
import { CourseMaterial } from "@/components/CourseMaterial";
import { AITutor } from "@/components/AITutor";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

interface WorkspaceProps {
  onBack: () => void;
  notebookId: string;
}

export default function Workspace({ onBack, notebookId }: WorkspaceProps) {
  const [summaryRequest, setSummaryRequest] = useState<{ title: string; sourceId: string } | null>(null);

  const handleRequestSummary = (title: string, sourceId: string) => {
    setSummaryRequest({ title, sourceId });
  };

  const clearSummaryRequest = () => {
    setSummaryRequest(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-screen w-full bg-background overflow-hidden flex flex-col"
    >
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="hover:bg-gray-100"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Button>
        <div className="h-4 w-px bg-gray-300" />
        <h2 className="text-sm font-medium text-gray-700">
          Oligopoly & Game Theory
        </h2>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={30}>
            <CourseMaterial onRequestSummary={handleRequestSummary} />
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-slate-100 border-l border-r border-slate-200 w-2 hover:bg-blue-50 transition-colors" />
          
          <ResizablePanel defaultSize={50} minSize={30}>
            <AITutor summaryRequest={summaryRequest} onSummaryHandled={clearSummaryRequest} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </motion.div>
  );
}
