
import { describe, it, expect } from 'vitest';
import { runSimulation } from '../../components/taxService';
import { CompanyData, CompanyType, TaxRegime, ServiceCategory } from '../../components/types';

describe('TaxService Engine', () => {
  const baseCompany: CompanyData = {
    cnpj: '12345678000190',
    name: 'Test Corp',
    municipality: 'São Paulo',
    state: 'SP',
    // Fix: Object literal may only specify known properties, and 'cnae' does not exist in type 'CompanyData'.
    selectedCnae: { 
      code: '6201-5/00', 
      description: 'Desenvolvimento de programas de computador sob encomenda', 
      type: CompanyType.Servico 
    },
    type: CompanyType.Servico,
    currentRegime: TaxRegime.Presumido,
    annualRevenue: 1000000, // 1 Milhão
    payrollCosts: 300000,
    suppliers: []
  };

  it('deve calcular corretamente o Simples Nacional para Anexo III', () => {
    const data: CompanyData = {
      ...baseCompany,
      currentRegime: TaxRegime.Simples,
      simplesAnexo: 'Anexo III'
    };
    const result = runSimulation(data);
    const simplesScenario = result.currentScenario.ranking.find(r => r.regime === TaxRegime.Simples);
    
    expect(simplesScenario).toBeDefined();
    expect(simplesScenario?.taxAmountYearly).toBeGreaterThan(0);
    // Para 1M no Anexo III, a alíquota efetiva deve estar próxima de 10-13%
    expect(simplesScenario?.effectiveRate).toBeGreaterThan(10);
    expect(simplesScenario?.effectiveRate).toBeLessThan(15);
  });

  it('deve aplicar a lógica de Fator R corretamente', () => {
    // Caso 1: Folha < 28% -> Anexo V (Mais caro)
    const dataV: CompanyData = {
      ...baseCompany,
      annualRevenue: 1000000,
      payrollCosts: 200000, // 20%
      currentRegime: TaxRegime.Simples,
      simplesAnexo: 'Anexo III',
      simplesFatorR: true
    };
    
    // Caso 2: Folha >= 28% -> Anexo III (Mais barato)
    const dataIII: CompanyData = {
      ...baseCompany,
      annualRevenue: 1000000,
      payrollCosts: 300000, // 30%
      currentRegime: TaxRegime.Simples,
      simplesAnexo: 'Anexo III',
      simplesFatorR: true
    };

    const resultV = runSimulation(dataV);
    const resultIII = runSimulation(dataIII);

    const taxV = resultV.currentScenario.ranking.find(r => r.regime === TaxRegime.Simples)?.taxAmountYearly || 0;
    const taxIII = resultIII.currentScenario.ranking.find(r => r.regime === TaxRegime.Simples)?.taxAmountYearly || 0;

    expect(taxV).toBeGreaterThan(taxIII);
  });

  it('deve calcular o cenário da Reforma Tributária 2026 com redução para Saúde/Educação', () => {
    const data: CompanyData = {
      ...baseCompany,
      serviceCategory: ServiceCategory.SaudeEducacao
    };
    const result = runSimulation(data);
    const reformScenario = result.reformScenario.ranking.find(r => r.regime === TaxRegime.IBS_CBS);
    
    // Alíquota padrão 26.5% com redução de 60% = 10.6%
    expect(reformScenario?.effectiveRate).toBeCloseTo(10.6, 0.5);
  });

  it('deve calcular Imposto Seletivo para indústrias de produtos nocivos', () => {
    const data: CompanyData = {
      ...baseCompany,
      type: CompanyType.Industria,
      industryHarmfulProduct: true
    };
    const result = runSimulation(data);
    const reformScenario = result.reformScenario.ranking.find(r => r.regime === TaxRegime.IBS_CBS);
    
    expect(reformScenario?.breakdown?.impostoSeletivo).toBeGreaterThan(0);
  });
});
