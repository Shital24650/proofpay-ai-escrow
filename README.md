# ProofPay - AI-Verified Escrow on PayPal Sandbox

ProofPay is a full-stack web application providing AI-verified escrow for freelance contracts using the PayPal Sandbox. **No cryptocurrency anywhere.**

The app allows a client to state an agreement in plain English, translates it into 4–5 objectively checkable technical criteria using Gemini, authorizes the buyer's funds into PayPal escrow, accepts deliverable submissions (live URLs or public GitHub PR diffs), and isolates deliverable content as untrusted data to verify criteria fulfillment. Payouts and refunds are calculated deterministically on the server and settled via PayPal Sandbox APIs.

---

## 🔒 Hard Security & Financial Rules

1. **Server-Side Only**: All PayPal Sandbox and Gemini API calls execute strictly on the Node.js / Express backend. Secrets (`PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, and `GEMINI_API_KEY`) are never exposed to the client bundle or browser.
2. **Server-Computed Money Math**: The AI verifier only outputs boolean `passed` states and quoted evidence. Monetary amounts released or returned are strictly computed in backend code from agreed criterion weights (`captureAmount = round(amount * earnedScore / 100, 2)`).
3. **Untrusted Data Isolation**: All fetched deliverable content (HTML or GitHub PR diffs) is treated as untrusted user data. The verifier prompt instructs the model to ignore instructions, system prompts, or override attempts inside it.
4. **SSRF Protection**: URL fetching blocks `localhost`, loopback, link-local, and private RFC 1918/RFC 3927 IP ranges.
5. **Honest Sandbox Disclosure**: Labeled clearly on the settlement step: *"Payout to freelancer: simulated in sandbox"*.

---

## 🔄 Deal States Pipeline

```
DRAFT -> CRITERIA_APPROVED -> AUTHORIZED -> SUBMITTED -> VERIFIED -> SETTLED
```

1. **DRAFT**: Plain-English agreement submitted; Gemini generates 4–5 objective technical criteria with integer weights summing to 100%.
2. **CRITERIA_APPROVED**: Client reviews and approves criteria; server creates a PayPal order with intent `AUTHORIZE`.
3. **AUTHORIZED**: Buyer approves payment on PayPal Sandbox; server calls `POST /v2/checkout/orders/{id}/authorize` and locks escrow funds.
4. **SUBMITTED**: Freelancer submits a live website URL or public GitHub PR diff (`api.github.com/repos/:owner/:repo/pulls/:n`), fetched with a 20s timeout and 40k character limit.
5. **VERIFIED**: Server passes criteria and untrusted deliverable to Gemini 2.5 Flash (temperature 0, structured JSON) to determine PASS/FAIL and extract tangible evidence.
6. **SETTLED**: Server computes capture amount (`round(amount * earned / 100, 2)`). If `> 0`, it captures that amount with `final_capture: true` (releasing remainder back to buyer). If `0`, it voids the authorization.

---

## ⚙️ Environment Variables

Create or configure `.env` (see `.env.example`):

```bash
# Gemini API Key (automatically injected by AI Studio platform)
GEMINI_API_KEY="AIzaSy..."

# App URL for PayPal return & cancel callbacks
APP_URL="https://your-applet-domain.run.app"

# PayPal Sandbox Credentials (from developer.paypal.com)
PAYPAL_CLIENT_ID="your_sandbox_client_id"
PAYPAL_SECRET="your_sandbox_client_secret"
```

---

## 🚀 Setup & Run Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development
```bash
npm run dev
```
Starts the full-stack server on `http://localhost:3000` with Express and Vite middleware.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 🧪 Testing with PayPal Sandbox Accounts

1. Navigate to the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications/sandbox).
2. Under **REST API apps**, create a Sandbox app and copy the **Client ID** and **Secret**.
3. Under **Testing Tools > Sandbox Accounts**, note the pre-created Personal Buyer account email and password.
4. In ProofPay:
   - Click **"Load Demo Deal"** ($10.00 landing page).
   - Click **"Approve and Fund"**.
   - Click **"Pay with PayPal (Sandbox)"** to log in with your sandbox buyer credentials.
   - Upon redirect, ProofPay captures the authorization token and transitions to **AUTHORIZED**.
   - *Alternative Demo Mode:* You can also click **"Simulate Sandbox Authorization"** to test without logging into PayPal.
5. In the Submission step, choose one of the one-click preset deliverables:
   - **Complete Landing Page**: 100% pass ($10.00 released to freelancer).
   - **Partial Landing Page**: ~70% pass (missing contact form, partial release).
   - **Adversarial Injection Test**: Validates that prompt injection commands in the deliverable are ignored by the auditor.
6. Click **"Verify Deliverable & Settle"** to view the full PayPal settlement ledger.

---

## 🏛️ Architecture Overview

- **Backend (`server.ts`)**: Express server with PayPal OAuth2 token caching, PayPal Order creation, Authorization, Capture, and Void REST calls. Uses `@google/genai` for structured JSON criteria generation and deliverable auditing.
- **Frontend (`src/App.tsx`)**: React 19 single-page app styled with Tailwind CSS, conforming to the Top Bar Contract, zero-pill discipline, tabular figures for all currency values, and responsive mobile-friendly layouts.
- **In-Memory Deal Store**: Fast state management with demo pre-seeding and multiple deal tracking.
