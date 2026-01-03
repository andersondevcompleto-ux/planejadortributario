
import { CompanyData, SimulationResult, TaxRegime, CompanyType, ScenarioResult, ServiceCategory, CNAE } from './types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ICMS_RATES: Record<string, number> = {
  'AC': 17, 'AL': 19, 'AM': 20, 'AP': 18, 'BA': 20.5, 'CE': 20, 'DF': 20, 'ES': 17,
  'GO': 19, 'MA': 22, 'MG': 18, 'MS': 17, 'MT': 17, 'PA': 19, 'PB': 20, 'PE': 20.5,
  'PI': 21, 'PR': 19.5, 'RJ': 22, 'RN': 20, 'RO': 17.5, 'RR': 20, 'RS': 17, 'SC': 17,
  'SE': 19, 'SP': 18, 'TO': 20
};

// Helper para inferir tipo de empresa pelo código CNAE
const inferTypeFromCNAE = (code: string): CompanyType => {
  const prefix = parseInt(code.substring(0, 2));
  if (prefix >= 1 && prefix <= 33) return CompanyType.Industria;
  if (prefix >= 45 && prefix <= 47) return CompanyType.Comercio;
  return CompanyType.Servico;
};

export const lookupCNPJ = async (cnpj: string): Promise<{ 
  name: string; 
  municipality: string; 
  state: string;
  primaryCnae: CNAE;
  secondaryCnaes: CNAE[];
}> => {
  await delay(1200); 
  const lastDigit = parseInt(cnpj.replace(/\D/g, '').slice(-1)) || 0;
  
  const cities = [
    { m: 'São Paulo', s: 'SP' },
    { m: 'Rio de Janeiro', s: 'RJ' },
    { m: 'Belo Horizonte', s: 'MG' },
    { m: 'Porto Alegre', s: 'RS' },
    { m: 'Curitiba', s: 'PR' }
  ];
  
  const location = cities[lastDigit % cities.length];

  const primaryCnaes = [
    { code: '6201-5/00', description: 'Desenvolvimento de programas de computador sob encomenda', type: CompanyType.Servico },
    { code: '4751-2/01', description: 'Comércio varejista especializado de equipamentos e suprimentos de informática', type: CompanyType.Comercio },
    { code: '1011-2/01', description: 'Frigorífico - abate de bovinos', type: CompanyType.Industria },
    { code: '8630-5/03', description: 'Atividade médica ambulatorial restrita a consultas', type: CompanyType.Servico },
    { code: '8513-9/00', description: 'Ensino fundamental', type: CompanyType.Servico }
  ];

  const secondaryCnaes = [
    { code: '8219-9/99', description: 'Preparação de documentos e serviços especializados de apoio administrativo', type: CompanyType.Servico },
    { code: '7490-1/04', description: 'Atividades de intermediação e agenciamento de serviços e negócios em geral', type: CompanyType.Servico },
    { code: '8599-6/04', description: 'Treinamento em desenvolvimento profissional e gerencial', type: CompanyType.Servico }
  ];

  return {
    name: "EMPRESA MODELO ESTRATÉGICA S.A.",
    municipality: location.m,
    state: location.s,
    primaryCnae: primaryCnaes[lastDigit % primaryCnaes.length],
    secondaryCnaes: secondaryCnaes
  };
};

