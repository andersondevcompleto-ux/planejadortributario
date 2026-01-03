# TaxStrategist 2026 📊

Plataforma SaaS de inteligência tributária desenvolvida para auxiliar empresas brasileiras na transição para a Reforma Tributária (PLP 68/2024).

![Status](https://img.shields.io/badge/Status-MVP-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6)

## 🚀 Visão Geral

O **TaxStrategist 2026** permite que contadores e empresários comparem o cenário tributário atual (Simples Nacional, Lucro Presumido, Lucro Real) com o cenário proposto pela Reforma Tributária (IVA Dual - IBS/CBS).

### Principais Funcionalidades

*   **Comparativo Lado a Lado:** Visualize a carga tributária atual vs. pós-reforma.
*   **Motor de Cálculo Avançado:** 
    *   Suporte a Fator R e Anexos do Simples.
    *   Cálculo de PIS/COFINS Cumulativo e Não-Cumulativo.
    *   Simulação de créditos de IVA baseada nos fornecedores.
*   **Geração de Relatórios PDF:** Exportação de memória de cálculo detalhada.
*   **Inteligência de Dados:** Busca automática de dados de empresas via CNPJ (Simulado/Mock).
*   **Persistência Local:** Salvamento automático das simulações no navegador.

## 🛠️ Tecnologias Utilizadas

*   **Frontend:** React 18, TypeScript
*   **Estilização:** Tailwind CSS
*   **Gráficos:** Recharts
*   **PDF:** jsPDF & AutoTable
*   **Ícones:** Lucide React
*   **Validação:** Zod
*   **Build/Runtime:** ESM Modules (via esm.sh) para execução rápida sem bundlers complexos no MVP.

## 🏁 Como Executar

Este projeto foi estruturado para rodar diretamente via `index.html` usando módulos ES6, ou pode ser servido por qualquer servidor estático.

1.  Clone o repositório.
2.  Abra o arquivo `index.html` em um servidor local (ex: Live Server do VSCode) ou `npx serve`.

**Nota:** Devido ao uso de importações via ESM, abrir o arquivo diretamente pelo sistema de arquivos (`file://`) pode gerar erros de CORS. Recomenda-se usar um servidor HTTP local.

## 🔒 Segurança e Privacidade

*   Os dados são processados localmente no navegador do cliente (Client-side logic).
*   Implementação de sanitização de inputs.
*   Algoritmos oficiais de validação de CNPJ (Módulo 11).

## 📄 Licença

Este projeto é um MVP demonstrativo.