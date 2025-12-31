import { useState } from "react";
import { CourseMaterial } from "@/components/CourseMaterial";
import { AITutor } from "@/components/AITutor";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export default function Home() {
  const [summaryRequest, setSummaryRequest] = useState<{ title: string; sourceId: string } | null>(null);

  const handleRequestSummary = (title: string, sourceId: string) => {
    setSummaryRequest({ title, sourceId });
  };

  const clearSummaryRequest = () => {
    setSummaryRequest(null);
  };

  return (
    <div className="h-screen w-full bg-background overflow-hidden">
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
  );
}
