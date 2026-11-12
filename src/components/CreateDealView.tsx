import React, { useState } from 'react';
import { Sparkles, DollarSign, ArrowRight, Lightbulb } from 'lucide-react';

interface CreateDealViewProps {
  onGenerate: (dealText: string, amount: number, currency?: string) => Promise<void>;
  onLoadDemo: () => void;
  loading: boolean;
}

const TEMPLATES = [
  {
    title: 'Landing Page (Demo)',
    amount: 10,
    currency: 'USD',
    text: 'Pay $10 for a one-page landing page with a hero section, a pricing section, and a contact form, live on a public URL.',
  },
  {
    title: 'Documentation Site',
    amount: 25,
    currency: 'USD',
    text: 'Pay $25 for a static developer documentation site featuring a responsive sidebar, code blocks with syntax highlighting, and search bar.',
  },
  {
    title: 'GitHub PR Bugfix',
    amount: 50,
    currency: 'USD',
    text: 'Pay $50 for a GitHub PR adding JWT authentication middleware, input sanitization tests, and a healthcheck route.',
  },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($ - US Dollar)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€ - Euro)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£ - British Pound)' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD ($ - Canadian Dollar)' },
  { code: 'AUD', symbol: 'AU$', label: 'AUD ($ - Australian Dollar)' },
];

export const CreateDealView: React.FC<CreateDealViewProps> = ({
  onGenerate,
  onLoadDemo,
  loading,
}) => {
  const [dealText, setDealText] = useState(
    'Pay $10 for a one-page landing page with a hero section, a pricing section, and a contact form, live on a public URL.'
  );
  const [amount, setAmount] = useState<number>(10);
  const [currency, setCurrency] = useState<string>('USD');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealText.trim() || amount <= 0) return;
    onGenerate(dealText, amount, currency);
  };

  const currentSymbol = CURRENCIES.find((c) => c.code === currency)?.symbol || '$';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
      <div className="max-w-2xl">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Create AI-Verified Escrow Deal
        </h2>
        <p className="text-sm text-slate-600 mt-1 mb-6">
          Describe what the freelancer will deliver in plain English. ProofPay uses Gemini to translate
          the agreement into 4–5 objectively verifiable technical criteria.
        </p>

        {/* Templates */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick Deal Templates</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.title}
                type="button"
                onClick={() => {
                  setDealText(tmpl.text);
                  setAmount(tmpl.amount);
                  setCurrency(tmpl.currency);
                }}
                className="text-left p-3 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>{tmpl.title}</span>
                  <span className="font-mono text-emerald-700">${tmpl.amount}</span>
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                  {tmpl.text}
                </div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Agreement Terms & Deliverable Description
            </label>
            <textarea
              value={dealText}
              onChange={(e) => setDealText(e.target.value)}
              rows={4}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
              placeholder="e.g. Build a responsive portfolio page with a hero header, projects gallery grid, and contact email link..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Escrow Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                  {currentSymbol}
                </div>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full pl-8 pr-3.5 py-2.5 text-base font-mono font-semibold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !dealText.trim() || amount <= 0}
                className="w-full px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Generate</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span>Funds remain 100% held in PayPal sandbox until objective code verification passes.</span>
          <button
            type="button"
            onClick={onLoadDemo}
            className="text-slate-700 hover:text-slate-900 font-semibold underline underline-offset-2 cursor-pointer"
          >
            Or load pre-seeded demo deal
          </button>
        </div>
      </div>
    </div>
  );
};
