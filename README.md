
# UniAid: Online Crowdfunding Platform

UniAid is a full-featured, role-based crowdfunding web application designed to connect fundraisers (students, startups, NGOs) with donors. The platform features a complete lifecycle for fundraising campaigns, including creation, administrative verification, public listing, donation processing, and fund transfer simulation.

## 🚀 Overview

The application simulates a full-stack environment using a persistent `localStorage` mock service. It adheres to a strict trust-and-safety workflow where fundraisers and campaigns must be verified before accepting funds.

## ✨ Key Features

### 🔐 Authentication & Roles
*   **Role-Based Access Control (RBAC)**: Distinct dashboards and permissions for **Admins**, **Fundraisers**, and **Donors**.
*   **Registration & Login**: Secure-feel authentication flow.
*   **Demo Access**: One-click login shortcuts for testing different personas.

### 👤 Fundraiser Workflow
*   **Campaign Creation**: Create detailed campaigns with titles, descriptions, goals, categories, and images.
*   **Identity Verification (KYC)**: Upload simulated documents (Government ID, Proof of Address) to gain verified status.
*   **Campaign Management**: Edit rejected campaigns for resubmission; view status of pending verifications.

### 💸 Donor Workflow
*   **Campaign Discovery**: Filter campaigns by category or search by keywords.
*   **Secure Donation System**: 
    *   Integrated **Mock Payment Gateway** with realistic credit card validation, processing states, and success animations.
    *   Real-time wallet balance updates.
*   **Donor Verification**: Upload ID to receive a "Verified Donor" badge.

### 🛡️ Admin Dashboard
*   **Platform Analytics**: Visual charts (Bar/Area) displaying platform activity, funds raised vs. goals.
*   **Campaign Moderation**: Review pending campaigns; Approve to make them live or Reject with feedback.
*   **User Verification Center**: Review submitted KYC documents (ID, Address proofs) and Approve/Reject user identities.

### 📈 Campaign Details & Analytics
*   **Real-time Progress**: Dynamic progress bars and raised amounts.
*   **Growth Charts**: Area charts visualizing donation history over time.
*   **Recent Activity**: List of recent donors and amounts.
*   **Trust Indicators**: Visible badges for verified organizers and campaigns.

## 🛠️ Tech Stack

This project is built using modern frontend technologies:

*   **Framework**: [React 19](https://react.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN for portability)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Data Visualization**: [Recharts](https://recharts.org/)
*   **Build/Runtime**: ES Modules (ESM) via browser-native support (no complex bundler required for this specific demo setup).

## 📂 Architecture

*   **`services/mockService.ts`**: The core "backend" of the application. It manages `localStorage` to persist Users, Campaigns, Donations, and Transactions, simulating a database.
*   **`types.ts`**: Shared TypeScript interfaces ensuring strict typing across the app.
*   **`pages/`**: Contains the main views (Dashboards, Landing Page, Campaign Details).
*   **`components/`**: Reusable UI components (PaymentGatewayModal, CampaignCard, Layout, etc.).

## 🚀 Getting Started

### Prerequisites
*   Node.js (for running a local server) or any static file server.

### Installation

1.  **Clone the repository**
2.  **Install dependencies** (if using a bundler setup, otherwise skip):
    ```bash
    npm install
    ```
3.  **Run the Application**:
    Since this project uses ES Modules and `importmap`, it requires a local server to run correctly (to avoid CORS issues with file:// protocol).
    
    Using `serve`:
    ```bash
    npx serve .
    ```
    
    Or using Python:
    ```bash
    python3 -m http.server 8000
    ```

4.  **Open in Browser**: Navigate to `http://localhost:8000` (or the port shown in your terminal).

## 🧪 Demo Accounts

You can use the "Demo Access" buttons on the login screen, or use these credentials:

| Role | Email | Password | Status |
|------|-------|----------|--------|
| **Admin** | `admin@uniaid.com` | `password` | Verified |
| **Fundraiser** | `john@fund.com` | `password` | Verified |
| **Donor** | `alice@donate.com` | `password` | Unverified |

## 💳 Payment Simulation

To test the payment gateway:
1.  Login as a **Donor**.
2.  Select an **Active** campaign.
3.  Click "Donate Now".
4.  Enter valid mock card details:
    *   **Card Number**: 16 digits (e.g., 4242 4242 4242 4242)
    *   **Expiry**: Future date (e.g., 12/28)
    *   **CVV**: 3 digits
5.  Watch the transaction process and your wallet balance update.
