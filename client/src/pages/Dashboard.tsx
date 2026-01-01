import { motion } from "framer-motion";
import { Plus, Book, FileText, Video, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotebookCard {
  id: string;
  title: string;
  gradient: string;
  sources: string;
  lastEdited: string;
  isActive: boolean;
}

interface DashboardProps {
  onSelectNotebook: (notebookId: string) => void;
}

const notebooks: NotebookCard[] = [
  {
    id: "oligopoly",
    title: "Oligopoly & Game Theory",
    gradient: "from-blue-500 to-purple-600",
    sources: "PDF + 2 Videos",
    lastEdited: "Edited 2m ago",
    isActive: true,
  },
  {
    id: "inflation",
    title: "Macroeconomics: Inflation",
    gradient: "from-green-500 to-teal-600",
    sources: "4 Sources",
    lastEdited: "Edited 1h ago",
    isActive: false,
  },
  {
    id: "market-failure",
    title: "Market Failure",
    gradient: "from-orange-500 to-red-600",
    sources: "1 Source",
    lastEdited: "Edited 3d ago",
    isActive: false,
  },
];

export default function Dashboard({ onSelectNotebook }: DashboardProps) {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Book className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">EconTutor</h1>
          </div>
          <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome to EconTutor
          </h2>
          <p className="text-lg text-gray-500">
            Select a notebook to begin your economics study session.
          </p>
        </motion.div>

        {/* Notebooks Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Existing Notebook Cards */}
          {notebooks.map((notebook, index) => (
            <motion.div
              key={notebook.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <NotebookCardComponent 
                notebook={notebook} 
                onClick={() => notebook.isActive && onSelectNotebook(notebook.id)}
              />
            </motion.div>
          ))}

          {/* Add New Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <AddNewCard />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

interface NotebookCardComponentProps {
  notebook: NotebookCard;
  onClick: () => void;
}

function NotebookCardComponent({ notebook, onClick }: NotebookCardComponentProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200",
        notebook.isActive 
          ? "cursor-pointer hover:-translate-y-1 hover:shadow-lg" 
          : "opacity-60 cursor-not-allowed"
      )}
    >
      {/* Gradient Header */}
      <div className={cn("h-32 bg-gradient-to-br", notebook.gradient)} />
      
      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {notebook.title}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            <span>{notebook.sources}</span>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-gray-400">
          {notebook.lastEdited}
        </div>
        
        {!notebook.isActive && (
          <div className="mt-3 inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
            Coming Soon
          </div>
        )}
      </div>
    </div>
  );
}

function AddNewCard() {
  return (
    <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 overflow-hidden h-full min-h-[280px] flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 group">
      <div className="text-center px-6 py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
          <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>
        <h3 className="text-lg font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
          New Notebook
        </h3>
        <p className="text-sm text-gray-400 mt-2">
          Create a new study notebook
        </p>
      </div>
    </div>
  );
}
