
import React, { useEffect, useState } from 'react';
import { Campaign, Donation, User, UserRole, CampaignStatus } from '../types';
import { mockService } from '../services/mockService';
import { PaymentGatewayModal } from '../components/PaymentGatewayModal';
import { ArrowLeft, Calendar, Tag, User as UserIcon, DollarSign, Clock, CheckCircle, AlertTriangle, ShieldCheck, FileText, X, ExternalLink } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  campaignId: string;
  user: User | null;
  onBack: () => void;
  onDonate?: () => void;
  onRefreshUser?: () => void; 
}

export const CampaignDetails: React.FC<Props> = ({ campaignId, user, onBack, onRefreshUser }) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState('');
  const [fundraiserUser, setFundraiserUser] = useState<User | undefined>(undefined);
  const [showDocsModal, setShowDocsModal] = useState(false);
  
  // Payment State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingAmount, setPendingAmount] = useState(0);

  useEffect(() => {
    loadData();
  }, [campaignId]);

  const loadData = () => {
    const c = mockService.getCampaignById(campaignId);
    if (c) {
      setCampaign(c);
      setDonations(mockService.getDonationsByCampaign(c.id));
      const u = mockService.getUsers().find(u => u.id === c.fundraiserId);
      setFundraiserUser(u);
    }
    setLoading(false);
  };

  const handleQuickDonate = () => {
    if (!user) {
        alert("Please sign in to donate.");
        return;
    }
    if (user.role !== UserRole.DONOR) {
        alert("Only donors can make donations.");
        return;
    }
    
    const amount = parseFloat(donationAmount);
    if (!amount || amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    if (amount > user.walletBalance) {
        alert("Insufficient wallet balance for this transaction!");
        return;
    }

    setPendingAmount(amount);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
      if(!campaign || !user) return;
      try {
        mockService.processDonation(user, campaignId, pendingAmount);
        setDonationAmount('');
        
        // Refresh local data
        loadData();
        
        // Refresh global user state (wallet balance)
        if (onRefreshUser) onRefreshUser();

      } catch (e: any) {
          alert(e.message);
      }
  };

  const handleAdminVerify = (approve: boolean) => {
      if(!campaign) return;
      mockService.updateCampaign(campaign.id, {
          status: approve ? CampaignStatus.ACTIVE : CampaignStatus.REJECTED
      });
      loadData();
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!campaign) return <div className="p-8 text-center">Campaign not found</div>;

  const percent = Math.min(100, Math.round((campaign.raisedAmount / campaign.goalAmount) * 100));
  const daysLeft = Math.ceil((new Date(campaign.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  // Prepare Chart Data
  // Aggregate donations by date
  const chartDataMap: Record<string, number> = {};
  // Start with 0
  chartDataMap[campaign.createdAt.split('T')[0]] = 0;
  
  let runningTotal = 0;
  // Sort donations chronologically for the chart
  const sortedDonations = [...donations].sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  sortedDonations.forEach(d => {
      const date = d.timestamp.split('T')[0];
      runningTotal += d.amount;
      chartDataMap[date] = runningTotal;
  });
  
  // Fill today if empty
  const today = new Date().toISOString().split('T')[0];
  if(!chartDataMap[today]) chartDataMap[today] = runningTotal;

  const chartData = Object.keys(chartDataMap).map(date => ({
      date,
      amount: chartDataMap[date]
  })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Navigation */}
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-emerald-600 transition-colors mb-4">
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to campaigns
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-video shadow-md">
                <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                     <span className="px-3 py-1 bg-white/90 backdrop-blur text-emerald-800 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm flex items-center gap-2">
                        <Tag className="w-3 h-3"/> {campaign.category}
                     </span>
                </div>
            </div>

            {/* Title and Fundraiser */}
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{campaign.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm">
                    <div className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        <span>Organized by <span className="text-slate-800 font-medium">{campaign.fundraiserName}</span></span>
                        {/* Fundraiser Verification Badge */}
                        {fundraiserUser?.verificationStatus === 'VERIFIED' && (
                             <span className="ml-1 inline-flex items-center text-emerald-600" title="Verified Fundraiser Identity">
                                 <CheckCircle className="w-4 h-4 fill-emerald-100" />
                             </span>
                        )}
                    </div>
                    <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Created {new Date(campaign.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">About the Campaign</h3>
                <div className="prose text-slate-600 max-w-none">
                    <p className="whitespace-pre-line leading-relaxed">{campaign.description}</p>
                </div>
                
                <div className="mt-6 bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-800 text-sm mb-2">Beneficiary Information</h4>
                    <p className="text-slate-600 text-sm">This campaign funds are designated for: <span className="font-medium">{campaign.beneficiary}</span></p>
                </div>
            </div>

            {/* Analytics Graph */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="text-xl font-bold text-slate-800 mb-4">Donation Growth</h3>
                 <div className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="date" hide />
                            <YAxis />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                formatter={(value: number) => [`$${value}`, 'Raised']}
                            />
                            <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={3} />
                        </AreaChart>
                     </ResponsiveContainer>
                 </div>
            </div>
            
            {/* Recent Donations List */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Donations ({donations.length})</h3>
                 <div className="space-y-4">
                     {donations.length === 0 ? (
                         <p className="text-slate-500 italic">No donations yet. Be the first!</p>
                     ) : (
                         donations.slice(0, 5).map(d => (
                             <div key={d.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                 <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                                         {d.donorName.charAt(0)}
                                     </div>
                                     <div>
                                         <p className="font-semibold text-slate-800 flex items-center gap-1">
                                             {d.donorName}
                                             {d.donorVerified && (
                                                <span title="Verified Donor">
                                                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                                                </span>
                                             )}
                                         </p>
                                         <p className="text-xs text-slate-400">{new Date(d.timestamp).toLocaleString()}</p>
                                     </div>
                                 </div>
                                 <span className="font-bold text-emerald-600">+${d.amount}</span>
                             </div>
                         ))
                     )}
                 </div>
            </div>
        </div>

        {/* Right Column: Sticky Stats & Action */}
        <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
                
                {/* Stats Card */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                        <div className="h-full bg-emerald-500 transition-all duration-1000" style={{width: `${percent}%`}}></div>
                    </div>
                    
                    <div className="pt-4 space-y-4">
                        <div>
                            <span className="text-4xl font-extrabold text-slate-900">${campaign.raisedAmount.toLocaleString()}</span>
                            <span className="text-slate-500 text-sm ml-2">raised of ${campaign.goalAmount.toLocaleString()}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-2">
                             <div className="bg-slate-50 p-3 rounded-lg text-center">
                                 <div className="text-xl font-bold text-slate-800">{donations.length}</div>
                                 <div className="text-xs text-slate-500">Donors</div>
                             </div>
                             <div className="bg-slate-50 p-3 rounded-lg text-center">
                                 <div className="text-xl font-bold text-slate-800">{daysLeft > 0 ? daysLeft : 0}</div>
                                 <div className="text-xs text-slate-500">Days Left</div>
                             </div>
                        </div>

                        {/* Logic for different user roles */}
                        {user?.role === UserRole.ADMIN && campaign.status === CampaignStatus.PENDING && (
                            <div className="space-y-2 pt-4">
                                <button onClick={() => handleAdminVerify(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg flex justify-center gap-2">
                                    <ShieldCheck className="w-5 h-5"/> Verify Campaign
                                </button>
                                <button onClick={() => handleAdminVerify(false)} className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 rounded-lg">
                                    Reject
                                </button>
                            </div>
                        )}

                        {(!user || user.role === UserRole.DONOR) && campaign.status === CampaignStatus.ACTIVE && (
                            <div className="pt-4 border-t border-slate-100">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Enter Amount ($)</label>
                                <div className="flex gap-2 mb-3">
                                    {[10, 50, 100].map(amt => (
                                        <button 
                                            key={amt}
                                            onClick={() => setDonationAmount(amt.toString())}
                                            className="flex-1 py-1 text-sm border border-slate-300 rounded hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                                        >
                                            ${amt}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative mb-3">
                                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-slate-400"/>
                                    <input 
                                        type="number" 
                                        value={donationAmount}
                                        onChange={(e) => setDonationAmount(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-bold text-slate-700"
                                        placeholder="Other amount"
                                    />
                                </div>
                                <button 
                                    onClick={handleQuickDonate}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-lg shadow-emerald-200 shadow-lg transition-transform active:scale-95"
                                >
                                    Donate Now
                                </button>
                                {!user && <p className="text-xs text-center mt-2 text-slate-500">You must be logged in to donate.</p>}
                            </div>
                        )}

                        {campaign.status === CampaignStatus.COMPLETED && (
                             <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-center font-medium border border-blue-200">
                                 <CheckCircle className="w-8 h-8 mx-auto mb-2"/>
                                 Campaign Goal Reached!
                                 <div className="text-sm font-normal mt-1">Funds have been transferred to the beneficiary.</div>
                             </div>
                        )}
                    </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-500 flex flex-col gap-2 border border-slate-200">
                     <div className="flex items-start gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <p>Verified Campaign. Your donation is protected by our fraud guarantee policy.</p>
                     </div>
                     {fundraiserUser?.verificationStatus === 'VERIFIED' && (
                         <div className="pt-2 border-t border-slate-200 mt-2 space-y-2">
                             <div className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                <p className="text-blue-800">Identity of the organizer <strong>{campaign.fundraiserName}</strong> has been confirmed by UniAid.</p>
                             </div>
                             
                             {fundraiserUser.verificationDocuments && (
                                <button 
                                    onClick={() => setShowDocsModal(true)}
                                    className="w-full mt-2 flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium py-2 px-4 rounded transition-colors text-xs uppercase tracking-wide"
                                >
                                    <FileText className="w-3 h-3" /> View Verification Proof
                                </button>
                             )}
                         </div>
                     )}
                </div>
            </div>
        </div>
      </div>

      {/* Verification Docs Modal */}
      {showDocsModal && fundraiserUser?.verificationDocuments && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full p-6 relative animate-in fade-in zoom-in duration-200 max-h-[95vh] overflow-y-auto">
                <button onClick={() => setShowDocsModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X className="h-6 w-6"/>
                </button>
                
                <div className="border-b pb-4 mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                        Verified Documents
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        These documents have been verified by UniAid Admin for <span className="font-bold text-slate-800">{fundraiserUser.name}</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-slate-700 border-b pb-1 flex justify-between items-center">
                            Government ID 
                            <span className="text-xs font-normal bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Verified</span>
                        </h4>
                        <div className="bg-slate-100 rounded-lg p-2 border border-slate-200">
                            <img src={fundraiserUser.verificationDocuments.governmentId} alt="Gov ID" className="w-full h-48 object-cover rounded shadow-sm hover:object-contain transition-all bg-white" />
                        </div>
                    </div>

                    {fundraiserUser.verificationDocuments.proofOfAddress && (
                        <div className="space-y-2">
                            <h4 className="font-semibold text-slate-700 border-b pb-1 flex justify-between items-center">
                                Proof of Address
                                <span className="text-xs font-normal bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Verified</span>
                            </h4>
                            <div className="bg-slate-100 rounded-lg p-2 border border-slate-200">
                                <img src={fundraiserUser.verificationDocuments.proofOfAddress} alt="Address" className="w-full h-48 object-cover rounded shadow-sm hover:object-contain transition-all bg-white" />
                            </div>
                        </div>
                    )}

                    {fundraiserUser.verificationDocuments.orgRegistration && (
                        <div className="space-y-2 md:col-span-2">
                            <h4 className="font-semibold text-slate-700 border-b pb-1 flex justify-between items-center">
                                Organization / Project Document
                                <span className="text-xs font-normal bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Verified</span>
                            </h4>
                            <div className="bg-slate-100 rounded-lg p-2 border border-slate-200">
                                <img src={fundraiserUser.verificationDocuments.orgRegistration} alt="Org Doc" className="w-full h-64 object-cover rounded shadow-sm hover:object-contain transition-all bg-white" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-4 border-t text-center">
                     <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                        <ExternalLink className="w-3 h-3"/>
                        Documents were submitted on {new Date(fundraiserUser.verificationDocuments.submittedAt).toLocaleDateString()}
                     </p>
                </div>
            </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      {showPaymentModal && campaign && (
          <PaymentGatewayModal 
             isOpen={showPaymentModal}
             onClose={() => setShowPaymentModal(false)}
             onSuccess={handlePaymentSuccess}
             amount={pendingAmount}
             campaignTitle={campaign.title}
          />
      )}
    </div>
  );
};
