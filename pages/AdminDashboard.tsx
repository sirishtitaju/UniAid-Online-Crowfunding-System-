
import React, { useState, useEffect } from 'react';
import { User, Campaign, CampaignStatus, UserRole, VerificationStatus } from '../types';
import { mockService } from '../services/mockService';
import { CampaignCard } from '../components/CampaignCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ShieldCheck, Activity, Users, UserCheck, CheckCircle, FileText, X } from 'lucide-react';

interface Props {
  user: User;
  onViewCampaign: (id: string) => void;
}

export const AdminDashboard: React.FC<Props> = ({ onViewCampaign }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'USERS'>('CAMPAIGNS');
  const [viewingUserDocs, setViewingUserDocs] = useState<User | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setCampaigns(mockService.getCampaigns());
    setUsers(mockService.getUsers());
  };

  const handleCampaignVerification = (id: string, approve: boolean) => {
    mockService.updateCampaign(id, {
      status: approve ? CampaignStatus.ACTIVE : CampaignStatus.REJECTED
    });
    loadData();
  };

  const handleUserVerification = (id: string, approve: boolean) => {
      mockService.evaluateUserVerification(id, approve);
      setViewingUserDocs(null); // Close modal if open
      loadData();
  }

  const pendingCampaigns = campaigns.filter(c => c.status === CampaignStatus.PENDING);
  const activeCampaigns = campaigns.filter(c => c.status !== CampaignStatus.PENDING);
  const pendingUsers = users.filter(u => u.verificationStatus === VerificationStatus.PENDING);

  // Prepare chart data
  const chartData = campaigns.map(c => ({
    name: c.title.substring(0, 10) + '...',
    Raised: c.raisedAmount,
    Goal: c.goalAmount
  }));

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
          <button 
              onClick={() => setActiveTab('CAMPAIGNS')}
              className={`pb-4 px-4 font-semibold ${activeTab === 'CAMPAIGNS' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
              Campaigns
          </button>
          <button 
              onClick={() => setActiveTab('USERS')}
              className={`pb-4 px-4 font-semibold flex items-center gap-2 ${activeTab === 'USERS' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
              User Verifications
              {pendingUsers.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingUsers.length}</span>}
          </button>
      </div>

      {activeTab === 'CAMPAIGNS' && (
        <div className="space-y-8 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <ShieldCheck className="text-emerald-600"/> Pending Campaign Approvals
                    </h3>
                    {pendingCampaigns.length === 0 ? (
                        <p className="text-slate-500 italic">No campaigns waiting for verification.</p>
                    ) : (
                        <div className="space-y-4">
                            {pendingCampaigns.map(c => (
                                <div key={c.id} className="border border-slate-200 rounded p-4 flex justify-between items-center bg-slate-50">
                                    <div>
                                        <div 
                                            className="font-semibold cursor-pointer hover:text-emerald-600"
                                            onClick={() => onViewCampaign(c.id)}
                                        >
                                            {c.title}
                                        </div>
                                        <div className="text-sm text-slate-500">by {c.fundraiserName} • Goal: ${c.goalAmount}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleCampaignVerification(c.id, true)}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleCampaignVerification(c.id, false)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-80">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Activity className="text-blue-600"/> Platform Activity
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Goal" fill="#94a3b8" />
                        <Bar dataKey="Raised" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">All Campaigns Monitor</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeCampaigns.map(c => (
                        <CampaignCard 
                            key={c.id} 
                            campaign={c} 
                            userRole={UserRole.ADMIN} 
                            onViewDetails={() => onViewCampaign(c.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
      )}

      {activeTab === 'USERS' && (
           <div className="space-y-6 animate-in fade-in">
               <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Users className="text-blue-600"/> Pending Identity Verifications
                    </h3>
                    {pendingUsers.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50 rounded border border-dashed border-slate-200">
                             <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-2"/>
                             <p className="text-slate-500">No users currently awaiting verification.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pendingUsers.map(u => (
                                <div key={u.id} className="border border-slate-200 rounded-lg p-4 flex flex-col justify-between bg-white shadow-sm">
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-slate-800">{u.name}</h4>
                                            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono">{u.role}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-1">{u.email}</p>
                                        <div className="text-xs bg-yellow-50 text-yellow-800 p-2 rounded mt-2 border border-yellow-100">
                                            ⚠️ Documents Submitted
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setViewingUserDocs(u)}
                                        className="w-full mb-2 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded text-sm font-semibold flex items-center justify-center gap-2"
                                    >
                                        <FileText className="w-4 h-4"/> View Documents
                                    </button>
                                    <div className="flex gap-2 mt-2">
                                        <button 
                                            onClick={() => handleUserVerification(u.id, true)}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-sm font-semibold"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleUserVerification(u.id, false)}
                                            className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2 rounded text-sm font-semibold"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
               </div>

               <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                   <h3 className="text-lg font-bold text-slate-800 mb-4">Verified Users Directory</h3>
                   <div className="overflow-x-auto">
                       <table className="w-full text-sm text-left text-slate-500">
                           <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                               <tr>
                                   <th className="px-6 py-3">Name</th>
                                   <th className="px-6 py-3">Role</th>
                                   <th className="px-6 py-3">Email</th>
                                   <th className="px-6 py-3">Status</th>
                               </tr>
                           </thead>
                           <tbody>
                               {users.filter(u => u.verificationStatus === VerificationStatus.VERIFIED).map(u => (
                                   <tr key={u.id} className="bg-white border-b hover:bg-slate-50">
                                       <td className="px-6 py-4 font-medium text-slate-900">{u.name}</td>
                                       <td className="px-6 py-4">{u.role}</td>
                                       <td className="px-6 py-4">{u.email}</td>
                                       <td className="px-6 py-4 text-emerald-600 flex items-center gap-1">
                                           <CheckCircle className="w-4 h-4" /> Verified
                                       </td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>
               </div>
           </div>
      )}

      {/* Document Viewer Modal */}
      {viewingUserDocs && viewingUserDocs.verificationDocuments && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
               <div className="bg-white rounded-xl max-w-4xl w-full p-6 relative animate-in fade-in zoom-in duration-200 max-h-[95vh] overflow-y-auto">
                    <button onClick={() => setViewingUserDocs(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="h-6 w-6"/></button>
                    <h2 className="text-xl font-bold mb-1">Reviewing Documents</h2>
                    <p className="text-slate-500 mb-6">User: <span className="font-semibold text-slate-800">{viewingUserDocs.name}</span> ({viewingUserDocs.role})</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                             <h4 className="font-semibold text-slate-700 border-b pb-1">Government ID</h4>
                             <div className="bg-slate-100 rounded-lg p-2 border border-slate-200">
                                 <img src={viewingUserDocs.verificationDocuments.governmentId} alt="ID" className="w-full h-auto rounded shadow-sm" />
                             </div>
                        </div>

                        {viewingUserDocs.verificationDocuments.proofOfAddress && (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-slate-700 border-b pb-1">Proof of Address</h4>
                                <div className="bg-slate-100 rounded-lg p-2 border border-slate-200">
                                    <img src={viewingUserDocs.verificationDocuments.proofOfAddress} alt="Address" className="w-full h-auto rounded shadow-sm" />
                                </div>
                            </div>
                        )}

                        {viewingUserDocs.verificationDocuments.orgRegistration && (
                            <div className="space-y-2 md:col-span-2">
                                <h4 className="font-semibold text-slate-700 border-b pb-1">Organization / Project Document</h4>
                                <div className="bg-slate-100 rounded-lg p-2 border border-slate-200">
                                    <img src={viewingUserDocs.verificationDocuments.orgRegistration} alt="Org Doc" className="w-full h-auto rounded shadow-sm" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end gap-4 border-t pt-4">
                        <button 
                            onClick={() => handleUserVerification(viewingUserDocs.id, false)}
                            className="px-6 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-bold"
                        >
                            Reject User
                        </button>
                        <button 
                            onClick={() => handleUserVerification(viewingUserDocs.id, true)}
                            className="px-6 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-bold shadow-lg shadow-emerald-200"
                        >
                            Approve Verified Status
                        </button>
                    </div>
               </div>
          </div>
      )}
    </div>
  );
};
