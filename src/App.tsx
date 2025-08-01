import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Mail, TrendingDown, AlertTriangle } from 'lucide-react';

interface EmailTemplate {
  subject: string;
  body: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

const emailTemplates: EmailTemplate[] = [
  {
    subject: "Quarterly Review Meeting",
    body: "Team, we need to schedule our quarterly review meeting for next week. Please confirm your availability.",
    urgency: 'low'
  },
  {
    subject: "Budget Approval Required",
    body: "The marketing budget needs immediate approval. The campaign launches tomorrow morning.",
    urgency: 'medium'
  },
  {
    subject: "Client Presentation Emergency",
    body: "Our biggest client moved the presentation to this afternoon. We need the deck revised immediately.",
    urgency: 'high'
  },
  {
    subject: "Server Outage Crisis",
    body: "All systems are down. Customer support is overwhelmed. We need an emergency response plan now.",
    urgency: 'critical'
  },
  {
    subject: "Competitor Analysis Update",
    body: "Our main competitor just announced a major product launch. We need to reassess our strategy.",
    urgency: 'medium'
  },
  {
    subject: "Urgent Staff Meeting",
    body: "There have been significant changes to company policy. All department heads must attend immediately.",
    urgency: 'high'
  },
  {
    subject: "Legal Compliance Issue",
    body: "We have received a notice from regulatory authorities. Legal review is required before close of business.",
    urgency: 'critical'
  },
  {
    subject: "Partnership Negotiation",
    body: "The potential merger talks are happening today. We need to prepare our position and financial projections.",
    urgency: 'high'
  },
  {
    subject: "Security Breach Alert",
    body: "Suspicious activity detected on our network. All passwords must be changed and security protocols activated.",
    urgency: 'critical'
  },
  {
    subject: "Final Quarterly Report",
    body: "This is our last chance to meet quarterly targets. The board expects detailed projections and immediate action items.",
    urgency: 'critical'
  }
];

const typoMap: { [key: string]: string[] } = {
  'meeting': ['meating', 'meting', 'meetign'],
  'immediate': ['imediate', 'immedate', 'immediat'],
  'business': ['busines', 'bussiness', 'bizness'],
  'review': ['reveiw', 'reviw', 'revue'],
  'budget': ['budjet', 'buget', 'budgit'],
  'client': ['cleint', 'cliant', 'cient'],
  'strategy': ['stratergy', 'straegy', 'strategey'],
  'department': ['deparment', 'departmant', 'dept'],
  'financial': ['finacial', 'finansial', 'fincial'],
  'security': ['secuirty', 'securty', 'secrity'],
  'quarterly': ['quartly', 'quaterley', 'qarterly'],
  'analysis': ['anaylsis', 'analisis', 'analysys'],
  'emergency': ['emergancy', 'emrgency', 'emergeny'],
  'campaign': ['campain', 'campagin', 'camapign'],
  'presentation': ['presentaion', 'presntation', 'presentaiton'],
  'availability': ['availabilty', 'avalability', 'avaliability'],
  'approval': ['aproval', 'approvel', 'apprval'],
  'tomorrow': ['tommorow', 'tomorow', 'tomarow'],
  'afternoon': ['afernoon', 'afternon', 'afternoom'],
  'customer': ['custmer', 'costumer', 'customar'],
  'competitor': ['competator', 'competetor', 'competiter'],
  'significant': ['signifcant', 'significent', 'signifigant'],
  'regulatory': ['regulatry', 'regualtory', 'regulatery'],
  'authorities': ['authoritys', 'authorites', 'authoriteis'],
  'partnership': ['parnership', 'partership', 'partnrship'],
  'negotiation': ['negotation', 'negoitation', 'negotiaton'],
  'projections': ['projectons', 'pojections', 'projetions'],
  'suspicious': ['suspecious', 'suspicous', 'suspishous'],
  'passwords': ['paswords', 'passwrds', 'passowrds'],
  'protocols': ['protocals', 'protcols', 'protocoles'],
  'detailed': ['detaild', 'detialed', 'detaled']
};

const keyboardGlitches = [
  { from: 'a', to: 's' },
  { from: 's', to: 'd' },
  { from: 'd', to: 'f' },
  { from: 'e', to: 'r' },
  { from: 'r', to: 't' },
  { from: 'i', to: 'o' },
  { from: 'o', to: 'p' },
  { from: 'n', to: 'm' },
  { from: 'l', to: 'k' }
];

function App() {
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [productivityScore, setProductivityScore] = useState(100);
  const [typoCount, setTypoCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [keyboardGlitch, setKeyboardGlitch] = useState<{from: string, to: string} | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);

  const currentEmail = emailTemplates[currentEmailIndex];
  const targetText = currentEmail.body;

  const injectTypos = useCallback((text: string) => {
    let result = text;
    Object.entries(typoMap).forEach(([correct, typos]) => {
      const regex = new RegExp(`\\b${correct}\\b`, 'gi');
      result = result.replace(regex, () => {
        const randomTypo = typos[Math.floor(Math.random() * typos.length)];
        setTypoCount(prev => prev + 1);
        return randomTypo;
      });
    });
    return result;
  }, []);

  const applyKeyboardGlitch = useCallback((char: string) => {
    if (keyboardGlitch && char.toLowerCase() === keyboardGlitch.from) {
      return keyboardGlitch.to;
    }
    return char;
  }, [keyboardGlitch]);

  const triggerRandomGlitch = useCallback(() => {
    if (Math.random() < 0.15) { // 15% chance
      const glitch = keyboardGlitches[Math.floor(Math.random() * keyboardGlitches.length)];
      setKeyboardGlitch(glitch);
      setTimeout(() => setKeyboardGlitch(null), 2000 + Math.random() * 3000);
    }
  }, []);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
    
    if (!startTime) {
      setStartTime(Date.now());
    }

    if (e.key === 'Backspace') {
      setTypedText(prev => prev.slice(0, -1));
      return;
    }

    if (e.key.length === 1) {
      const char = applyKeyboardGlitch(e.key);
      setTypedText(prev => prev + char);
      triggerRandomGlitch();
    }
  }, [gameOver, startTime, applyKeyboardGlitch, triggerRandomGlitch]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (typedText.length > 0) {
      const injectedText = injectTypos(typedText);
      setDisplayText(injectedText);
    } else {
      setDisplayText('');
    }
  }, [typedText, injectTypos]);

  useEffect(() => {
    // Update productivity score based on typos
    const newScore = Math.max(0, 100 - (typoCount * 5));
    setProductivityScore(newScore);
  }, [typoCount]);

  const generateHarshFeedback = () => {
    const feedbacks = [
      "Unacceptable typo rate. Your performance is below company standards.",
      "Multiple spelling errors detected. Recommend mandatory typing course.",
      "Quality control failure. This reflects poorly on your attention to detail.",
      "Excessive mistakes. Consider reviewing basic communication skills.",
      "Your typing accuracy is impacting team productivity metrics.",
      "Subpar performance. Management has been notified of these errors."
    ];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  };

  const sendEmail = () => {
    if (currentEmailIndex === 9) {
      // Final email always fails
      setFeedbackMessage("EMAIL REJECTED: Excessive typos detected. This email cannot be sent to clients. Your employment status is under review.");
      setGameOver(true);
    } else {
      setFeedbackMessage(generateHarshFeedback());
      setTimeout(() => {
        setCurrentEmailIndex(prev => prev + 1);
        setTypedText('');
        setDisplayText('');
        setIsComplete(false);
        setShowFeedback(false);
      }, 3000);
    }
    setShowFeedback(true);
  };

  useEffect(() => {
    if (typedText.length >= targetText.length && !isComplete) {
      setIsComplete(true);
    }
  }, [typedText.length, targetText.length, isComplete]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'text-blue-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const timeElapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 font-mono">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Mail className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">CorporateMAIL Pro v2.1</h1>
              <p className="text-gray-300 text-sm">Executive Communication Suite</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-gray-300">Productivity Score</div>
              <div className={`text-xl font-bold ${productivityScore < 50 ? 'text-red-400' : productivityScore < 75 ? 'text-yellow-400' : 'text-green-400'}`}>
                {productivityScore}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-300">Errors Detected</div>
              <div className="text-xl font-bold text-red-400">{typoCount}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Email Progress</span>
            <span className="text-sm text-gray-500">{currentEmailIndex + 1} / 10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentEmailIndex + 1) / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Email Interface */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Email Header */}
          <div className="bg-gray-50 border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(currentEmail.urgency)} bg-gray-100`}>
                  {currentEmail.urgency.toUpperCase()}
                </div>
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Time: {timeElapsed}s</span>
              </div>
              {keyboardGlitch && (
                <div className="flex items-center space-x-2 text-red-600 animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-semibold">KEYBOARD MALFUNCTION</span>
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mt-2">{currentEmail.subject}</h2>
          </div>

          {/* Email Body */}
          <div className="p-6">
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Target Message:</div>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-700 border-l-4 border-blue-500">
                {targetText}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Your Typed Message:</div>
              <div className="bg-yellow-50 p-4 rounded-lg min-h-24 border-l-4 border-yellow-500 relative">
                <div className="text-gray-800">
                  {displayText || (
                    <span className="text-gray-400 italic">Start typing the message above...</span>
                  )}
                  <span className="animate-pulse">|</span>
                </div>
                {typoCount > 0 && (
                  <div className="absolute bottom-2 right-2 text-xs text-red-600 font-semibold">
                    {typoCount} errors detected
                  </div>
                )}
              </div>
            </div>

            {isComplete && !showFeedback && (
              <div className="text-center">
                <button
                  onClick={sendEmail}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                >
                  SEND EMAIL
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Feedback Modal */}
        {showFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-2xl">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <TrendingDown className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {gameOver ? 'FINAL REJECTION' : 'PERFORMANCE ALERT'}
                </h3>
                <p className="text-gray-600 mb-6">{feedbackMessage}</p>
                {gameOver ? (
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-red-600">GAME OVER</div>
                    <p className="text-sm text-gray-500">
                      You typed {typoCount} words correctly, but our system sabotaged you every time.
                      Corporate efficiency at its finest!
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded font-semibold"
                    >
                      Try Again (Same Result Guaranteed)
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Moving to next email in 3 seconds...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-gray-800 text-white p-4 rounded-lg">
          <h3 className="font-bold mb-2">System Instructions:</h3>
          <ul className="text-sm space-y-1 text-gray-300">
            <li>• Type the exact message shown above</li>
            <li>• Your correctly typed words will be "auto-corrected" with typos</li>
            <li>• You will be penalized for the typos we create</li>
            <li>• Keyboard may malfunction randomly (as designed)</li>
            <li>• Complete all 10 emails to... well, you'll see</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;