
import React, { useState, useEffect } from 'react';
import { User, Campaign, CampaignStatus, UserRole, CampaignCategory, VerificationStatus, VerificationDocuments } from '../types';
import { mockService } from '../services/mockService';
import { CampaignCard } from '../components/CampaignCard';
import { Plus, X, Upload, ShieldAlert, CheckCircle, Clock, FileText, Lock } from 'lucide-react';

interface Props {
  user: User;
  onViewCampaign: (id: string) => void;
}

export const FundraiserDashboard: React.FC<Props> = ({ user, onViewCampaign }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Verification Form State
  const [verificationDocs, setVerificationDocs] = useState<{
      govId: string | null;
      proofOfAddress: string | null;
      orgDoc: string | null;
  }>({ govId: null, proofOfAddress: null, orgDoc: null });

  // Campaign Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalAmount: '',
    category: CampaignCategory.OTHER,
    beneficiary: '',
    deadline: ''
  });

  useEffect(() => {
    loadCampaigns();
  }, [user]);

  const loadCampaigns = () => {
    const all = mockService.getCampaigns();
    setCampaigns(all.filter(c => c.fundraiserId === user.id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'govId' | 'proofOfAddress' | 'orgDoc') => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setVerificationDocs(prev => ({...prev, [type]: reader.result as string}));
          };
          reader.readAsDataURL(file);
      }
  }

  const handleSubmitVerification = (e: React.FormEvent) => {
      e.preventDefault();
      if (!verificationDocs.govId || !verificationDocs.proofOfAddress || !verificationDocs.orgDoc) {
          alert("All verification documents are required.");
          return;
      }
      
      setIsVerifying(true);
      setTimeout(() => {
          const docs: VerificationDocuments = {
              governmentId: verificationDocs.govId!,
              proofOfAddress: verificationDocs.proofOfAddress!,
              orgRegistration: verificationDocs.orgDoc!,
              submittedAt: new Date().toISOString()
          };
          mockService.requestUserVerification(user.id, docs);
          setIsVerifying(false);
          setIsVerificationModalOpen(false);
          window.location.reload(); 
      }, 2000);
  }

  const handleCampaignImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const goal = parseFloat(formData.goalAmount);
    if (!goal || goal <= 0) return alert("Please enter a valid amount");
    if (!formData.deadline) return alert("Please select a deadline");

    try {
        if (editingId) {
            const updates: Partial<Campaign> = {
                title: formData.title,
                description: formData.description,
                goalAmount: goal,
                category: formData.category,
                beneficiary: formData.beneficiary,
                deadline: formData.deadline
            };
            if (imagePreview) {
                updates.image = imagePreview;
            }

            mockService.updateCampaign(editingId, updates);
            setEditingId(null);
        } else {
            mockService.createCampaign(
                user, 
                formData.title, 
                formData.description, 
                goal, 
                formData.category,
                formData.beneficiary,
                formData.deadline,
                imagePreview || undefined
            );
        }

        setIsModalOpen(false);
        resetCampaignForm();
        loadCampaigns();
    } catch (e: any) {
        alert(e.message);
    }
  };

  const resetCampaignForm = () => {
      setFormData({ 
          title: '', description: '', goalAmount: '', 
          category: CampaignCategory.OTHER, beneficiary: '', deadline: '' 
      });
      setImagePreview(null);
  }

  const handleEdit = (campaign: Campaign) => {
      setEditingId(campaign.id);
      setFormData({
          title: campaign.title,
          description: campaign.description,
          goalAmount: campaign.goalAmount.toString(),
          category: campaign.category,
          beneficiary: campaign.beneficiary,
          deadline: campaign.deadline.split('T')[0] // Format for input date
      });
      setImagePreview(campaign.image);
      setIsModalOpen(true);
  }

  return (
    <div className="space-y-6">
      
      {/* Verification Status Banner */}
      {user.verificationStatus === VerificationStatus.NONE && (
          <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                      <ShieldAlert className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                      <h3 className="font-bold text-orange-800 text-lg">Identity Verification Required</h3>
                      <p className="text-orange-700 text-sm">To ensure trust and safety, you must upload identification and organizational documents before creating campaigns.</p>
                  </div>
              </div>
              <button 
                onClick={() => setIsVerificationModalOpen(true)}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition whitespace-nowrap"
              >
                  Verify Identity Now
              </button>
          </div>
      )}

      {user.verificationStatus === VerificationStatus.PENDING && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-center gap-3">
               <Clock className="h-5 w-5 text-blue-600" />
               <div>
                   <h3 className="font-bold text-blue-800 text-sm">Verification in Progress</h3>
                   <p className="text-blue-700 text-xs">Admin is reviewing your submitted documents (ID, Address, Org Details). You will be notified once approved.</p>
               </div>
          </div>
      )}

      {user.verificationStatus === VerificationStatus.REJECTED && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center gap-3">
               <ShieldAlert className="h-5 w-5 text-red-600" />
               <div>
                   <h3 className="font-bold text-red-800 text-sm">Verification Rejected</h3>
                   <p className="text-red-700 text-xs">Your documents were not accepted. Please contact support or re-submit.</p>
                   <button onClick={() => setIsVerificationModalOpen(true)} className="text-red-700 underline text-xs mt-1">Re-submit Documents</button>
               </div>
          </div>
      )}

      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              My Campaigns
              {user.verificationStatus === VerificationStatus.VERIFIED && (
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3"/> Verified Fundraiser
                  </span>
              )}
          </h1>
          <p className="text-slate-500">Manage your fundraising activities</p>
        </div>
        <button
          onClick={() => {
              if (user.verificationStatus !== VerificationStatus.VERIFIED) {
                  alert("You must be a verified fundraiser to create a campaign.");
                  return;
              }
              setEditingId(null);
              resetCampaignForm();
              setIsModalOpen(true);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white ${user.verificationStatus === VerificationStatus.VERIFIED ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-300 cursor-not-allowed'}`}
        >
          <Plus className="h-5 w-5" />
          Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
            <p className="text-slate-500">You haven't created any campaigns yet.</p>
          </div>
        ) : (
          campaigns.map(c => (
            <CampaignCard 
                key={c.id} 
                campaign={c} 
                userRole={UserRole.FUNDRAISER}
                onAction={(action) => {
                    if (action === 'EDIT') handleEdit(c);
                }} 
                onViewDetails={() => onViewCampaign(c.id)}
            />
          ))
        )}
      </div>

      {/* Verification Modal */}
      {isVerificationModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
               <div className="bg-white rounded-xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                    <button onClick={() => setIsVerificationModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="h-6 w-6" /></button>
                    <h2 className="text-xl font-bold mb-1 flex items-center gap-2"><Lock className="w-5 h-5 text-emerald-600"/> Secure Verification</h2>
                    <p className="text-slate-500 text-sm mb-6">Upload official documents to verify your fundraising eligibility.</p>

                    <form onSubmit={handleSubmitVerification} className="space-y-6">
                        
                        {/* Gov ID */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">1. Government Issued ID (Required)</label>
                            <p className="text-xs text-slate-500 mb-2">Passport, Driver's License, or National ID</p>
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                                <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'govId')} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"/>
                                {verificationDocs.govId && <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> File Selected</p>}
                            </div>
                        </div>

                        {/* Proof of Address */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">2. Proof of Address (Required)</label>
                            <p className="text-xs text-slate-500 mb-2">Utility Bill, Bank Statement (last 3 months)</p>
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                                <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'proofOfAddress')} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"/>
                                {verificationDocs.proofOfAddress && <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> File Selected</p>}
                            </div>
                        </div>

                        {/* Org Doc */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">3. Fundraising Documents (Required)</label>
                            <p className="text-xs text-slate-500 mb-2">Project Plan, Medical Report, or NGO Registration</p>
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                                <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'orgDoc')} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"/>
                                {verificationDocs.orgDoc && <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> File Selected</p>}
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-3 rounded text-xs text-yellow-800 flex gap-2">
                            <Lock className="w-4 h-4 flex-shrink-0"/>
                            Your documents are encrypted and only visible to our verification team.
                        </div>

                        <button 
                            type="submit" 
                            disabled={isVerifying}
                            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition disabled:opacity-50"
                        >
                            {isVerifying ? 'Uploading & Submitting...' : 'Submit Documents'}
                        </button>
                    </form>
               </div>
          </div>
      )}

      {/* Campaign Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-6 w-6" />
            </button>
            
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Campaign' : 'Create New Campaign'}</h2>
            
            <form onSubmit={handleSubmitCampaign} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Campaign Image</label>
                
                {imagePreview ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-200 mb-2 group">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                                type="button"
                                onClick={() => setImagePreview(null)}
                                className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-red-600 transition-colors"
                            >
                                Remove & Change
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-slate-400" />
                                <p className="text-sm text-slate-500"><span className="font-semibold">Click to upload</span></p>
                                <p className="text-xs text-slate-400">PNG, JPG or GIF</p>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleCampaignImageChange} />
                        </label>
                    </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Title</label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select
                      className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as CampaignCategory})}
                    >
                        {Object.values(CampaignCategory).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                  </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  rows={4}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Explain why you are raising funds..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Beneficiary Name</label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={formData.beneficiary}
                      onChange={(e) => setFormData({...formData, beneficiary: e.target.value})}
                      placeholder="Who receives funds?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Goal Amount ($)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={formData.goalAmount}
                      onChange={(e) => setFormData({...formData, goalAmount: e.target.value})}
                    />
                  </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Deadline</label>
                 <input
                    type="date"
                    required
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.deadline}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                 />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  {editingId ? 'Resubmit for Verification' : 'Submit for Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
