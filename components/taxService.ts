import { CompanyData, SimulationResult, TaxRegime, CompanyType, ScenarioResult, ServiceCategory } from '../types';

// Mock API response delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Tabela de Alíquotas Internas de ICMS por Estado (Estimativa 2024/2025)
// Usado para pré-carregar o valor correto no Onboarding e cálculos.
export const ICMS_RATES: Record<string, number> = {
  'AC': 17, 'AL': 19, 'AM': 20, 'AP': 18, 'BA': 20.5, 'CE': 20, 'DF': 20, 'ES': 17,
  'GO': 19, 'MA': 22, 'MG': 18, 'MS': 17, 'MT': 17, 'PA': 19, 'PB': 20, 'PE': 20.5,
  'PI': 21, 'PR': 19.5, 'RJ': 22, 'RN': 20, 'RO': 17.5, 'RR': 20, 'RS': 17, 'SC': 17,
  'SE': 19, 'SP': 18, 'TO': 20
};

export const lookupCNPJ = async (cnpj: string): Promise<{ name: string; municipality: string; state: string }> => {
  await delay(800); 
  // Simulation of a lookup based on CNPJ ending to vary the response slightly for demo
  const lastDigit = parseInt(cnpj.replace(/\D/g, '').slice(-1)) || 0;
  
  const cities = [
    { m: 'São Paulo', s: 'SP' },
    { m: 'Rio de Janeiro', s: 'RJ' },
    { m: 'Belo Horizonte', s: 'MG' },
    { m: 'Porto Alegre', s: 'RS' },
    { m: 'Curitiba', s: 'PR' }
  ];
  
  const location = cities[lastDigit % cities.length];

  return {
    name: "EMPRESA MODELO S.A.",
    municipality: location.m,
    state: location.s
  };
};

/**
 * TABELAS DO SIMPLES NACIONAL (Vigência 2024/2025)
 * Faixas: Limite Superior, Alíquota Nominal, Valor a Deduzir
 */
const TABLES_SIMPLES: Record<string, { limit: number, rate: number, deduction: number }[]> = {
  'Anexo I': [ // Comércio
    { limit: 180000, rate: 0.04, deduction: 0 },
    { limit: 360000, rate: 0.073, deduction: 5940 },
    { limit: 720000, rate: 0.095, deduction: 13860 },
    { limit: 1800000, rate: 0.107, deduction: 22500 },
    { limit: 3600000, rate: 0.143, deduction: 87300 },
    { limit: 4800000, rate: 0.19, deduction: 378000 },
  ],
  'Anexo II': [ // Indústria
    { limit: 180000, rate: 0.045, deduction: 0 },
    { limit: 360000, rate: 0.078, deduction: 5940 },
    { limit: 720000, rate: 0.1, deduction: 13860 },
    { limit: 1800000, rate: 0.112, deduction: 22500 },
    { limit: 3600000, rate: 0.147, deduction: 85500 },
    { limit: 4800000, rate: 0.30, deduction: 720000 },
  ],
  'Anexo III': [ // Serviços (Fator R ou Padrão)
    { limit: 180000, rate: 0.06, deduction: 0 },
    { limit: 360000, rate: 0.112, deduction: 9360 },
    { limit: 720000, rate: 0.135, deduction: 17640 },
    { limit: 1800000, rate: 0.16, deduction: 35640 },
    { limit: 3600000, rate: 0.21, deduction: 125640 },
    { limit: 4800000, rate: 0.33, deduction: 648000 },
  ],
  'Anexo IV': [ // Serviços (Vigilância, Limpeza, Advocacia, Obras) - INSS Patronal Por Fora!
    { limit: 180000, rate: 0.045, deduction: 0 },
    { limit: 360000, rate: 0.09, deduction: 8100 },
    { limit: 720000, rate: 0.102, deduction: 12420 },
    { limit: 1800000, rate: 0.14, deduction: 39780 },
    { limit: 3600000, rate: 0.22, deduction: 183780 },
    { limit: 4800000, rate: 0.33, deduction: 579780 },
  ],
  'Anexo V': [ // Serviços Sujeitos a Fator R
    { limit: 180000, rate: 0.155, deduction: 0 },
    { limit: 360000, rate: 0.18, deduction: 4500 },
    { limit: 720000, rate: 0.195, deduction: 9900 },
    { limit: 1800000, rate: 0.205, deduction: 17100 },
    { limit: 3600000, rate: 0.23, deduction: 62100 },
    { limit: 4800000, rate: 0.305, deduction: 540000 },
  ]
};