const TABLES_SIMPLES: Record<string, { limit: number, rate: number, deduction: number }[]> = {
  'Anexo I': [ 
    { limit: 180000, rate: 0.04, deduction: 0 },
    { limit: 360000, rate: 0.073, deduction: 5940 },
    { limit: 720000, rate: 0.095, deduction: 13860 },
    { limit: 1800000, rate: 0.107, deduction: 22500 },
    { limit: 3600000, rate: 0.143, deduction: 87300 },
    { limit: 4800000, rate: 0.19, deduction: 378000 },
  ],
  'Anexo II': [ 
    { limit: 180000, rate: 0.045, deduction: 0 },
    { limit: 360000, rate: 0.078, deduction: 5940 },
    { limit: 720000, rate: 0.1, deduction: 13860 },
    { limit: 1800000, rate: 0.112, deduction: 22500 },
    { limit: 3600000, rate: 0.147, deduction: 85500 },
    { limit: 4800000, rate: 0.30, deduction: 720000 },
  ],
  'Anexo III': [ 
    { limit: 180000, rate: 0.06, deduction: 0 },
    { limit: 360000, rate: 0.112, deduction: 9360 },
    { limit: 720000, rate: 0.135, deduction: 17640 },
    { limit: 1800000, rate: 0.16, deduction: 35640 },
    { limit: 3600000, rate: 0.21, deduction: 125640 },
    { limit: 4800000, rate: 0.33, deduction: 648000 },
  ],
  'Anexo IV': [ 
    { limit: 180000, rate: 0.045, deduction: 0 },
    { limit: 360000, rate: 0.09, deduction: 8100 },
    { limit: 720000, rate: 0.102, deduction: 12420 },
    { limit: 1800000, rate: 0.14, deduction: 39780 },
    { limit: 3600000, rate: 0.22, deduction: 183780 },
    { limit: 4800000, rate: 0.33, deduction: 579780 },
  ],
  'Anexo V': [ 
    { limit: 180000, rate: 0.155, deduction: 0 },
    { limit: 360000, rate: 0.18, deduction: 4500 },
    { limit: 720000, rate: 0.195, deduction: 9900 },
    { limit: 1800000, rate: 0.205, deduction: 17100 },
    { limit: 3600000, rate: 0.23, deduction: 62100 },
    { limit: 4800000, rate: 0.305, deduction: 540000 },
  ]
};

const SIMPLES_CONSUMPTION_SHARE: Record<string, number> = {
  'Anexo I': 0.46, 
  'Anexo II': 0.52, 
  'Anexo III': 0.48, 
  'Anexo IV': 0.57, 
  'Anexo V': 0.28, 
};

const calculateSimplesEffectiveRate = (revenue12m: number, anexo: string, payroll12m: number, subjectToFactorR: boolean): { tax: number, rate: number, explanation: string, finalAnexo: string } => {
  let finalAnexo = anexo;
  let explanation = `Cálculo base conforme ${anexo}`;

  if (revenue12m <= 0) {
     return { tax: 0, rate: 0, explanation: 'Sem faturamento', finalAnexo: anexo };
  }

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
  const range = table.find(r => revenue12m <= r.limit) || table[table.length - 1];
  const nominalTax = revenue12m * range.rate;
  const finalTax = Math.max(0, nominalTax - range.deduction);
  const effectiveRate = finalTax / revenue12m;

  return { tax: finalTax, rate: effectiveRate, explanation, finalAnexo };
};

