import React, { useState, useEffect } from 'react';

// Policy database with constraints and models
const POLICIES = {
  'rent-cap': {
    wish: "We will cap rents to lower housing costs for working families.",
    errors: [
      { text: "cap rents", reason: "Price control creates supply constraint" },
      { text: "lower housing costs", reason: "Short-term effect only; long-term costs increase" }
    ],
    reality: {
      model: "Supply Constraint Model v4.2",
      outcomes: [
        { label: "Supply Change", value: "-14%", timeframe: "24 months", type: "negative" },
        { label: "Waiting Lists", value: "+3 years", timeframe: "36 months", type: "negative" },
        { label: "Tax Revenue", value: "-£4.2bn", timeframe: "annual", type: "negative" },
        { label: "Average Rent (controlled)", value: "-8%", timeframe: "12 months", type: "positive" }
      ],
      alternative: "Remove density restrictions within 800m of transit stations. Outcome: +340,000 units/year, rent -12% (sustained).",
      tradeoffs: ["Local visual change", "Construction disruption 18-24mo", "GDP +1.2%"]
    },
    stressTests: {
      "Interest rates 7%": { survives: false, reason: "Construction financing collapses. New builds drop 60%." },
      "Interest rates 5%": { survives: true, reason: "Model holds. Supply impact reduced to -11%." },
      "Labour shortage 20%": { survives: false, reason: "Alternative undeliverable. Timeline extends to 8 years." },
      "Cement +50%": { survives: true, reason: "Model holds. Cost per unit +£12k, still viable." },
      "Planning reform passes": { survives: true, reason: "Alternative accelerates. +480,000 units/year achievable." }
    }
  },
  'green-belt': {
    wish: "Build 1.5 million homes without touching the Green Belt.",
    errors: [
      { text: "1.5 million homes", reason: "Spatial constraint: insufficient non-protected land at viable density" },
      { text: "without touching the Green Belt", reason: "97% of Green Belt is not green; includes car parks, scrubland" }
    ],
    reality: {
      model: "Land Use Constraint Model v2.1",
      outcomes: [
        { label: "Achievable Units", value: "680,000", timeframe: "5 years", type: "negative" },
        { label: "Required Density", value: "+340%", timeframe: "immediate", type: "negative" },
        { label: "Political Viability", value: "Low", timeframe: "n/a", type: "negative" },
        { label: "Cost per Unit", value: "+£85k", timeframe: "vs baseline", type: "negative" }
      ],
      alternative: "Reclassify 'Grey Belt' (car parks, scrubland, disused land). Mandate 6-story minimum within 800m of stations. Outcome: 2.1m homes achievable.",
      tradeoffs: ["Visual change near stations", "Green Belt 'brand' diluted", "GDP +2.4%", "Housing costs -18%"]
    },
    stressTests: {
      "NIMBYs block Grey Belt": { survives: false, reason: "Falls back to original constraint. Only 680k achievable." },
      "Density bonus for affordable": { survives: true, reason: "Model strengthens. 2.4m achievable with 30% affordable." },
      "Construction capacity": { survives: true, reason: "MMC (Modern Methods of Construction) scales. 5-year delivery viable." },
      "Interest rates 8%": { survives: false, reason: "Private development freezes. Requires public balance sheet." }
    }
  },
  'nhs-waiting': {
    wish: "We will cut NHS waiting lists without privatisation.",
    errors: [
      { text: "cut NHS waiting lists", reason: "Capacity constraint: 6.4m backlog requires 15% throughput increase" },
      { text: "without privatisation", reason: "Definition unclear: NHS already uses 8% private capacity" }
    ],
    reality: {
      model: "Healthcare Capacity Model v3.0",
      outcomes: [
        { label: "Current Backlog", value: "6.4m", timeframe: "now", type: "negative" },
        { label: "Required Throughput", value: "+15%", timeframe: "to clear in 3yr", type: "negative" },
        { label: "Staff Shortage", value: "47,000", timeframe: "nurses alone", type: "negative" },
        { label: "Capital Requirement", value: "£18bn", timeframe: "3 years", type: "negative" }
      ],
      alternative: "Expand existing private capacity contracts (already legal, already happening). Redirect £3bn from acute to primary/preventive. Outcome: backlog to 3.2m in 30 months.",
      tradeoffs: ["'Privatisation' framing risk", "Primary care transition pain", "Long-term cost -22%"]
    },
    stressTests: {
      "Staff retention crisis": { survives: false, reason: "Model breaks. Throughput drops 8% regardless of funding." },
      "Pay rise 10%": { survives: true, reason: "Retention stabilizes. Model holds with £2.1bn additional cost." },
      "Pandemic 2.0": { survives: false, reason: "Backlog doubles. No policy survives this scenario." },
      "AI diagnostics rollout": { survives: true, reason: "Model accelerates. 20% efficiency gain in imaging/pathology." }
    }
  }
};

