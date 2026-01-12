
import { User, Campaign, Donation, Transaction, UserRole, CampaignStatus, CampaignCategory, VerificationStatus, VerificationDocuments } from '../types';

// Initial Mock Data
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@uniaid.com', password: 'password', role: UserRole.ADMIN, walletBalance: 0, verificationStatus: VerificationStatus.VERIFIED },
  { 
    id: 'u2', 
    name: 'John Fundraiser', 
    email: 'john@fund.com', 
    password: 'password', 
    role: UserRole.FUNDRAISER, 
    walletBalance: 1200, 
    verificationStatus: VerificationStatus.VERIFIED,
    verificationDocuments: {
        governmentId: 'https://images.unsplash.com/photo-1549920843-48301e74a810?auto=format&fit=crop&w=400&q=80',
        proofOfAddress: 'https://images.unsplash.com/photo-1555601568-c9e6f328489b?auto=format&fit=crop&w=400&q=80',
        orgRegistration: 'https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?auto=format&fit=crop&w=400&q=80',
        submittedAt: new Date(Date.now() - 86400000 * 30).toISOString()
    }
  },
  { 
    id: 'u4', 
    name: 'Sarah Smith', 
    email: 'sarah@fund.com', 
    password: 'password', 
    role: UserRole.FUNDRAISER, 
    walletBalance: 450, 
    verificationStatus: VerificationStatus.VERIFIED,
    verificationDocuments: {
        governmentId: 'https://images.unsplash.com/photo-1549920843-48301e74a810?auto=format&fit=crop&w=400&q=80',
        proofOfAddress: 'https://images.unsplash.com/photo-1555601568-c9e6f328489b?auto=format&fit=crop&w=400&q=80',
        orgRegistration: 'https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?auto=format&fit=crop&w=400&q=80',
        submittedAt: new Date(Date.now() - 86400000 * 25).toISOString()
    }
  },
  { id: 'u3', name: 'Alice Donor', email: 'alice@donate.com', password: 'password', role: UserRole.DONOR, walletBalance: 5000, verificationStatus: VerificationStatus.NONE },
  { id: 'u5', name: 'New User', email: 'new@user.com', password: 'password', role: UserRole.FUNDRAISER, walletBalance: 0, verificationStatus: VerificationStatus.NONE },
];

const STORAGE_KEYS = {
  USERS: 'uniaid_users',
  CAMPAIGNS: 'uniaid_campaigns',
  DONATIONS: 'uniaid_donations',
  TRANSACTIONS: 'uniaid_transactions',
  CURRENT_USER: 'uniaid_current_user',
};

