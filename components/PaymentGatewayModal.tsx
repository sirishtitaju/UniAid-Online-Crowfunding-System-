
import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, Calendar, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  campaignTitle: string;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({ isOpen, onClose, onSuccess, amount, campaignTitle }) => {
  const [step, setStep] = useState<'FORM' | 'PROCESSING' | 'SUCCESS'>('FORM');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep('FORM');
      setCardData({ number: '', name: '', expiry: '', cvv: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFormatCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.substring(0, 16);
    val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardData({ ...cardData, number: val });
  };

  const handleFormatExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
        val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setCardData({ ...cardData, expiry: val });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardData.number.length < 19 || cardData.cvv.length < 3 || !cardData.name || cardData.expiry.length < 5) {
        alert("Please fill in valid card details.");
        return;
    }

    setStep('PROCESSING');

    // Simulate Network Request
    setTimeout(() => {
        setStep('SUCCESS');
        // Close and Trigger Actual Success Logic after showing success state
        setTimeout(() => {
            onSuccess();
            onClose();
        }, 2000);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Lock className="w-4 h-4 text-emerald-600" />
                Secure Payment Gateway
            </div>
            {step === 'FORM' && (
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>

        <div className="p-6">
            {step === 'FORM' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-center mb-6">
                        <p className="text-slate-500 text-sm">You are donating</p>
                        <h2 className="text-3xl font-bold text-slate-800">${amount.toLocaleString()}</h2>
                        <p className="text-emerald-600 text-xs font-medium mt-1 truncate px-4">To: {campaignTitle}</p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Card Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="0000 0000 0000 0000"
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-slate-700"
                                    value={cardData.number}
                                    onChange={handleFormatCardNumber}
                                    maxLength={19}
                                    required
                                />
                                <div className="absolute right-3 top-3 flex gap-1">
                                    <div className="w-8 h-5 bg-slate-200 rounded"></div>
                                    <div className="w-8 h-5 bg-slate-200 rounded"></div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Cardholder Name</label>
                            <input 
                                type="text" 
                                placeholder="J. DOE"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none uppercase"
                                value={cardData.name}
                                onChange={(e) => setCardData({...cardData, name: e.target.value})}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Expiry Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <input 
                                        type="text" 
                                        placeholder="MM/YY"
                                        className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                                        value={cardData.expiry}
                                        onChange={handleFormatExpiry}
                                        maxLength={5}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">CVV / CVC</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <input 
                                        type="password" 
                                        placeholder="123"
                                        className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                                        value={cardData.cvv}
                                        onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '').substring(0,4)})}
                                        maxLength={4}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg mt-2 flex items-center justify-center gap-2"
                    >
                        <Lock className="w-4 h-4" /> Pay ${amount.toLocaleString()}
                    </button>
                    
                    <div className="flex justify-center items-center gap-2 mt-4 text-[10px] text-slate-400">
                        <ShieldCheck className="w-3 h-3" />
                        <span>256-bit SSL Encrypted Payment</span>
                    </div>
                </form>
            )}

            {step === 'PROCESSING' && (
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Lock className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-slate-800">Processing Payment</h3>
                    <p className="text-slate-500 mt-2">Connecting to bank securely...</p>
                    <p className="text-xs text-slate-400 mt-6">Do not close this window</p>
                </div>
            )}

            {step === 'SUCCESS' && (
                <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">Payment Successful!</h3>
                    <p className="text-slate-500 mt-2 text-center">Your donation of ${amount.toLocaleString()} has been received.</p>
                    
                    <div className="mt-6 bg-slate-50 p-4 rounded-lg w-full text-center border border-slate-100">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Transaction ID</p>
                        <p className="font-mono text-sm font-semibold text-slate-700">TXN-{Date.now().toString().slice(-8)}</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
