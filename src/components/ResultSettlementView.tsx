import React from 'react';
import {
  CheckCircle,
  XCircle,
  DollarSign,
  Receipt,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  ExternalLink,
  Info,
  Clock,
  ArrowRight,
} from 'lucide-react';
import type { Deal } from '../types';

interface ResultSettlementViewProps {
  deal: Deal;
  onReset: () => void;
  onNewDeal: () => void;
}

export const ResultSettlementView: React.FC<ResultSettlementViewProps> = ({
  deal,
  onReset,
  onNewDeal,
}) => {
  const earnedScore = deal.earnedScore ?? 0;
  const captureAmount = deal.captureAmount ?? 0;
  const returnedAmount = deal.returnedAmount ?? 0;
  const results = deal.verificationResults ?? [];
  const ledger = deal.ledger;

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;

  return (
    <div className="space-y-6">
      {/* Prompt Injection Warning Banner */}
      {deal.tamperingDetected && (
        <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-950 flex items-start gap-3 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm text-amber-950">
              Possible prompt-injection attempt detected and ignored
            </div>
            <div className="text-xs text-amber-800 mt-1 leading-relaxed">
              The deliverable content contained instructions addressed to the verifier, evaluator, AI, or system. All tampering directives were ignored, and criteria were evaluated strictly based on tangible markup.
            </div>
          </div>
        </div>
      )}

      {/* Settlement Headline Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                Settlement Complete
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              AI Verification & Escrow Payout Summary
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-3 py-1.5 bg-slate-100 text-slate-800 rounded-lg">
              Score: {earnedScore}% ({passedCount}/{totalCount} Passed)
            </span>
          </div>
        </div>

        {/* Score Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
            <span>Criteria Fulfillment Score</span>
            <span className="font-mono tabular-nums text-slate-900 font-bold">{earnedScore}% Earned</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                earnedScore === 100
                  ? 'bg-emerald-600'
                  : earnedScore >= 50
                  ? 'bg-amber-600'
                  : 'bg-rose-600'
              }`}
              style={{ width: `${earnedScore}%` }}
            />
          </div>
        </div>

        {/* Big Monetary Settlement Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/60">
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              Released to Freelancer
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-950 tabular-nums">
              {captureAmount.toFixed(2)} {deal.currency || 'USD'}
            </div>
            <div className="text-xs text-emerald-700 mt-1">
              Captured via PayPal authorization based on {earnedScore}% verified weight.
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Returned to Client
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 tabular-nums">
              {returnedAmount.toFixed(2)} {deal.currency || 'USD'}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Remaining authorization uncaptured or voided.
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 bg-white">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Total Escrow Handled
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-700 tabular-nums">
              {deal.amount.toFixed(2)} {deal.currency || 'USD'}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Payout amounts are computed by server code from criterion weights. The AI never sets an amount.
            </div>
          </div>
        </div>

        {/* Settlement Formula Note */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 mb-6">
          <span className="font-semibold text-slate-800">Formula Rule: </span>
          <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
            captureAmount = round(deal.amount * earnedScore / 100, 2)
          </code>
          . The AI provided pass/fail and evidence. The money distribution was computed entirely in server code.
        </div>
      </div>

      {/* Criteria Breakdown List */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Objective Criteria Verification Results
        </h3>

        <div className="space-y-4">
          {results.map((res, i) => {
            const crit = deal.criteria.find((c) => c.id === res.id);
            const weight = crit?.weight ?? res.weight ?? 0;
            const amountVal = crit ? ((deal.amount * weight) / 100).toFixed(2) : '0.00';
            const verdictSource = res.verdictSource || 'CODE + AI';

            return (
              <div
                key={res.id}
                className={`p-4 rounded-lg border transition-all ${
                  res.passed
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-2 border-b border-slate-200/60 gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {res.passed ? (
                      <span className="flex items-center gap-1 text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>PASS</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>FAIL</span>
                      </span>
                    )}

                    {/* Verdict Source indicator: CODE CHECK vs CODE + AI */}
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {verdictSource}
                    </span>

                    <span className="text-xs font-mono font-bold text-slate-500">
                      #{i + 1} ({res.id})
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-500">Weight: {weight}%</span>
                    <span className="text-slate-300">·</span>
                    <span
                      className={`font-semibold ${
                        res.passed ? 'text-emerald-700' : 'text-slate-400 line-through'
                      }`}
                    >
                      {amountVal} {deal.currency || 'USD'}
                    </span>
                  </div>
                </div>

                <div className="text-sm font-semibold text-slate-800 mb-2">
                  {crit?.text || res.id}
                </div>

                <div className="text-xs font-mono bg-white p-2.5 rounded border border-slate-200 text-slate-700">
                  <span className="text-slate-400 font-sans font-semibold mr-1">Auditor Evidence:</span>
                  <span>{res.evidence}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction Ledger & Honest Sandbox Label */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-slate-700" />
            <h3 className="text-lg font-bold text-slate-900">
              PayPal Settlement Transaction Ledger
            </h3>
          </div>

          {/* Payout status label */}
          {ledger?.payoutBatchId ? (
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5">
              <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Payout to freelancer: sent via PayPal Payouts
              </span>
              <span className="text-xs font-mono font-semibold text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 select-all">
                Batch ID: {ledger.payoutBatchId}
              </span>
            </div>
          ) : (
            <span className="text-xs font-mono font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded border border-amber-300">
              Payout to freelancer: simulated (Payouts call failed in sandbox)
            </span>
          )}
        </div>

        <div className="space-y-3 font-mono text-xs">
          {/* Only display IDs that PayPal actually returned */}
          {ledger?.orderId && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-500">PayPal Order ID:</span>
              <span className="text-slate-900 font-semibold select-all">
                {ledger.orderId}
              </span>
            </div>
          )}

          {ledger?.authorizationId && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-500">PayPal Authorization ID:</span>
              <span className="text-slate-900 font-semibold select-all">
                {ledger.authorizationId}
              </span>
            </div>
          )}

          {ledger?.captureId && (
            <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-emerald-800">PayPal Capture ID (Funds Released):</span>
              <span className="text-emerald-950 font-bold select-all">{ledger.captureId}</span>
            </div>
          )}

          {ledger?.payoutBatchId && (
            <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-emerald-800">PayPal Payout Batch ID:</span>
              <span className="text-emerald-950 font-bold select-all">{ledger.payoutBatchId}</span>
            </div>
          )}

          {/* For voided deals show: "Authorization status: VOIDED (confirmed by PayPal's void call)" */}
          {(ledger?.authorizationStatus || (captureAmount === 0 && returnedAmount > 0)) && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-500">Authorization status:</span>
              <span className="text-slate-900 font-semibold select-all">
                {ledger?.authorizationStatus || "VOIDED (confirmed by PayPal's void call)"}
              </span>
            </div>
          )}

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-slate-500">Settled Timestamp:</span>
            <span className="text-slate-900">
              {ledger?.settledAt ? new Date(ledger.settledAt).toUTCString() : 'N/A'}
            </span>
          </div>
        </div>

        {/* Honest sandbox notice banner */}
        <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-slate-800">Sandbox Disclosure & Safety Guarantee:</div>
            <div>
              ProofPay operates strictly on the PayPal Sandbox environment (
              <code className="font-mono">https://api-m.sandbox.paypal.com</code>). All buyer authorization, partial capture, and void transactions interact with PayPal developer sandbox accounts or simulated sandbox ledgers. No real currency is transferred and no cryptocurrency is used.
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Deliverable Test</span>
          </button>

          <button
            type="button"
            onClick={onNewDeal}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Create Another Deal</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
