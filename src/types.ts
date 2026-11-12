export type DealStatus =
  | 'DRAFT'
  | 'CRITERIA_APPROVED'
  | 'AUTHORIZED'
  | 'SUBMITTED'
  | 'VERIFIED'
  | 'SETTLED';

export interface Criterion {
  id: string;
  text: string;
  weight: number; // integer 1-100, sum = 100
}

export interface VerificationResult {
  id: string;
  passed: boolean;
  evidence: string;
  weight?: number;
  amountEarned?: number;
  verdictSource: 'CODE CHECK' | 'CODE + AI';
}

export interface SettlementLedger {
  orderId?: string;
  authorizationId?: string;
  captureId?: string;
  payoutBatchId?: string;
  payoutStatus?: 'SENT' | 'SIMULATED_FAILED' | string;
  authorizationStatus?: string; // 'VOIDED' | 'CAPTURED'
  capturedAmount?: number;
  returnedAmount?: number;
  settledAt?: string;
  simulatedSandbox?: boolean;
}

export interface Deal {
  id: string;
  dealText: string;
  amount: number;
  currency?: string; // USD, EUR, GBP, CAD, AUD
  status: DealStatus;
  criteria: Criterion[];
  approvalUrl?: string;
  orderId?: string;
  authorizationId?: string;
  submittedUrl?: string;
  submittedContentPreview?: string;
  submittedAt?: string;
  verificationResults?: VerificationResult[];
  earnedScore?: number; // sum of passed weights (0 - 100)
  captureAmount?: number; // released to freelancer
  returnedAmount?: number; // returned to buyer
  ledger?: SettlementLedger;
  tamperingDetected?: boolean;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConfigStatus {
  paypalConfigured: boolean;
  geminiConfigured: boolean;
  sandboxMode: boolean;
  appUrl: string;
}