class MockService {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CAMPAIGNS)) {
      const initialCampaigns: Campaign[] = [
        // --- STARTUP ---
        {
            id: 'c_start_1',
            fundraiserId: 'u2',
            fundraiserName: 'John Fundraiser',
            title: 'Eco-Friendly Campus Transport',
            description: 'We are building a fleet of solar-powered scooters for the university campus to reduce carbon footprint and ease commute for students living in dorms.',
            goalAmount: 15000,
            raisedAmount: 4500,
            status: CampaignStatus.ACTIVE,
            category: CampaignCategory.STARTUP,
            beneficiary: 'Green Campus Initiative',
            deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
            image: 'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        },
        {
            id: 'c_start_2',
            fundraiserId: 'u2',
            fundraiserName: 'John Fundraiser',
            title: 'AI Study Companion App',
            description: 'An innovative app that uses AI to create personalized study schedules and summaries for university students. Beta testing phase funding.',
            goalAmount: 8000,
            raisedAmount: 1200,
            status: CampaignStatus.ACTIVE,
            category: CampaignCategory.STARTUP,
            beneficiary: 'StudySmart Team',
            deadline: new Date(Date.now() + 86400000 * 45).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
            image: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
        },

        // --- EDUCATION ---
        {
            id: 'c_edu_1',
            fundraiserId: 'u2',
            fundraiserName: 'John Fundraiser',
            title: 'Tech Bootcamp Scholarships',
            description: 'Providing full scholarships for underrepresented youth to attend a 12-week intensive coding bootcamp. Help us bridge the tech diversity gap.',
            goalAmount: 25000,
            raisedAmount: 12500,
            status: CampaignStatus.ACTIVE,
            category: CampaignCategory.EDUCATION,
            beneficiary: 'Future Tech Leaders Foundation',
            deadline: new Date(Date.now() + 86400000 * 45).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
        },
        {
            id: 'c_edu_2',
            fundraiserId: 'u4',
            fundraiserName: 'Sarah Smith',
            title: 'Rural School Library Project',
            description: 'Building a modern library with computers and books for the elementary school in Oakville, providing resources to over 300 students.',
            goalAmount: 15000,
            raisedAmount: 3200,
            status: CampaignStatus.ACTIVE,
            category: CampaignCategory.EDUCATION,
            beneficiary: 'Oakville Elementary',
            deadline: new Date(Date.now() + 86400000 * 60).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
            image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
        },

        // --- MEDICAL ---
        {
            id: 'c_med_1',
            fundraiserId: 'u2',
            fundraiserName: 'John Fundraiser',
            title: 'Emergency Surgery for Baby Liam',
            description: 'Liam was born with a congenital heart defect and requires urgent open-heart surgery. The insurance covers 70%, we need help with the rest.',
            goalAmount: 30000,
            raisedAmount: 21000,
            status: CampaignStatus.ACTIVE,
            category: CampaignCategory.MEDICAL,
            beneficiary: 'Liam Johnson',
            deadline: new Date(Date.now() + 86400000 * 20).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
        },
        {
            id: 'c_med_2',
            fundraiserId: 'u4',
            fundraiserName: 'Sarah Smith',
            title: 'Cancer Treatment Fund for Maria',
            description: 'Maria is a single mother of two battling stage 3 breast cancer. Funds will help with chemotherapy, medication, and childcare during her treatment.',
            goalAmount: 12000,
            raisedAmount: 8500,
            status: CampaignStatus.ACTIVE,
            category: CampaignCategory.MEDICAL,
            beneficiary: 'Maria Rodriguez',
            deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
            image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
        },

        // --- NON-PROFIT ---
        {
            id: 'c_np_1',
            fundraiserId: 'u4',
            fundraiserName: 'Sarah Smith',
            title: 'City Food Bank Expansion',
            description: 'Helping the local food bank purchase new refrigeration units to store fresh produce for families in need.',
            goalAmount: 20000,
            raisedAmount: 15600,
            status: CampaignStatus.ACTIVE,
            category: CampaignCategory.NON_PROFIT,
            beneficiary: 'City Food Bank',
            deadline: new Date(Date.now() + 86400000 * 15).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
            image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
        },
        {
            id: 'c_np_2',
            fundraiserId: 'u2',
            fundraiserName: 'John Fundraiser',
            title: 'Clean Water for Villages',
            description: 'Constructing water wells in remote villages to provide safe and clean drinking water, preventing waterborne diseases.',
            goalAmount: 35000,
            raisedAmount: 9000,
            status: CampaignStatus.ACTIVE,
            category: CampaignCategory.NON_PROFIT,
            beneficiary: 'Global Water Aid',
            deadline: new Date(Date.now() + 86400000 * 90).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
            image: 'https://images.unsplash.com/photo-1538300342682-cf57afb97285?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
        },

        // --- EMERGENCY ---
        {
            id: 'c_em_1',
            fundraiserId: 'u4',
            fundraiserName: 'Sarah Smith',
            title: 'Flood Relief Fund',
            description: 'Direct financial assistance for 50 families who lost their homes in the recent devastating floods.',
            goalAmount: 50000,
            raisedAmount: 28000,
            status: CampaignStatus.ACTIVE,
            category: CampaignCategory.EMERGENCY,
            beneficiary: 'Community Relief Center',
            deadline: new Date(Date.now() + 86400000 * 10).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
            image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
        },
        {
            id: 'c_em_2',
            fundraiserId: 'u2',
            fundraiserName: 'John Fundraiser',
            title: 'House Fire Recovery for the Thompsons',
            description: 'The Thompson family lost everything in a house fire last week. Raising funds for temporary housing, clothes, and food.',
            goalAmount: 15000,
            raisedAmount: 13500,
            status: CampaignStatus.ACTIVE,
            category: CampaignCategory.EMERGENCY,
            beneficiary: 'Thompson Family',
            deadline: new Date(Date.now() + 86400000 * 14).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
            image: 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
        },

        // --- CREATIVE ---
        {
            id: 'c_cr_1',
            fundraiserId: 'u4',
            fundraiserName: 'Sarah Smith',
            title: 'Indie Documentary: "Voices"',
            description: 'Post-production funds for a documentary exploring the lives of street musicians in New York City.',
            goalAmount: 8000,
            raisedAmount: 1500,
            status: CampaignStatus.ACTIVE,
            category: CampaignCategory.CREATIVE,
            beneficiary: 'Indie Lens Productions',
            deadline: new Date(Date.now() + 86400000 * 40).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
            image: 'https://images.unsplash.com/photo-1533106958155-29e51f72edc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
        },
        {
            id: 'c_cr_2',
            fundraiserId: 'u2',
            fundraiserName: 'John Fundraiser',
            title: 'Community Art Mural',
            description: 'Commissioning local artists to paint a large-scale mural celebrating diversity in the downtown district.',
            goalAmount: 5000,
            raisedAmount: 4800,
            status: CampaignStatus.ACTIVE,
            category: CampaignCategory.CREATIVE,
            beneficiary: 'Downtown Arts Council',
            deadline: new Date(Date.now() + 86400000 * 10).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
            image: 'https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(initialCampaigns));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DONATIONS)) {
      // Create some initial donations for the graphs
      const initialDonations: Donation[] = [
          { id: 'd1', donorId: 'u3', donorName: 'Alice Donor', campaignId: 'c_start_1', campaignTitle: 'Eco-Friendly Campus Transport', amount: 500, timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), donorVerified: false },
          { id: 'd2', donorId: 'u3', donorName: 'Alice Donor', campaignId: 'c_start_1', campaignTitle: 'Eco-Friendly Campus Transport', amount: 1500, timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), donorVerified: false },
          { id: 'd3', donorId: 'u3', donorName: 'Alice Donor', campaignId: 'c_start_1', campaignTitle: 'Eco-Friendly Campus Transport', amount: 2500, timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), donorVerified: false },
          { id: 'd4', donorId: 'u3', donorName: 'Alice Donor', campaignId: 'c_med_1', campaignTitle: 'Emergency Surgery for Baby Liam', amount: 1200, timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), donorVerified: false },
          { id: 'd5', donorId: 'u3', donorName: 'Alice Donor', campaignId: 'c_np_1', campaignTitle: 'City Food Bank Expansion', amount: 5000, timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), donorVerified: false },
      ];
      localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(initialDonations));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
    }
  }

  // --- Auth ---

  login(email: string, password: string): User | null {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  }

  register(name: string, email: string, password: string, role: UserRole): User {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    if (users.find((u) => u.email === email)) {
      throw new Error('User already exists');
    }
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      password,
      role,
      walletBalance: role === UserRole.DONOR ? 1000 : 0, // Give donors some initial fake money
      verificationStatus: VerificationStatus.NONE, // Default Unverified
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    return newUser;
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  getCurrentUser(): User | null {
    const u = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return u ? JSON.parse(u) : null;
  }

  getUsers(): User[] {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  }

  // --- Verification ---

  requestUserVerification(userId: string, documents: VerificationDocuments) {
      const users = this.getUsers();
      const index = users.findIndex(u => u.id === userId);
      if (index !== -1) {
          users[index].verificationStatus = VerificationStatus.PENDING;
          users[index].verificationDocuments = documents;
          
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
          
          // Update current user if matches
          const currentUser = this.getCurrentUser();
          if (currentUser && currentUser.id === userId) {
              currentUser.verificationStatus = VerificationStatus.PENDING;
              currentUser.verificationDocuments = documents;
              localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
          }
      }
  }

  evaluateUserVerification(userId: string, isApproved: boolean) {
      const users = this.getUsers();
      const index = users.findIndex(u => u.id === userId);
      if (index !== -1) {
          users[index].verificationStatus = isApproved ? VerificationStatus.VERIFIED : VerificationStatus.REJECTED;
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
          
           // Update current user if matches (though usually admin performs this)
          const currentUser = this.getCurrentUser();
          if (currentUser && currentUser.id === userId) {
              currentUser.verificationStatus = users[index].verificationStatus;
              localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
          }
      }
  }

  // --- Campaigns ---

  createCampaign(
      fundraiser: User, 
      title: string, 
      description: string, 
      goalAmount: number, 
      category: CampaignCategory,
      beneficiary: string,
      deadline: string,
      image?: string
    ): Campaign {
    
    // Check verification
    if (fundraiser.role === UserRole.FUNDRAISER && fundraiser.verificationStatus !== VerificationStatus.VERIFIED) {
        throw new Error("You must verified by Admin before creating a campaign.");
    }

    const campaigns: Campaign[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CAMPAIGNS) || '[]');
    const newCampaign: Campaign = {
      id: `c${Date.now()}`,
      fundraiserId: fundraiser.id,
      fundraiserName: fundraiser.name,
      title,
      description,
      goalAmount,
      raisedAmount: 0,
      status: CampaignStatus.PENDING,
      category,
      beneficiary,
      deadline,
      createdAt: new Date().toISOString(),
      image: image || `https://picsum.photos/seed/${Date.now()}/800/600`,
    };
    campaigns.push(newCampaign);
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
    return newCampaign;
  }

  updateCampaign(campaignId: string, updates: Partial<Campaign>): Campaign {
     const campaigns: Campaign[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CAMPAIGNS) || '[]');
     const index = campaigns.findIndex(c => c.id === campaignId);
     if (index === -1) throw new Error("Campaign not found");
     
     campaigns[index] = { ...campaigns[index], ...updates };
     
     // Re-submit logic: If status was REJECTED and we are editing, set back to PENDING
     if (campaigns[index].status === CampaignStatus.REJECTED && (updates.description || updates.title)) {
         campaigns[index].status = CampaignStatus.PENDING;
     }

     localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
     return campaigns[index];
  }

  getCampaigns(): Campaign[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CAMPAIGNS) || '[]');
  }
  
  getCampaignById(id: string): Campaign | undefined {
      return this.getCampaigns().find(c => c.id === id);
  }

  // --- Transactions / Donations ---

  processDonation(donor: User, campaignId: string, amount: number) {
    const campaigns: Campaign[] = this.getCampaigns();
    const campaignIndex = campaigns.findIndex((c) => c.id === campaignId);
    if (campaignIndex === -1) throw new Error('Campaign not found');

    const campaign = campaigns[campaignIndex];
    if (campaign.status !== CampaignStatus.ACTIVE) throw new Error('Campaign is not active');

    // Use Number() to ensure we are adding numerically, preventing string concatenation bugs
    const safeAmount = Number(amount);
    if (isNaN(safeAmount) || safeAmount <= 0) throw new Error('Invalid donation amount');

    // 1. Create Donation Record
    const donation: Donation = {
      id: `d${Date.now()}`,
      donorId: donor.id,
      donorName: donor.name,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      amount: safeAmount,
      timestamp: new Date().toISOString(),
      donorVerified: donor.verificationStatus === VerificationStatus.VERIFIED
    };

    // 2. Update Campaign Raised Amount
    // Ensure raisedAmount is treated as a number in case of legacy string data
    campaign.raisedAmount = Number(campaign.raisedAmount) + safeAmount;

    // 3. Create Transaction (Donor -> System Bank)
    const transaction: Transaction = {
      id: `t${Date.now()}`,
      type: 'DONATION',
      amount: safeAmount,
      senderId: donor.id,
      receiverId: 'SYSTEM',
      date: new Date().toISOString(),
    };

    // 4. Check for Objective Completion
    if (campaign.raisedAmount >= campaign.goalAmount) {
      campaign.status = CampaignStatus.COMPLETED;
      
      // TRIGGER FUND TRANSFER (System -> Fundraiser)
      const transferTx: Transaction = {
        id: `t${Date.now()}_transfer`,
        type: 'FUND_TRANSFER',
        amount: campaign.raisedAmount,
        senderId: 'SYSTEM',
        receiverId: campaign.fundraiserId,
        date: new Date().toISOString(),
      };
      
      this.saveTransaction(transferTx);
      
      // Update fundraiser wallet (Simulated)
      this.updateUserWallet(campaign.fundraiserId, campaign.raisedAmount);
    }

    // Save everything
    campaigns[campaignIndex] = campaign;
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
    
    this.saveDonation(donation);
    this.saveTransaction(transaction);
    this.updateUserWallet(donor.id, -safeAmount); // Deduct from donor
  }

  private saveDonation(donation: Donation) {
    const donations: Donation[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.DONATIONS) || '[]');
    donations.push(donation);
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));
  }

  private saveTransaction(transaction: Transaction) {
    const transactions: Transaction[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
    transactions.push(transaction);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  private updateUserWallet(userId: string, change: number) {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      users[userIndex].walletBalance = Number(users[userIndex].walletBalance) + Number(change);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      
      // Update current user session if it's the logged in user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
         currentUser.walletBalance = Number(currentUser.walletBalance) + Number(change);
         localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      }
    }
  }

  getAllDonations(): Donation[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DONATIONS) || '[]');
  }
  
  getDonationsByCampaign(campaignId: string): Donation[] {
      const all = this.getAllDonations();
      return all.filter(d => d.campaignId === campaignId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

export const mockService = new MockService();
