
import { describe, it, expect } from 'vitest';
import { runSimulation, getSimplesAnexoForCNAE } from '../../components/taxService';
import { CompanyData, CompanyType, TaxRegime, ServiceCategory } from '../../components/types';

describe('TaxService Engine - Automatic Annex Identification', () => {
  it('deve identificar Anexo I para CNAE de Comércio (47xx)', () => {
    const res = getSimplesAnexoForCNAE('4751-2/01');
    expect(res.anexo).toBe('Anexo I');
    expect(res.subjectToFactorR).toBe(false);
  });

  it('deve identificar Anexo II para CNAE de Indústria (10xx)', () => {
    const res = getSimplesAnexoForCNAE('1011-2/01');
    expect(res.anexo).toBe('Anexo II');
    expect(res.subjectToFactorR).toBe(false);
  });

  it('deve identificar Anexo III para CNAE de Serviço Geral (8219)', () => {
    const res = getSimplesAnexoForCNAE('8219-9/99');
    expect(res.anexo).toBe('Anexo III');
    expect(res.subjectToFactorR).toBe(false);
  });

  it('deve identificar Anexo V e Fator R para CNAE de TI (6201)', () => {
    const res = getSimplesAnexoForCNAE('6201-5/00');
    expect(res.anexo).toBe('Anexo V');
    expect(res.subjectToFactorR).toBe(true);
  });

  it('deve identificar Anexo IV para CNAE de Limpeza (8121)', () => {
    const res = getSimplesAnexoForCNAE('8121-4/00');
    expect(res.anexo).toBe('Anexo IV');
    expect(res.subjectToFactorR).toBe(false);
  });
});

describe('TaxService Engine - Simulation Tests', () => {
  const baseCompany: CompanyData = {
    cnpj: '12345678000190',
    name: 'Test Corp',
    municipality: 'São Paulo',
    state: 'SP',
    selectedCnae: { 
      code: '6201-5/00', 
      description: 'Desenvolvimento de programas de computador sob encomenda', 
      type: CompanyType.Servico 
    },
    type: CompanyType.Servico,
    currentRegime: TaxRegime.Presumido,
    annualRevenue: 1000000, 
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
    expect(simplesScenario?.effectiveRate).toBeGreaterThan(10);
    expect(simplesScenario?.effectiveRate).toBeLessThan(15);
  });

  it('deve aplicar a lógica de Fator R corretamente', () => {
    const dataV: CompanyData = {
      ...baseCompany,
      annualRevenue: 1000000,
      payrollCosts: 200000, 
      currentRegime: TaxRegime.Simples,
      simplesAnexo: 'Anexo III',
      simplesFatorR: true
    };
    
    const dataIII: CompanyData = {
      ...baseCompany,
      annualRevenue: 1000000,
      payrollCosts: 300000, 
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
    
    expect(reformScenario?.effectiveRate).toBeCloseTo(10.6, 0.5);
  });
});
