import { useState } from 'react';

type Stage = 'welcome' | 'interview' | 'tier-select' | 'generating' | 'report';
type Tier = 'free' | 'standard' | 'council';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  followUp?: string;
}

interface Question {
  id: string;
  question: string;
  followUp: string;
  requiresConfirmation?: boolean;
}

interface Pathway {
  name: string;
  description: string;
  effort: string;
  impact: string;
  firstStep: string;
}

interface Report {
  summary: string;
  analysis: {
    coreIssue: string;
    constraints: string;
    stakeholders: string;
    timeframe: string;
  };
  pathways: Pathway[];
  council?: {
    analyst: string;
    pragmatist: string;
    contrarian: string;
    synthesis: string;
  };
  nextActions: string[];
  seriousnessNote: string;
}

export default function BrunelEngine() {
  const [stage, setStage] = useState<Stage>('welcome');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [seriousnessConfirmed, setSeriousnessConfirmed] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [selectedTier, setSelectedTier] = useState<Tier>('free');
  const [email, setEmail] = useState('');
  const [followUpRegistered, setFollowUpRegistered] = useState(false);

  const interviewFlow: Question[] = [
    {
      id: 'initial',
      question: "What's on your mind? Tell me about the problem, frustration, or situation you're dealing with.",
      followUp: "Take your time. The more specific you can be, the more useful this will be."
    },
    {
      id: 'impact',
      question: "How is this affecting you? What's the cost of this problem continuing?",
      followUp: "Think about time, money, stress, relationships, opportunities..."
    },
    {
      id: 'tried',
      question: "What have you already tried? What's worked, what hasn't?",
      followUp: "Even failed attempts tell us something useful."
    },
    {
      id: 'constraints',
      question: "What constraints are you working with? What can't change?",
      followUp: "Budget, time, relationships, location, commitments..."
    },
    {
      id: 'ideal',
      question: "If this were solved, what would that look like? Be specific.",
      followUp: "Paint the picture. What's different?"
    },
    {
      id: 'serious',
      question: "Last question: Are you serious about addressing this? This tool works best when you're ready to act on what it surfaces.",
      followUp: "No judgment either way. Just helps calibrate the output.",
      requiresConfirmation: true
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleStart = () => {
    setStage('interview');
    setMessages([{
      role: 'assistant',
      content: interviewFlow[0].question,
      followUp: interviewFlow[0].followUp
    }]);
  };

  const handleAnswer = () => {
    if (!input.trim()) return;

    const currentQ = interviewFlow[currentQuestion];

    const newAnswers = { ...answers, [currentQ.id]: input };
    setAnswers(newAnswers);

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: input }
    ];

    if (currentQ.requiresConfirmation) {
      const isSerious = input.toLowerCase().includes('yes') ||
                       input.toLowerCase().includes('serious') ||
                       input.toLowerCase().includes('ready') ||
                       input.toLowerCase().includes('absolutely');
      setSeriousnessConfirmed(isSerious);

      if (!isSerious) {
        newMessages.push({
          role: 'assistant',
          content: "That's completely fine. Sometimes we just need to vent, or we're not ready yet. The tool will still generate a report, but it may be less actionable. You can always come back when you're ready."
        });
      }
    }

    if (currentQuestion < interviewFlow.length - 1) {
      const nextQ = interviewFlow[currentQuestion + 1];
      newMessages.push({
        role: 'assistant',
        content: nextQ.question,
        followUp: nextQ.followUp
      });
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStage('tier-select');
    }

    setMessages(newMessages);
    setInput('');
  };

  const handleGenerateReport = async () => {
    setStage('generating');

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          tier: selectedTier,
          serious: seriousnessConfirmed
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const generatedReport = await response.json();
      setReport(generatedReport);
      setStage('report');
    } catch (error) {
      console.error('Error generating report:', error);
      // Fallback to local generation for development
      const fallbackReport = generateFallbackReport(answers, selectedTier, seriousnessConfirmed);
      setReport(fallbackReport);
      setStage('report');
    }
  };

  const generateFallbackReport = (answers: Record<string, string>, tier: Tier, serious: boolean): Report => {
    return {
      summary: `Based on our conversation, you're dealing with: ${answers.initial?.substring(0, 100)}...`,

      analysis: {
        coreIssue: "The underlying problem appears to be a coordination failure between what you need and what's currently available.",
        constraints: answers.constraints || "No specific constraints identified.",
        stakeholders: "You, and potentially others affected by this situation.",
        timeframe: serious ? "Ready for immediate action" : "Exploratory phase"
      },

      pathways: [
        {
          name: "Quick Win",
          description: "The smallest change that could improve things",
          effort: "Low",
          impact: "Medium",
          firstStep: "Based on what you've tried, the next logical step is..."
        },
        {
          name: "Structural Fix",
          description: "Address the root cause, not the symptom",
          effort: "High",
          impact: "High",
          firstStep: "This requires changing the underlying dynamic..."
        },
        {
          name: "Adaptation",
          description: "If the situation can't change, how might you?",
          effort: "Medium",
          impact: "Variable",
          firstStep: "Reframe the constraint as a feature..."
        }
      ],

      council: tier === 'council' ? {
        analyst: "From a systems perspective, this is a classic case of...",
        pragmatist: "The fastest path forward is...",
        contrarian: "Have you considered that the problem itself might be wrong?",
        synthesis: "Weighing these perspectives, the recommended approach is..."
      } : undefined,

      nextActions: [
        "Specific action item 1 based on your situation",
        "Specific action item 2 with clear first step",
        "Contingency if those don't work"
      ],

      seriousnessNote: serious
        ? "You indicated you're serious about this. The report is calibrated accordingly."
        : "You're still exploring. That's fine. Revisit when you're ready to act."
    };
  };

  const handleFollowUp = async () => {
    if (!email) return;

    try {
      await fetch('/api/register-followup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      setFollowUpRegistered(true);
    } catch (error) {
      console.error('Error registering follow-up:', error);
    }
  };

  if (stage === 'welcome') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="max-w-xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-stone-800 mb-2">The Brunel Engine</h1>
            <p className="text-stone-500">Transform frustrations into actionable insight</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
            <div className="space-y-6 text-stone-600">
              <p>
                This is a structured conversation about something that's bothering you—a problem,
                a frustration, a situation you can't seem to crack.
              </p>

              <p>
                Answer honestly. The more specific you are, the more useful the output.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm">
                  <strong>Note:</strong> This works best when you're serious about addressing
                  the problem. Venting is fine, but the tool will calibrate its output based
                  on your commitment level.
                </p>
              </div>

              <p className="text-sm text-stone-500">
                Your responses generate a private report. Only you see it.
              </p>
            </div>

            <button
              onClick={handleStart}
              className="w-full mt-8 bg-stone-800 text-white py-3 px-6 rounded-lg hover:bg-stone-700 transition-colors"
            >
              Begin
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'interview') {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <div className="flex-1 max-w-2xl w-full mx-auto p-4">
          <div className="mb-6">
            <div className="flex justify-between text-xs text-stone-400 mb-1">
              <span>Question {currentQuestion + 1} of {interviewFlow.length}</span>
              <span>{Math.round(((currentQuestion + 1) / interviewFlow.length) * 100)}%</span>
            </div>
            <div className="h-1 bg-stone-200 rounded-full">
              <div
                className="h-1 bg-stone-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / interviewFlow.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {messages.map((msg, i) => (
              <div key={i} className={`${msg.role === 'user' ? 'ml-8' : 'mr-8'}`}>
                <div className={`rounded-2xl p-4 ${
                  msg.role === 'user'
                    ? 'bg-stone-800 text-white'
                    : 'bg-white border border-stone-200'
                }`}>
                  <p>{msg.content}</p>
                  {msg.followUp && (
                    <p className="text-stone-400 text-sm mt-2 italic">{msg.followUp}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="sticky bottom-4">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-lg p-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAnswer();
                  }
                }}
                placeholder="Type your response..."
                className="w-full p-3 border-0 focus:ring-0 resize-none text-stone-800"
                rows={3}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAnswer}
                  disabled={!input.trim()}
                  className="bg-stone-800 text-white px-6 py-2 rounded-lg hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'tier-select') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-light text-stone-800 mb-2">Generate Your Report</h2>
            <p className="text-stone-500">Choose your analysis depth</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setSelectedTier('free')}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                selectedTier === 'free'
                  ? 'border-stone-800 bg-white'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="text-lg font-medium text-stone-800 mb-1">Basic</div>
              <div className="text-2xl font-light text-stone-800 mb-3">Free</div>
              <ul className="text-sm text-stone-500 space-y-1">
                <li>• Single model analysis</li>
                <li>• Core pathways</li>
                <li>• Action items</li>
              </ul>
            </button>

            <button
              onClick={() => setSelectedTier('standard')}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                selectedTier === 'standard'
                  ? 'border-stone-800 bg-white'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="text-lg font-medium text-stone-800 mb-1">Standard</div>
              <div className="text-2xl font-light text-stone-800 mb-3">10p</div>
              <ul className="text-sm text-stone-500 space-y-1">
                <li>• Enhanced analysis</li>
                <li>• Multiple perspectives</li>
                <li>• Detailed action plan</li>
              </ul>
            </button>

            <button
              onClick={() => setSelectedTier('council')}
              className={`p-6 rounded-2xl border-2 text-left transition-all relative ${
                selectedTier === 'council'
                  ? 'border-stone-800 bg-white'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 text-xs px-2 py-1 rounded-full font-medium">
                Recommended
              </div>
              <div className="text-lg font-medium text-stone-800 mb-1">Council</div>
              <div className="text-2xl font-light text-stone-800 mb-3">50p</div>
              <ul className="text-sm text-stone-500 space-y-1">
                <li>• Multi-model synthesis</li>
                <li>• Contrarian viewpoints</li>
                <li>• Strategic consensus</li>
              </ul>
            </button>
          </div>

          <button
            onClick={handleGenerateReport}
            className="w-full bg-stone-800 text-white py-4 px-6 rounded-xl hover:bg-stone-700 transition-colors text-lg"
          >
            {selectedTier === 'free' ? 'Generate Report' : `Generate Report (${selectedTier === 'standard' ? '10p' : '50p'})`}
          </button>

          <p className="text-center text-stone-400 text-sm mt-4">
            Payments cover API costs only. No profit taken.
          </p>
        </div>
      </div>
    );
  }

  if (stage === 'generating') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl text-stone-800 mb-2">
            {selectedTier === 'council' ? 'Convening the council...' : 'Generating your report...'}
          </h2>
          <p className="text-stone-500">
            {selectedTier === 'council'
              ? 'Multiple perspectives being synthesized'
              : 'Analyzing your responses'}
          </p>
        </div>
      </div>
    );
  }

  if (stage === 'report' && report) {
    return (
      <div className="min-h-screen bg-stone-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light text-stone-800 mb-2">Your Report</h1>
            <p className="text-stone-500 text-sm">Private. Only you can see this.</p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
            <h2 className="text-lg font-medium text-stone-800 mb-3">Summary</h2>
            <p className="text-stone-600">{report.summary}</p>
            <p className="text-sm text-stone-400 mt-3 italic">{report.seriousnessNote}</p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
            <h2 className="text-lg font-medium text-stone-800 mb-4">Analysis</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-stone-500 mb-1">Core Issue</div>
                <p className="text-stone-700">{report.analysis.coreIssue}</p>
              </div>
              <div>
                <div className="text-sm font-medium text-stone-500 mb-1">Constraints</div>
                <p className="text-stone-700">{report.analysis.constraints}</p>
              </div>
              <div>
                <div className="text-sm font-medium text-stone-500 mb-1">Readiness</div>
                <p className="text-stone-700">{report.analysis.timeframe}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
            <h2 className="text-lg font-medium text-stone-800 mb-4">Pathways Forward</h2>
            <div className="space-y-4">
              {report.pathways.map((pathway, i) => (
                <div key={i} className="border border-stone-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-stone-800">{pathway.name}</h3>
                    <div className="flex gap-2">
                      <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded">
                        Effort: {pathway.effort}
                      </span>
                      <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded">
                        Impact: {pathway.impact}
                      </span>
                    </div>
                  </div>
                  <p className="text-stone-600 text-sm mb-2">{pathway.description}</p>
                  <p className="text-stone-500 text-sm italic">First step: {pathway.firstStep}</p>
                </div>
              ))}
            </div>
          </div>

          {report.council && (
            <div className="bg-gradient-to-br from-amber-50 to-stone-50 rounded-2xl border border-amber-200 p-6 mb-6">
              <h2 className="text-lg font-medium text-stone-800 mb-4">Council Perspectives</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-amber-700 mb-1">The Analyst</div>
                  <p className="text-stone-700">{report.council.analyst}</p>
                </div>
                <div>
                  <div className="text-sm font-medium text-amber-700 mb-1">The Pragmatist</div>
                  <p className="text-stone-700">{report.council.pragmatist}</p>
                </div>
                <div>
                  <div className="text-sm font-medium text-amber-700 mb-1">The Contrarian</div>
                  <p className="text-stone-700">{report.council.contrarian}</p>
                </div>
                <div className="border-t border-amber-200 pt-4">
                  <div className="text-sm font-medium text-amber-800 mb-1">Synthesis</div>
                  <p className="text-stone-800 font-medium">{report.council.synthesis}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-stone-800 text-white rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Next Actions</h2>
            <ol className="space-y-3">
              {report.nextActions.map((action, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">
                    {i + 1}
                  </span>
                  <span className="text-stone-200">{action}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
            <h2 className="text-lg font-medium text-stone-800 mb-3">Tell me how it went</h2>
            <p className="text-stone-500 text-sm mb-4">
              Sign up for a check-in at 1 month and 1 year. See how things developed.
            </p>

            {followUpRegistered ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                ✓ You'll hear from us in 1 month, and again in 1 year.
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400"
                />
                <button
                  onClick={handleFollowUp}
                  disabled={!email}
                  className="bg-stone-800 text-white px-6 py-2 rounded-lg hover:bg-stone-700 disabled:opacity-50"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>

          <div className="text-center py-8 border-t border-stone-200">
            <p className="text-stone-500 mb-4">
              Found this useful? Help keep it running.
            </p>
            <a href="https://ko-fi.com/mattkilcoyne" className="text-stone-800 underline hover:no-underline">
              Donate later →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
