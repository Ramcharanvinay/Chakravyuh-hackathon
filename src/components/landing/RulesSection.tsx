import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Shield, FileText, CheckCircle2 } from 'lucide-react';

interface RuleCategory {
  id: string;
  title: string;
  rules: string[];
}

const ruleCategories: RuleCategory[] = [
  {
    id: 'eligibility',
    title: 'Eligibility & Registration',
    rules: [
      'Open to all actively enrolled undergraduate and postgraduate students from recognized colleges and universities across India.',
      'Registration must be completed through the official portal before the announced deadline.',
      'Each participant may belong to only one squad; duplicate registrations will result in squad disqualification.',
    ],
  },
  {
    id: 'teams',
    title: 'Squad Formation & Participation',
    rules: [
      'Squad size: 1 to 4 members per team.',
      'Inter-college team formations are fully permitted with valid student identification from each participant.',
      'Each squad must nominate one Team Leader responsible for official submissions, check-ins, and communications.',
    ],
  },
  {
    id: 'tracks',
    title: 'Track & Problem Statement Locking',
    rules: [
      'Each squad must select and lock exactly one challenge statement from their chosen battle track.',
      'Once a challenge statement is locked within the Chakravyuh portal, the choice is immutable and cannot be altered.',
      'Teams must formulate and develop solutions aligned directly with their committed challenge brief.',
    ],
  },
  {
    id: 'originality',
    title: 'Originality & Academic Integrity',
    rules: [
      'All submitted code, architectures, and artifacts must be developed during the official hackathon timeline.',
      'Pre-existing private repositories or uncredited third-party plagiarism will cause immediate disqualification.',
      'Open-source libraries, pretrained foundation models, and public APIs are permitted with explicit architectural attribution.',
    ],
  },
  {
    id: 'submission',
    title: 'Project Deliverables & Artifacts',
    rules: [
      'Final submission must include a functioning prototype, architecture presentation deck (max 25MB), and public repository.',
      'A recorded video walk-through or deployment URL must accompany technical repository links.',
      'The submission portal will close strictly at the designated deadline with zero tolerance for late submissions.',
    ],
  },
  {
    id: 'judging',
    title: 'Evaluation Framework & Scoring',
    rules: [
      'Solutions will be evaluated by an esteemed jury of industry veterans and academic leaders.',
      'Scoring dimensions: Technical Depth & Execution (30%), Strategic Innovation (25%), Practical Feasibility & Impact (25%), and Presentation (20%).',
      'The decision of the evaluation committee is definitive and binding.',
    ],
  },
  {
    id: 'nep',
    title: 'National Education Policy (NEP 2020) Context',
    rules: [
      'Chakravyuh is organized in philosophical alignment with the National Education Policy (NEP 2020) framework, advocating experiential learning and translational innovation.',
      'Multidisciplinary teamwork across engineering domains is actively encouraged to mirror real-world industry problem solving.',
    ],
  },
];

const useInView = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};

export const RulesSection: React.FC = () => {
  const { ref, inView } = useInView();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="rules" className="relative py-28 bg-[#08090C] overflow-hidden border-t border-white/[0.08]">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-tactical-grid opacity-30" />
      </div>

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-[#12141C] text-[10px] font-mono tracking-[0.24em] uppercase text-zinc-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
            <span>OPERATING DIRECTIVES</span>
          </div>

          <h2 className="font-cinzel font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            RULES OF ENGAGEMENT.<br />
            <span className="text-zinc-500 font-bold">FAIR PLAY. ABSOLUTE INTEGRITY.</span>
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {ruleCategories.map((cat, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={cat.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#12141C] border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
                    : 'bg-[#12141C]/60 border-white/[0.06] hover:border-white/15 hover:bg-[#12141C]'
                } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: inView ? `${idx * 50}ms` : '0ms' }}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs font-bold text-zinc-500">
                      0{idx + 1}
                    </span>
                    <h3 className="font-cinzel font-black text-base sm:text-lg text-white">
                      {cat.title}
                    </h3>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full border border-white/[0.1] flex items-center justify-center transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-white text-[#08090C]' : 'text-zinc-400 bg-[#08090C]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-white/[0.04] space-y-3 animate-in fade-in duration-200">
                    {cat.rules.map((rule, rIdx) => (
                      <div key={rIdx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
                        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                          {rule}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default RulesSection;
