import '@angular/compiler';
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { Component, signal, computed, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  BarChart2, 
  ArrowRight, 
  Database, 
  PlusCircle, 
  LogOut, 
  Download, 
  ChevronRight, 
  Search, 
  Building2, 
  ArrowLeft, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  ShieldAlert 
} from 'lucide-angular';

import { CompanyData, CompanyType, TaxRegime, ViewState, SimulationResult } from './components/types';
import { runSimulation, lookupCNPJ } from './components/taxService';
import { validateCNPJStrict, sanitizeInput } from './services/security';

registerLocaleData(localePt);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  template: `
    <div [ngSwitch]="view()" class="animate-fade-in">
      
      <!-- Landing Page -->
      <div *ngSwitchCase="'landing'" class="bg-white min-h-screen">
        <header class="p-6 max-w-7xl mx-auto flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div class="bg-brand-600 p-1.5 rounded-lg">
              <lucide-icon [name]="BarChart2" class="h-6 w-6 text-white"></lucide-icon>
            </div>
            <span class="text-xl font-bold">TaxStrategist 2026</span>
          </div>
          <div class="flex gap-4">
            <button (click)="view.set('login')" class="text-sm font-semibold hover:text-brand-600 transition-colors">Entrar</button>
            <button (click)="view.set('onboarding')" class="bg-brand-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-700 transition-all">Começar Agora</button>
          </div>
        </header>
        <main class="max-w-7xl mx-auto px-6 py-24 text-center">
          <div class="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-brand-600 uppercase bg-brand-50 rounded-full">
            Evolução Angular 19 + Reforma Tributária
          </div>
          <h1 class="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Sua estratégia tributária <br/>
            <span class="text-brand-600">redefinida para 2026</span>
          </h1>
          <p class="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Simulações seguras e precisas da Reforma Tributária (IBS/CBS) integradas com os regimes atuais.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button (click)="view.set('onboarding')" class="bg-brand-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center hover:bg-brand-500 transition-all shadow-lg shadow-brand-500/20">
              Simular Agora <lucide-icon [name]="ArrowRight" class="ml-2 h-5 w-5"></lucide-icon>
            </button>
            <button class="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all">
              Ver Demonstração
            </button>
          </div>
        </main>
      </div>

      <!-- Login (Mock) -->
      <div *ngSwitchCase="'login'" class="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div class="w-full max-w-md bg-white p-10 rounded-3xl shadow-sm border animate-fade-in">
          <h2 class="text-3xl font-bold mb-2">Bem-vindo</h2>
          <p class="text-slate-500 mb-8">Acesse sua conta para ver suas simulações.</p>
          <div class="space-y-4">
            <input type="email" placeholder="E-mail" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500">
            <input type="password" placeholder="Senha" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500">
            <button (click)="view.set('dashboard')" class="w-full bg-brand-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-brand-700 transition-all">Entrar</button>
            <button (click)="view.set('landing')" class="w-full text-slate-400 text-sm hover:text-slate-600">Voltar para Início</button>
          </div>
        </div>
      </div>

      <!-- Onboarding -->
      <div *ngSwitchCase="'onboarding'" class="min-h-screen bg-slate-50 pt-20 px-4">
        <div class="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
           
           <div *ngIf="onboardingStep() === 1" class="space-y-6 animate-fade-in">
              <div class="text-center mb-8">
                <div class="bg-brand-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <lucide-icon [name]="Building2" class="text-brand-600 h-10 w-10"></lucide-icon>
                </div>
                <h2 class="text-2xl font-bold text-slate-800">Identificação da Empresa</h2>
                <p class="text-slate-500">Validamos os dados oficiais para precisão fiscal.</p>
              </div>

              <div class="relative">
                <lucide-icon [name]="Search" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-6 w-6"></lucide-icon>
                <input 
                  [(ngModel)]="cnpjInput" 
                  placeholder="00.000.000/0000-00" 
                  class="w-full pl-14 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-medium focus:ring-4 focus:ring-brand-100 outline-none transition-all"
                  (input)="cnpjError = ''">
              </div>

              <div *ngIf="cnpjError" class="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center animate-pulse">
                <lucide-icon [name]="ShieldAlert" class="h-4 w-4 mr-2"></lucide-icon>
                {{cnpjError}}
              </div>

              <button (click)="searchCNPJ()" [disabled]="isLoadingCnpj()" class="w-full bg-brand-600 text-white py-5 rounded-2xl font-bold flex items-center justify-center hover:bg-brand-700 disabled:bg-slate-300 transition-all shadow-lg">
                <lucide-icon *ngIf="isLoadingCnpj()" [name]="Loader2" class="animate-spin mr-2"></lucide-icon>
                <span>{{ isLoadingCnpj() ? 'Consultando...' : 'Validar e Continuar' }}</span>
              </button>
              <button (click)="view.set('landing')" class="w-full text-slate-400 text-sm font-medium hover:text-slate-600">Cancelar</button>
           </div>
           
           <div *ngIf="onboardingStep() === 2" class="space-y-6 animate-fade-in">
              <h2 class="text-2xl font-bold text-slate-800">Configuração de Faturamento</h2>
              <div class="p-6 bg-brand-50 rounded-2xl border border-brand-100">
                <p class="text-xs font-bold text-brand-600 uppercase tracking-widest mb-1">Localizado com Sucesso</p>
                <p class="font-bold text-slate-800 text-lg">{{currentCompany()?.name}}</p>
                <p class="text-slate-500 text-sm">{{currentCompany()?.municipality}} - {{currentCompany()?.state}}</p>
              </div>
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-2">Faturamento Anual Bruto (R$)</label>
                  <input type="number" [(ngModel)]="annualRevenue" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all">
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-2">Custos de Folha Anuais (R$)</label>
                  <input type="number" [(ngModel)]="payrollCosts" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all">
                </div>
              </div>
              <div class="pt-4 space-y-3">
                <button (click)="finishOnboarding()" class="w-full bg-brand-600 text-white py-5 rounded-2xl font-bold shadow-lg hover:bg-brand-700 transition-all">
                  Gerar Análise 2026
                </button>
                <button (click)="onboardingStep.set(1)" class="w-full text-slate-400 text-sm font-medium">Voltar</button>
              </div>
           </div>
        </div>
      </div>

      <!-- Dashboard -->
      <div *ngSwitchCase="'dashboard'" class="min-h-screen bg-slate-50">
        <nav class="bg-white border-b h-16 flex items-center justify-between px-8 sticky top-0 z-10">
           <div class="flex items-center gap-2 cursor-pointer" (click)="selectedSim.set(null)">
             <div class="bg-brand-600 p-1 rounded-md">
               <lucide-icon [name]="BarChart2" class="h-4 w-4 text-white"></lucide-icon>
             </div>
             <h1 class="text-xl font-bold">TaxStrategist <span class="text-brand-600 font-black">2026</span></h1>
           </div>
           <div class="flex items-center gap-4">
             <span class="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">Angular 19 Pure</span>
             <button (click)="view.set('landing')" class="text-slate-500 hover:text-red-500 flex items-center text-sm font-bold transition-colors">
               <lucide-icon [name]="LogOut" class="h-4 w-4 mr-2"></lucide-icon> Sair
             </button>
           </div>
        </nav>
        
        <div class="max-w-7xl mx-auto p-8">
          <div *ngIf="!selectedSim()" class="space-y-8 animate-fade-in">
             <div class="flex justify-between items-center">
               <h2 class="text-2xl font-bold text-slate-800">Suas Simulações</h2>
               <button (click)="view.set('onboarding')" class="bg-brand-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center hover:bg-brand-700 transition-all">
                 <lucide-icon [name]="PlusCircle" class="h-4 w-4 mr-2"></lucide-icon> Nova Empresa
               </button>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div *ngFor="let sim of simulations()" (click)="selectSim(sim)" class="bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-600 cursor-pointer transition-all hover:shadow-xl group">
                   <div class="bg-brand-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
                     <lucide-icon [name]="Database" class="text-brand-600 h-6 w-6"></lucide-icon>
                   </div>
                   <h3 class="font-bold text-lg text-slate-800 truncate">{{sim.name}}</h3>
                   <p class="text-slate-400 text-sm font-mono mb-4">{{sim.cnpj}}</p>
                   <div class="flex items-center text-brand-600 text-sm font-bold">
                     Ver detalhes <lucide-icon [name]="ChevronRight" class="h-4 w-4 ml-1"></lucide-icon>
                   </div>
                </div>
                
                <div *ngIf="simulations().length === 0" class="md:col-span-3 py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <lucide-icon [name]="Search" class="h-12 w-12 text-slate-200 mx-auto mb-4"></lucide-icon>
                  <p class="text-slate-400 font-medium">Nenhuma simulação encontrada. Inicie sua primeira agora!</p>
                </div>
             </div>
          </div>

          <div *ngIf="selectedSim()" class="space-y-8 animate-fade-in">
             <div class="flex items-center gap-4">
               <button (click)="selectedSim.set(null)" class="bg-white border border-slate-200 p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                 <lucide-icon [name]="ArrowLeft" class="h-5 w-5"></lucide-icon>
               </button>
               <div>
                 <h2 class="text-2xl font-bold text-slate-800">{{selectedSim()?.name}}</h2>
                 <p class="text-slate-500 text-sm">{{selectedSim()?.cnpj}} • {{selectedSim()?.municipality}}, {{selectedSim()?.state}}</p>
               </div>
             </div>
             
             <div class="grid grid-cols-1 md:grid-cols-3 gap-6" *ngIf="simResult() as res">
                <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                  <div class="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full opacity-50"></div>
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cenário Vigente (Mensal)</p>
                  <p class="text-3xl font-extrabold text-slate-900">{{res.currentScenario.taxAmountMonthly | currency:'BRL'}}</p>
                  <div class="flex items-center mt-3">
                    <span class="text-brand-600 text-xs font-bold bg-brand-50 px-2 py-1 rounded">{{res.currentScenario.bestRegime}}</span>
                  </div>
                </div>

                <div class="bg-brand-600 p-8 rounded-3xl text-white shadow-2xl shadow-brand-500/30 relative overflow-hidden">
                   <div class="absolute top-0 right-0 w-24 h-24 bg-brand-500 rounded-bl-full opacity-30"></div>
                  <p class="text-xs font-bold text-brand-200 uppercase tracking-widest mb-2">Pós-Reforma 2026 (Mensal)</p>
                  <p class="text-3xl font-extrabold">{{res.reformScenario.taxAmountMonthly | currency:'BRL'}}</p>
                  <div class="flex items-center mt-3">
                    <span class="text-brand-100 text-xs font-bold bg-brand-700 px-2 py-1 rounded">{{res.reformScenario.bestRegime}}</span>
                  </div>
                </div>

                <div class="bg-emerald-600 p-8 rounded-3xl text-white shadow-xl shadow-emerald-500/20">
                  <p class="text-xs font-bold text-emerald-200 uppercase tracking-widest mb-2">Economia Projetada</p>
                  <p class="text-3xl font-extrabold">{{res.savingsMonthly | currency:'BRL'}}</p>
                  <p class="text-emerald-100 text-xs mt-3 flex items-center">
                    <lucide-icon [name]="CheckCircle" class="h-3 w-3 mr-1"></lucide-icon> Otimização tributária identificada
                  </p>
                </div>
             </div>

             <div class="grid grid-cols-1 lg:grid-cols-2 gap-8" *ngIf="simResult() as res">
               <!-- Gráfico Nativo Angular SVG -->
               <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 class="font-bold text-slate-900 mb-8 flex items-center">
                    <lucide-icon [name]="BarChart2" class="h-5 w-5 mr-2 text-brand-600"></lucide-icon> Distribuição de Carga por Regime
                  </h3>
                  <div class="flex items-end gap-6 h-64 border-b border-slate-100 pb-2 mb-4">
                     <div *ngFor="let item of res.currentScenario.ranking" class="flex-1 flex flex-col items-center group">
                        <div class="w-full bg-slate-50 rounded-t-xl transition-all relative overflow-hidden" 
                             [style.height]="(item.taxAmountMonthly / res.currentScenario.ranking[res.currentScenario.ranking.length-1].taxAmountMonthly * 100) + '%'">
                           <div class="absolute inset-0 bg-brand-600 transition-opacity" 
                                [class.opacity-20]="item.regime !== res.currentScenario.bestRegime"
                                [class.opacity-100]="item.regime === res.currentScenario.bestRegime"></div>
                        </div>
                        <span class="text-[9px] font-bold text-slate-400 mt-4 text-center uppercase leading-none truncate w-full" [title]="item.regime">{{item.regime}}</span>
                     </div>
                  </div>
                  <p class="text-[10px] text-slate-400 italic">* Comparativo baseado no faturamento e folha informados.</p>
               </div>

               <!-- Recomendações -->
               <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-slate-900 mb-6 flex items-center">
                      <lucide-icon [name]="ShieldAlert" class="h-5 w-5 mr-2 text-brand-600"></lucide-icon> Parecer Estratégico
                    </h3>
                    <div class="bg-slate-50 p-6 rounded-2xl border-l-4 border-brand-600 mb-6">
                      <p class="text-slate-700 leading-relaxed italic">"{{res.recommendation}}"</p>
                    </div>
                  </div>
                  <button (click)="exportPDF()" class="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-slate-800 transition-all">
                    <lucide-icon [name]="Download" class="h-5 w-5 mr-2"></lucide-icon> Baixar Relatório Completo (PDF)
                  </button>
               </div>
             </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class App {
  // Navigation State
  view = signal<ViewState>('landing');
  
  // Simulation Data
  simulations = signal<CompanyData[]>([]);
  selectedSim = signal<CompanyData | null>(null);
  
  // Onboarding Logic
  onboardingStep = signal(1);
  isLoadingCnpj = signal(false);
  cnpjInput = '';
  cnpjError = '';
  annualRevenue = 0;
  payrollCosts = 0;
  currentCompany = signal<Partial<CompanyData> | null>(null);

  // Computed Dashboard Result
  simResult = computed(() => {
    const sim = this.selectedSim();
    return sim ? runSimulation(sim) : null;
  });

  // Icons Reference
  BarChart2 = BarChart2; ArrowRight = ArrowRight; Database = Database; PlusCircle = PlusCircle; 
  LogOut = LogOut; Download = Download; ChevronRight = ChevronRight; Search = Search; 
  Building2 = Building2; ArrowLeft = ArrowLeft; Loader2 = Loader2; CheckCircle = CheckCircle; 
  XCircle = XCircle; ShieldAlert = ShieldAlert;

  constructor() {
    // Carregar do LocalStorage no início
    const saved = localStorage.getItem('tax_sims_ng');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.simulations.set(parsed);
      } catch (e) {
        console.error('Falha ao restaurar persistência local.');
      }
    }
  }

  async searchCNPJ() {
    const cleanCnpj = this.cnpjInput.replace(/\D/g, '');
    
    if (!validateCNPJStrict(cleanCnpj)) {
      this.cnpjError = 'CNPJ inválido de acordo com o Módulo 11.';
      return;
    }

    this.isLoadingCnpj.set(true);
    this.cnpjError = '';
    
    try {
      const info = await lookupCNPJ(cleanCnpj);
      this.currentCompany.set({ 
        name: sanitizeInput(info.name),
        municipality: sanitizeInput(info.municipality),
        state: sanitizeInput(info.state),
        cnpj: cleanCnpj 
      });
      this.onboardingStep.set(2);
    } catch (e) {
      this.cnpjError = 'Erro na comunicação com o serviço de consulta.';
    } finally {
      this.isLoadingCnpj.set(false);
    }
  }

  finishOnboarding() {
    const base = this.currentCompany();
    const newSim: CompanyData = {
      id: Math.random().toString(36).substring(2, 11),
      cnpj: base?.cnpj || '',
      name: base?.name || 'Empresa Nova',
      municipality: base?.municipality || '',
      state: base?.state || '',
      type: CompanyType.Servico,
      currentRegime: TaxRegime.Simples,
      annualRevenue: this.annualRevenue || 0,
      payrollCosts: this.payrollCosts || 0,
      suppliers: [],
      createdAt: new Date(),
      cnae: '6201-5/00'
    };
    
    const updated = [newSim, ...this.simulations()];
    this.simulations.set(updated);
    localStorage.setItem('tax_sims_ng', JSON.stringify(updated));
    this.selectedSim.set(newSim);
    this.view.set('dashboard');
    
    // Reset onboarding
    this.onboardingStep.set(1);
    this.cnpjInput = '';
    this.annualRevenue = 0;
    this.payrollCosts = 0;
  }

  selectSim(sim: CompanyData) {
    this.selectedSim.set(sim);
    this.view.set('dashboard');
  }

  async exportPDF() {
    const sim = this.selectedSim();
    const result = this.simResult();
    if (sim && result) {
      const { generatePDF } = await import('./services/pdfService');
      generatePDF(sim, result);
    }
  }
}

// Bootstrap com tratamento de erro
bootstrapApplication(App).catch(err => {
  console.error('Angular Bootstrap Error:', err);
  document.body.innerHTML = `
    <div style="padding: 40px; text-align: center; font-family: sans-serif;">
      <h1 style="color: #ef4444;">Erro Crítico ao Iniciar</h1>
      <p style="color: #64748b;">A aplicação não pôde ser iniciada devido a um erro de carregamento.</p>
      <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer;">Tentar Novamente</button>
      <div style="margin-top: 20px; color: #94a3b8; font-size: 12px; font-family: monospace;">${err.message || err}</div>
    </div>
  `;
});