/**
 * Estimativa da Parcela de Impostos de Consumo dentro do DAS (PIS/COFINS/ISS/ICMS/IPI).
 * Usado para calcular o "Simples Híbrido" na reforma.
 * O restante é considerado Renda/Folha (IRPJ, CSLL, CPP).
 */
const SIMPLES_CONSUMPTION_SHARE: Record<string, number> = {
  'Anexo I': 0.46, // ~34% ICMS + ~12% PIS/COFINS
  'Anexo II': 0.52, // ~32% ICMS + ~12% PIS/COFINS + 8% IPI
  'Anexo III': 0.48, // ~33% ISS + ~15% PIS/COFINS
  'Anexo IV': 0.57, // ~45% ISS + ~12% PIS/COFINS (Base é menor pois não tem CPP)
  'Anexo V': 0.28, // ~16% ISS + ~12% PIS/COFINS (Alíquota total alta devido a CPP/IRPJ)
};

/**
 * Calcula a Alíquota Efetiva do Simples Nacional
 * Fórmula: (RBT12 * AliqNominal - ParcelaDeduzir) / RBT12
 */
const calculateSimplesEffectiveRate = (revenue12m: number, anexo: string, payroll12m: number, subjectToFactorR: boolean): { tax: number, rate: number, explanation: string, finalAnexo: string } => {
  let finalAnexo = anexo;
  let explanation = `Cálculo base conforme ${anexo}`;

  // Safe Guard for zero revenue
  if (revenue12m <= 0) {
     return { tax: 0, rate: 0, explanation: 'Sem faturamento', finalAnexo: anexo };
  }

  // Lógica do Fator R
  if (subjectToFactorR) {
    const factorR = payroll12m / revenue12m;
    if (factorR >= 0.28) {
      finalAnexo = 'Anexo III';
      explanation = `Fator R (${(factorR * 100).toFixed(1)}%) ≥ 28%: Enquadramento reduzido para Anexo III`;
    } else {
      finalAnexo = 'Anexo V';
      explanation = `Fator R (${(factorR * 100).toFixed(1)}%) < 28%: Tributação no Anexo V`;
    }
  }

  const table = TABLES_SIMPLES[finalAnexo] || TABLES_SIMPLES['Anexo III'];
  
  // Encontrar faixa
  const range = table.find(r => revenue12m <= r.limit) || table[table.length - 1];
  
  // Cálculo Oficial
  const nominalTax = revenue12m * range.rate;
  const finalTax = Math.max(0, nominalTax - range.deduction);
  const effectiveRate = finalTax / revenue12m;

  return {
    tax: finalTax,
    rate: effectiveRate,
    explanation,
    finalAnexo
  };
};

