import React from 'react';
import {
  FileCode,
  CheckCircle2,
  Lock,
  UploadCloud,
  SearchCheck,
  Receipt,
} from 'lucide-react';
import type { DealStatus } from '../types';

interface StepperProps {
  currentStatus: DealStatus;
  amount: number;
  currency?: string;
}

const STEPS: Array<{ key: DealStatus; label: string; sub: string; icon: React.ElementType }> = [
  { key: 'DRAFT', label: '1. Deal Spec', sub: 'Plain-English agreement', icon: FileCode },
  { key: 'CRITERIA_APPROVED', label: '2. Criteria', sub: 'Weights sum to 100', icon: CheckCircle2 },
  { key: 'AUTHORIZED', label: '3. PayPal Escrow', sub: 'Funds held in sandbox', icon: Lock },
  { key: 'SUBMITTED', label: '4. Deliverable', sub: 'Live URL or GitHub PR', icon: UploadCloud },
  { key: 'VERIFIED', label: '5. AI Verifier', sub: 'Objective evidence check', icon: SearchCheck },
  { key: 'SETTLED', label: '6. Settlement', sub: 'Ledger release & return', icon: Receipt },
];

const ORDER: Record<DealStatus, number> = {
  DRAFT: 0,
  CRITERIA_APPROVED: 1,
  AUTHORIZED: 2,
  SUBMITTED: 3,
  VERIFIED: 4,
  SETTLED: 5,
};

export const DealStepper: React.FC<StepperProps> = ({ currentStatus, amount, currency = 'USD' }) => {
  const currentIndex = ORDER[currentStatus] ?? 0;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
            Escrow Deal Pipeline
          </span>
          <span className="text-xs text-slate-300">/</span>
          <span className="text-xs font-mono font-semibold text-slate-700">
            Status: {currentStatus}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500">Contract Value:</div>
          <div className="text-base font-bold font-mono tabular-nums text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
            {amount.toFixed(2)} {currency}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 sm:gap-3">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div
              key={step.key}
              className={`p-2.5 rounded-lg border transition-all ${
                isCurrent
                  ? 'border-emerald-600 bg-emerald-50/50 text-slate-900'
                  : isDone
                  ? 'border-slate-200 bg-slate-50 text-slate-700'
                  : 'border-slate-100 bg-white text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-emerald-600 text-white'
                      : isDone
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="font-semibold text-xs truncate">{step.label}</div>
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-1">{step.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
