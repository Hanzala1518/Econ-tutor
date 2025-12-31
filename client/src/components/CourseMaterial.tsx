import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, PlayCircle, Lightbulb, Target, AlertCircle, FileText, Sparkles } from "lucide-react";

interface CourseMaterialProps {
  onRequestSummary: (title: string, sourceId: string) => void;
}

export function CourseMaterial({ onRequestSummary }: CourseMaterialProps) {
  const pdfSectionRef = useRef<HTMLDivElement>(null);

  const scrollToPdf = () => {
    pdfSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            Econ Tutor
          </Badge>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Oligopoly & Game Theory</h1>
        <p className="text-slate-500 mt-1">Understanding market structures with few dominant firms.</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          
          {/* Video Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <PlayCircle className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-800 font-sans">Lecture Videos</h2>
            </div>
            
            <Tabs defaultValue="video1" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-4 bg-slate-100 p-1 rounded-lg">
                <TabsTrigger value="video1" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Part 1: Intro to Oligopoly
                </TabsTrigger>
                <TabsTrigger value="video2" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Part 2: Kinked Demand
                </TabsTrigger>
                <TabsTrigger value="pdf" onClick={scrollToPdf} className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  PDF Notes
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="video1" className="mt-0 space-y-3">
                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/Ec19ljjvlCI" 
                    title="Oligopoly Video 1" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                  />
                </div>
                <Button 
                  onClick={() => onRequestSummary("Intro to Oligopoly", "video1")}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Summary for this Video
                </Button>
                
                {/* Key Concepts for Video 1 */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-slate-700">Key Concepts - Intro to Oligopoly</h3>
                  </div>
                  <div className="grid gap-3">
                    <ConceptCard 
                      title="Defining Oligopoly" 
                      description="A market structure characterized by a small number of firms, high barriers to entry, and mutual interdependence."
                    />
                    <ConceptCard 
                      title="Market Concentration" 
                      description="Measured using concentration ratios (e.g., 5-firm ratio). High concentration indicates oligopolistic market structure."
                    />
                    <ConceptCard 
                      title="Interdependence" 
                      description="A firm's decisions on price, output, and strategy depend on how rivals will react. This creates strategic uncertainty."
                    />
                    <ConceptCard 
                      title="Barriers to Entry" 
                      description="High barriers prevent new firms from entering, allowing existing firms to maintain supernormal profits."
                    />
                  </div>
                </div>
                
                {/* Study Tips for Video 1 */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm font-semibold text-slate-700">Study Tips - Intro to Oligopoly</h3>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600 shrink-0">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-amber-800 text-sm">
                        Create a comparison table listing characteristics of different market structures (Perfect Competition, Monopoly, Oligopoly, Monopolistic Competition). Focus on number of firms, barriers to entry, and product differentiation.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Exam Tips for Video 1 */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-red-600" />
                    <h3 className="text-sm font-semibold text-slate-700">Exam Tips - Intro to Oligopoly</h3>
                  </div>
                  <div className="grid gap-3">
                    <ExamTipCard 
                      title="Know Your Terminology"
                      tip="Be able to distinguish between: Oligopoly, Monopoly, Perfect Competition, and Monopolistic Competition. Exams often test these differences."
                    />
                    <ExamTipCard 
                      title="Concentration Ratios"
                      tip="Know how to calculate and interpret concentration ratios. A 5-firm ratio above 60% typically indicates oligopoly."
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="video2" className="mt-0 space-y-3">
                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/Z_S0VA4jKes" 
                    title="Oligopoly Video 2" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                  />
                </div>
                <Button 
                  onClick={() => onRequestSummary("Kinked Demand", "video2")}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Summary for this Video
                </Button>
                
                {/* Key Concepts for Video 2 */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-slate-700">Key Concepts - Kinked Demand Curve</h3>
                  </div>
                  <div className="grid gap-3">
                    <ConceptCard 
                      title="Kinked Demand Curve" 
                      description="Explains price rigidity. Demand is elastic if price rises (rivals don't follow) but inelastic if price falls (rivals match cuts)."
                    />
                    <ConceptCard 
                      title="Price Rigidity (Sticky Prices)" 
                      description="Firms keep prices stable at P1 because changing price in either direction reduces revenue."
                    />
                    <ConceptCard 
                      title="MR Curve Discontinuity" 
                      description="The Marginal Revenue curve has a vertical gap at Q1. MC can shift within this gap without changing the optimal price."
                    />
                    <ConceptCard 
                      title="Revenue Implications" 
                      description="Raising prices → elastic demand → revenue falls. Cutting prices → inelastic demand → revenue also falls."
                    />
                  </div>
                </div>
                
                {/* Study Tips for Video 2 */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm font-semibold text-slate-700">Study Tips - Kinked Demand Curve</h3>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600 shrink-0">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-amber-800 text-sm">
                        Try to draw the kinked demand curve yourself. Mark the point where the marginal revenue curve has a vertical gap. This visual understanding is crucial for exams!
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Exam Tips for Video 2 */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-red-600" />
                    <h3 className="text-sm font-semibold text-slate-700">Exam Tips - Kinked Demand Curve</h3>
                  </div>
                  <div className="grid gap-3">
                    <ExamTipCard 
                      title="The Kinked Demand Curve Deep Dive"
                      tip="Understand WHY the curve is kinked: firms fear price wars below the current price, so rivals follow cuts. Above, they don't follow increases."
                    />
                    <ExamTipCard 
                      title="Math Component"
                      tip="Practice calculating MR gaps and determining profit-maximizing quantities. Some exams ask: 'What quantity maximizes profit given these demand and cost curves?'"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pdf" className="mt-0 space-y-3">
                <div ref={pdfSectionRef} className="w-full rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white">
                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">Oligopoly & Game Theory - Course Notes</span>
                  </div>
                  <iframe
                    src="/oligopoly_notes.pdf"
                    className="w-full h-[400px]"
                    title="Course PDF Notes"
                  />
                </div>
                <Button 
                  onClick={() => onRequestSummary("PDF Course Notes", "pdf")}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Summary for PDF Notes
                </Button>
                
                {/* Key Concepts for PDF */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-slate-700">Key Concepts - Complete Course Notes</h3>
                  </div>
                  <div className="grid gap-3">
                    <ConceptCard 
                      title="Game Theory & Prisoner's Dilemma" 
                      description="Analyzing strategic interactions. Nash Equilibrium shows why collusion is unstable—each firm has incentive to cheat."
                    />
                    <ConceptCard 
                      title="Collusion Types" 
                      description="Overt (formal cartels), Covert (secret agreements), and Tacit (unwritten rules like price leadership)."
                    />
                    <ConceptCard 
                      title="Cartel Instability" 
                      description="While cartels maximize joint profits, individual firms gain more by undercutting, leading to collapse."
                    />
                    <ConceptCard 
                      title="Evaluation: Pros & Cons" 
                      description="Disadvantages: high prices, inefficiency. Advantages: economies of scale, dynamic efficiency through R&D investment."
                    />
                  </div>
                </div>
                
                {/* Study Tips for PDF */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm font-semibold text-slate-700">Study Tips - Game Theory & Collusion</h3>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600 shrink-0">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-amber-800 text-sm">
                        Practice drawing payoff matrices for the Prisoner's Dilemma. Label each outcome clearly (Collude/Defect) and identify the Nash Equilibrium. Understanding why "Defect-Defect" is stable is key!
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Exam Tips for PDF */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-red-600" />
                    <h3 className="text-sm font-semibold text-slate-700">Exam Tips - Game Theory & Collusion</h3>
                  </div>
                  <div className="grid gap-3">
                    <ExamTipCard 
                      title="Game Theory Applications"
                      tip="Be ready to apply the Prisoner's Dilemma to real-world scenarios. Why is collusion unstable? Draw payoff matrices to explain."
                    />
                    <ExamTipCard 
                      title="Types of Collusion"
                      tip="Know the difference between Overt (formal cartels), Covert (secret), and Tacit (price leadership) collusion. Give real-world examples for each."
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </section>
          
        </div>
      </ScrollArea>
    </div>
  );
}

function ConceptCard({ title, description }: { title: string, description: string }) {
  return (
    <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow duration-200">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base text-slate-900 font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <CardDescription className="text-slate-600 leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

function ExamTipCard({ title, tip }: { title: string, tip: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 items-start">
      <div className="p-2 bg-red-100 rounded-lg text-red-600 shrink-0 mt-0.5">
        <AlertCircle className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-red-900 text-sm mb-1">{title}</h4>
        <p className="text-red-800 text-sm">{tip}</p>
      </div>
    </div>
  );
}
