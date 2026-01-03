
import React, { useState } from 'react';
import { X, Check, CreditCard, QrCode } from 'lucide-react';
import { maskCreditCard } from '../services/security';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export const Pricing: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [method, setMethod] = useState<'card' | 'pix'>('pix');
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(maskCreditCard(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.substring(0,2) + '/' + val.substring(2,4);
    setExpiry(val);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900">Finalizar Assinatura</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-baseline justify-between mb-6">
            <span className="text-3xl font-bold text-slate-900">R$ 99,90</span>
            <span className="text-slate-500">/mês</span>
          </div>

          {/* Payment Method Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
            <button 
              onClick={() => setMethod('pix')}
              className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center space-x-2 transition-all ${method === 'pix' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <QrCode className="h-4 w-4" />
              <span>Pix</span>
            </button>
            <button 
              onClick={() => setMethod('card')}
              className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center space-x-2 transition-all ${method === 'card' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <CreditCard className="h-4 w-4" />
              <span>Cartão</span>
            </button>
          </div>

          {method === 'pix' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-48 h-48 bg-slate-100 mx-auto rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                <span className="text-slate-400 text-sm">QR Code Mock</span>
              </div>
              <p className="text-sm text-slate-600">Escaneie o QR Code para aprovação instantânea.</p>
            </div>
          )}

          {method === 'card' && (
            <div className="space-y-4">
               <input 
                 type="text" 
                 placeholder="Número do Cartão" 
                 value={cardNumber}
                 onChange={handleCardChange}
                 className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white" 
               />
               <div className="grid grid-cols-2 gap-4">
                 <input 
                   type="text" 
                   placeholder="MM/AA" 
                   maxLength={5}
                   value={expiry}
                   onChange={handleExpiryChange}
                   className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white" 
                 />
                 <input 
                   type="text" 
                   placeholder="CVV" 
                   maxLength={4}
                   value={cvv}
                   onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                   className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white" 
                 />
               </div>
               <input type="text" placeholder="Nome no Cartão" className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white" />
               <select className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white">
                 <option>À vista - R$ 99,90</option>
                 <option>2x de R$ 49,95</option>
                 <option>3x de R$ 33,30</option>
               </select>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-brand-500/20 disabled:opacity-70 disabled:cursor-wait"
          >
            {loading ? 'Processando...' : (method === 'pix' ? 'Já fiz o Pix' : 'Pagar Agora')}
          </button>
          <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-slate-500">
            <Check className="h-3 w-3 text-emerald-500" />
            <span>Ambiente seguro. Seus dados estão protegidos.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
