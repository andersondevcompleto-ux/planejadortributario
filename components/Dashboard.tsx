
import React, { useMemo, useState, useEffect } from 'react';
import { CompanyData, SimulationResult, TaxRegime, HistoryEntry } from '../types';
import { runSimulation } from '../services/taxService';
import { generatePDF } from '../services/pdfService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Download, AlertTriangle, CheckCircle, TrendingDown, TrendingUp, Lock, FileText, FileSpreadsheet, LogOut, Settings, User, ChevronDown, PlusCircle, X, Bell, ArrowLeft, Trash2, Edit2, ChevronRight, Calendar, Database, ArrowRight, Wallet, Loader2, History } from 'lucide-react';

interface Props {
  simulations: CompanyData[];
  history: HistoryEntry[];
  onUpgrade: () => void;
  onLogout: () => void;
  onNewAnalysis: () => void;
  onEditSimulation: (id: string) => void;
  onDeleteSimulation: (id: string) => void;
}

export const Dashboard: React.FC<Props> = ({ 
  simulations, 
  history,
  onUpgrade, 
  onLogout, 
  onNewAnalysis,
  onEditSimulation,
  onDeleteSimulation
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'profile' | 'settings'>('none');
  const [selectedSimulationId, setSelectedSimulationId] = useState<string | null>(null);

  // Lazy Loading States
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Find the selected simulation object
  const activeSimulation = useMemo(() => 
    simulations.find(s => s.id === selectedSimulationId), 
  [simulations, selectedSimulationId]);
  
  // Effect to lazy load results
  useEffect(() => {
    if (activeSimulation) {
      setIsCalculating(true);
      setSimulationResult(null);
      
      // Simulate async processing time
      const timer = setTimeout(() => {
        const result = runSimulation(activeSimulation);
        setSimulationResult(result);
        setIsCalculating(false);
      }, 800);
      
      return () => clearTimeout(timer);
    } else {
      setSimulationResult(null);
      setIsCalculating(false);
    }
  }, [activeSimulation]);

  const handleDownloadPDF = () => {
    if (activeSimulation && simulationResult) {
      if (!activeSimulation.isPremium) {
        onUpgrade();
        return;
      }
      generatePDF(activeSimulation, simulationResult);
    }
  };

  // Prepare chart data for side-by-side comparison of Best Current vs Best Reform
  const comparisonData = simulationResult ? [
    {
      name: 'Atual (Mensal)',
      Imposto: simulationResult.currentScenario.taxAmountMonthly,
      Taxa: simulationResult.currentScenario.effectiveRate,
      Regime: simulationResult.currentScenario.bestRegime
    },
    {
      name: 'Reforma (Mensal)',
      Imposto: simulationResult.reformScenario.taxAmountMonthly,
      Taxa: simulationResult.reformScenario.effectiveRate,
      Regime: simulationResult.reformScenario.bestRegime
    }
  ] : [];

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const headerCompany = activeSimulation || simulations[0] || { name: 'Sua Empresa', cnpj: '...', isPremium: false, type: 'Indefinido' };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-800">TaxStrategist <span className="text-brand-600">Dashboard</span></h1>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-700 max-w-[150px] truncate">{headerCompany.name}</p>
                <p className="text-xs text-slate-500">{headerCompany.cnpj}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold border border-brand-200">
                {headerCompany.name.charAt(0)}
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-fade-in-down">
                  <div className="px-4 py-3 border-b border-slate-50 mb-1 sm:hidden">
                    <p className="text-sm font-medium text-slate-900 truncate">{headerCompany.name}</p>
                    <p className="text-xs text-slate-500 truncate">{headerCompany.cnpj}</p>
                  </div>

                  <button 
                    onClick={() => { setShowUserMenu(false); setActiveModal('profile'); }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center transition-colors"
                  >
                    <User className="h-4 w-4 mr-2 text-slate-400" /> 
                    Meu Perfil
                  </button>
                  <button 
                    onClick={() => { setShowUserMenu(false); setActiveModal('settings'); }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-2 text-slate-400" /> 
                    Configurações
                  </button>
                  <div className="border-t border-slate-50 my-1"></div>
                  <button 
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> 
                    Sair da Conta
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* VIEW: SIMULATIONS LIST */}
        {!activeSimulation && (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Suas Simulações</h2>
                <p className="text-slate-500 mt-1">Gerencie seus cenários tributários ou crie novas análises.</p>
              </div>
              <button 
                onClick={onNewAnalysis}
                className="flex items-center justify-center space-x-2 bg-brand-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Nova Simulação</span>
              </button>
            </div>

            {simulations.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Nenhuma simulação encontrada</h3>
                <p className="text-slate-500 mb-6">Comece agora para descobrir oportunidades de economia.</p>
                <button 
                  onClick={onNewAnalysis}
                  className="text-brand-600 font-medium hover:text-brand-700 hover:underline"
                >
                  Criar minha primeira simulação
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Empresa</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Regime Atual</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Faturamento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {simulations.map((sim) => (
                        <tr 
                          key={sim.id} 
                          onClick={() => sim.id && setSelectedSimulationId(sim.id)}
                          className="hover:bg-slate-50 transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                             <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold mr-4">
                                  {sim.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-slate-900">{sim.name}</div>
                                  <div className="text-sm text-slate-500">{sim.cnpj}</div>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                              {sim.currentRegime}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {formatCurrency(sim.annualRevenue)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-slate-400" />
                            {sim.createdAt ? new Date(sim.createdAt).toLocaleDateString('pt-BR') : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-1">
                              {/* Using explicit buttons with propagation stopping */}
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); if(sim.id) setSelectedSimulationId(sim.id); }}
                                className="text-brand-600 hover:text-brand-900 p-2 rounded-full hover:bg-brand-50 transition-colors" 
                                title="Ver Detalhes"
                              >
                                <ChevronRight className="h-5 w-5" />
                              </button>
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); if(sim.id) onEditSimulation(sim.id); }}
                                className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button 
                                type="button"
                                onClick={(e) => { 
                                  e.preventDefault();
                                  e.stopPropagation(); 
                                  if(sim.id) onDeleteSimulation(sim.id); 
                                }}
                                className="text-slate-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                                title="Excluir"
                              >
                                <Trash2 className="h-4 w-4 pointer-events-none" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: SIMULATION DETAILS (Comparison) */}
        {activeSimulation && (
          <div className="animate-fade-in space-y-8">
            {(!simulationResult || isCalculating) ? (
               <div className="min-h-[500px] flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm animate-pulse">
                  <div className="p-4 bg-brand-50 rounded-full mb-6">
                    <Loader2 className="h-12 w-12 text-brand-600 animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Processando Cenários</h3>
                  <p className="text-slate-500 max-w-sm text-center">
                    Nosso motor de regras está analisando o impacto da Reforma Tributária 2026 para a empresa <span className="font-semibold text-slate-700">{activeSimulation.name}</span>.
                  </p>
               </div>
            ) : simulationResult ? (
              <>
                {/* Header */}
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedSimulationId(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Resultado da Simulação</h2>
                    <p className="text-slate-500 text-sm">Comparativo: Legislação Vigente vs. Reforma 2026</p>
                  </div>
                </div>

                {/* Input Data Summary Card */}
                <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm mt-1">
                      <Database className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Dados Considerados na Análise</h3>
                      <div className="text-sm text-slate-600 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <span className="flex items-center"><span className="font-semibold mr-1">Faturamento:</span> {formatCurrency(simulationResult.inputs.revenue)}</span>
                        <span className="w-1 h-1 bg-slate-400 rounded-full self-center hidden md:block"></span>
                        <span className="flex items-center"><span className="font-semibold mr-1">Folha:</span> {formatCurrency(simulationResult.inputs.payroll)}</span>
                        <span className="w-1 h-1 bg-slate-400 rounded-full self-center hidden md:block"></span>
                        <span className="flex items-center text-slate-500">{simulationResult.inputs.details}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => activeSimulation.id && onEditSimulation(activeSimulation.id)}
                    className="text-sm font-medium text-brand-600 hover:text-brand-800 hover:bg-white px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-200 whitespace-nowrap"
                  >
                    Alterar Dados
                  </button>
                </div>

                {/* Comparison Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left: Current Scenario */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase">Hoje</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Cenário Tributário Atual</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Melhor Enquadramento</p>
                        <p className="text-xl font-bold text-slate-800">{simulationResult.currentScenario.bestRegime}</p>
                      </div>

                      <div className="border-b border-slate-100 pb-4">
                        <div className="flex items-baseline justify-between mb-2">
                          <div>
                            <p className="text-sm text-slate-500 mb-1">Imposto Mensal Estimado</p>
                            <p className="text-3xl font-extrabold text-slate-900">{formatCurrency(simulationResult.currentScenario.taxAmountMonthly)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-500 mb-1">Alíquota Efetiva</p>
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-slate-100 text-slate-800">
                              {simulationResult.currentScenario.effectiveRate.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Ranking de Opções (Atual)</p>
                        <div className="space-y-3">
                          {simulationResult.currentScenario.ranking.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                              <div className="flex justify-between items-center mb-1">
                                <span className={`font-medium text-sm ${idx === 0 ? 'text-green-600' : 'text-slate-600'}`}>
                                  {idx + 1}. {item.regime}
                                </span>
                                <div className="flex flex-col text-right">
                                    <span className="text-sm font-bold text-slate-700">{formatCurrency(item.taxAmountMonthly)} <span className="text-xs font-normal text-slate-400">/mês</span></span>
                                </div>
                              </div>
                              {/* Majoration Alert */}
                              {item.isMajored && (
                                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-start">
                                    <AlertTriangle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                    <span>Presunção do Lucro majorada conforme legislação (32% IRPJ/CSLL).</span>
                                  </div>
                              )}
                              {/* Breakdown */}
                              {item.breakdown && (item.regime === TaxRegime.Presumido || item.regime === TaxRegime.Real) && (
                                  <div className="text-[11px] text-slate-500 pt-2 mt-1 border-t border-slate-200 grid grid-cols-2 gap-2">
                                      <span>IRPJ: <b>{formatCurrency(item.breakdown.irpj)}</b></span>
                                      <span>CSLL: <b>{formatCurrency(item.breakdown.csll)}</b></span>
                                      <span>PIS/COFINS: <b>{formatCurrency(item.breakdown.pisCofins || 0)}</b></span>
                                      {item.breakdown.iss ? <span>ISS: <b>{formatCurrency(item.breakdown.iss)}</b></span> : null}
                                      {item.breakdown.laborTaxes ? <span className="col-span-2 border-t border-dashed border-slate-200 pt-1 mt-1 text-slate-600">Encargos Folha: <b>{formatCurrency(item.breakdown.laborTaxes)}</b></span> : null}
                                  </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Reform 2026 Scenario */}
                  <div className="bg-white rounded-2xl p-6 border-2 border-brand-100 shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                      <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-bold uppercase flex items-center">
                        <Calendar className="w-3 h-3 mr-1" /> 2026
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-brand-900 mb-6">Cenário Pós-Reforma</h3>

                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-brand-700/70 mb-1">Melhor Enquadramento</p>
                        <p className="text-xl font-bold text-brand-900">{simulationResult.reformScenario.bestRegime}</p>
                      </div>

                      <div className="flex items-baseline justify-between border-b border-brand-100 pb-4">
                        <div>
                          <p className="text-sm text-brand-700/70 mb-1">Imposto Mensal Estimado</p>
                          <p className="text-3xl font-extrabold text-brand-700">{formatCurrency(simulationResult.reformScenario.taxAmountMonthly)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-brand-700/70 mb-1">Alíquota Efetiva</p>
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-brand-100 text-brand-800">
                            {simulationResult.reformScenario.effectiveRate.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      
                      {/* Credits Display */}
                      <div className="bg-brand-50 rounded-lg p-3 flex items-center justify-between border border-brand-100">
                        <div className="flex items-center text-brand-700 text-sm font-medium">
                            <Wallet className="h-4 w-4 mr-2" />
                            Créditos de IVA Aproveitados
                        </div>
                        <span className="font-bold text-brand-700">
                            {formatCurrency(simulationResult.reformScenario.creditsUsed / 12)}/mês
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-brand-700/70 uppercase mb-3">Ranking de Opções (2026)</p>
                        <div className="space-y-3">
                          {simulationResult.reformScenario.ranking.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-brand-100">
                              <div className="flex flex-col">
                                <span className={`font-medium text-sm ${idx === 0 ? 'text-brand-700' : 'text-slate-500'}`}>
                                  {idx + 1}. {item.regime}
                                </span>
                                {item.details[0].includes('Redução') && (
                                  <span className="text-[10px] text-emerald-600">{item.details[0].split('(')[1]?.replace(')', '') || 'Redução Aplicada'}</span>
                                )}
                              </div>
                              <div className="flex flex-col text-right">
                                  <span className="text-sm font-bold text-slate-700">{formatCurrency(item.taxAmountMonthly)} <span className="text-xs font-normal text-slate-400">/mês</span></span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparison Visuals */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recommendation Box */}
                  <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl flex flex-col justify-center">
                    <h3 className="text-lg font-bold mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-emerald-400" />
                      Conclusão
                    </h3>
                    <p className="text-slate-300 mb-6 leading-relaxed">
                      {simulationResult.recommendation}
                    </p>
                    <div className="mt-auto pt-4 border-t border-white/10">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Diferença Mensal</p>
                      <p className={`text-2xl font-bold ${simulationResult.reformScenario.taxAmountMonthly < simulationResult.currentScenario.taxAmountMonthly ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {simulationResult.reformScenario.taxAmountMonthly < simulationResult.currentScenario.taxAmountMonthly ? '-' : '+'}
                        {formatCurrency(simulationResult.savingsMonthly)}
                      </p>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Comparativo Visual (Mensal)</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{fill: '#475569', fontSize: 13, fontWeight: 500}} />
                          <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            formatter={(val: number) => formatCurrency(val)}
                          />
                          <Bar dataKey="Imposto" radius={[0, 4, 4, 0]} barSize={40}>
                            {comparisonData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#94a3b8' : '#2563eb'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Premium Actions */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900">Precisa do relatório detalhado?</h4>
                    <p className="text-sm text-slate-500">Baixe o PDF com a memória de cálculo completa para seu contador.</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={handleDownloadPDF}
                      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${headerCompany.isPremium ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/20'}`}
                    >
                      {headerCompany.isPremium ? <Download className="h-4 w-4 mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                      {headerCompany.isPremium ? 'Baixar PDF Completo' : 'Desbloquear PDF'}
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>

      {/* Modals for Profile and Settings */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setActiveModal('none')}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">
                {activeModal === 'profile' ? 'Meu Perfil' : 'Configurações'}
              </h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              {activeModal === 'profile' ? (
                <div className="space-y-6">
                   <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-2xl font-bold border-2 border-brand-200">
                      {headerCompany.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">{headerCompany.name}</h4>
                      <p className="text-sm text-slate-500">{headerCompany.type}</p>
                    </div>
                  </div>
                   <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">CNPJ</label>
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-700 font-mono text-sm border border-slate-200">
                        {headerCompany.cnpj}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Action History Log */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center">
                      <History className="h-4 w-4 mr-2 text-brand-500" /> Histórico de Ações
                    </h4>
                    <div className="space-y-3">
                      {history.length > 0 ? (
                        history.map((entry) => (
                          <div key={entry.id} className="flex items-start justify-between py-2 border-b border-slate-100 last:border-0">
                            <div className="flex flex-col">
                              <span className="text-sm text-slate-700">{entry.action}</span>
                              <span className="text-[10px] text-slate-400">{entry.timestamp.toLocaleString('pt-BR')}</span>
                            </div>
                            <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500 italic">Nenhuma ação registrada recentemente.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center">
                      <Bell className="h-4 w-4 mr-2 text-brand-500" /> Notificações
                    </h4>
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Alertas de Vencimento</span>
                      <div className="w-11 h-6 bg-brand-600 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100">
                     <button className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center">
                       <LogOut className="h-4 w-4 mr-2" /> Encerrar todas as sessões
                     </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