const CUSTOM_POLICY = {
  wish: "",
  errors: [],
  reality: {
    model: "Awaiting Analysis",
    outcomes: [],
    alternative: "Submit a policy promise to generate analysis.",
    tradeoffs: []
  },
  stressTests: {}
};

export default function PolicyWindTunnel() {
  const [selectedPolicy, setSelectedPolicy] = useState('rent-cap');
  const [customWish, setCustomWish] = useState('');
  const [activeStressTest, setActiveStressTest] = useState(null);
  const [stressTestResult, setStressTestResult] = useState(null);
  const [compiled, setCompiled] = useState(false);
  const [passedTests, setPassedTests] = useState(new Set());
  
  const policy = POLICIES[selectedPolicy] || CUSTOM_POLICY;
  
  const highlightErrors = (text, errors) => {
    if (!errors || errors.length === 0) return <span>{text}</span>;
    
    let result = text;
    let segments = [];
    let lastIndex = 0;
    
    errors.forEach((error, i) => {
      const index = text.toLowerCase().indexOf(error.text.toLowerCase());
      if (index !== -1) {
        if (index > lastIndex) {
          segments.push({ text: text.slice(lastIndex, index), isError: false });
        }
        segments.push({ text: text.slice(index, index + error.text.length), isError: true, reason: error.reason });
        lastIndex = index + error.text.length;
      }
    });
    
    if (lastIndex < text.length) {
      segments.push({ text: text.slice(lastIndex), isError: false });
    }
    
    if (segments.length === 0) return <span>{text}</span>;
    
    return segments.map((seg, i) => 
      seg.isError ? (
        <span key={i} className="relative group">
          <span className="bg-red-500/30 text-red-300 border-b-2 border-red-500 cursor-help">
            {seg.text}
          </span>
          <span className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-red-300 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-red-500/50">
            ⚠️ {seg.reason}
          </span>
        </span>
      ) : (
        <span key={i}>{seg.text}</span>
      )
    );
  };
  
  const runStressTest = (testName) => {
    setActiveStressTest(testName);
    setStressTestResult(null);
    
    setTimeout(() => {
      const result = policy.stressTests[testName];
      setStressTestResult(result);
      
      if (result.survives) {
        setPassedTests(prev => new Set([...prev, testName]));
      }
    }, 800);
  };
  
  const checkCompiled = () => {
    const allTests = Object.keys(policy.stressTests);
    const passingTests = allTests.filter(t => policy.stressTests[t].survives);
    const allPassingRun = passingTests.every(t => passedTests.has(t));
    
    if (allPassingRun && passedTests.size >= 2) {
      setCompiled(true);
    }
  };
  
  useEffect(() => {
    checkCompiled();
  }, [passedTests]);
  
  useEffect(() => {
    setPassedTests(new Set());
    setCompiled(false);
    setActiveStressTest(null);
    setStressTestResult(null);
  }, [selectedPolicy]);
  
  const gapSeverity = policy.reality.outcomes.filter(o => o.type === 'negative').length;
  const gapColor = gapSeverity >= 3 ? 'text-red-500' : gapSeverity >= 2 ? 'text-yellow-500' : 'text-green-500';
  const gapLabel = gapSeverity >= 3 ? 'CRITICAL' : gapSeverity >= 2 ? 'MODERATE' : 'LOW';
  
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">CLAMOUR</h1>
            <p className="text-gray-500 text-sm">The Policy Wind Tunnel</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Select policy:</span>
            <select 
              value={selectedPolicy}
              onChange={(e) => setSelectedPolicy(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="rent-cap">Rent Caps</option>
              <option value="green-belt">Green Belt Housing</option>
              <option value="nhs-waiting">NHS Waiting Lists</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Main Split Screen */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4">
        
        {/* LEFT PANE - The Wish */}
        <div className="col-span-4 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-red-400">THE WISH</h2>
              <span className="text-xs text-gray-500">Source: Political Promise</span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 mb-4">
              <p className="text-lg leading-relaxed">
                {highlightErrors(policy.wish, policy.errors)}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Sentiment Analysis:</span>
                <span className="text-yellow-400">High desirability, low specificity</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Constraint Violations:</span>
                <span className="text-red-400">{policy.errors.length} detected</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Reality Gap:</span>
                <span className={`font-bold ${gapColor}`}>🔴 {gapLabel}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* CENTER - The Friction */}
        <div className="col-span-4 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="bg-blue-500/10 border-b border-blue-500/30 px-4 py-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-blue-400">STRESS TEST</h2>
              <span className="text-xs text-gray-500">Break the model</span>
            </div>
          </div>
          
          <div className="p-4">
            <p className="text-sm text-gray-400 mb-4">
              Submit parameters to test if the Reality model survives. If you can't break it, your opinion doesn't matter.
            </p>
            
            <div className="space-y-2 mb-4">
              {Object.keys(policy.stressTests).map((testName) => (
                <button
                  key={testName}
                  onClick={() => runStressTest(testName)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                    activeStressTest === testName 
                      ? 'bg-blue-500/20 border-blue-500' 
                      : passedTests.has(testName)
                        ? 'bg-green-500/10 border-green-500/50'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{testName}</span>
                    {passedTests.has(testName) && (
                      <span className="text-green-400 text-xs">✓ PASSED</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Result Display */}
            {activeStressTest && (
              <div className={`rounded-lg p-4 border ${
                stressTestResult === null 
                  ? 'bg-gray-800 border-gray-700' 
                  : stressTestResult.survives 
                    ? 'bg-green-500/10 border-green-500/50' 
                    : 'bg-red-500/10 border-red-500/50'
              }`}>
                {stressTestResult === null ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span>Running simulation...</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {stressTestResult.survives ? (
                        <span className="text-green-400 font-bold">✓ MODEL SURVIVES</span>
                      ) : (
                        <span className="text-red-400 font-bold">✗ MODEL BREAKS</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300">{stressTestResult.reason}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Compiled Status */}
            {compiled && (
              <div className="mt-4 bg-green-500/20 border border-green-500 rounded-lg p-4 text-center">
                <div className="text-green-400 font-bold text-lg mb-1">✓ COMPILED</div>
                <p className="text-sm text-green-300">Solution survived stress testing. Ready for Claimer.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* RIGHT PANE - The Reality */}
        <div className="col-span-4 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="bg-green-500/10 border-b border-green-500/30 px-4 py-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-green-400">THE REALITY</h2>
              <span className="text-xs text-gray-500">{policy.reality.model}</span>
            </div>
          </div>
          
          <div className="p-4">
            {/* Outcomes */}
            <div className="space-y-2 mb-4">
              {policy.reality.outcomes.map((outcome, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-950 rounded-lg px-3 py-2 border border-gray-800">
                  <span className="text-sm text-gray-400">{outcome.label}</span>
                  <div className="text-right">
                    <span className={`font-mono font-bold ${outcome.type === 'negative' ? 'text-red-400' : 'text-green-400'}`}>
                      {outcome.value}
                    </span>
                    <span className="text-xs text-gray-600 ml-2">{outcome.timeframe}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Alternative */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
              <div className="text-xs text-green-400 font-semibold mb-1">VALID ALTERNATIVE</div>
              <p className="text-sm text-gray-300">{policy.reality.alternative}</p>
            </div>
            
            {/* Tradeoffs */}
            <div>
              <div className="text-xs text-gray-500 mb-2">TRADE-OFFS</div>
              <div className="flex flex-wrap gap-2">
                {policy.reality.tradeoffs.map((tradeoff, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400 border border-gray-700">
                    {tradeoff}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-6 text-center">
        <p className="text-gray-600 text-sm">
          You're not posting. You're submitting a pull request to the British State.
        </p>
      </div>
    </div>
  );
}
