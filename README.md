# 🎓 Econ Tutor

An AI-powered Economics tutoring application that helps students learn Oligopoly and Game Theory concepts through interactive chat, audio podcasts, and visual diagrams.

![Econ Tutor](https://img.shields.io/badge/AI-Gemini%202.5-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6)
![Express](https://img.shields.io/badge/Express-4.21-000000)

## ✨ Features

### 💬 AI Chat Interface
- Ask questions about Oligopoly, Game Theory, Nash Equilibrium, and more
- Get detailed explanations powered by Google Gemini AI
- Markdown-rendered responses with proper formatting

### 📊 Visual Diagrams
- Automatic Mermaid.js diagram generation for complex concepts
- Flowcharts for processes (e.g., Kinked Demand Curve)
- Mind maps for categorization (e.g., Market Structures)
- Interaction graphs for Game Theory scenarios

### 🎙️ Podcast Mode
- Convert explanations to audio using Web Speech Synthesis
- Interactive professor-student dialogue format
- Play/Pause controls with progress tracking

### 📚 Course Materials
- Embedded lecture videos (YouTube)
- PDF document viewer
- Key concepts, study tips, and exam tips for each source
- One-click summary generation for any source

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS + shadcn/ui components
- Framer Motion for animations
- Mermaid.js for diagram rendering
- React Markdown with remark-gfm

**Backend:**
- Express.js with TypeScript
- Google Gemini AI (gemini-2.5-flash model)
- RESTful API architecture

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Google AI Studio API Key](https://aistudio.google.com/app/apikey)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/econ-tutor.git
cd econ-tutor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Required: Get your API key from https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Server port (defaults to 5000)
PORT=5000
```

### 4. Add Your Course Materials

Place your PDF files in the `client/public/` directory:

```
client/public/
  └── oligopoly_notes.pdf  (or your PDF file)
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📦 Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
econ-tutor/
├── client/                 # Frontend React application
│   ├── public/            # Static assets (PDFs, images)
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/       # shadcn/ui components
│   │   │   ├── AITutor.tsx
│   │   │   ├── CourseMaterial.tsx
│   │   │   └── Mermaid.tsx
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   └── pages/        # Page components
│   └── index.html
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes & AI logic
│   ├── static.ts         # Static file serving
│   └── vite.ts           # Vite dev server integration
├── shared/               # Shared types & schemas
│   ├── routes.ts         # API route definitions
│   └── schema.ts         # Zod schemas
├── .env.example          # Environment template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send a question, get AI response with diagrams |
| POST | `/api/podcast` | Generate audio podcast script |
| POST | `/api/summary` | Generate summary for a specific source |

### Example Request

```javascript
// Chat endpoint
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'Explain the kinked demand curve' })
});
```

## 🎨 Customization

### Adding New Topics

Edit the `TRANSCRIPTS` object in `server/routes.ts` to add new video transcripts or course materials:

```typescript
const TRANSCRIPTS = {
  video1: `Your transcript here...`,
  video2: `Another transcript...`,
  pdf: `PDF content summary...`,
};
```

### Modifying AI Behavior

Adjust the prompt in `server/routes.ts` to change how the AI responds:
- Add new diagram types
- Modify response format
- Add subject-specific instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for powering the AI tutor
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Mermaid.js](https://mermaid.js.org/) for diagram generation
- Course content based on standard economics curriculum

---

**Made with ❤️ for students learning Economics**
