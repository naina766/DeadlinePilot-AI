"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Copy, 
  Check, 
  ArrowLeft,
  BookOpen, 
  Terminal,
  Cpu, 
  Globe,
  Lock,
  Layers,
  Database,
  Menu,
  X,
  TrendingUp,
  GitBranch,
  Table,
  Heart,
  FileText,
  Eye
} from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group border border-white/5 rounded-xl bg-slate-950/80 overflow-hidden my-3">
      <div className="flex justify-between items-center px-4 py-2 border-b border-white/5 bg-slate-900/40 text-[10px] text-slate-500 font-mono">
        <span>{language.toUpperCase()}</span>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-slate-200 transition-colors p-1 rounded hover:bg-white/5"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs text-slate-300 font-mono leading-relaxed text-left">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    'overview': true,
    'features': true,
    'architecture': true,
    'folder-structure': true,
    'ai-architecture': true,
    'agent-flow': true,
    'database-schema': true,
    'api-endpoints': true,
    'authentication': true,
    'env-vars': true,
    'deployment': true,
    'mockups': true,
    'faq': true,
    'future-scope': true,
    'contributors': true,
    'license': true
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <p>
            Welcome to the <strong>DeadlinePilot AI Documentation Center</strong>. DeadlinePilot AI is a modern, premium, agentic coordinate executive assistant designed specifically for students to manage tasks, exams, schedules, habits, focus sessions, and study plans.
          </p>
          <p>
            Unlike traditional calendars, DeadlinePilot is powered by a multi-agent backend orchestrator that evaluates task risks, auto-schedules work sessions, logs focus durations, and coaches users to success before time runs out.
          </p>
        </div>
      )
    },
    {
      id: 'features',
      title: 'Features',
      icon: Cpu,
      content: (
        <div className="space-y-4">
          <p>DeadlinePilot features five specialized, autonomous AI Agents coordinating live workspace actions:</p>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li><strong>Planner Agent:</strong> Breaks complex objectives down into micro-estimated subtasks.</li>
            <li><strong>Priority Agent:</strong> Evaluates deadlines, habits, and delays to predict risks and set priorities.</li>
            <li><strong>Scheduling Agent:</strong> Maps optimal calendar work-blocks avoiding personal conflicts.</li>
            <li><strong>Reminder Agent:</strong> Issues context-aware, encouraging alerts during free hours.</li>
            <li><strong>Reflection Agent:</strong> Analyzes logs to provide weekly summaries, coaching scores, and insights.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'architecture',
      title: 'Architecture',
      icon: Layers,
      content: (
        <div className="space-y-4">
          <p>The application is built on a decoupled Client-Server architecture:</p>
          <div className="p-4 border border-indigo-500/10 rounded-xl bg-indigo-950/5 text-xs text-slate-300 leading-relaxed font-mono overflow-x-auto">
            <div className="text-center font-bold text-indigo-400 mb-2">System Layout Diagram</div>
            +------------------------------------------+<br/>
            |             React Frontend               |<br/>
            |         (Next.js App Router)             |<br/>
            +--------------------+---------------------+<br/>
            | HTTPS              | HTTPS               | HTTP<br/>
            v                    v                     v<br/>
            +--------+-----------+   +---------+-------+   +-----------+<br/>
            | Firebase Auth API  |   | Express API Server |   | Gemini API|<br/>
            |   (Client Auth)    |   |  (Node.js / ES)    |   | (LLM reasoning)<br/>
            +--------------------+   +---------+-------+   +-----------+<br/>
                                               | Mongoose<br/>
                                               v<br/>
                                     +---------+-------+<br/>
                                     | MongoDB Atlas   |<br/>
                                     +-----------------+
          </div>
        </div>
      )
    },
    {
      id: 'folder-structure',
      title: 'Folder Structure',
      icon: Layers,
      content: (
        <div className="space-y-4">
          <p>The code repository is cleanly modularized into Client and Server structures:</p>
          <CodeBlock 
            language="text" 
            code={`DeadlinePilot AI/
├── client/                 # Next.js Frontend App
│   ├── src/
│   │   ├── app/            # Next.js routes
│   │   ├── components/     # UI presentation components (ai/, common/)
│   │   ├── hooks/          # React custom hooks (useAIChat, useTasks)
│   │   ├── lib/api/        # Extracted client API layer (chat.api, task.api)
│   │   └── utils/date/     # Modular Indian Standard Time date helpers
└── server/                 # Express Backend Server
    ├── ai/                 # Orchestrator, tools, and prompts
    │   ├── orchestrator/   # Main controller, intentDetector
    │   ├── parser/         # Pipeline (ResponseNormalizer, markdownCleaner)
    │   ├── prompts/        # System and personality instructions
    │   ├── schema/         # JSON Schema files
    │   └── tools/          # DB-lookup registry helper tools
    ├── config/             # Gemini, database connection configurations
    ├── controllers/        # Route controllers
    ├── middleware/         # Auth verify & global errorHandler
    ├── models/             # Mongoose schemas
    ├── routes/             # REST endpoints (health, tasks, ai, calendar)
    └── services/           # Backend services (cache, memory)`} 
          />
        </div>
      )
    },
    {
      id: 'ai-architecture',
      title: 'AI Architecture',
      icon: Cpu,
      content: (
        <div className="space-y-4">
          <p>
            The backend AI framework operates on a clean pipeline structure. The main entry point evaluates intents and leverages an in-memory TTL caching service for recurring dashboard operations.
          </p>
          <CodeBlock 
            language="javascript" 
            code={`// Heuristic detection inside orchestrator
if (intentDetector.isSimpleQuestion(message)) {
  // Query DB locally using toolRegistry
  const context = await loadLocalContext(userId, intent);
  return responseFormatter.generateLocalFallback(context, actions);
} else {
  // Feed DB context into Gemini System Instruction
  const response = await chatModel.generateContent({...});
  return responseFormatter.formatResponse(response.text());
}`} 
          />
        </div>
      )
    },
    {
      id: 'agent-flow',
      title: 'Agent Flow Diagram',
      icon: GitBranch,
      content: (
        <div className="space-y-4">
          <p>Below is the step-by-step resolution path for chat instructions:</p>
          <pre className="p-4 border border-indigo-500/10 rounded-xl bg-slate-950/60 text-xs text-slate-300 font-mono leading-relaxed overflow-x-auto whitespace-pre">
{`[User Chat Query]
      |
      v
[In-Memory Cache Check] --(Hit)--> [Return Cached JSON]
      |
      v (Miss)
[Intent Classification (intentDetector.js)]
      |
      +---> (Simple Intent?) --YES--> [Local Tool Execution (DB)] ---> [Local Fallback Generator]
      |
      +---> (Complex Reasoning?) --NO--> [Gemini Reasoning Model]
                                            |
                                            v
                                  [Response Normalizer]
                                            |
                                            v
                                  [Markdown Cleaner]
                                            |
                                            v
                                  [Response Validator] --(Invalid)--> [Fallback Generator]
                                            |
                                            v
                                    [Compliant Front JSON]`}
          </pre>
        </div>
      )
    },
    {
      id: 'database-schema',
      title: 'Database Schema',
      icon: Table,
      content: (
        <div className="space-y-4">
          <p>
            Mongoose model configurations established on MongoDB Atlas:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30">
              <h5 className="font-bold text-slate-200 text-xs">Task Schema</h5>
              <ul className="list-disc pl-5 text-slate-400 text-xs mt-1 space-y-1">
                <li>userId: String (Indexed)</li>
                <li>title: String</li>
                <li>deadline: Date</li>
                <li>estimatedHours: Number</li>
                <li>status: Pending | In Progress | Completed | Overdue</li>
                <li>priority: Critical | High | Medium | Low</li>
                <li>subtasks: Array of EmbeddedSubTask</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30">
              <h5 className="font-bold text-slate-200 text-xs">Analytics Schema</h5>
              <ul className="list-disc pl-5 text-slate-400 text-xs mt-1 space-y-1">
                <li>userId: String</li>
                <li>completionRate: Number</li>
                <li>productivityScore: Number</li>
                <li>focusTimeHours: Number</li>
                <li>insights: Array of Strings</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'api-endpoints',
      title: 'API Reference',
      icon: Globe,
      content: (
        <div className="space-y-4">
          <p>Secure REST endpoints available on the Express API server:</p>
          <div className="space-y-2">
            <div>
              <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded mr-2">GET</span>
              <span className="font-mono text-slate-200">/api/health</span>
              <span className="text-slate-400 text-xs block pl-12">System check endpoint (database, cache, Gemini, uptime status)</span>
            </div>
            <div>
              <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded mr-2">GET</span>
              <span className="font-mono text-slate-200">/api/tasks</span>
              <span className="text-slate-400 text-xs block pl-12">Retrieve all active tasks for user</span>
            </div>
            <div>
              <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded mr-2">POST</span>
              <span className="font-mono text-slate-200">/api/tasks</span>
              <span className="text-slate-400 text-xs block pl-12">Create a new task manually</span>
            </div>
            <div>
              <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded mr-2">POST</span>
              <span className="font-mono text-slate-200">/api/ai/chat</span>
              <span className="text-slate-400 text-xs block pl-12">Submit user prompt to AI Co-Pilot drawer</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'authentication',
      title: 'Authentication',
      icon: Lock,
      content: (
        <div className="space-y-4">
          <p>
            Authentication is powered by <strong>Firebase Authentication</strong>. The client logs the user in and retrieves an ID Token, which is attached to all backend requests via an Authorization header:
          </p>
          <CodeBlock 
            language="javascript" 
            code={`// Header format attached to backend fetch calls
headers: {
  'Authorization': 'Bearer <firebase_id_token>',
  'Content-Type': 'application/json'
}`} 
          />
        </div>
      )
    },
    {
      id: 'env-vars',
      title: 'Environment Variables',
      icon: Terminal,
      content: (
        <div className="space-y-4">
          <p>Required environment parameters to run the application safely:</p>
          <h5 className="font-bold text-indigo-400 text-xs">Frontend Environment Variables (.env.local)</h5>
          <CodeBlock 
            language="env" 
            code={`NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project`} 
          />
          <h5 className="font-bold text-cyan-400 text-xs">Backend Environment Variables (.env)</h5>
          <CodeBlock 
            language="env" 
            code={`PORT=8000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
GEMINI_API_KEY=your_google_gemini_api_key`} 
          />
        </div>
      )
    },
    {
      id: 'deployment',
      title: 'Deployment Guide',
      icon: Globe,
      content: (
        <div className="space-y-4">
          <p>Deploying DeadlinePilot AI to production:</p>
          <div className="space-y-2">
            <h5 className="font-bold text-slate-200 text-xs">Deploying Frontend on Vercel</h5>
            <CodeBlock 
              language="bash" 
              code={`# Deploy frontend directory
vercel --prod`} 
            />
            <h5 className="font-bold text-slate-200 text-xs">Deploying Backend on Render or GCP Cloud Run</h5>
            <CodeBlock 
              language="bash" 
              code={`# Build Docker container
docker build -t deadlinepilot-api .
docker tag deadlinepilot-api gcr.io/your-project/deadlinepilot-api
docker push gcr.io/your-project/deadlinepilot-api`} 
            />
          </div>
        </div>
      )
    },
    {
      id: 'mockups',
      title: 'Visual Architecture Mockups',
      icon: Eye,
      content: (
        <div className="space-y-4">
          <p>Representative visual component model showcasing the dashboard card layouts:</p>
          <div className="p-6 rounded-2xl border border-indigo-500/20 bg-slate-900/40 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Active Task Card (Mock)</span>
              <span className="text-[9px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded font-black uppercase">Critical Priority</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-200">Refactor database index mappings</h4>
              <p className="text-[11px] text-slate-400">Optimize query speed on the MongoDB tasks collection.</p>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>Deadline: 30 Jun 2026</span>
              <span className="text-rose-400 font-semibold">⚠️ 65% delay risk</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: BookOpen,
      content: (
        <div className="space-y-4 text-left">
          <div>
            <h5 className="font-bold text-slate-200 text-xs">Q: What happens if Gemini API rate limits are reached?</h5>
            <p className="text-slate-400 text-xs pt-1">
              A: The backend automatically falls back to heuristic intent matching and queries the database locally to present your schedule, tasks, and analytics without interruption.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-slate-200 text-xs">Q: Is Indian Timezone (IST) supported everywhere?</h5>
            <p className="text-slate-400 text-xs pt-1">
              A: Yes! The system utilizes Asia/Kolkata (UTC+5:30) for parsing and rendering schedules, deadlines, and logs across the Dashboard, Calendar, and Analytics pages.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'future-scope',
      title: 'Future Enhancements',
      icon: TrendingUp,
      content: (
        <div className="space-y-4">
          <ul className="list-disc pl-5 text-slate-300 space-y-2 text-xs">
            <li><strong>Google Calendar Bidirectional Sync:</strong> Propagate task work-blocks back to the user's Google Calendar.</li>
            <li><strong>Collaborative Group Pilot:</strong> Auto-split subtasks across study group members.</li>
            <li><strong>Offline Service Workers:</strong> Cache dashboard state locally for offline operations.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'contributors',
      title: 'Contributors',
      icon: Heart,
      content: (
        <div className="space-y-2 text-slate-300 text-xs">
          <p>Developed with passion by the <strong>DeadlinePilot Team</strong> for the Hackathon 2026.</p>
        </div>
      )
    },
    {
      id: 'license',
      title: 'License',
      icon: FileText,
      content: (
        <div className="space-y-2 text-slate-300 text-xs leading-relaxed">
          <p>Licensed under the <strong>MIT License</strong>. Proprietary enhancements copyright © 2026.</p>
        </div>
      )
    }
  ];

  const filteredSections = sections.filter(sec => {
    const query = searchQuery.toLowerCase();
    return sec.title.toLowerCase().includes(query) || sec.id.toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full px-6 py-4 flex justify-between items-center border-b border-white/5 bg-slate-950/70 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800 transition-all mr-2">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="p-1.5 rounded-lg bg-indigo-600 shadow-md shadow-indigo-600/30">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Documentation Center
          </span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-slate-300"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block w-72 border-r border-white/5 p-6 shrink-0 h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto space-y-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search sections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/5 rounded-xl text-xs placeholder-slate-500 text-slate-200 outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>

          <nav className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block px-3 pb-2">Sections</span>
            {filteredSections.map(sec => {
              const Icon = sec.icon;
              return (
                <a 
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all text-left"
                >
                  <Icon className="w-4 h-4 text-slate-500" />
                  {sec.title}
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-slate-950/90 backdrop-blur-sm lg:hidden flex flex-col p-6 pt-24 space-y-6">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/5 rounded-xl text-xs placeholder-slate-500 text-slate-200 outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
            <nav className="flex-1 overflow-y-auto space-y-1">
              {filteredSections.map(sec => (
                <a 
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all text-left"
                >
                  {sec.title}
                </a>
              ))}
            </nav>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-grow p-6 lg:p-12 overflow-y-auto space-y-6">
          {filteredSections.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-sm">
              No documentation sections found matching your search.
            </div>
          ) : (
            filteredSections.map(sec => {
              const Icon = sec.icon;
              const isOpen = openSections[sec.id];
              return (
                <section 
                  key={sec.id} 
                  id={sec.id}
                  className="glass-card p-6 border-white/5 bg-slate-900/10 hover:bg-slate-900/20 transition-all duration-300 scroll-mt-24 text-left"
                >
                  <button 
                    onClick={() => toggleSection(sec.id)}
                    className="w-full flex justify-between items-center group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-extrabold text-base tracking-tight text-slate-100 group-hover:text-indigo-400 transition-colors">
                        {sec.title}
                      </h3>
                    </div>
                    {isOpen ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
                  </button>

                  {isOpen && (
                    <div className="mt-5 border-t border-white/5 pt-4 text-sm text-slate-300 leading-relaxed font-medium">
                      {sec.content}
                    </div>
                  )}
                </section>
              );
            })
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-white/5 text-center text-[10px] text-slate-500 bg-slate-950 shrink-0">
        © 2026 DeadlinePilot AI Documentation Center. Premium Co-Pilot Framework.
      </footer>
    </div>
  );
}
