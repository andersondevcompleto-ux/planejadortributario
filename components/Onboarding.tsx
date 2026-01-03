import React, { useState, useEffect } from 'react';
import { CompanyData, CompanyType, TaxRegime, Supplier, ServiceCategory } from '../types';
import { lookupCNPJ, ICMS_RATES } from '../services/taxService';
import { validateCNPJStrict } from '../services/security';
import { Search, MapPin, Building2, DollarSign, ArrowRight, Loader2, Check, ArrowLeft, Info, ShoppingCart, Plus, Trash2, Users, Briefcase, Percent, FileBarChart, Factory, Truck, Flame } from 'lucide-react';

interface Props {
  onComplete: (data: CompanyData) => void;
  onCancel: () => void;
  initialData?: CompanyData | null;
}

export const Onboarding: React.FC<Props> = ({ onComplete, onCancel, initialData }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [supplierLoading, setSupplierLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for adding a new supplier
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    cnpj: '',
    regime: TaxRegime.Real,
    amount: 0,
    anexo: 'Anexo I'
  });
  
  const [data, setData] = useState<Partial<CompanyData>>({
    cnpj: '',
    name: '',
    municipality: '',
    state: '',
    type: CompanyType.Servico,
    serviceCategory: ServiceCategory.Padrao, // Default
    currentRegime: TaxRegime.Simples,
    annualRevenue: 0,
    payrollCosts: 0,
    // Initialize specific fields
    simplesAnexo: 'Anexo III',
    simplesFatorR: false,
    realHasDeductions: false,
    realDeductionAmount: 0,
    realPaymentMode: 'Trimestral',
    realAdditions: 0,
    realExclusions: 0,
    realAccumulatedLoss: 0,
    // Initialize SUP fields
    isSup: false,
    supProfessionalCount: 1,
    supTaxAmountMonthly: 0,
    // Initialize Desoneracao
    isDesonerada: false,
    cprbRate: 0,
    // Initialize new Purchase fields
    monthlyPurchases: 0,
    suppliers: [],
    // Industry & ICMS Defaults
    industryIpiRate: 0,
    industryHarmfulProduct: false,
    icmsInterstatePercent: 0,
    icmsInternalRate: 18, // Default 18% standard
    icmsTaxIncentive: false
  });

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setStep(2); // Start at step 2 for editing
    }
  }, [initialData]);

  // Effect to update ICMS Rate when State changes
  useEffect(() => {
    if (data.state && data.state.length === 2) {
      const rate = ICMS_RATES[data.state.toUpperCase()];
      if (rate) {
        setData(prev => ({ ...prev, icmsInternalRate: rate }));
      }
    }
  }, [data.state]);

  const handleCnpjSearch = async () => {
    // SECURITY: Use Strict Validation instead of just length check
    if (!validateCNPJStrict(data.cnpj || '')) {
      setError("CNPJ inválido (Dígito verificador incorreto)");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const info = await lookupCNPJ(data.cnpj!);
      setData(prev => ({ ...prev, ...info }));
      setStep(2);
    } catch (e) {
      setError("Erro ao consultar CNPJ. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSupplierCnpjSearch = async () => {
    // SECURITY: Validate supplier CNPJ too
    if (!validateCNPJStrict(newSupplier.cnpj || '')) {
      return; 
    }
    setSupplierLoading(true);
    try {
      const info = await lookupCNPJ(newSupplier.cnpj!);
      setNewSupplier(prev => ({ 
        ...prev, 
        name: info.name,
        state: info.state,
        municipality: info.municipality 
      }));
    } catch (e) {
      // ignore
    } finally {
      setSupplierLoading(false);
    }
  };

  const handleAddSupplier = () => {
    if (!validateCNPJStrict(newSupplier.cnpj || '') || !newSupplier.amount) {
      return; // Simple validation
    }
    
    const supplier: Supplier = {
      id: Math.random().toString(36).substr(2, 9),
      cnpj: newSupplier.cnpj!,
      name: newSupplier.name || 'Fornecedor',
      state: newSupplier.state,
      municipality: newSupplier.municipality,
      amount: newSupplier.amount,
      regime: newSupplier.regime || TaxRegime.Real,
      anexo: newSupplier.anexo
    };

    setData(prev => ({
      ...prev,
      suppliers: [...(prev.suppliers || []), supplier]
    }));

    // Reset new supplier form
    setNewSupplier({
      cnpj: '',
      regime: TaxRegime.Real,
      amount: 0,
      anexo: 'Anexo I'
    });
    setIsAddingSupplier(false);
  };

  const handleRemoveSupplier = (id: string) => {
    setData(prev => ({
      ...prev,
      suppliers: prev.suppliers?.filter(s => s.id !== id) || []
    }));
  };

  const handleFinalSubmit = () => {
    if (data.annualRevenue === undefined || data.annualRevenue === null || isNaN(data.annualRevenue)) {
      setError("Faturamento Anual é obrigatório");
      return;
    }
    if (data.annualRevenue < 0) {
      setError("Faturamento não pode ser negativo");
      return;
    }
    onComplete(data as CompanyData);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Navigation / Cancel */}
        <div className="mb-6">
          <button 
            onClick={onCancel}
            className="flex items-center text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Cancelar e Voltar
          </button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Passo {step} de 3</span>
            <span className="text-xs font-semibold text-brand-600">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-brand-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {initialData ? 'Editar Empresa' : 'Nova Simulação'}
                </h2>
                <p className="text-slate-500 mt-2">Buscaremos os dados cadastrais da sua empresa automaticamente.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Seu CNPJ (somente números)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={data.cnpj}
                    onChange={(e) => setData({...data, cnpj: e.target.value.replace(/\D/g, '')})}
                    placeholder="00000000000000"
                    maxLength={14}
                    className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow bg-white"
                    disabled={!!initialData} 
                  />
                  {!initialData && (
                    <button 
                      onClick={handleCnpjSearch}
                      disabled={loading || !data.cnpj}
                      className="bg-brand-600 text-white px-6 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Buscar"}
                    </button>
                  )}
                  {initialData && (
                     <button 
                     onClick={() => setStep(2)}
                     className="bg-brand-600 text-white px-6 rounded-lg font-medium hover:bg-brand-700 flex items-center"
                   >
                     Avançar
                   </button>
                  )}
                </div>
                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 flex items-center">
                   <Building2 className="h-5 w-5 mr-2 text-brand-600" />
                   Dados Cadastrais
                </h3>
                
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Razão Social</label>
                   <input
                       type="text"
                       value={data.name || ''}
                       onChange={(e) => setData({...data, name: e.target.value})}
                       className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                       placeholder="Nome da Empresa"
                   />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-slate-400" /> Estado (UF)
                     </label>
                     <input
                         type="text"
                         value={data.state || ''}
                         onChange={(e) => setData({...data, state: e.target.value.toUpperCase()})}
                         className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                         placeholder="Ex: SP"
                         maxLength={2}
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Município</label>
                     <input
                         type="text"
                         value={data.municipality || ''}
                         onChange={(e) => setData({...data, municipality: e.target.value})}
                         className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                         placeholder="Cidade"
                     />
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Empresa</label>
                  <select 
                    value={data.type}
                    onChange={(e) => setData({...data, type: e.target.value as CompanyType})}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                  >
                    {Object.values(CompanyType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* --- INDUSTRY SPECIFIC FIELDS (ICMS/IPI) --- */}
                {(data.type === CompanyType.Industria || data.type === CompanyType.Comercio) && (
                   <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 animate-fade-in space-y-5">
                      <div className="flex items-center space-x-2 border-b border-blue-200 pb-2">
                        <Factory className="h-5 w-5 text-blue-600" />
                        <h4 className="font-bold text-blue-900">Perfil Industrial & ICMS</h4>
                      </div>

                      {/* ICMS Flow */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-blue-800 mb-1 flex items-center">
                               <Truck className="h-3 w-3 mr-1" /> 
                               Vendas Interestaduais (%)
                            </label>
                            <input 
                              type="number"
                              min="0" max="100"
                              value={data.icmsInterstatePercent || 0}
                              onChange={(e) => setData({...data, icmsInterstatePercent: parseFloat(e.target.value)})}
                              className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                            />
                            <p className="text-[10px] text-blue-600 mt-1">Impacta a alíquota média (7% ou 12% vs 18% interna)</p>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-blue-800 mb-1">
                               Alíquota Interna ICMS (%)
                            </label>
                            <input 
                              type="number"
                              min="12" max="25"
                              value={data.icmsInternalRate || 18}
                              onChange={(e) => setData({...data, icmsInternalRate: parseFloat(e.target.value)})}
                              className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                            />
                            <p className="text-[10px] text-blue-600 mt-1">
                                {data.state ? `Padrão para ${data.state}: ${ICMS_RATES[data.state] || 18}%` : 'Padrão: 18% (SP/MG/PR) ou 20% (RJ)'}
                            </p>
                         </div>
                      </div>

                      {/* IPI & Imposto Seletivo */}
                      {data.type === CompanyType.Industria && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-bold text-blue-800 mb-1">Alíquota Média de IPI (%)</label>
                                <input 
                                  type="number"
                                  min="0"
                                  value={data.industryIpiRate || 0}
                                  onChange={(e) => setData({...data, industryIpiRate: parseFloat(e.target.value)})}
                                  placeholder="0.00"
                                  className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                                />
                             </div>
                             <div className="flex flex-col justify-end">
                                <label className="flex items-center space-x-2 cursor-pointer bg-white p-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                                   <input 
                                      type="checkbox"
                                      checked={data.industryHarmfulProduct || false}
                                      onChange={(e) => setData({...data, industryHarmfulProduct: e.target.checked})}
                                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                                   />
                                   <span className="text-xs font-bold text-red-700 flex items-center">
                                      <Flame className="h-3 w-3 mr-1" />
                                      Produto Nocivo? (Bebida/Fumo)
                                   </span>
                                </label>
                                <p className="text-[10px] text-blue-600 mt-1 px-1">Sujeito a Imposto Seletivo (IS) na Reforma 2026.</p>
                             </div>
                          </div>
                        </>
                      )}
                   </div>
                )}

                {/* --- SERVICE CATEGORY SELECTION --- */}
                {data.type === CompanyType.Servico && (
                  <div className="space-y-4">
                    <div className="bg-brand-50 p-4 rounded-xl border border-brand-200">
                      <label className="block text-sm font-bold text-brand-900 mb-2">Categoria do Serviço (Reforma 2026)</label>
                      <p className="text-xs text-brand-700 mb-3">Selecione para calcular as reduções de alíquota previstas no PLP 68/2024.</p>
                      <select 
                          value={data.serviceCategory || ServiceCategory.Padrao}
                          onChange={(e) => setData({...data, serviceCategory: e.target.value as ServiceCategory})}
                          className="w-full p-3 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                      >
                        <option value={ServiceCategory.Padrao}>Geral (Alíquota Padrão)</option>
                        <option value={ServiceCategory.SaudeEducacao}>Saúde, Educação ou Cultura (Redução 60%)</option>
                        <option value={ServiceCategory.ProfissionalLiberal}>Profissional Liberal (Adv, Eng, Arq, etc) (Redução 30%)</option>
                      </select>
                    </div>

                    {/* --- SOCIEDADE UNIPROFISSIONAL (ISS FIXO) --- */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                       <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 text-slate-600" />
                            <label className="text-sm font-bold text-slate-800">Sociedade Uniprofissional (SUP)</label>
                         </div>
                         <button 
                            onClick={() => setData({...data, isSup: !data.isSup})}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.isSup ? 'bg-brand-600' : 'bg-slate-300'}`}
                         >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.isSup ? 'translate-x-6' : 'translate-x-1'}`} />
                         </button>
                       </div>
                       
                       <p className="text-xs text-slate-500 mb-4">
                          Habilite se a empresa paga ISS Fixo (por profissional) em vez de percentual sobre faturamento (Decreto-Lei 406/68).
                       </p>

                       {data.isSup && (
                         <div className="grid grid-cols-2 gap-4 animate-fade-in">
                           <div>
                             <label className="block text-xs font-medium text-slate-700 mb-1">Nº de Profissionais (Sócios/Habilitados)</label>
                             <input 
                               type="number"
                               min="1"
                               value={data.supProfessionalCount || 1}
                               onChange={(e) => setData({...data, supProfessionalCount: parseInt(e.target.value) || 1})}
                               className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm bg-white"
                             />
                           </div>
                           <div>
                             <label className="block text-xs font-medium text-slate-700 mb-1">ISS Fixo Mensal por Profissional (R$)</label>
                             <input 
                               type="number"
                               min="0"
                               value={data.supTaxAmountMonthly || 0}
                               onChange={(e) => setData({...data, supTaxAmountMonthly: parseFloat(e.target.value)})}
                               placeholder="0,00"
                               className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm bg-white"
                             />
                             <p className="text-[10px] text-slate-400 mt-1">Ex: R$ 200,00 (pode variar por município)</p>
                           </div>
                         </div>
                       )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CNAE Principal</label>
                  <input 
                    type="text"
                    value={data.cnae || ''}
                    onChange={(e) => setData({...data, cnae: e.target.value})}
                    placeholder="Busque pelo código ou nome da atividade..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Regime Tributário Atual</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[TaxRegime.Simples, TaxRegime.Presumido, TaxRegime.Real].map((regime) => {
                      const isSelected = data.currentRegime === regime;
                      return (
                        <div
                          key={regime}
                          onClick={() => setData({ ...data, currentRegime: regime })}
                          className={`
                            cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200
                            ${isSelected 
                              ? 'border-brand-600 bg-brand-50 shadow-sm' 
                              : 'border-slate-200 hover:border-brand-200 hover:bg-slate-50'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                          <span className={`block text-sm font-medium ${isSelected ? 'text-brand-900' : 'text-slate-700'}`}>
                            {regime}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* --- DETALHAMENTO SIMPLES NACIONAL --- */}
                {data.currentRegime === TaxRegime.Simples && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 animate-fade-in space-y-4">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center">
                      <Info className="h-4 w-4 mr-2 text-brand-500" />
                      Detalhamento do Simples
                    </h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Anexo de Apuração</label>
                      <select 
                        value={data.simplesAnexo || 'Anexo III'}
                        onChange={(e) => setData({...data, simplesAnexo: e.target.value})}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                      >
                        <option value="Anexo I">Anexo I - Comércio</option>
                        <option value="Anexo II">Anexo II - Indústria</option>
                        <option value="Anexo III">Anexo III - Serviços</option>
                        <option value="Anexo IV">Anexo IV - Serviços</option>
                        <option value="Anexo V">Anexo V - Serviços</option>
                      </select>
                    </div>

                    {data.simplesAnexo === 'Anexo V' && (
                      <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-slate-200">
                        <input 
                          type="checkbox"
                          id="fatorR"
                          checked={data.simplesFatorR || false}
                          onChange={(e) => setData({...data, simplesFatorR: e.target.checked})}
                          className="h-5 w-5 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
                        />
                        <label htmlFor="fatorR" className="text-sm text-slate-700 cursor-pointer select-none">
                          Empresa sujeita ao Fator R?
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {/* --- DETALHAMENTO LUCRO REAL (LALUR) --- */}
                {/* Available if Real is selected OR user wants to simulate real comparison details */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 animate-fade-in space-y-4">
                   <h4 className="text-sm font-bold text-slate-800 flex items-center">
                    <FileBarChart className="h-4 w-4 mr-2 text-brand-500" />
                    Apuração Lucro Real (LALUR)
                  </h4>
                  <p className="text-xs text-slate-500">Dados para cálculo do IRPJ/CSLL Não-Cumulativo.</p>

                  {/* Operational Expenses (Simplification) */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Outras Despesas Operacionais (R$/Ano)</label>
                    <input 
                      type="number"
                      min="0"
                      value={data.realDeductionAmount || ''}
                      onChange={(e) => setData({...data, realDeductionAmount: parseFloat(e.target.value)})}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm bg-white"
                      placeholder="Aluguel, Energia, Marketing, etc."
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Usado para encontrar o Lucro Contábil (Receita - Compras - Folha - Despesas).</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-200 pt-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Adições (R$)</label>
                      <input 
                        type="number"
                        min="0"
                        value={data.realAdditions || ''}
                        onChange={(e) => setData({...data, realAdditions: parseFloat(e.target.value)})}
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm bg-white"
                        placeholder="Despesas Indedutíveis"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Exclusões (R$)</label>
                      <input 
                        type="number"
                        min="0"
                        value={data.realExclusions || ''}
                        onChange={(e) => setData({...data, realExclusions: parseFloat(e.target.value)})}
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm bg-white"
                        placeholder="Receitas Isentas"
                      />
                    </div>
                    <div>
                       <label className="block text-xs font-medium text-slate-700 mb-1">Prejuízo Acumulado (R$)</label>
                       <input 
                         type="number"
                         min="0"
                         value={data.realAccumulatedLoss || ''}
                         onChange={(e) => setData({...data, realAccumulatedLoss: parseFloat(e.target.value)})}
                         className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm bg-white"
                         placeholder="De anos anteriores"
                       />
                       <p className="text-[10px] text-slate-400 mt-1">Limitado a 30% do Lucro Real.</p>
                    </div>
                  </div>
                  
                  {data.currentRegime === TaxRegime.Real && (
                    <div className="pt-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Forma de Apuração</label>
                      <div className="flex space-x-4">
                         <label className="flex items-center cursor-pointer">
                            <input 
                              type="radio" 
                              name="paymentMode"
                              checked={data.realPaymentMode === 'Trimestral'}
                              onChange={() => setData({...data, realPaymentMode: 'Trimestral'})}
                              className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                            />
                            <span className="ml-2 text-sm text-slate-700">Trimestral</span>
                         </label>
                         <label className="flex items-center cursor-pointer">
                            <input 
                              type="radio" 
                              name="paymentMode"
                              checked={data.realPaymentMode === 'Estimativa Mensal'}
                              onChange={() => setData({...data, realPaymentMode: 'Estimativa Mensal'})}
                              className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                            />
                            <span className="ml-2 text-sm text-slate-700">Estimativa Mensal</span>
                         </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                 <button 
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-slate-300 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-50"
                >
                  Voltar
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="w-2/3 bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 flex items-center justify-center space-x-2"
                >
                  <span>Próximo Passo</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Dados Financeiros & Compras</h2>
                <p className="text-slate-500 mt-2">Valores essenciais para o cálculo de impostos e créditos.</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                   <h3 className="font-bold text-slate-800 border-b pb-2">Receitas e Despesas</h3>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Faturamento Anual (R$)</label>
                      <input 
                        type="number"
                        min="0"
                        value={data.annualRevenue || ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setData({...data, annualRevenue: isNaN(val) ? undefined : val});
                        }}
                        placeholder="0,00"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Folha Anual (R$)</label>
                      <input 
                        type="number"
                        min="0"
                        value={data.payrollCosts || ''}
                        onChange={(e) => setData({...data, payrollCosts: parseFloat(e.target.value)})}
                        placeholder="0,00"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                      />
                    </div>
                   </div>

                   {/* --- DESONERAÇÃO DA FOLHA (CPRB) --- */}
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 animate-fade-in">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                           <Percent className="h-4 w-4 mr-2 text-slate-600" />
                           <label className="text-sm font-bold text-slate-800">Desoneração da Folha (CPRB)</label>
                        </div>
                        <button 
                           onClick={() => setData({...data, isDesonerada: !data.isDesonerada})}
                           className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.isDesonerada ? 'bg-brand-600' : 'bg-slate-300'}`}
                        >
                           <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.isDesonerada ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">
                         Empresa optante pela substituição do INSS Patronal (20%) pela CPRB sobre a Receita Bruta?
                      </p>
                      
                      {data.isDesonerada && (
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Alíquota CPRB (%)</label>
                          <select 
                            value={data.cprbRate || 0}
                            onChange={(e) => setData({...data, cprbRate: parseFloat(e.target.value)})}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm bg-white"
                          >
                             <option value={0}>Selecione a alíquota...</option>
                             <option value={0.01}>1.0% (Indústria/Transportes)</option>
                             <option value={0.015}>1.5% (Jornalismo/Comunicação)</option>
                             <option value={0.02}>2.0% (Transportes/Calçados)</option>
                             <option value={0.025}>2.5% (Construção Civil)</option>
                             <option value={0.03}>3.0% (Call Center)</option>
                             <option value={0.045}>4.5% (TI/TIC/Hotelaria)</option>
                          </select>
                        </div>
                      )}
                   </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                   <h3 className="font-bold text-slate-800 flex items-center">
                     <ShoppingCart className="h-5 w-5 mr-2 text-brand-600" />
                     Perfil de Compras (Total)
                   </h3>
                   
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Valor Total de Compra Mensal (R$)</label>
                      <input 
                        type="number"
                        min="0"
                        value={data.monthlyPurchases || ''}
                        onChange={(e) => setData({...data, monthlyPurchases: parseFloat(e.target.value)})}
                        placeholder="0,00"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                      />
                      <p className="text-xs text-slate-500 mt-1">Este é o montante total. Abaixo, cadastre seus fornecedores principais para refinar o cálculo de crédito.</p>
                   </div>

                   {/* Suppliers List Section */}
                   <div className="border-t border-slate-200 pt-4">
                      <div className="flex items-center justify-between mb-4">
                         <h4 className="text-sm font-bold text-slate-800 flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Fornecedores Principais (Opcional)
                         </h4>
                         <button
                           onClick={() => setIsAddingSupplier(true)}
                           className="text-xs flex items-center bg-brand-600 text-white px-3 py-1.5 rounded-lg hover:bg-brand-700 transition-colors"
                         >
                           <Plus className="h-3 w-3 mr-1" />
                           Adicionar Fornecedor
                         </button>
                      </div>
                      
                      {/* List of Added Suppliers */}
                      {data.suppliers && data.suppliers.length > 0 && (
                        <div className="space-y-3 mb-4">
                           {data.suppliers.map((sup) => (
                             <div key={sup.id} className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
                                <div>
                                   <p className="text-sm font-bold text-slate-800">{sup.name || 'Fornecedor'}</p>
                                   <div className="text-xs text-slate-500 flex gap-2 mt-1">
                                      <span>{sup.regime}</span>
                                      <span className="text-slate-300">|</span>
                                      <span>{formatCurrency(sup.amount)}/mês</span>
                                   </div>
                                </div>
                                <button 
                                  onClick={() => handleRemoveSupplier(sup.id)}
                                  className="text-slate-400 hover:text-red-500 p-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                             </div>
                           ))}
                        </div>
                      )}

                      {/* Add Supplier Form */}
                      {isAddingSupplier && (
                        <div className="bg-white p-4 rounded-lg border border-brand-200 shadow-sm animate-fade-in mb-4 relative">
                           <button 
                              onClick={() => setIsAddingSupplier(false)}
                              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
                           >
                              <Check className="h-4 w-4 hidden" /> {/* Hidden, just for spacing if needed */}
                              <span className="text-xs font-bold">Cancelar</span>
                           </button>
                           
                           <h5 className="text-sm font-semibold text-brand-700 mb-3">Novo Fornecedor</h5>
                           
                           <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">CNPJ (Somente números)</label>
                                <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    value={newSupplier.cnpj}
                                    onChange={(e) => setNewSupplier({...newSupplier, cnpj: e.target.value.replace(/\D/g, '')})}
                                    placeholder="00000000000000"
                                    maxLength={14}
                                    className="flex-1 p-2 border border-slate-300 rounded text-sm bg-white"
                                  />
                                  <button 
                                    onClick={handleSupplierCnpjSearch}
                                    disabled={supplierLoading || !newSupplier.cnpj}
                                    className="bg-slate-100 text-slate-600 px-3 rounded hover:bg-slate-200"
                                  >
                                    {supplierLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                  </button>
                                </div>
                                {newSupplier.name && <p className="text-xs text-green-600 mt-1 truncate">{newSupplier.name}</p>}
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Valor de Compra (R$/mês)</label>
                                <input 
                                  type="number" 
                                  value={newSupplier.amount || ''}
                                  onChange={(e) => setNewSupplier({...newSupplier, amount: parseFloat(e.target.value)})}
                                  placeholder="0,00"
                                  className="w-full p-2 border border-slate-300 rounded text-sm bg-white"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Regime Tributário</label>
                                <select 
                                  value={newSupplier.regime}
                                  onChange={(e) => setNewSupplier({...newSupplier, regime: e.target.value as TaxRegime})}
                                  className="w-full p-2 border border-slate-300 rounded text-sm bg-white"
                                >
                                   <option value={TaxRegime.Real}>Regime Normal (Lucro Real/Presumido)</option>
                                   <option value={TaxRegime.Simples}>Simples Nacional</option>
                                </select>
                              </div>
                              
                              <button
                                onClick={handleAddSupplier}
                                className="w-full bg-brand-600 text-white py-2 rounded text-sm font-medium hover:bg-brand-700 mt-2"
                              >
                                Adicionar à Lista
                              </button>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(2)}
                  className="w-1/3 border border-slate-300 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-50"
                >
                  Voltar
                </button>
                <button 
                  onClick={handleFinalSubmit}
                  className="w-2/3 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                >
                  {initialData ? 'Atualizar Simulação' : 'Gerar Análise Completa'}
                </button>
              </div>
              {error && <p className="text-center text-sm text-red-500 mt-2">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};