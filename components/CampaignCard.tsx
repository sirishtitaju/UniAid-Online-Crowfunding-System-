
import React from 'react';
import { Campaign, CampaignStatus, UserRole } from '../types';
import { CheckCircle, XCircle, Clock, DollarSign, AlertCircle, Eye } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
  userRole?: UserRole; // Optional, user might not be logged in
  onAction?: (action: 'DONATE' | 'APPROVE' | 'REJECT' | 'EDIT') => void;
  onViewDetails?: () => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, userRole, onAction, onViewDetails }) => {
  const percent = Math.min(100, Math.round((campaign.raisedAmount / campaign.goalAmount) * 100));
  
  const getStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.ACTIVE:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Verified & Active</span>;
      case CampaignStatus.PENDING:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending Verification</span>;
      case CampaignStatus.REJECTED:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Rejected</span>;
      case CampaignStatus.COMPLETED:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" /> Completed</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-slate-200 group">
      <div 
        className="relative h-48 cursor-pointer overflow-hidden"
        onClick={onViewDetails}
      >
        <img 
            src={campaign.image} 
            alt={campaign.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
        <div className="absolute top-2 right-2">
            {getStatusBadge(campaign.status)}
        </div>
        <div className="absolute bottom-2 left-2">
            <span className="inline-block px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-md">
                {campaign.category}
            </span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div 
            className="flex justify-between items-start mb-2 cursor-pointer"
            onClick={onViewDetails}
        >
             <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">{campaign.title}</h3>
        </div>
        
        <p className="text-sm text-slate-500 mb-1">by <span className="font-semibold">{campaign.fundraiserName}</span></p>
        <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow">{campaign.description}</p>
        
        <div className="mt-auto space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1 font-medium">
              <span className="text-slate-500">Raised: ${campaign.raisedAmount.toLocaleString()}</span>
              <span className="text-slate-800">Goal: ${campaign.goalAmount.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${campaign.status === CampaignStatus.COMPLETED ? 'bg-blue-600' : 'bg-emerald-500'}`} 
                style={{ width: `${percent}%` }}
              ></div>
            </div>
            <div className="text-right text-xs text-slate-500 mt-1">{percent}% Funded</div>
          </div>

          {/* Action Buttons based on Role & Status */}
          <div className="flex gap-2 pt-2 border-t border-slate-100">
            {/* If no role (public) or generic view, show View Details primarily */}
            <button 
                onClick={onViewDetails}
                className="flex-1 flex justify-center items-center py-2 px-4 border border-slate-200 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
            >
                <Eye className="w-4 h-4 mr-1" /> View
            </button>

            {userRole === UserRole.DONOR && campaign.status === CampaignStatus.ACTIVE && (
              <button 
                onClick={() => onAction && onAction('DONATE')}
                className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
              >
                <DollarSign className="w-4 h-4 mr-1" /> Donate
              </button>
            )}

            {userRole === UserRole.ADMIN && campaign.status === CampaignStatus.PENDING && (
              <>
                 <button 
                  onClick={() => onAction && onAction('APPROVE')}
                  className="flex-1 flex justify-center items-center py-2 px-2 rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle className="w-4 h-4 mr-1" /> Verify
                </button>
                <button 
                  onClick={() => onAction && onAction('REJECT')}
                  className="flex-1 flex justify-center items-center py-2 px-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  <XCircle className="w-4 h-4 mr-1" /> Reject
                </button>
              </>
            )}

            {userRole === UserRole.FUNDRAISER && campaign.status === CampaignStatus.REJECTED && (
               <button 
               onClick={() => onAction && onAction('EDIT')}
               className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
             >
               <AlertCircle className="w-4 h-4 mr-1" /> Edit
             </button>
            )}
            
            {campaign.status === CampaignStatus.COMPLETED && (
                 <div className="w-full text-center py-2 text-sm font-medium text-blue-800 bg-blue-50 rounded-md">
                     Funds Transferred
                 </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
