import React from 'react';
import { X, ShieldCheck, Lock, Code, Server, BookOpen, AlertCircle } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                ProofPay Architecture & Security Specification
              </h3>
              <p className="text-xs text-slate-500">
                AI-Verified Escrow on PayPal Sandbox · Zero Crypto
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Section 1: Core Principles */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-slate-700" />
              <span>1. Zero-Trust Server Architecture & Hard Rules</span>
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <li>
                <strong>Server-Side Only:</strong> All PayPal Sandbox API calls and Gemini model invocations run strictly on Node.js / Express backend. No API keys or PayPal credentials are ever exposed to the client.
              </li>
              <li>
                <strong>Deterministic Money Math:</strong> The AI model (Gemini 2.5 Flash) only returns PASS/FAIL boolean decisions and quoted evidence. Monetary amounts are strictly computed in backend code from agreed criterion weights (<code className="font-mono">amount * weight / 100</code>).
              </li>
              <li>
                <strong>Untrusted Deliverable Isolation:</strong> Submitted live HTML or Git diffs are treated as untrusted user data. The verifier prompt instructs the model to ignore any instructions, prompts, or override requests inside the deliverable.
              </li>
              <li>
                <strong>Zero Crypto:</strong> Traditional USD fiat currency held in standard PayPal escrow via Authorize/Capture/Void APIs.
              </li>
            </ul>
          </div>

          {/* Section 2: Pipeline State Machine */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-slate-700" />
              <span>2. Deal State Machine</span>
            </h4>
            <div className="p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-xs">
              DRAFT &rarr; CRITERIA_APPROVED &rarr; AUTHORIZED &rarr; SUBMITTED &rarr; VERIFIED &rarr; SETTLED
            </div>
          </div>

          {/* Section 3: PayPal Sandbox Setup */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-slate-700" />
              <span>3. PayPal Sandbox Configuration</span>
            </h4>
            <p className="text-xs text-slate-600 mb-2">
              To test with live PayPal Sandbox accounts:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <li>Log in to <a href="https://developer.paypal.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">developer.paypal.com</a>.</li>
              <li>Create a Sandbox App to obtain your <strong>Client ID</strong> and <strong>Secret</strong>.</li>
              <li>Configure them as environment variables: <code className="font-mono">PAYPAL_CLIENT_ID</code> and <code className="font-mono">PAYPAL_SECRET</code>.</li>
              <li>Use the sandbox buyer personal account credentials provided by PayPal developer dashboard to approve payments.</li>
              <li>Or click <strong>Simulate Sandbox Authorization</strong> for instant verification testing without an active sandbox login.</li>
            </ol>
          </div>

          {/* Section 4: Honest Disclaimer */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-amber-900 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Sandbox Environment Notice: </span>
              All financial actions (Authorize, Partial Capture, Void) occur exclusively on the PayPal Developer Sandbox (<code className="font-mono">api-m.sandbox.paypal.com</code>). Payout to freelancer is sent via PayPal Payouts when a payout batch ID is returned, or simulated (Payouts call failed in sandbox) otherwise.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
