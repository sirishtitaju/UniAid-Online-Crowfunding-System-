
import React, { useEffect, useState } from 'react';
import { mockService } from '../services/mockService';
import { Campaign, CampaignStatus, UserRole, CampaignCategory } from '../types';
import { CampaignCard } from '../components/CampaignCard';
import { Shield, Heart, Users, TrendingUp, ArrowRight, BookOpen, Search, Filter } from 'lucide-react';

interface LandingPageProps {
  onNavigateToAuth: () => void;
  onViewCampaign: (id: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth, onViewCampaign }) => {
  const [allActiveCampaigns, setAllActiveCampaigns] = useState<Campaign[]>([]); // Store all active
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]); // Store filtered
  const [stats, setStats] = useState({ totalRaised: 0, totalCampaigns: 0 });
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const campaigns = mockService.getCampaigns();
    const active = campaigns.filter(c => c.status === CampaignStatus.ACTIVE);
    setAllActiveCampaigns(active);
    setFilteredCampaigns(active); // Initial state
    
    // Calculate simple stats
    const totalRaised = campaigns.reduce((acc, curr) => acc + curr.raisedAmount, 0);
    setStats({
      totalRaised,
      totalCampaigns: campaigns.length
    });
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = allActiveCampaigns;

    if (searchTerm) {
      result = result.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedCategory !== 'All') {
      result = result.filter(c => c.category === selectedCategory);
    }

    setFilteredCampaigns(result);
  }, [searchTerm, selectedCategory, allActiveCampaigns]);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative bg-emerald-900 rounded-3xl overflow-hidden text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 px-8 py-24 md:py-32 max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Empowering Student Dreams <br/>
            <span className="text-emerald-400">One Donation at a Time</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto">
            UniAid connects students, alumni, and donors to fund education, research, and campus initiatives securely and transparently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button 
              onClick={onNavigateToAuth}
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Start Fundraising <ArrowRight className="w-5 h-5"/>
            </button>
            <button 
              onClick={() => {
                 const el = document.getElementById('campaigns-section');
                 el?.scrollIntoView({behavior: 'smooth'});
              }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-8 rounded-full transition-all"
            >
              Donate Now
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <TrendingUp className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-slate-800">${stats.totalRaised.toLocaleString()}</h3>
            <p className="text-slate-500">Total Funds Raised</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <Heart className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-slate-800">{stats.totalCampaigns}</h3>
            <p className="text-slate-500">Campaigns Launched</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <Users className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-slate-800">100%</h3>
            <p className="text-slate-500">Transparent Transfers</p>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section id="campaigns-section">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Featured Campaigns</h2>
                <p className="text-slate-500">Support these verified initiatives needing your help</p>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="flex gap-2 w-full md:w-auto">
               <div className="relative flex-grow md:w-64">
                   <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                   <input 
                       type="text" 
                       placeholder="Search campaigns..." 
                       className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                   />
               </div>
               <div className="relative min-w-[140px]">
                   <Filter className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                   <select 
                       className="w-full pl-9 pr-8 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none bg-white cursor-pointer"
                       value={selectedCategory}
                       onChange={(e) => setSelectedCategory(e.target.value)}
                   >
                       <option value="All">All Types</option>
                       {Object.values(CampaignCategory).map(cat => (
                           <option key={cat} value={cat}>{cat}</option>
                       ))}
                   </select>
                   {/* Dropdown arrow fix */}
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
               </div>
            </div>
        </div>
        
        {filteredCampaigns.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500">No campaigns found matching your criteria.</p>
                {(searchTerm || selectedCategory !== 'All') && (
                    <button 
                        onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                        className="mt-2 text-emerald-600 font-medium hover:underline"
                    >
                        Clear filters
                    </button>
                )}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCampaigns.map(c => (
                    <CampaignCard 
                        key={c.id} 
                        campaign={c} 
                        userRole={UserRole.DONOR} 
                        onAction={() => onViewCampaign(c.id)}
                        onViewDetails={() => onViewCampaign(c.id)}
                    />
                ))}
            </div>
        )}
      </section>

      {/* Info & Policies */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm">
         <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-emerald-600" />
                <h2 className="text-2xl font-bold text-slate-800">Trust & Safety Policies</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
                At UniAid, integrity is our core value. All fundraisers undergo a strict verification process by our administration team before their campaigns go live.
            </p>
            <ul className="space-y-3">
                <li className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-slate-700">Funds are held securely in the system wallet until goals are met.</span>
                </li>
                <li className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-slate-700">Automatic refunds if verification fails post-donation.</span>
                </li>
                <li className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-slate-700">Full transparency on transaction fees (0% platform fee for students).</span>
                </li>
            </ul>
         </div>

         <div className="space-y-6 border-t md:border-t-0 md:border-l border-slate-100 md:pl-12 pt-8 md:pt-0">
             <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-8 h-8 text-emerald-600" />
                <h2 className="text-2xl font-bold text-slate-800">How It Works</h2>
            </div>
            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">1</div>
                    <div>
                        <h4 className="font-semibold text-slate-800">Create a Campaign</h4>
                        <p className="text-sm text-slate-600">Students & staff verify identity and submit campaign details.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">2</div>
                    <div>
                        <h4 className="font-semibold text-slate-800">Get Verified</h4>
                        <p className="text-sm text-slate-600">Admin reviews the request to ensure legitimacy.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">3</div>
                    <div>
                        <h4 className="font-semibold text-slate-800">Receive Funds</h4>
                        <p className="text-sm text-slate-600">Once the goal is hit, funds are automatically transferred.</p>
                    </div>
                </div>
            </div>
         </div>
      </section>
    </div>
  );
};

const CheckIcon = () => (
    <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
);