export const runSimulation = (data: CompanyData): SimulationResult => {
  const annualRevenue = data.annualRevenue || 0;
  const annualPayroll = data.payrollCosts || 0;
  const monthlyPurchases = data.monthlyPurchases || 0;
  const annualPurchases = monthlyPurchases * 12;

  // --- CALCULATE GENERAL LABOR CHARGES (Relevant for Presumido, Real AND Simples Anexo IV) ---
  const RAT_OTHERS_RATE = 0.08; // Estimate for RAT + System S
  const CPP_RATE_STANDARD = 0.20; // INSS Patronal

  let laborTaxYearly = 0;
  let laborExplanation = '';

  if (data.isDesonerada && data.cprbRate) {
     const cprbValue = annualRevenue * data.cprbRate;
     const otherLaborTaxes = annualPayroll * RAT_OTHERS_RATE;
     laborTaxYearly = cprbValue + otherLaborTaxes;
     laborExplanation = `CPRB (${(data.cprbRate*100).toFixed(1)}%) + Encargos`;
  } else {
     laborTaxYearly = annualPayroll * (CPP_RATE_STANDARD + RAT_OTHERS_RATE);
     laborExplanation = `Folha (20% INSS + RAT/Terceiros)`;
  }

  // --- ICMS & IPI CALCULATION ENGINE ---
  // Default values or Look up based on state
  let icmsInternal = 0.18; // Default
  if (data.icmsInternalRate) {
    icmsInternal = data.icmsInternalRate / 100;
  } else if (data.state && ICMS_RATES[data.state.toUpperCase()]) {
    icmsInternal = ICMS_RATES[data.state.toUpperCase()] / 100;
  }
  
  // If selling interstate, typical rates are 12% (normal) or 7% (to N/NE/ES) or 4% (imported)
  // We approximate using the percentage provided
  const interstatePercent = (data.icmsInterstatePercent || 0) / 100;
  const internalPercent = 1 - interstatePercent;
  
  // Weighted Average ICMS Rate on Sales
  // Ex: 80% Internal (18%) + 20% Interstate (12%)
  const avgIcmsDebitRate = (internalPercent * icmsInternal) + (interstatePercent * 0.12);
  
  // IPI Rate (Industry Only)
  const ipiRate = (data.type === CompanyType.Industria && data.industryIpiRate) 
      ? (data.industryIpiRate / 100) 
      : 0;

  // --- 1. SIMPLES NACIONAL ---
  const simplesResult = calculateSimplesEffectiveRate(
    annualRevenue, 
    data.simplesAnexo || (data.type === CompanyType.Industria ? 'Anexo II' : (data.type === CompanyType.Comercio ? 'Anexo I' : 'Anexo III')), 
    annualPayroll, 
    data.simplesFatorR || false
  );

  let totalSimples = simplesResult.tax;
  let simplesDetails = simplesResult.explanation;
  let simplesIncludedCPP = true;

  // SPECIFIC RULE: Anexo IV DOES NOT include CPP (Payroll Tax) in the DAS.
  if (simplesResult.finalAnexo === 'Anexo IV') {
    totalSimples += laborTaxYearly;
    simplesDetails += ' + INSS Patronal (Pago à parte no Anexo IV)';
    simplesIncludedCPP = false;
  } else {
    simplesDetails += ' (INSS Patronal incluído no DAS)';
  }

  // --- 2. LUCRO PRESUMIDO (2025) ---
  // PIS/COFINS (Cumulativo): 0.65% + 3.00% = 3.65%
  // ISS (Serviços): Estimado em 5%
  // ICMS (Indústria/Comércio): Não-Cumulativo (Débito - Crédito)
  // IPI (Indústria): Não-Cumulativo (Débito - Crédito)
  
  const pisCofinsPresumidoRate = 0.0365;
  
  let irpjBaseRate = 0.32; // Default Serviço
  let csllBaseRate = 0.32; // Default Serviço
  let isMajored = false;
  let issPresumidoYearly = 0;
  let icmsPresumidoYearly = 0;
  let ipiPresumidoYearly = 0;
  let consumptionExplanation = '';

  if (data.type === CompanyType.Comercio || data.type === CompanyType.Industria) {
    irpjBaseRate = 0.08;
    csllBaseRate = 0.12;
    isMajored = false;
    issPresumidoYearly = 0; 
    
    // ICMS Calculation (Simplified Non-Cumulative)
    const icmsDebit = annualRevenue * avgIcmsDebitRate;
    // Estimate credit on purchases (Assume purchases have standard ICMS embedded)
    // Conservatively assume 12% credit on all purchases (interstate assumption) or full internal if local
    const icmsCreditRate = 0.12; // Average credit rate
    const icmsCredit = annualPurchases * icmsCreditRate; 
    icmsPresumidoYearly = Math.max(0, icmsDebit - icmsCredit);
    
    consumptionExplanation = `ICMS: Média ${(avgIcmsDebitRate*100).toFixed(1)}% (Débito) - Crédito Compras`;

    // IPI Calculation
    if (data.type === CompanyType.Industria) {
      const ipiDebit = annualRevenue * ipiRate;
      const ipiCredit = annualPurchases * (ipiRate * 0.5); // Estimate 50% of purchases generate IPI credit
      ipiPresumidoYearly = Math.max(0, ipiDebit - ipiCredit);
      consumptionExplanation += ` | IPI: ${(ipiRate*100).toFixed(1)}%`;
    }

  } else {
    // É Serviço
    isMajored = true;
    
    // Check for Sociedade Uniprofissional (Fixed ISS)
    if (data.isSup && data.supProfessionalCount && data.supTaxAmountMonthly) {
       issPresumidoYearly = data.supProfessionalCount * data.supTaxAmountMonthly * 12;
       consumptionExplanation = `ISS Fixo (Uniprofissional)`;
    } else {
       // ISS Ad Valorem (Standard)
       const standardIssRate = 0.05; // 5% estimate
       issPresumidoYearly = annualRevenue * standardIssRate;
       consumptionExplanation = `ISS (Est.): ${(standardIssRate * 100).toFixed(0)}%`;
    }
  }

  const irpjBase = annualRevenue * irpjBaseRate;
  const csllBase = annualRevenue * csllBaseRate;

  const irpjBasic = irpjBase * 0.15;
  const irpjAdicional = Math.max(0, (irpjBase - 240000) * 0.10);
  const totalIrpjPresumido = irpjBasic + irpjAdicional;
  
  const csll = csllBase * 0.09;
  const pisCofinsPresumido = annualRevenue * pisCofinsPresumidoRate;

  // Total Presumido
  const totalPresumido = totalIrpjPresumido + csll + pisCofinsPresumido + issPresumidoYearly + icmsPresumidoYearly + ipiPresumidoYearly + laborTaxYearly;

  // --- 3. LUCRO REAL (2025) ---
  // PIS/COFINS (Não-Cumulativo): 1.65% + 7.6% = 9.25%
  // ICMS & IPI same logic as Presumido (Non-Cumulative state/federal rules apply equally)
  
  const pisCofinsRealRate = 0.0925;
  const pisCofinsDebit = annualRevenue * pisCofinsRealRate;
  const pisCofinsCredit = annualPurchases * pisCofinsRealRate; 
  const pisCofinsNet = Math.max(0, pisCofinsDebit - pisCofinsCredit);

  // Accounting Profit Calculation
  const operationalExpenses = data.realDeductionAmount || 0;
  let accountingProfit = annualRevenue - annualPurchases - annualPayroll - operationalExpenses;

  // LALUR
  const additions = data.realAdditions || 0;
  const exclusions = data.realExclusions || 0;
  
  let taxableProfitBeforeLoss = accountingProfit + additions - exclusions;
  let lossOffset = 0;
  if (taxableProfitBeforeLoss > 0 && data.realAccumulatedLoss && data.realAccumulatedLoss > 0) {
     const maxOffset = taxableProfitBeforeLoss * 0.30;
     lossOffset = Math.min(data.realAccumulatedLoss, maxOffset);
  }

  let finalTaxableProfit = taxableProfitBeforeLoss - lossOffset;
  if (finalTaxableProfit < 0) finalTaxableProfit = 0; 

  // Taxes
  const irpjRealBasic = finalTaxableProfit * 0.15;
  const irpjRealAdicional = Math.max(0, (finalTaxableProfit - 240000) * 0.10);
  const totalIrpjReal = irpjRealBasic + irpjRealAdicional;

  const csllReal = finalTaxableProfit * 0.09;
  
  let issRealYearly = 0;
  let icmsRealYearly = 0;
  let ipiRealYearly = 0;

  if (data.type === CompanyType.Servico) {
     if (data.isSup && data.supProfessionalCount && data.supTaxAmountMonthly) {
        issRealYearly = data.supProfessionalCount * data.supTaxAmountMonthly * 12;
     } else {
        issRealYearly = annualRevenue * 0.05;
     }
  } else {
     // Comercio/Industria - Logic identical to Presumido for VATs
     const icmsDebit = annualRevenue * avgIcmsDebitRate;
     const icmsCredit = annualPurchases * 0.12; 
     icmsRealYearly = Math.max(0, icmsDebit - icmsCredit);

     if (data.type === CompanyType.Industria) {
        const ipiDebit = annualRevenue * ipiRate;
        const ipiCredit = annualPurchases * (ipiRate * 0.5); 
        ipiRealYearly = Math.max(0, ipiDebit - ipiCredit);
     }
  }

  // Total Real
  const totalReal = totalIrpjReal + csllReal + pisCofinsNet + issRealYearly + icmsRealYearly + ipiRealYearly + laborTaxYearly;
  
  const lalurDetails = `Lucro Contábil: ${accountingProfit.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;

  // Safe division for effective rate
  const safeEffectiveRate = (tax: number) => annualRevenue > 0 ? (tax / annualRevenue) * 100 : 0;

  // Ranking Current
  const currentScenarios: ScenarioResult[] = [
    { 
        regime: TaxRegime.Simples, 
        taxAmountYearly: totalSimples, 
        taxAmountMonthly: totalSimples / 12,
        effectiveRate: safeEffectiveRate(totalSimples), 
        creditsUsedYearly: 0,
        details: [simplesDetails] 
    },
    { 
        regime: TaxRegime.Presumido, 
        taxAmountYearly: totalPresumido, 
        taxAmountMonthly: totalPresumido / 12,
        effectiveRate: safeEffectiveRate(totalPresumido), 
        creditsUsedYearly: 0,
        details: [`PIS/COFINS (3.65%)`, consumptionExplanation, `IRPJ/CSLL Presumido`, laborExplanation],
        breakdown: {
            irpj: totalIrpjPresumido / 12,
            csll: csll / 12,
            pisCofins: pisCofinsPresumido / 12,
            iss: issPresumidoYearly / 12,
            icms: icmsPresumidoYearly / 12,
            ipi: ipiPresumidoYearly / 12,
            laborTaxes: laborTaxYearly / 12
        },
        isMajored: isMajored
    },
    { 
        regime: TaxRegime.Real, 
        taxAmountYearly: totalReal, 
        taxAmountMonthly: totalReal / 12,
        effectiveRate: safeEffectiveRate(totalReal), 
        creditsUsedYearly: pisCofinsCredit,
        details: [`PIS/COFINS (9.25%)`, consumptionExplanation, lalurDetails, `Crédito PIS/COFINS: R$ ${pisCofinsCredit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`],
        breakdown: {
            irpj: totalIrpjReal / 12,
            csll: csllReal / 12,
            pisCofins: pisCofinsNet / 12,
            iss: issRealYearly / 12,
            icms: icmsRealYearly / 12,
            ipi: ipiRealYearly / 12,
            laborTaxes: laborTaxYearly / 12
        } 
    },
  ];
  currentScenarios.sort((a, b) => a.taxAmountYearly - b.taxAmountYearly);


  // --- 4. REFORMA TRIBUTÁRIA 2026+ (IVA DUAL - IBS/CBS) ---
  
  // Base Standard Rate
  let ivaRate = 0.265;
  let reformExplanation = 'Alíquota Padrão (26.5%)';

  // Apply Service Reductions
  if (data.type === CompanyType.Servico && data.serviceCategory) {
    if (data.serviceCategory === ServiceCategory.SaudeEducacao) {
      ivaRate = ivaRate * 0.4; 
      reformExplanation = 'Redução de 60% (Saúde/Educação)';
    } else if (data.serviceCategory === ServiceCategory.ProfissionalLiberal) {
      ivaRate = ivaRate * 0.7; 
      reformExplanation = 'Redução de 30% (Prof. Liberal)';
    }
  }

  // REFORM INDUSTRY SPECIFICS: Imposto Seletivo (Sin Tax)
  // Replaces IPI for harmful goods. IPI is extinguished for everything else.
  let impostoSeletivo = 0;
  if (data.industryHarmfulProduct) {
     // Estimating Sin Tax (IS) add-on
     const isRate = 0.15; // Estimate 15% surcharge for harmful goods
     impostoSeletivo = annualRevenue * isRate;
     reformExplanation += ' + Imposto Seletivo (Nocivos)';
  }

  const ivaDebit = (annualRevenue - exclusions) * ivaRate; 

  // Calculate Weighted Credit
  let totalIvaCredit = 0;
  let trackedPurchases = 0;
  
  if (data.suppliers && data.suppliers.length > 0) {
    data.suppliers.forEach(sup => {
       const supplierRate = sup.regime === TaxRegime.Simples ? 0.07 : 0.265; 
       const yearlyAmount = sup.amount * 12;
       totalIvaCredit += yearlyAmount * supplierRate;
       trackedPurchases += yearlyAmount;
    });
  }

  // Remaining purchases credit
  const remainingPurchases = Math.max(0, annualPurchases - trackedPurchases);
  if (remainingPurchases > 0) {
      totalIvaCredit += remainingPurchases * 0.265; 
  }

  const totalIva = Math.max(0, ivaDebit - totalIvaCredit);
  const totalReformLiability = totalIva + impostoSeletivo + laborTaxYearly;

  // --- SIMPLES NACIONAL NA REFORMA (2 Cenários) ---
  const reformSimplesPureTax = totalSimples;

  // Simples Híbrido Calculation
  const consumptionShare = SIMPLES_CONSUMPTION_SHARE[simplesResult.finalAnexo] || 0.48;
  const dasTax = simplesResult.tax;
  const dasOnly = (simplesResult.finalAnexo === 'Anexo IV') ? (totalSimples - laborTaxYearly) : totalSimples;
  
  const dasConsumptionPart = dasOnly * consumptionShare;
  const dasIncomePart = dasOnly - dasConsumptionPart; 

  let hybridTax = dasIncomePart + totalIva + impostoSeletivo;
  
  if (simplesResult.finalAnexo === 'Anexo IV') {
     hybridTax += laborTaxYearly;
  }

  const reformScenarios: ScenarioResult[] = [
    { 
        regime: TaxRegime.Simples, 
        taxAmountYearly: reformSimplesPureTax, 
        taxAmountMonthly: reformSimplesPureTax / 12,
        effectiveRate: safeEffectiveRate(reformSimplesPureTax), 
        creditsUsedYearly: 0, 
        details: ['Mantém DAS único', 'Alerta: Gera pouco crédito para clientes B2B'] 
    },
    { 
        regime: 'Simples Nacional + IVA (Híbrido)', 
        taxAmountYearly: hybridTax, 
        taxAmountMonthly: hybridTax / 12,
        effectiveRate: safeEffectiveRate(hybridTax), 
        creditsUsedYearly: totalIvaCredit, 
        details: ['Recolhe IBS/CBS por fora', 'Ideal para prestadores B2B'] 
    },
    { 
        regime: TaxRegime.IBS_CBS, 
        taxAmountYearly: totalReformLiability, 
        taxAmountMonthly: totalReformLiability / 12,
        effectiveRate: safeEffectiveRate(totalReformLiability), 
        creditsUsedYearly: totalIvaCredit,
        details: [`IVA Estimado: ${(ivaRate*100).toFixed(1)}% (${reformExplanation})`, `Fim do IPI (Extinto)`, `Imposto Seletivo (se aplicável)`],
        breakdown: {
          irpj: 0, csll: 0, iva: totalIva / 12, impostoSeletivo: impostoSeletivo / 12, laborTaxes: laborTaxYearly / 12
        }
    }
  ];
  reformScenarios.sort((a, b) => a.taxAmountYearly - b.taxAmountYearly);

  // --- 5. RESULTADOS FINAIS ---

  const currentBest = currentScenarios[0];
  const reformBest = reformScenarios[0];

  let recommendation = '';
  
  if (data.type === CompanyType.Industria) {
    if (data.industryHarmfulProduct) {
       recommendation = `Indústria de Nocivos: O novo Imposto Seletivo encarecerá sua operação na Reforma. O Simples Nacional tende a ser um refúgio tributário importante para evitar essa sobretaxa.`;
    } else {
       recommendation = `Indústria Geral: A extinção do IPI e a unificação do ICMS no IVA trarão simplificação radical. Seus insumos gerarão crédito pleno (IBS/CBS), favorecendo o Lucro Real ou o Regime Geral do IVA.`;
    }
  } else {
    // Logic for services/commerce generic
     if (reformBest.taxAmountYearly < currentBest.taxAmountYearly) {
      recommendation = `Atenção: A migração para o IVA (Regime Geral) projeta uma economia.`;
    } else {
      recommendation = `O Simples Nacional continua sendo mais vantajoso financeiramente.`;
    }
  }

  const dataDetails = [];
  dataDetails.push(`Compras/mês: ${monthlyPurchases.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`);
  if (data.type === CompanyType.Industria) dataDetails.push(`IPI Médio: ${data.industryIpiRate}%`);

  return {
    inputs: {
      revenue: annualRevenue,
      payroll: annualPayroll,
      regime: data.currentRegime,
      details: dataDetails.join(' • ')
    },
    currentScenario: {
      bestRegime: currentBest.regime,
      taxAmountMonthly: currentBest.taxAmountMonthly,
      effectiveRate: currentBest.effectiveRate || 0,
      creditsUsed: currentBest.creditsUsedYearly,
      ranking: currentScenarios
    },
    reformScenario: {
      bestRegime: reformBest.regime,
      taxAmountMonthly: reformBest.taxAmountMonthly,
      effectiveRate: reformBest.effectiveRate || 0,
      creditsUsed: reformBest.creditsUsedYearly,
      ranking: reformScenarios
    },
    recommendation,
    savingsMonthly: Math.abs(currentBest.taxAmountMonthly - reformBest.taxAmountMonthly)
  };
};