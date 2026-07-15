import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, CheckCircle, Shield, AlertCircle, RefreshCw, X } from 'lucide-react';

interface CheckoutSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number;
  paymentMethod: 'UPI' | 'Card' | 'Wallet';
  onSuccess: (transactionId: string) => void;
}

export default function CheckoutSimulator({
  isOpen,
  onClose,
  orderId,
  amount,
  paymentMethod,
  onSuccess
}: CheckoutSimulatorProps) {
  const [step, setStep] = useState<'method' | 'processing' | 'success' | 'otp'>('method');
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'Card' | 'Wallet'>(paymentMethod);
  const [otp, setOtp] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [upiId, setUpiId] = useState('vignesh@okhdfcbank');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('method');
      setSelectedMethod(paymentMethod);
      setError('');
    }
  }, [isOpen, paymentMethod]);

  if (!isOpen) return null;

  const handlePay = () => {
    if (selectedMethod === 'Card') {
      if (!cardNumber || cardNumber.length < 12) {
        setError('Please enter a valid card number');
        return;
      }
      setStep('otp');
    } else if (selectedMethod === 'UPI') {
      if (!upiId.includes('@')) {
        setError('Please enter a valid UPI ID (e.g. name@upi)');
        return;
      }
      simulateProcessing();
    } else {
      simulateProcessing();
    }
  };

  const simulateProcessing = () => {
    setError('');
    setStep('processing');
    setTimeout(() => {
      const txnId = `TXN-${selectedMethod}-${Math.floor(10000 + Math.random() * 90000)}`;
      setStep('success');
      setTimeout(() => {
        onSuccess(txnId);
        onClose();
      }, 1800);
    }, 2000);
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 4) {
      setError('Please enter a 4-digit OTP code');
      return;
    }
    simulateProcessing();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="font-display font-semibold tracking-wide text-sm">SECURE GATEWAY</span>
          </div>
          <button onClick={onClose} className="hover:text-slate-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount bar */}
        <div className="bg-emerald-50 border-b border-emerald-100 p-4 flex justify-between items-center text-sm">
          <div>
            <p className="text-slate-500 text-xs font-medium">Pre-Booking Ref</p>
            <p className="font-mono font-semibold text-slate-800">{orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-xs font-medium">Amount Due</p>
            <p className="text-lg font-bold text-emerald-700">₹{amount.toFixed(2)}</p>
          </div>
        </div>

        <div className="p-6">
          {step === 'method' && (
            <div className="space-y-5">
              <h3 className="font-display font-bold text-slate-800 text-base">Select Secure Payment Gateway Method</h3>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => { setSelectedMethod('UPI'); setError(''); }}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                    selectedMethod === 'UPI'
                      ? 'border-emerald-600 bg-emerald-50/40 text-emerald-800'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Smartphone className="w-6 h-6" />
                  <span className="text-xs font-medium">UPI / GPay</span>
                </button>

                <button
                  onClick={() => { setSelectedMethod('Card'); setError(''); }}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                    selectedMethod === 'Card'
                      ? 'border-emerald-600 bg-emerald-50/40 text-emerald-800'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-xs font-medium">Card Pay</span>
                </button>

                <button
                  onClick={() => { setSelectedMethod('Wallet'); setError(''); }}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                    selectedMethod === 'Wallet'
                      ? 'border-emerald-600 bg-emerald-50/40 text-emerald-800'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Shield className="w-6 h-6" />
                  <span className="text-xs font-medium">LPU Wallet</span>
                </button>
              </div>

              {/* Method specific inputs */}
              {selectedMethod === 'UPI' && (
                <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-200">
                  <label className="text-xs font-semibold text-slate-600 block">Enter UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    placeholder="student@okaxis"
                  />
                  <p className="text-[10px] text-slate-400">Generates instant approval request on your UPI app</p>
                </div>
              )}

              {selectedMethod === 'Card' && (
                <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-200">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block">Card Number</label>
                    <input
                      type="text"
                      maxLength={16}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      placeholder="4111 2222 3333 4444"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        maxLength={5}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-emerald-600"
                        placeholder="12/28"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block">CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-emerald-600"
                        placeholder="***"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'Wallet' && (
                <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100 animate-in slide-in-from-bottom-2 duration-200">
                  <p className="text-xs text-slate-500">Pay directly using pre-loaded campus student wallet balance.</p>
                  <p className="text-xs text-slate-400 mt-1">Deduction is secure and instant with 0 transaction fees.</p>
                </div>
              )}

              {error && (
                <div className="bg-rose-50 text-rose-700 p-3 rounded-lg flex items-start gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handlePay}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Authorize & Pay ₹{amount.toFixed(2)}</span>
              </button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-display font-bold text-slate-800 text-base">Enter 3D-Secure OTP</h3>
                <p className="text-xs text-slate-500 mt-1">We sent a 4-digit verification code to your registered mobile number.</p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-32 mx-auto text-center border-2 border-slate-300 rounded-lg py-3 text-lg font-bold font-mono tracking-widest focus:outline-none focus:border-emerald-600 block"
                  placeholder="0000"
                />
                {error && (
                  <div className="bg-rose-50 text-rose-700 p-2.5 rounded-lg flex items-center gap-2 text-xs justify-center">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleVerifyOtp}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm"
              >
                Submit Code & Complete Payment
              </button>
              <button
                onClick={() => setStep('method')}
                className="w-full text-slate-500 hover:text-slate-700 text-xs font-semibold"
              >
                Go Back / Change Method
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-8 flex flex-col items-center justify-center gap-4 animate-in fade-in duration-200">
              <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin" />
              <div className="text-center">
                <p className="font-display font-bold text-slate-800">Processing Payment Securely</p>
                <p className="text-xs text-slate-400 mt-1">Communicating with bank gateways. Do not reload or close page.</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center gap-3 animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100">
                <CheckCircle className="w-10 h-10 text-emerald-600 animate-bounce" />
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-slate-800 text-lg">Transaction Approved</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">Payment Verified Successfully</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 border-t border-slate-100">
          <Shield className="w-3.5 h-3.5" />
          <span>PCI-DSS Compliant • 256-bit Secure Sockets Layer (SSL) Encryption</span>
        </div>
      </div>
    </div>
  );
}
