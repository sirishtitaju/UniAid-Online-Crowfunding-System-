
import React, { useState, useEffect } from 'react';
import { User, Campaign, CampaignStatus, UserRole, VerificationStatus, VerificationDocuments } from '../types';
import { mockService } from '../services/mockService';
import { CampaignCard } from '../components/CampaignCard';
import { PaymentGatewayModal } from '../components/PaymentGatewayModal';
import { X, Search, CheckCircle, Shield, Lock } from 'lucide-react';

interface Props {
  user: User;
  onRefreshUser: () => void;
  onViewCampaign: (id: string) => void;
}

export const DonorDashboard: React.FC<Props> = ({ user, onRefreshUser, onViewCampaign }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [filter, setFilter] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [govId, setGovId] = useState<string | null>(null);
  
  // Payment Gateway State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingPaymentAmount, setPendingPaymentAmount] = useState(0);

  useEffect(() => {
    loadCampaigns();
  }, [user]);

  const loadCampaigns = () => {
    // Donors only see Active or Completed campaigns
    const all = mockService.getCampaigns();
    setCampaigns(all.filter(c => c.status === CampaignStatus.ACTIVE || c.status === CampaignStatus.COMPLETED));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setGovId(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  }

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!govId) return alert("Please upload your Government ID");

    setIsVerifying(true);
    setTimeout(() => {
        const docs: VerificationDocuments = {
            governmentId: govId,
            submittedAt: new Date().toISOString()
        };
        mockService.requestUserVerification(user.id, docs);
        setIsVerifying(false);
        setIsVerificationModalOpen(false);
        onRefreshUser();
    }, 1500);
  };

  const initiateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    const amount = parseFloat(donationAmount);
    if (!amount || amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }
    
    if (amount > user.walletBalance) {
        alert("Insufficient wallet balance for this transaction!");
        return;
    }
    
    setPendingPaymentAmount(amount);
    setShowPaymentModal(true); // Open Payment Gateway
  };

  const handlePaymentSuccess = () => {
      if (!selectedCampaign) return;
      try {
          mockService.processDonation(user, selectedCampaign.id, pendingPaymentAmount);
          // Success alert handled by modal visuals, but we reset UI here
          setSelectedCampaign(null);
          setDonationAmount('');
          loadCampaigns();
          onRefreshUser(); 
      } catch (err: any) {
          alert("Transaction Failed: " + err.message);
      }
  }

  const filteredCampaigns = campaigns.filter(c => 
    c.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="bg-emerald-900 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Make a Difference Today</h1>
                    <p className="text-emerald-100 max-w-xl">Browse verified campaigns and support causes that matter.</p>
                </div>
                
                {/* Donor Verification Badge / Action */}
                <div className="bg-emerald-800/50 backdrop-blur-sm p-3 rounded-lg border border-emerald-600/30">
                     {user.verificationStatus === VerificationStatus.VERIFIED ? (
                         <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                             <CheckCircle className="w-5 h-5" /> Verified Donor
                         </div>
                     ) : user.verificationStatus === VerificationStatus.PENDING ? (
                         <span className="text-emerald-200 text-sm">Verification Pending...</span>
                     ) : (
                         <button 
                             onClick={() => setIsVerificationModalOpen(true)}
                             className="flex items-center gap-2 text-sm bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1.5 rounded transition-colors"
                         >
                             <Shield className="w-4 h-4" /> 
                             Get Verified Badge
                         </button>
                     )}
                </div>
            </div>
            
            <div className="relative max-w-md mt-6">
                <Search className="absolute left-3 top-3 h-5 w-5 text-emerald-700" />
                <input 
                    type="text"
                    placeholder="Search campaigns..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-emerald-400"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
        </div>
        {/* Decorative circle */}
        <div className="absolute -right-10 -bottom-20 w-64 h-64 rounded-full bg-emerald-800 opacity-50"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.length === 0 ? (
            <div className="col-span-full text-center py-12">
                <p className="text-slate-500 text-lg">No active campaigns found matching your search.</p>
            </div>
        ) : (
            filteredCampaigns.map(c => (
                <CampaignCard 
                    key={c.id} 
                    campaign={c} 
                    userRole={UserRole.DONOR}
                    onAction={(action) => {
                        if (action === 'DONATE') setSelectedCampaign(c);
                    }}
                    onViewDetails={() => onViewCampaign(c.id)}
                />
            ))
        )}
      </div>

      {/* Donation Input Modal */}
      {selectedCampaign && !showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-xl font-bold text-slate-800">Donate to Campaign</h3>
                <button onClick={() => setSelectedCampaign(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-6 w-6"/>
                </button>
            </div>
            
            <div className="mb-4">
                <p className="text-sm text-slate-500">You are donating to:</p>
                <p className="font-semibold text-emerald-800 text-lg">{selectedCampaign.title}</p>
            </div>

            <form onSubmit={initiateDonation}>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount to Donate ($)</label>
                <input
                  type="number"
                  min="1"
                  max={user.walletBalance}
                  autoFocus
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-mono mb-2"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="0.00"
                />
                <p className="text-xs text-slate-500 mb-6">Available Wallet Balance: ${user.walletBalance.toLocaleString()}</p>
                
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                  Proceed to Payment
                </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      {selectedCampaign && (
          <PaymentGatewayModal 
             isOpen={showPaymentModal}
             onClose={() => setShowPaymentModal(false)}
             onSuccess={handlePaymentSuccess}
             amount={pendingPaymentAmount}
             campaignTitle={selectedCampaign.title}
          />
      )}

      {/* Donor Verification Modal */}
      {isVerificationModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
               <div className="bg-white rounded-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
                    <button onClick={() => setIsVerificationModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="h-6 w-6" /></button>
                    <h2 className="text-xl font-bold mb-1 flex items-center gap-2"><Lock className="w-5 h-5 text-emerald-600"/> Donor Verification</h2>
                    <p className="text-slate-500 text-sm mb-6">Upload your ID to get the "Verified Donor" badge.</p>

                    <form onSubmit={handleSubmitVerification} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Government Issued ID</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                                <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"/>
                                {govId && <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> File Selected</p>}
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isVerifying}
                            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition disabled:opacity-50"
                        >
                            {isVerifying ? 'Submitting...' : 'Verify Now'}
                        </button>
                    </form>
               </div>
          </div>
      )}
    </div>
  );
};
