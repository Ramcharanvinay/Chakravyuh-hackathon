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
      title: 'Choose Track',
      route: '/tracks',
      isCompleted: Boolean(selection),
      isLocked: Boolean(selection),
      isActive: currentStep === 1,
      canNavigate: !selection || location.pathname === '/tracks',
    },
    {
      number: '02',
      title: 'Choose Problem',
      route: '/problems',
      isCompleted: Boolean(selection),
      isLocked: Boolean(selection),
      isActive: currentStep === 2,
      canNavigate: Boolean(selection) || location.pathname === '/problems',
    },
    {
      number: '03',
      title: 'Submit Solution',
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
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[1px] bg-charcoal-border z-0" />
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-gold via-gold to-transparent transition-all duration-500 z-0"
          style={{
            width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
          }}
        />

        {steps.map((step, idx) => {
          const isDone = step.isCompleted;
          const isActive = step.isActive;

          return (
            <button
              key={step.number}
              onClick={() => {
                if (step.canNavigate) {
                  navigate(step.route);
                }
              }}
              disabled={!step.canNavigate}
              className={`relative z-10 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-charcoal-card border border-gold/60 shadow-gold-subtle'
                  : isDone
                  ? 'bg-[#10131A] border border-charcoal-border hover:border-gold/30'
                  : 'bg-[#0E1017] border border-charcoal-border/60 opacity-60'
              } ${step.canNavigate ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              {/* Step Badge */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-gold/20 text-gold border border-gold/50'
                    : isActive
                    ? 'bg-gold text-obsidian font-black shadow-gold-glow'
                    : 'bg-charcoal text-ivory-muted/60 border border-charcoal-border'
                }`}
              >
                {isDone ? (
                  step.isLocked && currentStep < 3 ? (
                    <Lock className="w-3.5 h-3.5 text-gold" />
                  ) : (
                    <Check className="w-4 h-4 text-gold stroke-[3]" />
                  )
                ) : (
                  step.number
                )}
              </div>

              {/* Title */}
              <div className="flex flex-col text-center sm:text-left">
                <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-ivory-muted/70">
                  Step {step.number}
                </span>
                <span
                  className={`font-sans font-semibold text-xs sm:text-sm tracking-wide ${
                    isActive ? 'text-gold' : isDone ? 'text-ivory' : 'text-ivory-muted/70'
                  }`}
                >
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
