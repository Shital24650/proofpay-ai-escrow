import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, ArrowLeft, AlertCircle, Percent } from 'lucide-react';
import type { Criterion, Deal } from '../types';

interface CriteriaReviewViewProps {
  deal: Deal;
  onApproveAndFund: (criteria: Criterion[]) => Promise<void>;
  onBack: () => void;
  loading: boolean;
}

export const CriteriaReviewView: React.FC<CriteriaReviewViewProps> = ({
  deal,
  onApproveAndFund,
  onBack,
  loading,
}) => {
  const [criteria, setCriteria] = useState<Criterion[]>(deal.criteria);

  const totalWeight = criteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
  const isValid = totalWeight === 100;

  const handleWeightChange = (index: number, newWeight: number) => {
    const next = [...criteria];
    next[index] = { ...next[index], weight: Math.max(1, Math.min(100, Math.round(newWeight))) };
    setCriteria(next);
  };

  const handleTextChange = (index: number, newText: string) => {
    const next = [...criteria];
    next[index] = { ...next[index], text: newText };
    setCriteria(next);
  };

  const handleNormalizeWeights = () => {
    if (criteria.length === 0) return;
    const share = Math.floor(100 / criteria.length);
    const remainder = 100 - share * criteria.length;
    const next = criteria.map((c, i) => ({
      ...c,
      weight: share + (i === 0 ? remainder : 0),
    }));
    setCriteria(next);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Review Objective Contract Criteria
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Gemini translated your agreement into verifiable technical criteria. Each has an integer weight.
            Sum must equal 100%.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-500">Weight Sum</div>
            <div
              className={`text-lg font-mono font-bold tabular-nums ${
                isValid ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {totalWeight}% / 100%
            </div>
          </div>
          {!isValid && (
            <button
              type="button"
              onClick={handleNormalizeWeights}
              className="text-xs px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded cursor-pointer"
            >
              Auto-Balance
            </button>
          )}
        </div>
      </div>

      {/* Deal text reminder */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
          Agreed Deal Scope ({deal.amount.toFixed(2)} {deal.currency || 'USD'})
        </span>
        <p className="text-sm text-slate-800 italic">"{deal.dealText}"</p>
      </div>

      {!isValid && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 text-amber-800 text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Criteria weights must sum to exactly 100%</div>
            <div className="text-xs mt-0.5 text-amber-700">
              Current sum is {totalWeight}%. Please adjust the sliders or click "Auto-Balance" above.
            </div>
          </div>
        </div>
      )}

      {/* Criteria list */}
      <div className="space-y-4 mb-8">
        {criteria.map((crit, idx) => {
          const moneyVal = ((deal.amount * crit.weight) / 100).toFixed(2);
          return (
            <div
              key={crit.id}
              className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-500">
                    ID: {crit.id}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded">
                    <Percent className="w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={crit.weight}
                      onChange={(e) => handleWeightChange(idx, parseInt(e.target.value) || 0)}
                      className="w-12 text-sm font-mono font-bold text-right bg-transparent focus:outline-none text-slate-900"
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                  <div className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">
                    {moneyVal} {deal.currency || 'USD'}
                  </div>
                </div>
              </div>

              <textarea
                value={crit.text}
                onChange={(e) => handleTextChange(idx, e.target.value)}
                rows={2}
                className="w-full text-sm text-slate-800 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors"
                placeholder="Criterion description..."
              />
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Deal Scope</span>
        </button>

        <button
          type="button"
          disabled={!isValid || loading}
          onClick={() => onApproveAndFund(criteria)}
          className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          {loading ? (
            <span>Initiating PayPal Sandbox Escrow...</span>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Approve and Fund ({deal.amount.toFixed(2)} {deal.currency || 'USD'})</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
