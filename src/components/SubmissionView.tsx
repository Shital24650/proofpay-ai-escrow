import React, { useState } from 'react';
import {
  UploadCloud,
  Globe,
  GitPullRequest,
  CheckCircle,
  FileCode,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { SAMPLE_DELIVERABLES, type SampleDeliverable } from '../sampleDeliverables';
import type { Deal } from '../types';

interface SubmissionViewProps {
  deal: Deal;
  onSubmitWork: (url: string, rawContent?: string) => Promise<void>;
  onVerify: () => Promise<void>;
  loading: boolean;
  verifying: boolean;
}

export const SubmissionView: React.FC<SubmissionViewProps> = ({
  deal,
  onSubmitWork,
  onVerify,
  loading,
  verifying,
}) => {
  const [submissionUrl, setSubmissionUrl] = useState<string>(deal.submittedUrl || '');
  const [customHtml, setCustomHtml] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'url' | 'samples' | 'paste'>('samples');
  const [selectedSample, setSelectedSample] = useState<SampleDeliverable>(SAMPLE_DELIVERABLES[0]);

  const isSubmitted = deal.status === 'SUBMITTED' || deal.status === 'VERIFIED' || deal.status === 'SETTLED';

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionUrl.trim()) return;
    onSubmitWork(submissionUrl.trim());
  };

  const handleSampleSubmit = (sample: SampleDeliverable) => {
    setSelectedSample(sample);
    onSubmitWork(`demo-sample://${sample.label.toLowerCase().replace(/\s+/g, '-')}`, sample.rawContent);
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHtml.trim()) return;
    onSubmitWork('custom-input://code-deliverable', customHtml.trim());
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
      <div className="pb-6 mb-6 border-b border-slate-100">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <UploadCloud className="w-6 h-6 text-emerald-600" />
          <span>Freelancer Deliverable Submission</span>
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Submit the completed work as a public live URL, a GitHub pull request diff, or test deliverable.
          The server will fetch and isolate the code for untrusted evaluation.
        </p>
      </div>

      {/* Agreed Criteria Quick Reference */}
      <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Agreed Objective Criteria to Fulfill ({deal.criteria.length} criteria)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {deal.criteria.map((c, i) => (
            <div key={c.id} className="flex items-start gap-2 bg-white p-2 rounded border border-slate-200">
              <span className="font-mono font-bold text-slate-700 shrink-0">#{i + 1}</span>
              <span className="text-slate-800 flex-1">{c.text}</span>
              <span className="font-mono text-emerald-700 font-semibold shrink-0">
                {c.weight}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('samples')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'samples'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Preset Test Deliverables (Recommended for Demo)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'url'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Live URL or GitHub PR
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('paste')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'paste'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Paste Raw HTML / Diff
        </button>
      </div>

      {/* Tab: Samples */}
      {activeTab === 'samples' && (
        <div className="space-y-4 mb-6">
          <div className="text-xs text-slate-600 mb-2">
            Select one of the pre-configured deliverables to test the AI verifier and settlement engine immediately:
          </div>

          <div className="grid grid-cols-1 gap-3">
            {SAMPLE_DELIVERABLES.map((sample) => (
              <div
                key={sample.label}
                className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{sample.label}</span>
                  </div>
                  <p className="text-xs text-slate-600">{sample.description}</p>
                  <p className="text-[11px] font-mono text-emerald-700 font-medium">
                    Expected outcome: {sample.expectedOutcome}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSampleSubmit(sample)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors shrink-0 cursor-pointer shadow-sm"
                >
                  {loading ? 'Submitting...' : 'Use This Deliverable'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Live URL or GitHub PR */}
      {activeTab === 'url' && (
        <form onSubmit={handleUrlSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Deliverable URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                placeholder="https://my-landing-page.com or https://github.com/owner/repo/pull/12"
                required
                className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start gap-2">
            <GitPullRequest className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <strong>Supported URLs:</strong> Any public web page URL (fetched via GET, up to 40k chars) or public GitHub pull requests (<code className="font-mono">github.com/owner/repo/pull/n</code>), which are automatically fetched via GitHub Diff API.
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !submissionUrl.trim()}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <UploadCloud className="w-4 h-4 text-emerald-400" />
            <span>{loading ? 'Fetching content...' : 'Submit Work'}</span>
          </button>
        </form>
      )}

      {/* Tab: Paste Code */}
      {activeTab === 'paste' && (
        <form onSubmit={handlePasteSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Deliverable Code / HTML / Diff Content
            </label>
            <textarea
              value={customHtml}
              onChange={(e) => setCustomHtml(e.target.value)}
              rows={8}
              placeholder="Paste HTML page content, components, or Git diff here..."
              required
              className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !customHtml.trim()}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>{loading ? 'Storing deliverable...' : 'Submit Work'}</span>
          </button>
        </form>
      )}

      {/* Submitted Content Preview */}
      {isSubmitted && (
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold text-slate-900">
                Deliverable Received & Isolated
              </span>
              <span className="text-xs text-slate-500 font-mono">
                ({deal.submittedUrl})
              </span>
            </div>
            <div className="text-xs text-slate-500">
              Untrusted User Data Isolated
            </div>
          </div>

          <div className="p-3.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-xs overflow-x-auto max-h-48 border border-slate-800">
            <pre>{deal.submittedContentPreview || 'Deliverable content cached on server.'}...</pre>
          </div>

          {deal.status === 'SUBMITTED' && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div>
                <div className="font-bold text-sm text-emerald-950">
                  Ready for AI Objective Verification
                </div>
                <div className="text-xs text-emerald-800 mt-0.5">
                  Gemini 2.5 Flash will evaluate tangible evidence against agreed criteria. Money amounts are strictly computed in server code.
                </div>
              </div>

              <button
                type="button"
                disabled={verifying}
                onClick={onVerify}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0"
              >
                {verifying ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Verifying with Gemini...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Deliverable & Settle</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
