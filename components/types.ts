
export type Language = 'pt' | 'en';

export enum TaxRegime {
  Simples = 'Simples Nacional',
  Presumido = 'Lucro Presumido',
  Real = 'Lucro Real',
  IBS_CBS = 'IVA Dual (Reforma 2026)',
}

export enum CompanyType {
  Servico = 'Serviço',
  Comercio = 'Comércio',
  Industria = 'Indústria',
}

export enum ServiceCategory {
  Padrao = 'Serviço Geral (Padrão)',
  SaudeEducacao = 'Saúde ou Educação (Redução 60%)',
  ProfissionalLiberal = 'Profissional Liberal (Redução 30%)',
}

export interface CNAE {
  code: string;
  description: string;
  type: CompanyType;
}

export interface Supplier {
  id: string;
  cnpj: string;
  name?: string;
  municipality?: string;
  state?: string;
  regime: TaxRegime;
  anexo?: string; // If supplier is Simples
  amount: number; // Monthly purchase amount from this supplier
}

export interface CompanyData {
  id?: string;
  createdAt?: Date;
  cnpj: string;
  name: string;
  municipality: string;
  state: string;
  selectedCnae: CNAE;
  secondaryCnaes?: CNAE[];
  type: CompanyType;
  serviceCategory?: ServiceCategory;
  
  currentRegime: TaxRegime;
  annualRevenue: number;
  payrollCosts: number;
  isPremium?: boolean;
  
  simplesAnexo?: string;
  simplesFatorR?: boolean;

  realDeductionAmount?: number; 
  realPaymentMode?: 'Trimestral' | 'Estimativa Mensal';
  
  realAdditions?: number; 
  realExclusions?: number; 
  realAccumulatedLoss?: number; 

  isSup?: boolean;
  supProfessionalCount?: number; 
  supTaxAmountMonthly?: number; 

  isDesonerada?: boolean;
  cprbRate?: number; 

  monthlyPurchases?: number; 
  suppliers: Supplier[];

  industryIpiRate?: number; 
  industryHarmfulProduct?: boolean; 
  icmsInterstatePercent?: number; 
  icmsInternalRate?: number; 
  icmsTaxIncentive?: boolean; 
}

export interface ScenarioBreakdown {
  irpj: number;
  csll: number;
  pisCofins?: number;
  iss?: number; 
  icms?: number; 
  ipi?: number; 
  iva?: number; 
  impostoSeletivo?: number; 
  laborTaxes?: number; 
}

export interface ScenarioResult {
  regime: string;
  taxAmountYearly: number;
  taxAmountMonthly: number; 
  effectiveRate: number;
  creditsUsedYearly: number; 
  details: string[]; 
  breakdown?: ScenarioBreakdown; 
  isMajored?: boolean; 
}

export interface SimulationResult {
  inputs: {
    revenue: number;
    payroll: number;
    regime: string;
    details: string; 
  };
  currentScenario: {
    bestRegime: string;
    taxAmountMonthly: number; 
    effectiveRate: number;
    creditsUsed: number;
    ranking: ScenarioResult[];
  };
  reformScenario: {
    bestRegime: string;
    taxAmountMonthly: number; 
    effectiveRate: number;
    creditsUsed: number;
    ranking: ScenarioResult[];
  };
  recommendation: string;
  savingsMonthly: number; 
}

export interface HistoryEntry {
  id: string;
  action: string;
  timestamp: Date;
}

export type ViewState = 'landing' | 'login' | 'register' | 'onboarding' | 'dashboard' | 'pricing' | 'tests';