export const runSimulation = (data: CompanyData): SimulationResult => {
  const annualRevenue = data.annualRevenue || 0;
  const annualPayroll = data.payrollCosts || 0;
  const monthlyPurchases = data.monthlyPurchases || 0;
  const annualPurchases = monthlyPurchases * 12;

  const RAT_OTHERS_RATE = 0.08; 
  const CPP_RATE_STANDARD = 0.20; 

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

  let icmsInternal = 0.18; 
  if (data.icmsInternalRate) {
    icmsInternal = data.icmsInternalRate / 100;
  } else if (data.state && ICMS_RATES[data.state.toUpperCase()]) {
    icmsInternal = ICMS_RATES[data.state.toUpperCase()] / 100;
  }
  
  const interstatePercent = (data.icmsInterstatePercent || 0) / 100;
  const internalPercent = 1 - interstatePercent;
  const avgIcmsDebitRate = (internalPercent * icmsInternal) + (interstatePercent * 0.12);
  const ipiRate = (data.type === CompanyType.Industria && data.industryIpiRate) ? (data.industryIpiRate / 100) : 0;

  const simplesResult = calculateSimplesEffectiveRate(
    annualRevenue, 
    data.simplesAnexo || (data.type === CompanyType.Industria ? 'Anexo II' : (data.type === CompanyType.Comercio ? 'Anexo I' : 'Anexo III')), 
    annualPayroll, 
    data.simplesFatorR || false
  );

  let totalSimples = simplesResult.tax;
  let simplesDetails = simplesResult.explanation;
  if (simplesResult.finalAnexo === 'Anexo IV') {
    totalSimples += laborTaxYearly;
    simplesDetails += ' + INSS Patronal (Anexo IV)';
  } else {
    simplesDetails += ' (INSS Patronal incluído)';
  }

  const pisCofinsPresumidoRate = 0.0365;
  let irpjBaseRate = 0.32; 
  let csllBaseRate = 0.32; 
  let isMajored = false;
  let issPresumidoYearly = 0;
  let icmsPresumidoYearly = 0;
  let ipiPresumidoYearly = 0;
  let consumptionExplanation = '';

  if (data.type === CompanyType.Comercio || data.type === CompanyType.Industria) {
    irpjBaseRate = 0.08;
    csllBaseRate = 0.12;
    const icmsDebit = annualRevenue * avgIcmsDebitRate;
    const icmsCredit = annualPurchases * 0.12; 
    icmsPresumidoYearly = Math.max(0, icmsDebit - icmsCredit);
    consumptionExplanation = `ICMS: Média ${(avgIcmsDebitRate*100).toFixed(1)}%`;
    if (data.type === CompanyType.Industria) {
      const ipiDebit = annualRevenue * ipiRate;
      const ipiCredit = annualPurchases * (ipiRate * 0.5); 
      ipiPresumidoYearly = Math.max(0, ipiDebit - ipiCredit);
      consumptionExplanation += ` | IPI: ${(ipiRate*100).toFixed(1)}%`;
    }
  } else {
    isMajored = true;
    if (data.isSup && data.supProfessionalCount && data.supTaxAmountMonthly) {
       issPresumidoYearly = data.supProfessionalCount * data.supTaxAmountMonthly * 12;
       consumptionExplanation = `ISS Fixo`;
    } else {
       issPresumidoYearly = annualRevenue * 0.05;
       consumptionExplanation = `ISS: 5%`;
    }
  }

  const irpjBase = annualRevenue * irpjBaseRate;
  const csllBase = annualRevenue * csllBaseRate;
  const totalIrpjPresumido = (irpjBase * 0.15) + Math.max(0, (irpjBase - 240000) * 0.10);
  const csll = csllBase * 0.09;
  const pisCofinsPresumido = annualRevenue * pisCofinsPresumidoRate;
  const totalPresumido = totalIrpjPresumido + csll + pisCofinsPresumido + issPresumidoYearly + icmsPresumidoYearly + ipiPresumidoYearly + laborTaxYearly;

  const pisCofinsRealRate = 0.0925;
  const pisCofinsNet = Math.max(0, (annualRevenue * pisCofinsRealRate) - (annualPurchases * pisCofinsRealRate));
  const accountingProfit = annualRevenue - annualPurchases - annualPayroll - (data.realDeductionAmount || 0);
  const taxableProfit = Math.max(0, (accountingProfit + (data.realAdditions || 0) - (data.realExclusions || 0)));
  const totalIrpjReal = (taxableProfit * 0.15) + Math.max(0, (taxableProfit - 240000) * 0.10);
  const totalReal = totalIrpjReal + (taxableProfit * 0.09) + pisCofinsNet + issPresumidoYearly + icmsPresumidoYearly + ipiPresumidoYearly + laborTaxYearly;

  const safeEffectiveRate = (tax: number) => annualRevenue > 0 ? (tax / annualRevenue) * 100 : 0;

  const currentScenarios: ScenarioResult[] = [
    { regime: TaxRegime.Simples, taxAmountYearly: totalSimples, taxAmountMonthly: totalSimples / 12, effectiveRate: safeEffectiveRate(totalSimples), creditsUsedYearly: 0, details: [simplesDetails] },
    { regime: TaxRegime.Presumido, taxAmountYearly: totalPresumido, taxAmountMonthly: totalPresumido / 12, effectiveRate: safeEffectiveRate(totalPresumido), creditsUsedYearly: 0, details: [`PIS/COFINS Cumulativo`, consumptionExplanation], isMajored },
    { regime: TaxRegime.Real, taxAmountYearly: totalReal, taxAmountMonthly: totalReal / 12, effectiveRate: safeEffectiveRate(totalReal), creditsUsedYearly: annualPurchases * pisCofinsRealRate, details: [`Lucro Real`, consumptionExplanation] },
  ];
  currentScenarios.sort((a, b) => a.taxAmountYearly - b.taxAmountYearly);

  let ivaRate = 0.265;
  let reformExplanation = 'Alíquota Padrão';
  if (data.type === CompanyType.Servico && data.serviceCategory) {
    if (data.serviceCategory === ServiceCategory.SaudeEducacao) { ivaRate *= 0.4; reformExplanation = 'Redução 60%'; }
    else if (data.serviceCategory === ServiceCategory.ProfissionalLiberal) { ivaRate *= 0.7; reformExplanation = 'Redução 30%'; }
  }

  let impostoSeletivo = data.industryHarmfulProduct ? (annualRevenue * 0.15) : 0;
  const totalIvaCredit = annualPurchases * 0.265;
  const totalIva = Math.max(0, (annualRevenue * ivaRate) - totalIvaCredit);
  const totalReformLiability = totalIva + impostoSeletivo + laborTaxYearly;

  const hybridTax = (totalSimples * (1 - (SIMPLES_CONSUMPTION_SHARE[simplesResult.finalAnexo] || 0.48))) + totalIva + impostoSeletivo;

  const reformScenarios: ScenarioResult[] = [
    { regime: TaxRegime.Simples, taxAmountYearly: totalSimples, taxAmountMonthly: totalSimples / 12, effectiveRate: safeEffectiveRate(totalSimples), creditsUsedYearly: 0, details: ['DAS Único'] },
    { regime: 'Híbrido (Simples + IVA)', taxAmountYearly: hybridTax, taxAmountMonthly: hybridTax / 12, effectiveRate: safeEffectiveRate(hybridTax), creditsUsedYearly: totalIvaCredit, details: ['IBS/CBS por fora'] },
    { regime: TaxRegime.IBS_CBS, taxAmountYearly: totalReformLiability, taxAmountMonthly: totalReformLiability / 12, effectiveRate: safeEffectiveRate(totalReformLiability), creditsUsedYearly: totalIvaCredit, details: [`IVA: ${(ivaRate*100).toFixed(1)}% (${reformExplanation})`] }
  ];
  reformScenarios.sort((a, b) => a.taxAmountYearly - b.taxAmountYearly);

  return {
    inputs: { revenue: annualRevenue, payroll: annualPayroll, regime: data.currentRegime, details: `Atividade: ${data.selectedCnae.description}` },
    currentScenario: { bestRegime: currentScenarios[0].regime, taxAmountMonthly: currentScenarios[0].taxAmountMonthly, effectiveRate: currentScenarios[0].effectiveRate, creditsUsed: currentScenarios[0].creditsUsedYearly, ranking: currentScenarios },
    reformScenario: { bestRegime: reformScenarios[0].regime, taxAmountMonthly: reformScenarios[0].taxAmountMonthly, effectiveRate: reformScenarios[0].effectiveRate, creditsUsed: reformScenarios[0].creditsUsedYearly, ranking: reformScenarios },
    recommendation: `Para ${data.selectedCnae.description}, a estratégia sugerida foca em ${reformScenarios[0].regime}.`,
    savingsMonthly: Math.abs(currentScenarios[0].taxAmountMonthly - reformScenarios[0].taxAmountMonthly)
  };
};
