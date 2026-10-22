import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ExternalLink, Shield, BookOpen } from 'lucide-react';

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
      '[Official Rule] Open to all actively enrolled undergraduate and postgraduate students from recognized colleges and universities.',
      '[Official Rule] Registration must be completed through the official portal before the announced deadline.',
      '[Official Rule] Each participant may belong to only one squad; duplicate registrations will result in disqualification.',
    ],
  },
  {
    id: 'teams',
    title: 'Team Formation & Participation',
    rules: [
      '[Official Rule] Squad size: 1 to 4 members per team.',
      '[Official Rule] Inter-college team formations are permitted with valid student identification from each participant.',
      '[Official Rule] Each squad must nominate one Team Leader responsible for official submissions and communications.',
    ],
  },
  {
    id: 'tracks',
    title: 'Track & Problem-Statement Selection',
    rules: [
      '[Official Rule] Each squad must select and lock exactly one challenge statement from their chosen battle track.',
      '[Official Rule] Once a challenge statement is locked within the Chakravyuh portal, the choice is immutable.',
      '[Official Rule] Teams must formulate and develop solutions aligned directly with their committed challenge.',
    ],
  },
  {
    id: 'originality',
    title: 'Project Originality & Plagiarism Policy',
    rules: [
      '[Official Rule] All submitted code, architectures, and artifacts must be developed during the hackathon timeline.',
      '[Official Rule] Pre-existing private projects or uncredited third-party plagiarism will cause immediate disqualification.',
      '[Official Rule] Open-source libraries, pretrained foundation models, and public APIs are permitted with explicit attribution.',
    ],
  },
  {
    id: 'submission',
    title: 'Project Submissions & Deliverables',
    rules: [
      '[Official Rule] Final submission must include a functioning prototype, presentation deck (max 25MB), and public repository.',
      '[Official Rule] A recorded video walk-through or deployment URL must accompany technical repository links.',
      '[Official Rule] Submission portal will close strictly at the designated deadline with zero tolerance for late entries.',
    ],
  },
  {
    id: 'judging',
    title: 'Judging & Evaluation Criteria',
    rules: [
      '[Official Rule] Solutions will be evaluated by an esteemed jury of industry veterans and academic experts.',
      '[Official Rule] Scoring dimensions: Technical Execution (30%), Strategic Innovation (25%), Feasibility & Impact (25%), and Presentation (20%).',
      '[Official Rule] The decision of the evaluation committee is definitive and binding.',
    ],
  },
  {
    id: 'conduct',
    title: 'Code of Conduct & Academic Integrity',
    rules: [
      '[Official Rule] Mutual respect, professional sportsmanship, and ethical collaboration are mandatory at all times.',
      '[Official Rule] Harassment, misconduct, or malicious disruption of peer infrastructure will trigger expulsion and disciplinary escalation.',
      '[Official Rule] All participants must adhere to VIT-AP University campus and digital conduct directives.',
    ],
  },
  {
    id: 'nep',
    title: 'National Education Policy 2020 (NEP 2020) Context',
    rules: [
      'Chakravyuh is organized in philosophical alignment with the National Education Policy (NEP 2020) framework, which advocates experiential learning, multidisciplinary collaboration, and student-driven translational innovation.',
      'Note: NEP 2020 serves as an overarching educational vision and is not the author of hackathon-specific technical criteria.',
      '[Placeholder] Any additional institutional guidelines aligned with NEP mandates will be posted by the organizing committee.',
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

const AccordionItem: React.FC<{ category: RuleCategory; defaultOpen?: boolean }> = ({
  category,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-2xl border transition-all duration-300 ${open ? 'border-[#806638] bg-[#17171B]' : 'border-[#302920] bg-[#121318]'}`}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A15B] rounded-2xl"
        aria-expanded={open}
      >
        <span className="font-cinzel font-semibold text-sm sm:text-base text-[#F0E6D1] pr-4">
          {category.title}
        </span>
        <div className={`w-7 h-7 rounded-lg bg-[#08090B] border border-[#302920] flex items-center justify-center shrink-0 transition-transform duration-300 ${open ? 'rotate-180 border-[#C6A15B]' : ''}`}>
          <ChevronDown className="w-4 h-4 text-[#C6A15B]" />
        </div>
      </button>

      {open && (
        <div className="px-6 pb-6 pt-2 border-t border-[#302920]/60 space-y-3.5">
          {category.rules.map((rule, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] mt-2 shrink-0 shadow-[0_0_6px_rgba(198,161,91,0.5)]" />
              <p className="text-[#C7BDA9] text-xs sm:text-sm leading-relaxed">{rule}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const RulesSection: React.FC = () => {
  const { ref, inView } = useInView();

  // Configurable rulebook URL — update when official document is ready
  const RULEBOOK_URL = '#';

  return (
    <section id="rules" className="relative py-28 bg-[#08090B] overflow-hidden border-t border-[#302920]/40">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-ancient-grid opacity-30" />
        <div className="absolute top-0 left-0 w-[450px] h-[450px] rounded-full bg-[#C6A15B]/3 blur-[120px]" />
      </div>

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full border border-[#302920] bg-[#121318]">
            <Shield className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span className="text-[#C6A15B] text-xs font-sans font-semibold tracking-widest uppercase">RULES & REGULATIONS</span>
          </div>
          <h2 className="font-cinzel font-black text-4xl sm:text-5xl text-[#F0E6D1]">
            KNOW THE CODE BEFORE<br />ENTERING THE{' '}
            <span className="text-[#E0BC70]">ARENA</span>
          </h2>
          <p className="mt-4 text-[#898174] text-sm max-w-lg mx-auto leading-relaxed">
            Every warrior must understand the rules of combat. Review the protocol guidelines below.
          </p>
          <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent" />
        </div>

        {/* Accordions */}
        <div
          className={`space-y-3.5 transition-all duration-700 delay-150 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {ruleCategories.map((cat, idx) => (
            <AccordionItem key={cat.id} category={cat} defaultOpen={idx === 0} />
          ))}
        </div>

        {/* View Full Rulebook CTA */}
        <div
          className={`mt-12 text-center transition-all duration-700 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <a
            href={RULEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl border border-[#302920] bg-[#121318] hover:border-[#806638] hover:bg-[#17171B] text-[#C6A15B] hover:text-[#E0BC70] text-xs font-cinzel font-bold tracking-wider transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A15B]"
          >
            <BookOpen className="w-4 h-4 text-[#C6A15B]" />
            <span>VIEW FULL RULEBOOK</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
          <p className="mt-3 text-[#898174] text-xs">
            Official rulebook download link will be synchronized with event schedule.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RulesSection;
