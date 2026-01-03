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
  cnae: string;
  type: CompanyType;
  // NEW: Service Sub-category for Reform calculation
  serviceCategory?: ServiceCategory;
  
  currentRegime: TaxRegime;
  annualRevenue: number;
  payrollCosts: number; // For Fator R calculation in Simples
  isPremium?: boolean;
  
  // Specific fields for Simples Nacional
  simplesAnexo?: string;
  simplesFatorR?: boolean;

  // Specific fields for Lucro Real (LALUR Logic)
  realHasDeductions?: boolean; // Deprecated in UI, kept for compatibility, prefer using realExclusions below
  realDeductionAmount?: number; // General operational expenses to find accounting profit
  realPaymentMode?: 'Trimestral' | 'Estimativa Mensal';
  
  // NEW: LALUR Fields
  realAdditions?: number; // Despesas Indedutíveis (Multas, Brindes, etc)
  realExclusions?: number; // Receitas não tributáveis ou Incentivos Fiscais (Lei 14.789/23)
  realAccumulatedLoss?: number; // Prejuízo Fiscal de exercícios anteriores (Trava 30%)

  // Sociedade Uniprofissional (ISS Fixo)
  isSup?: boolean;
  supProfessionalCount?: number; // Number of partners/employees authorized
  supTaxAmountMonthly?: number; // Fixed monthly tax per professional

  // Desoneração da Folha (CPRB) - Applicable to Presumido/Real
  isDesonerada?: boolean;
  cprbRate?: number; // Alíquota sobre a receita (1% a 4.5%)

  // Purchasing & Supplier Data
  monthlyPurchases?: number; // Total monthly purchases
  suppliers: Supplier[]; // List of specific suppliers

  // --- NEW FIELDS FOR INDUSTRY & ICMS (2026 UPDATE) ---
  industryIpiRate?: number; // Alíquota média de IPI (ex: 5%, 10%)
  industryHarmfulProduct?: boolean; // Se produz bens sujeitos a Imposto Seletivo (Cigarro, Bebida, Minério)
  icmsInterstatePercent?: number; // % das vendas para fora do estado (Impacta alíquota média 12% ou 7%)
  icmsInternalRate?: number; // Alíquota interna padrão (17%, 18%, 20% dependendo do estado)
  icmsTaxIncentive?: boolean; // Se possui benefício fiscal (Ex: Redução de Base de Cálculo)
}

export interface ScenarioBreakdown {
  irpj: number;
  csll: number;
  pisCofins?: number;
  iss?: number; // Municipal Service Tax
  icms?: number; // State Value Added Tax (NEW)
  ipi?: number; // Federal Industrial Tax (NEW)
  iva?: number; // IBS/CBS
  impostoSeletivo?: number; // Sin Tax 2026
  laborTaxes?: number; // INSS Patronal + RAT + Terceiros OR CPRB
}

export interface ScenarioResult {
  regime: string;
  taxAmountYearly: number;
  taxAmountMonthly: number; // NEW: Monthly Tax
  effectiveRate: number;
  creditsUsedYearly: number; // NEW: Value of tax credits used
  details: string[]; 
  breakdown?: ScenarioBreakdown; // Details for IRPJ/CSLL
  isMajored?: boolean; // NEW: Flag for Profit Presumption Majoration
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
    taxAmountMonthly: number; // Display monthly in dashboard
    effectiveRate: number;
    creditsUsed: number;
    ranking: ScenarioResult[];
  };
  reformScenario: {
    bestRegime: string;
    taxAmountMonthly: number; // Display monthly in dashboard
    effectiveRate: number;
    creditsUsed: number;
    ranking: ScenarioResult[];
  };
  recommendation: string;
  savingsMonthly: number; // Monthly savings
}

export interface HistoryEntry {
  id: string;
  action: string;
  timestamp: Date;
}

export type ViewState = 'landing' | 'login' | 'register' | 'onboarding' | 'dashboard' | 'pricing' | 'tests';