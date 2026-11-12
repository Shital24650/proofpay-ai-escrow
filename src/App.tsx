import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DealStepper } from './components/DealStepper';
import { CreateDealView } from './components/CreateDealView';
import { CriteriaReviewView } from './components/CriteriaReviewView';
import { FundingView } from './components/FundingView';
import { SubmissionView } from './components/SubmissionView';
import { ResultSettlementView } from './components/ResultSettlementView';
import { DocsModal } from './components/DocsModal';
import { AlertCircle, CheckCircle2, History, X, ShieldAlert } from 'lucide-react';
import type { Deal, Criterion, ConfigStatus } from './types';

export default function App() {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [dealsList, setDealsList] = useState<Deal[]>([]);
  const [config, setConfig] = useState<ConfigStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDemo, setLoadingDemo] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [docsOpen, setDocsOpen] = useState<boolean>(false);

  // Fetch initial config & deals
  useEffect(() => {
    fetchConfig();
    fetchDeals();

    // Check URL search parameters (e.g., return from PayPal)
    const params = new URLSearchParams(window.location.search);
    const dealIdParam = params.get('dealId');
    const authorizedParam = params.get('authorized');
    const errorParam = params.get('error');
    const cancelledParam = params.get('cancelled');

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
    if (cancelledParam) {
      setError(`PayPal approval was cancelled for deal ${cancelledParam}.`);
    }
    if (authorizedParam) {
      setSuccessMsg('PayPal buyer authorization completed! Escrow funds are held and ready for freelancer submission.');
    }

    if (dealIdParam) {
      loadDealById(dealIdParam);
    } else {
      // Default to loading the demo deal on startup
      loadDemoDeal(false);
    }
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (e) {
      console.warn('Failed to load config', e);
    }
  };

  const fetchDeals = async () => {
    try {
      const res = await fetch('/api/deals');
      if (res.ok) {
        const list = await res.json();
        setDealsList(list);
      }
    } catch (e) {
      console.warn('Failed to load deals list', e);
    }
  };

  const loadDealById = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/deals/${id}`);
      if (res.ok) {
        const data = await res.json();
        setDeal(data);
      } else {
        setError('Requested deal could not be found.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching deal');
    } finally {
      setLoading(false);
    }
  };

  const loadDemoDeal = async (showFeedback = true) => {
    setLoadingDemo(true);
    setError(null);
    try {
      const res = await fetch('/api/deals/reset-demo', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setDeal(data);
        fetchDeals();
        if (showFeedback) {
          setSuccessMsg('Demo deal loaded: "Pay $10 for a one-page landing page with a hero section, pricing section, and contact form".');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load demo deal');
    } finally {
      setLoadingDemo(false);
    }
  };

  const handleGenerateCriteria = async (dealText: string, amount: number, currency = 'USD') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealText, amount, currency }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create deal');
      }
      const newDeal = await res.json();
      setDeal(newDeal);
      fetchDeals();
    } catch (err: any) {
      setError(err.message || 'Failed to generate criteria with Gemini');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAndFund = async (criteria: Criterion[]) => {
    if (!deal) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/deals/${deal.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ criteria }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to approve deal');
      }

      setDeal(data.deal);
      fetchDeals();

      if (data.approvalUrl) {
        setSuccessMsg('PayPal Sandbox order created! Click "Pay with PayPal" to authorize with sandbox credentials.');
      } else if (data.message) {
        // Helpful message if PayPal keys aren't set
        setSuccessMsg(data.message);
      }
    } catch (err: any) {
      setError(err.message || 'Error creating PayPal authorization order');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateAuthorize = async () => {
    if (!deal) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/deals/${deal.id}/simulate-authorize`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to simulate authorization');
      }
      setDeal(data.deal);
      fetchDeals();
      setSuccessMsg('Sandbox authorization verified! Funds ($' + data.deal.amount.toFixed(2) + ' USD) are held in escrow.');
    } catch (err: any) {
      setError(err.message || 'Failed to simulate authorization');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWork = async (url: string, rawContent?: string) => {
    if (!deal) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/deals/${deal.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, rawContent }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit deliverable');
      }
      setDeal(data);
      fetchDeals();
      setSuccessMsg('Deliverable code successfully fetched & isolated as untrusted data.');
    } catch (err: any) {
      setError(err.message || 'Error fetching deliverable');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!deal) return;
    setVerifying(true);
    setError(null);
    try {
      const res = await fetch(`/api/deals/${deal.id}/verify`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification and settlement failed');
      }
      setDeal(data);
      fetchDeals();
      setSuccessMsg(`Settlement complete: Released $${data.captureAmount.toFixed(2)} to freelancer, $${data.returnedAmount.toFixed(2)} returned to client.`);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleNewDeal = () => {
    setDeal(null);
    setError(null);
    setSuccessMsg(null);
  };

  // Determine active view
  const renderCurrentView = () => {
    if (!deal) {
      return (
        <CreateDealView
          onGenerate={handleGenerateCriteria}
          onLoadDemo={() => loadDemoDeal(true)}
          loading={loading}
        />
      );
    }

    switch (deal.status) {
      case 'DRAFT':
        return (
          <CriteriaReviewView
            deal={deal}
            onApproveAndFund={handleApproveAndFund}
            onBack={() => setDeal(null)}
            loading={loading}
          />
        );
      case 'CRITERIA_APPROVED':
        return (
          <FundingView
            deal={deal}
            onSimulateAuthorize={handleSimulateAuthorize}
            onProceedToSubmit={() => {
              // Transition to SUBMITTED view preparation
              setDeal({ ...deal, status: 'AUTHORIZED' });
            }}
            loading={loading}
          />
        );
      case 'AUTHORIZED':
      case 'SUBMITTED':
        return (
          <SubmissionView
            deal={deal}
            onSubmitWork={handleSubmitWork}
            onVerify={handleVerify}
            loading={loading}
            verifying={verifying}
          />
        );
      case 'VERIFIED':
      case 'SETTLED':
        return (
          <ResultSettlementView
            deal={deal}
            onReset={() => {
              if (deal.id === 'deal-demo-landing-page') {
                loadDemoDeal(true);
              } else {
                setDeal({ ...deal, status: 'AUTHORIZED', verificationResults: undefined, ledger: undefined });
              }
            }}
            onNewDeal={handleNewDeal}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        onNewDeal={handleNewDeal}
        onLoadDemo={() => loadDemoDeal(true)}
        onOpenDocs={() => setDocsOpen(true)}
        config={config}
        loadingDemo={loadingDemo}
        deal={deal}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Error: </span>
                <span>{error}</span>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-500 hover:text-rose-800 p-1 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-sm flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>{successMsg}</div>
            </div>
            <button
              onClick={() => setSuccessMsg(null)}
              className="text-emerald-700 hover:text-emerald-950 p-1 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stepper Pipeline */}
        {deal && <DealStepper currentStatus={deal.status} amount={deal.amount} currency={deal.currency} />}

        {/* Active Screen View */}
        {renderCurrentView()}

        {/* Deals History Quick Selector */}
        {dealsList.length > 1 && (
          <div className="mt-10 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <History className="w-4 h-4" />
              <span>Recent Deals in In-Memory Store ({dealsList.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {dealsList.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDeal(d)}
                  className={`px-3 py-1.5 text-xs rounded-lg border font-mono transition-colors cursor-pointer flex items-center gap-2 ${
                    deal?.id === d.id
                      ? 'border-slate-900 bg-slate-900 text-white font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{d.id.slice(0, 15)}...</span>
                  <span className="text-[10px] opacity-75 font-sans">${d.amount.toFixed(2)} ({d.status})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">ProofPay</span>
            <span>·</span>
            <span>PayPal Sandbox Integration</span>
            <span>·</span>
            <span className={deal?.ledger?.payoutBatchId ? "text-emerald-700 font-medium" : "text-amber-700 font-medium"}>
              {deal?.ledger?.payoutBatchId
                ? 'Payout to freelancer: sent via PayPal Payouts'
                : 'Payouts: PayPal Payouts API (sandbox)'}
            </span>
          </div>
          <div>
            Zero cryptocurrency · Objective server-side evaluation · Gemini 3.8 Flash
          </div>
        </div>
      </footer>

      {/* Docs & Spec Modal */}
      <DocsModal isOpen={docsOpen} onClose={() => setDocsOpen(false)} />
    </div>
  );
}
