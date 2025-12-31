import { useState, useEffect, useRef } from "react";
import { useChat, useGeneratePodcast, useSummary } from "@/hooks/use-tutor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Mic, Play, Pause, RotateCcw, Sparkles, Bot, User, Headphones } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Mermaid } from "./Mermaid";

// Helper function to parse message text and extract mermaid diagrams
function parseMessageContent(text: string) {
  const parts: { type: 'text' | 'mermaid'; content: string }[] = [];
  const mermaidRegex = /```mermaid\s*([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = mermaidRegex.exec(text)) !== null) {
    // Add text before the mermaid block
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    // Add the mermaid diagram
    parts.push({ type: 'mermaid', content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last mermaid block
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: 'text' as const, content: text }];
}

type Mode = "chat" | "podcast";

interface Message {
  role: "user" | "ai";
  text: string;
}

interface AITutorProps {
  summaryRequest?: { title: string; sourceId: string } | null;
  onSummaryHandled?: () => void;
}

export function AITutor({ summaryRequest, onSummaryHandled }: AITutorProps) {
  const [mode, setMode] = useState<Mode>("chat");
  
  // Switch to chat mode when summary is requested
  useEffect(() => {
    if (summaryRequest) {
      setMode("chat");
    }
  }, [summaryRequest]);
  
  return (
    <div className="h-full flex flex-col bg-slate-50/50">
      {/* Header with Toggle */}
      <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            {mode === "chat" ? <Bot className="w-5 h-5" /> : <Headphones className="w-5 h-5" />}
          </div>
          <h2 className="font-semibold text-slate-900">AI Tutor Assistant</h2>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-full border border-slate-200">
          <Label 
            htmlFor="mode-toggle" 
            className={cn(
              "text-xs font-medium px-2 cursor-pointer transition-colors",
              mode === "chat" ? "text-slate-900" : "text-slate-500"
            )}
          >
            Chat
          </Label>
          <Switch 
            id="mode-toggle" 
            checked={mode === "podcast"}
            onCheckedChange={(checked) => setMode(checked ? "podcast" : "chat")}
            className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-400"
          />
          <Label 
            htmlFor="mode-toggle" 
            className={cn(
              "text-xs font-medium px-2 cursor-pointer transition-colors",
              mode === "podcast" ? "text-slate-900" : "text-slate-500"
            )}
          >
            Podcast
          </Label>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {mode === "chat" ? (
            <ChatInterface key="chat" summaryRequest={summaryRequest} onSummaryHandled={onSummaryHandled} />
          ) : (
            <PodcastInterface key="podcast" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==========================================
// CHAT MODE
// ==========================================

interface ChatInterfaceProps {
  summaryRequest?: { title: string; sourceId: string } | null;
  onSummaryHandled?: () => void;
}

function ChatInterface({ summaryRequest, onSummaryHandled }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "👨‍🏫 Hello! I'm your Economics Professor. Ask me anything about Oligopolies, the Kinked Demand Curve, Game Theory, or exam preparation. I'm here to help you master this material!" }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { mutate: sendMessage, isPending: isChatPending } = useChat();
  const { mutate: generateSummary, isPending: isSummaryPending } = useSummary();
  
  const isPending = isChatPending || isSummaryPending;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle summary request from video/PDF - use dedicated summary endpoint
  useEffect(() => {
    if (summaryRequest && !isPending) {
      const isPdf = summaryRequest.sourceId === "pdf";
      const icon = isPdf ? "📄" : "📹";
      const label = isPdf ? "PDF" : "Video";
      
      const userMsg: Message = { role: "user", text: `${icon} Generate summary for ${label}: ${summaryRequest.title}` };
      setMessages(prev => [...prev, userMsg]);
      
      generateSummary({ videoId: summaryRequest.sourceId }, {
        onSuccess: (data) => {
          setMessages(prev => [...prev, { role: "ai", text: data.summary }]);
          onSummaryHandled?.();
        },
        onError: () => {
          setMessages(prev => [...prev, { role: "ai", text: "I'm sorry, I encountered an error generating the summary. Please try again." }]);
          onSummaryHandled?.();
        }
      });
    }
  }, [summaryRequest]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isPending) return;

    const userMsg: Message = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    sendMessage({ query: userMsg.text }, {
      onSuccess: (data) => {
        setMessages(prev => [...prev, { role: "ai", text: data.answer }]);
      },
      onError: () => {
        setMessages(prev => [...prev, { role: "ai", text: "I'm sorry, I encountered an error trying to answer that. Please try again." }]);
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex flex-col"
    >
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-6 pb-4">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={cn(
                "flex w-full",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "flex max-w-[85%] items-start gap-2",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm",
                  msg.role === "user" ? "bg-blue-100 border-blue-200 text-blue-600" : "bg-white border-slate-200 text-slate-600"
                )}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={cn(
                  "chat-bubble text-sm p-4 shadow-md",
                  msg.role === "user" 
                    ? "bg-blue-600 text-white rounded-tr-none" 
                    : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                )}>
                  {msg.role === "user" ? (
                    msg.text
                  ) : (
                    parseMessageContent(msg.text).map((part, partIndex) => (
                      part.type === 'mermaid' ? (
                        <Mermaid key={partIndex} chart={part.content} />
                      ) : (
                        <ReactMarkdown 
                          key={partIndex}
                          remarkPlugins={[remarkGfm]}
                          components={{
                            strong: ({children}) => <span className="font-bold text-blue-600">{children}</span>,
                            ul: ({children}) => <ul className="list-disc pl-4 my-2">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal pl-4 my-2">{children}</ol>,
                            li: ({children}) => <li className="mb-1">{children}</li>,
                            h1: ({children}) => <h1 className="text-xl font-bold my-2">{children}</h1>,
                            h2: ({children}) => <h2 className="text-lg font-bold my-2">{children}</h2>,
                            h3: ({children}) => <h3 className="text-base font-bold my-1">{children}</h3>,
                            p: ({children}) => <p className="mb-2 leading-relaxed last:mb-0">{children}</p>,
                            code: ({children}) => <code className="bg-slate-100 px-1 py-0.5 rounded text-sm">{children}</code>,
                          }}
                        >
                          {part.content}
                        </ReactMarkdown>
                      )
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isPending && (
            <div className="flex justify-start w-full">
               <div className="flex max-w-[85%] items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-600 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="chat-bubble bg-white border border-slate-200 rounded-tl-none text-slate-500 flex items-center gap-2 p-4 shadow-sm">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about oligopoly, kinked demand curve, or game theory..."
            className="flex-1 rounded-full border-slate-300 focus:ring-blue-500 focus:border-blue-500"
            disabled={isPending}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full w-10 h-10 shrink-0 bg-blue-600 hover:bg-blue-700 shadow-md transition-all hover:scale-105"
            disabled={isPending || !input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </motion.div>
  );
}

// ==========================================
// PODCAST MODE
// ==========================================

function PodcastInterface() {
  const [script, setScript] = useState<{speaker: string, text: string}[] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const synthRef = useRef<SpeechSynthesis | null>(window.speechSynthesis);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const isPlayingRef = useRef(false); // Track playing state for callbacks
  
  const { mutate: generate, isPending } = useGeneratePodcast();

  // Keep ref in sync with state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = synthRef.current?.getVoices() || [];
    };
    loadVoices();
    if (synthRef.current?.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }
    
    return () => {
      synthRef.current?.cancel();
    };
  }, []);

  const handleGenerate = () => {
    generate(undefined, {
      onSuccess: (data) => {
        setScript(data.script);
        setCurrentLineIndex(-1);
        setIsPlaying(false);
        isPlayingRef.current = false;
        synthRef.current?.cancel();
      }
    });
  };

  const speakLine = (index: number) => {
    if (!script || index >= script.length) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      setCurrentLineIndex(-1);
      return;
    }

    const line = script[index];
    const utterance = new SpeechSynthesisUtterance(line.text);
    
    // Attempt to pick voices (Male for Professor, Female for Student)
    // This is heuristic and browser dependent
    const voices = voicesRef.current;
    if (voices.length > 0) {
      if (line.speaker === "Professor") {
        const maleVoice = voices.find(v => v.name.includes("Male") || v.name.includes("David") || v.name.includes("Google US English"));
        if (maleVoice) utterance.voice = maleVoice;
      } else {
        const femaleVoice = voices.find(v => v.name.includes("Female") || v.name.includes("Zira") || v.name.includes("Google UK English Female"));
        if (femaleVoice) utterance.voice = femaleVoice;
      }
    }

    utterance.onend = () => {
      // Use ref instead of state to avoid stale closure
      if (isPlayingRef.current) {
        speakLine(index + 1);
      }
    };
    
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      // Try to continue with next line on error
      if (isPlayingRef.current) {
        speakLine(index + 1);
      }
    };

    setCurrentLineIndex(index);
    synthRef.current?.speak(utterance);
  };

  const togglePlay = () => {
    if (!script) return;

    if (isPlaying) {
      synthRef.current?.cancel();
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      setIsPlaying(true);
      isPlayingRef.current = true;
      // Resume from current line or start from beginning
      const startIndex = currentLineIndex === -1 ? 0 : currentLineIndex;
      speakLine(startIndex);
    }
  };

  const handleReset = () => {
    synthRef.current?.cancel();
    setIsPlaying(false);
    isPlayingRef.current = false;
    setCurrentLineIndex(-1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="h-full flex flex-col p-6"
    >
      {!script ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Mic className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Generate Audio Lesson</h3>
          <p className="text-slate-500 mb-8 max-w-sm">
            Create an AI-generated dialogue between a Professor and a Student about this week's topic.
          </p>
          <Button 
            onClick={handleGenerate} 
            disabled={isPending}
            size="lg"
            className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-200 transition-all hover:scale-105"
          >
            {isPending ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Generating Script...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Podcast
              </>
            )}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
               <Button 
                 size="icon" 
                 onClick={togglePlay}
                 className={cn(
                   "w-12 h-12 rounded-full shadow-md transition-all",
                   isPlaying ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700"
                 )}
               >
                 {isPlaying ? <Pause className="fill-current" /> : <Play className="fill-current ml-1" />}
               </Button>
               <div>
                 <h4 className="font-bold text-slate-900">Audio Lesson</h4>
                 <p className="text-xs text-slate-500">
                   {isPlaying ? "Playing now..." : "Paused"}
                 </p>
               </div>
            </div>
            
            <Button variant="ghost" size="icon" onClick={handleReset} className="text-slate-400 hover:text-slate-600">
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 border rounded-xl bg-white shadow-inner p-4">
            <div className="space-y-6">
              {script.map((line, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "p-4 rounded-xl border transition-all duration-300",
                    currentLineIndex === idx 
                      ? "bg-blue-50 border-blue-200 shadow-md scale-[1.02]" 
                      : "bg-white border-transparent hover:border-slate-100"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                      line.speaker === "Professor" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"
                    )}>
                      {line.speaker}
                    </span>
                  </div>
                  <p className={cn(
                    "text-lg leading-relaxed font-serif",
                    currentLineIndex === idx ? "text-slate-900" : "text-slate-600"
                  )}>
                    {line.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </>
      )}
    </motion.div>
  );
}
