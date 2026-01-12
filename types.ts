
export enum UserRole {
  ADMIN = 'ADMIN',
  FUNDRAISER = 'FUNDRAISER',
  DONOR = 'DONOR',
}

export enum CampaignStatus {
  PENDING = 'PENDING', // Waiting for admin verification
  ACTIVE = 'ACTIVE',   // Verified and accepting donations
  REJECTED = 'REJECTED', // Rejected by admin
  COMPLETED = 'COMPLETED', // Goal reached, funds transferred
}

export enum CampaignCategory {
  EDUCATION = 'Education',
  MEDICAL = 'Medical',
  STARTUP = 'Startup',
  NON_PROFIT = 'Non-Profit',
  EMERGENCY = 'Emergency',
  CREATIVE = 'Creative',
  OTHER = 'Other',
}

export enum VerificationStatus {
  NONE = 'NONE',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export interface VerificationDocuments {
  governmentId: string; // Base64 string or URL
  proofOfAddress?: string; // Base64 string or URL
  orgRegistration?: string; // Base64 string or URL (Fundraiser only)
  submittedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // In a real app, this would be hashed. Storing for mock auth.
  walletBalance: number; // For donors (source) and fundraisers (destination)
  verificationStatus: VerificationStatus;
  verificationDocuments?: VerificationDocuments;
}

export interface Campaign {
  id: string;
  fundraiserId: string;
  fundraiserName: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  status: CampaignStatus;
  category: CampaignCategory;
  beneficiary: string;
  deadline: string;
  createdAt: string;
  image: string;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  campaignId: string;
  campaignTitle: string;
  amount: number;
  timestamp: string;
  donorVerified?: boolean; // Snapshot of verification status at time of donation or dynamic
}

export interface Transaction {
  id: string;
  type: 'DONATION' | 'FUND_TRANSFER'; // Donation to system vs System to Fundraiser
  amount: number;
  senderId: string; // Donor ID or 'SYSTEM'
  receiverId: string; // 'SYSTEM' or Fundraiser ID
  date: string;
}

export interface AppState {
  user: User | null;
}
