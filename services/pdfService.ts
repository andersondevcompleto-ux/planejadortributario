
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { CompanyData, SimulationResult } from '../components/types';

export const generatePDF = (company: CompanyData, result: SimulationResult) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFillColor(37, 99, 235); // Brand Blue
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatório de Inteligência Tributária', 20, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30);
  doc.text('TaxStrategist 2026', pageWidth - 50, 30);

  // Company Info
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Dados da Empresa', 20, 55);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Razão Social: ${company.name}`, 20, 65);
  doc.text(`CNPJ: ${company.cnpj}`, 20, 70);
  doc.text(`Faturamento Anual: R$ ${company.annualRevenue.toLocaleString('pt-BR')}`, 20, 75);
  doc.text(`Folha de Pagamento: R$ ${company.payrollCosts.toLocaleString('pt-BR')}`, 120, 75);
  doc.text(`Regime Atual: ${company.currentRegime}`, 20, 80);
  // Fix: Property 'cnae' does not exist on type 'CompanyData'. Using 'selectedCnae.code' instead.
  doc.text(`Atividade (CNAE): ${company.selectedCnae?.code || 'Não informado'}`, 120, 80);

  // Recommendation
  doc.setFillColor(240, 253, 244); // Green 50
  doc.setDrawColor(22, 163, 74); // Green 600
  doc.rect(20, 90, pageWidth - 40, 25, 'FD');
  
  doc.setTextColor(22, 101, 52); // Green 800
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Recomendação Estratégica', 25, 100);
  
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Split text to fit width
  const splitRecommendation = doc.splitTextToSize(result.recommendation, pageWidth - 50);
  doc.text(splitRecommendation, 25, 108);

  // Scenario Table
  const headers = [['Cenário', 'Melhor Regime', 'Imposto Mensal', 'Alíquota Efetiva']];
  const data = [
    [
      'Legislação Vigente', 
      result.currentScenario.bestRegime, 
      result.currentScenario.taxAmountMonthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      `${result.currentScenario.effectiveRate.toFixed(2)}%`
    ],
    [
      'Reforma 2026', 
      result.reformScenario.bestRegime, 
      result.reformScenario.taxAmountMonthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      `${result.reformScenario.effectiveRate.toFixed(2)}%`
    ]
  ];

  // @ts-ignore - jspdf-autotable injection
  doc.autoTable({
    startY: 125,
    head: headers,
    body: data,
    headStyles: { fillColor: [37, 99, 235] },
    theme: 'grid'
  });

  // Detailed Breakdown (Current)
  let finalY = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Detalhamento do Cenário Atual', 20, finalY);
  
  const breakdownCurrent = result.currentScenario.ranking.map(r => [
    r.regime,
    r.taxAmountMonthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    `${(r.effectiveRate || 0).toFixed(2)}%`
  ]);

  // @ts-ignore
  doc.autoTable({
    startY: finalY + 5,
    head: [['Regime', 'Imposto Mensal', 'Alíquota Efetiva']],
    body: breakdownCurrent,
    theme: 'striped'
  });

  // Detailed Breakdown (Reform)
  finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.text('Detalhamento Pós-Reforma 2026', 20, finalY);

  const breakdownReform = result.reformScenario.ranking.map(r => [
    r.regime,
    r.taxAmountMonthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    `${(r.effectiveRate || 0).toFixed(2)}%`
  ]);

  // @ts-ignore
  doc.autoTable({
    startY: finalY + 5,
    head: [['Regime', 'Imposto Mensal', 'Alíquota Efetiva']],
    body: breakdownReform,
    theme: 'striped'
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - 30, doc.internal.pageSize.height - 10);
    doc.text('TaxStrategist - Simulação sujeita a alterações na legislação.', 20, doc.internal.pageSize.height - 10);
  }

  doc.save(`relatorio-tributario-${company.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
};
