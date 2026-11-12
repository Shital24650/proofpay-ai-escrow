import React from 'react';
import { ShieldCheck, PlusCircle, RefreshCw, FileText } from 'lucide-react';
import type { ConfigStatus, Deal } from '../types';

interface HeaderProps {
  onNewDeal: () => void;
  onLoadDemo: () => void;
  onOpenDocs: () => void;
  config: ConfigStatus | null;
  loadingDemo: boolean;
  deal?: Deal | null;
}

export const Header: React.FC<HeaderProps> = ({
  onNewDeal,
  onLoadDemo,
  onOpenDocs,
  config,
  loadingDemo,
  deal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
              ProofPay
            </span>
            <span className="text-xs text-slate-500 font-medium mt-1">
              AI-Verified Escrow · PayPal Sandbox · Zero Crypto
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={onOpenDocs}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Architecture & Specs</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500 whitespace-nowrap">
            <span>PayPal Sandbox</span>
            <span aria-hidden="true">·</span>
            <span className={deal?.ledger?.payoutBatchId ? "text-emerald-700 font-medium" : "text-amber-700 font-medium"}>
              {deal?.ledger?.payoutBatchId
                ? 'Payout to freelancer: sent via PayPal Payouts'
                : 'Payouts: PayPal Payouts API (sandbox)'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-700 font-medium">USD Escrow</span>
          </div>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onLoadDemo}
            disabled={loadingDemo}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Load pre-seeded $10 landing page deal"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingDemo ? 'animate-spin' : ''}`} />
            <span>Load Demo Deal</span>
          </button>

          <button
            onClick={onNewDeal}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>New Deal</span>
          </button>
        </div>
      </div>
    </header>
  );
};
