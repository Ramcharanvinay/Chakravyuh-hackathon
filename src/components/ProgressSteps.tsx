import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Check, Lock } from 'lucide-react';

interface ProgressStepsProps {
  currentStep: 1 | 2 | 3;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selection, submission } = useAuth();

  const steps = [
    {
      number: '01',
      title: 'CHOOSE TRACK',
      route: '/tracks',
      isCompleted: Boolean(selection),
      isLocked: Boolean(selection),
      isActive: currentStep === 1,
      canNavigate: true,
    },
    {
      number: '02',
      title: 'LOCK PROBLEM',
      route: '/problems',
      isCompleted: Boolean(selection),
      isLocked: Boolean(selection),
      isActive: currentStep === 2,
      canNavigate: Boolean(selection) || location.pathname === '/problems' || location.pathname.startsWith('/theme'),
    },
    {
      number: '03',
      title: 'SUBMIT SOLUTION',
      route: '/submit',
      isCompleted: Boolean(submission),
      isLocked: Boolean(submission),
      isActive: currentStep === 3,
      canNavigate: Boolean(selection),
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="relative flex items-center justify-between">
        {/* Connecting Line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-px bg-white/[0.08] z-0" />
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-px bg-white transition-all duration-500 z-0"
          style={{
            width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
          }}
        />

        {steps.map((step) => {
          const isDone = step.isCompleted;
          const isActive = step.isActive;

          return (
            <button
              key={step.number}
              type="button"
              onClick={() => {
                if (step.canNavigate) {
                  navigate(step.route);
                }
              }}
              disabled={!step.canNavigate}
              className={`relative z-10 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-2 rounded-xl transition-all duration-300 font-mono ${
                isActive
                  ? 'bg-[#161822] border border-white/40 shadow-lg'
                  : isDone
                  ? 'bg-[#12141C] border border-white/[0.12] hover:border-white/30'
                  : 'bg-[#090A0E] border border-white/[0.06] opacity-50'
              } ${step.canNavigate ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              {/* Step Badge */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[11px] font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                    : isActive
                    ? 'bg-white text-[#08090C] font-black shadow-md'
                    : 'bg-[#12141C] text-zinc-500 border border-white/[0.08]'
                }`}
              >
                {isDone ? (
                  step.isLocked && currentStep < 3 ? (
                    <Lock className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                  )
                ) : (
                  step.number
                )}
              </div>

              {/* Title */}
              <div className="flex flex-col text-center sm:text-left">
                <span className={`text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase ${
                  isActive ? 'text-white' : isDone ? 'text-zinc-300' : 'text-zinc-500'
                }`}>
                  {step.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;
