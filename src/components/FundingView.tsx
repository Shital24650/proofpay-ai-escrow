import React from 'react';
import {
  Lock,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  PlayCircle,
  HelpCircle,
  Info,
} from 'lucide-react';
import type { Deal } from '../types';

interface FundingViewProps {
  deal: Deal;
  onSimulateAuthorize: () => Promise<void>;
  onProceedToSubmit: () => void;
  loading: boolean;
}

export const FundingView: React.FC<FundingViewProps> = ({
  deal,
  onSimulateAuthorize,
  onProceedToSubmit,
  loading,
}) => {
  const isAuthorized = deal.status === 'AUTHORIZED' || deal.status === 'SUBMITTED' || deal.status === 'VERIFIED' || deal.status === 'SETTLED';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
      <div className="pb-6 mb-6 border-b border-slate-100">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Lock className="w-6 h-6 text-emerald-600" />
          <span>PayPal Sandbox Escrow Authorization</span>
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Lock escrow funds using PayPal's two-step Authorize-Capture mechanism. Money is held on the buyer's account and never disbursed until criteria are verified.
        </p>
      </div>

      {/* Escrow State Banner */}
      <div
        className={`p-5 rounded-xl border mb-6 ${
          isAuthorized
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : 'bg-amber-50/70 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider font-bold">
                Escrow State
              </span>
              <span className="text-xs">·</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  isAuthorized ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                }`}
              >
                {isAuthorized ? 'FUNDS HELD, NOT YET RELEASED' : 'PENDING BUYER AUTHORIZATION'}
              </span>
            </div>
            <p className="text-base font-semibold">
              {isAuthorized
                ? `${deal.amount.toFixed(2)} ${deal.currency || 'USD'} is safely locked in PayPal sandbox escrow.`
                : `Awaiting PayPal authorization for ${deal.amount.toFixed(2)} ${deal.currency || 'USD'}.`}
            </p>
            <p className="text-xs text-slate-600">
              {isAuthorized
                ? 'The freelancer can now start work and submit their live URL or public GitHub PR for automated evaluation.'
                : 'Click "Pay with PayPal" to authorize via your PayPal Sandbox buyer account, or simulate authorization instantly below.'}
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs text-slate-500">Escrow Value</div>
            <div className="text-2xl font-mono font-bold tabular-nums text-slate-900">
              {deal.amount.toFixed(2)} <span className="text-sm font-sans font-medium text-slate-600">{deal.currency || 'USD'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical IDs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            PayPal Order ID
          </div>
          <div className="font-mono text-sm text-slate-900 font-medium break-all select-all">
            {deal.orderId || 'Pending creation...'}
          </div>
        </div>

        <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            PayPal Authorization ID
          </div>
          <div className="font-mono text-sm text-slate-900 font-medium break-all select-all">
            {deal.authorizationId || 'Awaiting buyer authorization...'}
          </div>
        </div>
      </div>

      {/* Actions */}
      {!isAuthorized ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {deal.approvalUrl && (
              <a
                href={deal.approvalUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 px-6 py-3 bg-[#0070ba] hover:bg-[#005ea6] text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Pay with PayPal (Sandbox)</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              type="button"
              disabled={loading}
              onClick={onSimulateAuthorize}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <PlayCircle className="w-4 h-4 text-emerald-400" />
              <span>Simulate Sandbox Authorization</span>
            </button>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-2">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Seeing "Seller doesn't accept payments in your currency"?</span>
                <div className="mt-1 text-slate-600 space-y-1">
                  <div>
                    If your sandbox buyer account is from <strong>India (Country: IN)</strong>, PayPal restricts domestic India-to-India USD payments.
                  </div>
                  <div>
                    <strong>Quick Fix:</strong> In <a href="https://developer.paypal.com/dashboard/accounts" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">developer.paypal.com</a> under <strong>Testing Tools &gt; Sandbox Accounts</strong>, click <em>Create account</em> and choose <strong>Country: United States</strong> for a US personal buyer account.
                  </div>
                  <div>
                    Or click <strong>Simulate Sandbox Authorization</strong> above to test escrow release without currency barriers!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-600">
            Escrow verified. Funds are held in sandbox intent <code className="font-mono font-semibold">AUTHORIZE</code>.
          </div>

          <button
            type="button"
            onClick={onProceedToSubmit}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Proceed to Freelancer Submission</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      )}
    </div>
  );
};
