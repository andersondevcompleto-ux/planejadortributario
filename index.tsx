
import '@angular/compiler';
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { Component, signal, computed, LOCALE_ID, OnInit, inject } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FormsModule } from '@angular/forms';
import { GoogleGenAI } from "@google/genai";
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
  ShieldAlert,
  MessageSquare,
  BookOpen,
  ExternalLink,
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Clock,
  Zap,
  ShieldCheck,
  TrendingUp,
  Tag,
  Gift,
  Plus,
  Scale,
  Briefcase,
  FileText,
  History,
  Settings,
  Trash2,
  Key,
  Shield,
  MailCheck,
  DollarSign,
  PieChart
} from 'lucide-angular';

import { CompanyData, CompanyType, TaxRegime, ViewState, SimulationResult } from './components/types';
import { runSimulation, lookupCNPJ } from './components/taxService';
import { validateCNPJStrict } from './services/security';

registerLocaleData(localePt);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  template: `
    <div [ngSwitch]="view()" class="min-h-screen font-sans">
      
      <!-- Landing Page -->
      <div *ngSwitchCase="'landing'" class="bg-white min-h-screen animate-fade-in">
        <nav class="p-6 max-w-7xl mx-auto flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div class="bg-brand-600 p-1.5 rounded-lg"><lucide-icon [name]="BarChart2" class="h-6 w-6 text-white"></lucide-icon></div>
            <span class="text-xl font-black tracking-tight text-slate-900">TaxStrategist <span class="text-brand-600">2026</span></span>
          </div>
          <div class="flex items-center gap-4">
            <button (click)="view.set('login')" class="font-bold text-slate-600 hover:text-brand-600 transition-colors">Entrar</button>
            <button (click)="view.set('register')" class="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">Criar Conta</button>
          </div>
        </nav>
        
        <main class="max-w-7xl mx-auto px-6 py-12">
          <div class="text-center mb-16">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-6">
              <lucide-icon [name]="Sparkles" class="h-3 w-3"></lucide-icon> INTEGRADO COM GOOGLE AI & RECEITA FEDERAL
            </div>
            <h1 class="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
              A Nova Era da <br/>
              <span class="text-brand-600">Inteligência Fiscal.</span>
            </h1>
            <p class="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
              O futuro da gestão tributária não é mais reativo, é preditivo. No modelo SaaS, eliminamos a barreira entre a lei e a execução, garantindo eficiência máxima para empresas de todos os portes.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            <div class="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
              <div class="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-brand-600 transition-colors">
                <lucide-icon [name]="Zap" class="text-brand-600 h-6 w-6 group-hover:text-white"></lucide-icon>
              </div>
              <h3 class="text-lg font-bold mb-3">Agilidade Estratégica</h3>
              <p class="text-slate-500 text-sm leading-relaxed">De startups no Simples a corporações no Lucro Real, processe gigabytes de legislação em milissegundos.</p>
            </div>
            <div class="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
              <div class="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-brand-600 transition-colors">
                <lucide-icon [name]="Clock" class="text-brand-600 h-6 w-6 group-hover:text-white"></lucide-icon>
              </div>
              <h3 class="text-lg font-bold mb-3">Compliance em Tempo Real</h3>
              <p class="text-slate-500 text-sm leading-relaxed">Nossa infraestrutura absorve cada nova instrução normativa da Receita Federal instantaneamente.</p>
            </div>
            <div class="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
              <div class="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-brand-600 transition-colors">
                <lucide-icon [name]="TrendingUp" class="text-brand-600 h-6 w-6 group-hover:text-white"></lucide-icon>
              </div>
              <h3 class="text-lg font-bold mb-3">Escalabilidade Inteligente</h3>
              <p class="text-slate-500 text-sm leading-relaxed">Pequenas empresas acessam ferramentas enterprise, grandes grupos consolidam filiais sem esforço.</p>
            </div>
            <div class="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
              <div class="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-brand-600 transition-colors">
                <lucide-icon [name]="ShieldCheck" class="text-brand-600 h-6 w-6 group-hover:text-white"></lucide-icon>
              </div>
              <h3 class="text-lg font-bold mb-3">Segurança Bancária</h3>
              <p class="text-slate-500 text-sm leading-relaxed">Dados criptografados e redundância geográfica sob os mais altos padrões internacionais.</p>
            </div>
          </div>
        </main>
      </div>

      <!-- Login Screen -->
      <div *ngSwitchCase="'login'" class="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-fade-in">
        <div class="w-full max-w-md">
          <div class="text-center mb-8">
             <div (click)="view.set('landing')" class="inline-flex items-center gap-2 cursor-pointer mb-6">
                <div class="bg-brand-600 p-1 rounded-lg"><lucide-icon [name]="BarChart2" class="h-5 w-5 text-white"></lucide-icon></div>
                <span class="text-xl font-black text-slate-900">TaxStrategist</span>
             </div>
             <h2 class="text-3xl font-bold text-slate-900">Bem-vindo de volta</h2>
          </div>
          <div class="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700">E-mail</label>
                <input type="email" [(ngModel)]="authForm.email" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700">Senha</label>
                <input type="password" [(ngModel)]="authForm.password" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500">
              </div>
              <button (click)="handleLogin()" class="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-all">Entrar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Register Screen -->
      <div *ngSwitchCase="'register'" class="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-fade-in">
        <div class="w-full max-w-md">
          <div class="text-center mb-8">
             <h2 class="text-3xl font-bold text-slate-900">Crie sua conta</h2>
          </div>
          <div class="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700">Nome Completo</label>
                <input type="text" [(ngModel)]="authForm.name" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700">E-mail Corporativo</label>
                <input type="email" [(ngModel)]="authForm.email" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700">Senha</label>
                <input type="password" [(ngModel)]="authForm.password" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500">
              </div>
              <button (click)="handleRegister()" class="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-all">Criar Conta</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ONBOARDING -->
      <div *ngSwitchCase="'onboarding'" class="bg-slate-50 min-h-screen flex items-center justify-center p-6 animate-fade-in">
        <div class="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
          
          <!-- Stepper Header -->
          <div class="bg-slate-900 p-8 text-white relative">
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center gap-2">
                 <div class="bg-brand-600 p-1.5 rounded-lg"><lucide-icon [name]="Building2" class="h-5 w-5"></lucide-icon></div>
                 <h2 class="text-xl font-black">Nova Estratégia</h2>
              </div>
              <span class="text-slate-400 font-bold text-sm uppercase tracking-widest">Passo {{ onboardingStep() }} de 3</span>
            </div>
            <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
               <div class="h-full bg-brand-500 transition-all duration-500" [style.width.%]="(onboardingStep() / 3) * 100"></div>
            </div>
          </div>

          <div class="p-10">
            <!-- Passo 1: Identificação -->
            <div *ngIf="onboardingStep() === 1" class="space-y-8 animate-fade-in">
              <div>
                <h3 class="text-2xl font-black text-slate-900 mb-2">Qual o CNPJ da empresa?</h3>
                <p class="text-slate-500">Buscaremos os dados oficiais na base da Receita Federal.</p>
              </div>

              <div class="relative">
                <lucide-icon [name]="Search" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5"></lucide-icon>
                <input 
                  type="text" 
                  [(ngModel)]="companyForm.cnpj" 
                  placeholder="00.000.000/0000-00" 
                  class="w-full pl-12 pr-32 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-medium outline-none focus:ring-2 focus:ring-brand-500">
                <button 
                  (click)="searchCNPJ()" 
                  [disabled]="isSearchingCNPJ()"
                  class="absolute right-2 top-2 bottom-2 bg-slate-900 text-white px-6 rounded-xl font-bold flex items-center gap-2">
                  <lucide-icon *ngIf="isSearchingCNPJ()" [name]="Loader2" class="animate-spin h-4 w-4"></lucide-icon>
                  Consultar
                </button>
              </div>

              <div *ngIf="companyForm.name" class="p-6 bg-brand-50 rounded-2xl border border-brand-100 animate-fade-in">
                <div class="flex items-center gap-4">
                  <div class="bg-white p-3 rounded-xl shadow-sm"><lucide-icon [name]="CheckCircle" class="text-brand-600 h-6 w-6"></lucide-icon></div>
                  <div>
                    <h4 class="font-black text-slate-900">{{ companyForm.name }}</h4>
                    <p class="text-sm text-slate-500">{{ companyForm.municipality }} - {{ companyForm.state }}</p>
                  </div>
                </div>
              </div>

              <div class="flex justify-end pt-4">
                <button 
                  (click)="nextStep()" 
                  [disabled]="!companyForm.name"
                  class="bg-brand-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-500/20 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50">
                  Próximo Passo <lucide-icon [name]="ArrowRight" class="h-5 w-5"></lucide-icon>
                </button>
              </div>
            </div>

            <!-- Passo 2: Perfil e Regime -->
            <div *ngIf="onboardingStep() === 2" class="space-y-8 animate-fade-in">
               <div>
                 <h3 class="text-2xl font-black text-slate-900 mb-2">Perfil de Negócio</h3>
                 <p class="text-slate-500">Como a empresa opera hoje?</p>
               </div>

               <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    *ngFor="let type of companyTypes" 
                    (click)="companyForm.type = type.value"
                    [class.border-brand-600]="companyForm.type === type.value"
                    [class.bg-brand-50]="companyForm.type === type.value"
                    class="p-6 border-2 border-slate-100 rounded-3xl text-left hover:border-brand-200 transition-all group">
                    <lucide-icon [name]="type.icon" class="h-8 w-8 text-slate-400 mb-4 group-hover:text-brand-600 transition-colors" [class.text-brand-600]="companyForm.type === type.value"></lucide-icon>
                    <span class="block font-black text-slate-900">{{ type.label }}</span>
                  </button>
               </div>

               <div class="space-y-4">
                  <label class="text-sm font-bold text-slate-700 uppercase tracking-widest">Regime Tributário Atual</label>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button 
                      *ngFor="let regime of regimes" 
                      (click)="companyForm.currentRegime = regime"
                      [class.bg-slate-900]="companyForm.currentRegime === regime"
                      [class.text-white]="companyForm.currentRegime === regime"
                      class="px-4 py-3 border rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                      {{ regime }}
                    </button>
                  </div>
               </div>

               <!-- OPÇÕES ESPECÍFICAS SIMPLES NACIONAL -->
               <div *ngIf="companyForm.currentRegime === 'Simples Nacional'" class="space-y-4 animate-fade-in p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div>
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Selecione o Anexo</label>
                    <div class="flex flex-wrap gap-2">
                      <button 
                        *ngFor="let anexo of ['Anexo I', 'Anexo II', 'Anexo III', 'Anexo IV', 'Anexo V']"
                        (click)="companyForm.simplesAnexo = anexo"
                        [class.bg-brand-600]="companyForm.simplesAnexo === anexo"
                        [class.text-white]="companyForm.simplesAnexo === anexo"
                        class="px-4 py-2 border rounded-xl text-xs font-bold transition-all shadow-sm">
                        {{ anexo }}
                      </button>
                    </div>
                  </div>
                  
                  <div *ngIf="companyForm.simplesAnexo === 'Anexo V'" class="flex items-center gap-3 pt-2 bg-white p-3 rounded-xl shadow-sm border border-brand-100">
                    <input type="checkbox" [(ngModel)]="companyForm.simplesFatorR" class="w-5 h-5 accent-brand-600 cursor-pointer">
                    <label class="text-sm font-bold text-slate-700 cursor-pointer">Sujeito ao Fator R? (Pode reduzir para Anexo III)</label>
                  </div>
               </div>

               <div class="flex justify-between pt-4">
                  <button (click)="prevStep()" class="text-slate-500 font-bold hover:text-slate-900 transition-all flex items-center gap-2">
                    <lucide-icon [name]="ArrowLeft" class="h-4 w-4"></lucide-icon> Voltar
                  </button>
                  <button (click)="nextStep()" class="bg-brand-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-500/20 hover:scale-105 transition-all flex items-center gap-2">
                    Finanças <lucide-icon [name]="ArrowRight" class="h-5 w-5"></lucide-icon>
                  </button>
               </div>
            </div>

            <!-- Passo 3: Dados Financeiros -->
            <div *ngIf="onboardingStep() === 3" class="space-y-8 animate-fade-in">
               <div>
                 <h3 class="text-2xl font-black text-slate-900 mb-2">Dados Financeiros</h3>
                 <p class="text-slate-500">Valores anuais estimados para simulação.</p>
               </div>

               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div class="space-y-2">
                   <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Faturamento Anual (R$)</label>
                   <div class="relative">
                     <lucide-icon [name]="DollarSign" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5"></lucide-icon>
                     <input type="number" [(ngModel)]="companyForm.annualRevenue" class="w-full pl-12 p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-brand-500">
                   </div>
                 </div>
                 <div class="space-y-2">
                   <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Custo de Folha Anual (R$)</label>
                   <div class="relative">
                     <lucide-icon [name]="User" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5"></lucide-icon>
                     <input type="number" [(ngModel)]="companyForm.payrollCosts" class="w-full pl-12 p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-brand-500">
                   </div>
                 </div>
               </div>

               <div class="bg-brand-50 p-6 rounded-3xl flex items-center gap-4">
                  <lucide-icon [name]="Sparkles" class="text-brand-600 h-10 w-10"></lucide-icon>
                  <p class="text-sm text-brand-900 leading-relaxed">
                    Estamos quase lá! Com esses dados, nossa IA calculará sua economia no <strong>Simples, Lucro Presumido</strong> e na <strong>Reforma Tributária 2026</strong>.
                  </p>
               </div>

               <div class="flex justify-between pt-4">
                  <button (click)="prevStep()" class="text-slate-500 font-bold hover:text-slate-900 transition-all flex items-center gap-2">
                    <lucide-icon [name]="ArrowLeft" class="h-4 w-4"></lucide-icon> Voltar
                  </button>
                  <button (click)="finishOnboarding()" [disabled]="!companyForm.annualRevenue" class="bg-brand-600 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-brand-500/40 hover:scale-105 transition-all flex items-center gap-3">
                    Gerar Inteligência <lucide-icon [name]="PieChart" class="h-6 w-6"></lucide-icon>
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard -->
      <div *ngSwitchCase="'dashboard'" class="bg-slate-50 min-h-screen">
        <nav class="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-50">
          <div class="flex items-center gap-2 cursor-pointer" (click)="activeTab.set('overview')">
            <div class="bg-brand-600 p-1 rounded-lg"><lucide-icon [name]="BarChart2" class="h-4 w-4 text-white"></lucide-icon></div>
            <span class="font-bold text-slate-900">TaxStrategist <span class="text-brand-600">Pro</span></span>
          </div>
          <div class="flex gap-1 bg-slate-100 p-1 rounded-xl">
            <button (click)="activeTab.set('overview')" [class.bg-white]="activeTab() === 'overview'" class="text-xs font-bold px-4 py-2 rounded-lg transition-all">Simulações</button>
            <button (click)="activeTab.set('ai')" [class.bg-white]="activeTab() === 'ai'" class="text-xs font-bold px-4 py-2 rounded-lg transition-all">Consultoria & Leis</button>
            <button (click)="activeTab.set('profile')" [class.bg-white]="activeTab() === 'profile'" class="text-xs font-bold px-4 py-2 rounded-lg transition-all">Perfil</button>
          </div>
          <button (click)="handleLogout()" class="text-slate-500 font-bold text-sm">Sair</button>
        </nav>

        <div class="max-w-7xl mx-auto p-8">
          
          <!-- Aba de Simulações -->
          <div *ngIf="activeTab() === 'overview'" class="space-y-8 animate-fade-in">
             <div *ngIf="simulations().length > 0; else emptyState">
                <div class="flex justify-between items-center mb-6">
                   <h1 class="text-3xl font-black text-slate-900">Inteligência Fiscal</h1>
                   <button (click)="startNewSimulation()" class="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand-500/20">
                     <lucide-icon [name]="Plus" class="h-4 w-4"></lucide-icon> Nova Simulação
                   </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div *ngFor="let sim of simulations()" class="bg-white p-6 rounded-3xl border shadow-sm hover:border-brand-200 transition-all cursor-pointer group">
                     <div class="bg-brand-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:text-white transition-all"><lucide-icon [name]="Building2" class="h-5 w-5"></lucide-icon></div>
                     <h4 class="font-bold text-slate-800 leading-tight">{{ sim.name }}</h4>
                     <p class="text-xs text-slate-400 mt-1">{{ sim.cnpj }}</p>
                     <div class="mt-4 pt-4 border-t flex justify-between items-center">
                        <span class="text-[10px] font-bold text-slate-400 uppercase">Regime</span>
                        <span class="text-[10px] font-black text-brand-600">{{ sim.currentRegime }}</span>
                     </div>
                  </div>
                </div>
             </div>
             <ng-template #emptyState>
                <div class="text-center py-20 bg-white rounded-[3rem] border shadow-2xl shadow-slate-200/50 max-w-2xl mx-auto">
                  <div class="bg-brand-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                    <lucide-icon [name]="Building2" class="h-10 w-10 text-brand-600"></lucide-icon>
                  </div>
                  <h2 class="text-3xl font-black mb-4">Inicie sua inteligência fiscal</h2>
                  <p class="text-slate-500 mb-10 max-w-sm mx-auto">Configure sua primeira empresa para ver o comparativo detalhado da Reforma Tributária.</p>
                  <button (click)="startNewSimulation()" class="bg-brand-600 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-105 transition-all">
                    Começar Agora
                  </button>
                </div>
             </ng-template>
          </div>

          <!-- Aba de Consultoria & Legislação (AI Chat) -->
          <div *ngIf="activeTab() === 'ai'" class="animate-fade-in">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <!-- Painel Lateral Legislativo -->
              <div class="lg:col-span-4 space-y-6">
                <div class="bg-white p-6 rounded-[2.5rem] border shadow-sm">
                   <h3 class="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                     <lucide-icon [name]="BookOpen" class="h-5 w-5 text-brand-600"></lucide-icon> Centro Legislativo
                   </h3>
                   <p class="text-xs text-slate-500 mb-6">Selecione um tributo para ver o resumo técnico e o impacto da Reforma 2026.</p>
                   
                   <div class="space-y-3">
                     <!-- Simples Nacional -->
                     <button (click)="askLegislativeSummary('Simples Nacional')" class="w-full p-4 rounded-2xl border bg-slate-50 hover:bg-brand-50 hover:border-brand-200 transition-all text-left group">
                        <div class="flex justify-between items-center mb-1">
                          <span class="text-sm font-bold text-slate-800">Simples Nacional</span>
                          <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-bold uppercase">Estável</span>
                        </div>
                        <p class="text-[10px] text-slate-400">LC 123/06 • Transição Híbrida 2026</p>
                     </button>

                     <!-- ICMS Estadual -->
                     <button (click)="askLegislativeSummary('ICMS Estadual')" class="w-full p-4 rounded-2xl border bg-slate-50 hover:bg-brand-50 hover:border-brand-200 transition-all text-left group">
                        <div class="flex justify-between items-center mb-1">
                          <span class="text-sm font-bold text-slate-800">ICMS (Estadual)</span>
                          <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold uppercase">Extinção 2033</span>
                        </div>
                        <p class="text-[10px] text-slate-400">RICMS • Em processo de extinção completa em 2033</p>
                     </button>

                     <!-- ISS Municipal -->
                     <button (click)="askLegislativeSummary('ISS Municipal')" class="w-full p-4 rounded-2xl border bg-slate-50 hover:bg-brand-50 hover:border-brand-200 transition-all text-left group">
                        <div class="flex justify-between items-center mb-1">
                          <span class="text-sm font-bold text-slate-800">ISS (Municipal)</span>
                          <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold uppercase">Extinção 2033</span>
                        </div>
                        <p class="text-[10px] text-slate-400">LC 116/03 • Em processo de extinção completa em 2033</p>
                     </button>

                     <!-- IPI & Indústria -->
                     <button (click)="askLegislativeSummary('IPI e Indústria')" class="w-full p-4 rounded-2xl border bg-slate-50 hover:bg-brand-50 hover:border-brand-200 transition-all text-left group">
                        <div class="flex justify-between items-center mb-1">
                          <span class="text-sm font-bold text-slate-800">IPI & Indústria</span>
                          <span class="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold uppercase">Seletivo</span>
                        </div>
                        <p class="text-[10px] text-slate-400">RIPI • Novo Imposto Seletivo 2026</p>
                     </button>
                   </div>
                </div>

                <!-- Card de Status de Atualização -->
                <div class="bg-brand-900 p-6 rounded-[2rem] text-white">
                   <div class="flex items-center gap-2 mb-3">
                     <lucide-icon [name]="History" class="h-4 w-4 text-brand-300"></lucide-icon>
                     <span class="text-xs font-bold uppercase tracking-widest text-brand-300">Inteligência Ativa</span>
                   </div>
                   <p class="text-sm font-medium mb-1">Base Legal: Março 2024</p>
                   <p class="text-[10px] text-brand-400 leading-relaxed">Monitorando em tempo real: PLP 68/2024, Decretos Estaduais e Instruções Normativas da RFB via Google Search Grounding.</p>
                </div>
              </div>

              <!-- Janela do Chat (AI) -->
              <div class="lg:col-span-8">
                <div class="bg-white rounded-[2.5rem] border shadow-sm h-[75vh] flex flex-col overflow-hidden">
                  <div class="p-6 bg-slate-50 border-b flex justify-between items-center">
                    <div class="flex items-center gap-3">
                      <div class="bg-brand-600 p-2.5 rounded-xl shadow-md shadow-brand-200"><lucide-icon [name]="Sparkles" class="h-5 w-5 text-white"></lucide-icon></div>
                      <div>
                        <h2 class="font-bold text-slate-900 leading-none">Consultor de Legislação</h2>
                        <span class="text-[10px] text-brand-600 font-bold uppercase tracking-wider">Base Gemini 3 Pro + Diário Oficial</span>
                      </div>
                    </div>
                    <button (click)="clearChat()" class="text-slate-400 hover:text-red-500 transition-colors p-2"><lucide-icon [name]="XCircle" class="h-5 w-5"></lucide-icon></button>
                  </div>

                  <div class="flex-1 overflow-y-auto p-6 space-y-6" #chatContainer>
                    <div *ngFor="let msg of chatHistory()" [class]="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
                       <div [class]="msg.role === 'user' ? 'bg-brand-600 text-white rounded-2xl rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-2xl rounded-tl-none'" class="max-w-[90%] p-5 shadow-sm">
                          <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ msg.text }}</p>
                          <!-- Grounding Sources -->
                          <div *ngIf="msg.sources?.length" class="mt-4 pt-4 border-t border-slate-200/50">
                            <p class="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-tighter">Fontes Consultadas</p>
                            <div class="flex flex-wrap gap-2">
                              <a *ngFor="let source of msg.sources" [href]="source.uri" target="_blank" class="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] text-brand-600 hover:bg-brand-50 transition-all">
                                <lucide-icon [name]="ExternalLink" class="h-3 w-3"></lucide-icon> {{ source.title }}
                              </a>
                            </div>
                          </div>
                       </div>
                    </div>
                    <div *ngIf="isThinking()" class="flex justify-start animate-pulse">
                      <div class="bg-slate-100 p-5 rounded-2xl rounded-tl-none flex items-center gap-3">
                        <lucide-icon [name]="Loader2" class="h-4 w-4 animate-spin text-brand-600"></lucide-icon>
                        <span class="text-sm font-medium text-slate-500">Consultando base tributária atualizada...</span>
                      </div>
                    </div>
                  </div>

                  <div class="p-6 bg-white border-t flex gap-3">
                    <input [(ngModel)]="aiQuery" (keyup.enter)="askAI()" placeholder="Sua dúvida sobre ICMS, ISS, IPI ou Simples..." class="flex-1 p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-brand-500">
                    <button (click)="askAI()" [disabled]="isThinking() || !aiQuery.trim()" class="bg-brand-600 text-white p-4 rounded-2xl shadow-lg hover:bg-brand-700 transition-all">
                      <lucide-icon [name]="ArrowRight" class="h-6 w-6"></lucide-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Aba de Perfil -->
          <div *ngIf="activeTab() === 'profile'" class="animate-fade-in max-w-4xl mx-auto space-y-8">
             <div class="bg-white rounded-[2.5rem] border p-8 shadow-sm">
                <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <lucide-icon [name]="User" class="h-5 w-5 text-brand-600"></lucide-icon> Dados Pessoais
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
                    <input type="text" [(ngModel)]="profileForm.name" class="w-full p-4 bg-slate-50 border rounded-2xl">
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase">E-mail</label>
                    <input type="email" [value]="authForm.email" disabled class="w-full p-4 bg-slate-100 border rounded-2xl cursor-not-allowed">
                  </div>
                </div>
                <div class="mt-8 flex justify-end">
                   <button (click)="updateName()" class="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold">Salvar Alterações</button>
                </div>
             </div>
             <div class="bg-red-50 rounded-[2.5rem] border border-red-100 p-8 flex justify-between items-center">
                <div>
                  <h3 class="text-lg font-bold text-red-800 mb-1">Zona Crítica</h3>
                  <p class="text-sm text-red-600/70">Excluir conta permanentemente (confirmação via e-mail).</p>
                </div>
                <button (click)="requestDeleteAccount()" class="bg-red-600 text-white px-6 py-3 rounded-xl font-bold">Excluir</button>
             </div>
          </div>
        </div>
      </div>

      <!-- Modal de Exclusão (Simulado) -->
      <div *ngIf="showDeleteModal()" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
         <div class="bg-white w-full max-w-md rounded-[3rem] p-10 animate-fade-in">
            <h2 class="text-2xl font-black text-center mb-4">Confirmar Exclusão</h2>
            <p class="text-center text-slate-500 mb-8">Insira o código enviado para seu e-mail (Simulado: 123456).</p>
            <input type="text" [(ngModel)]="deleteCodeInput" class="w-full p-5 text-center text-3xl font-black tracking-widest bg-slate-50 border rounded-2xl mb-6">
            <div class="space-y-3">
              <button (click)="confirmDeleteAccount()" class="w-full bg-red-600 text-white py-5 rounded-2xl font-bold">Excluir Conta</button>
              <button (click)="closeDeleteModal()" class="w-full py-4 text-slate-500 font-bold">Cancelar</button>
            </div>
         </div>
      </div>

    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    input::placeholder { color: #94a3b8; }
  `]
})
export class App implements OnInit {
  view = signal<ViewState>('landing');
  activeTab = signal<'overview' | 'ai' | 'profile'>('overview');
  
  // Auth State
  isAuthenticating = signal(false);
  authForm = { name: '', email: '', password: '' };

  // Profile Form State
  profileForm = { name: '', currentPass: '', newPass: '', confirmPass: '' };

  // Onboarding Step State
  onboardingStep = signal(1);
  isSearchingCNPJ = signal(false);
  
  // Form para nova empresa
  companyForm = {
    cnpj: '',
    name: '',
    municipality: '',
    state: '',
    type: CompanyType.Servico,
    currentRegime: TaxRegime.Simples,
    simplesAnexo: 'Anexo III',
    simplesFatorR: false,
    annualRevenue: 0,
    payrollCosts: 0
  };

  companyTypes = [
    { label: 'Serviço', value: CompanyType.Servico, icon: Briefcase },
    { label: 'Comércio', value: CompanyType.Comercio, icon: Tag },
    { label: 'Indústria', value: CompanyType.Industria, icon: Database }
  ];

  regimes = [TaxRegime.Simples, TaxRegime.Presumido, TaxRegime.Real];

  // Simulations State
  simulations = signal<CompanyData[]>([]);

  // Account Deletion State
  showDeleteModal = signal(false);
  deleteCodeInput = '';
  sentCode = '123456';

  // AI State
  aiQuery = '';
  isThinking = signal(false);
  chatHistory = signal<{role: 'user' | 'model', text: string, sources?: any[]}[]>([]);

  // Icons
  BarChart2 = BarChart2; ArrowRight = ArrowRight; Building2 = Building2; 
  Search = Search; LogOut = LogOut; Database = Database; 
  PlusCircle = PlusCircle; ChevronRight = ChevronRight; Download = Download;
  CheckCircle = CheckCircle; ShieldAlert = ShieldAlert; MessageSquare = MessageSquare;
  BookOpen = BookOpen; ExternalLink = ExternalLink; XCircle = XCircle;
  Loader2 = Loader2; Sparkles = Sparkles; Mail = Mail; Lock = Lock;
  User = User; Eye = Eye; EyeOff = EyeOff; Clock = Clock; Zap = Zap;
  ShieldCheck = ShieldCheck; TrendingUp = TrendingUp; Tag = Tag; Gift = Gift;
  Plus = Plus; Scale = Scale; Briefcase = Briefcase; FileText = FileText;
  History = History; Settings = Settings; Trash2 = Trash2; Key = Key;
  Shield = Shield; MailCheck = MailCheck; DollarSign = DollarSign; PieChart = PieChart;
  ArrowLeft = ArrowLeft;

  ngOnInit() {
    this.chatHistory.set([{
      role: 'model',
      text: 'Olá! Sou seu assistente de estratégia tributária. Como posso ajudar com ISS, ICMS, Indústria ou Reforma hoje?'
    }]);
  }

  // Auth Handlers
  handleLogin() {
    this.view.set('dashboard');
    this.profileForm.name = this.authForm.name || 'Estrategista';
  }

  handleRegister() {
    this.view.set('onboarding');
    this.profileForm.name = this.authForm.name;
  }

  handleLogout() {
    this.view.set('landing');
    this.simulations.set([]);
  }

  // ONBOARDING FLOW
  startNewSimulation() {
    this.companyForm = {
      cnpj: '',
      name: '',
      municipality: '',
      state: '',
      type: CompanyType.Servico,
      currentRegime: TaxRegime.Simples,
      simplesAnexo: 'Anexo III',
      simplesFatorR: false,
      annualRevenue: 0,
      payrollCosts: 0
    };
    this.onboardingStep.set(1);
    this.view.set('onboarding');
  }

  nextStep() {
    if (this.onboardingStep() < 3) this.onboardingStep.update(s => s + 1);
  }

  prevStep() {
    if (this.onboardingStep() > 1) this.onboardingStep.update(s => s - 1);
  }

  async searchCNPJ() {
    if (!this.companyForm.cnpj || this.companyForm.cnpj.length < 11) {
        alert('Por favor, insira um CNPJ válido.');
        return;
    }
    
    this.isSearchingCNPJ.set(true);
    try {
      const data = await lookupCNPJ(this.companyForm.cnpj);
      this.companyForm.name = data.name;
      this.companyForm.municipality = data.municipality;
      this.companyForm.state = data.state;
    } catch (err) {
      alert('Erro ao buscar CNPJ. Verifique a conexão e tente novamente.');
    } finally {
      this.isSearchingCNPJ.set(false);
    }
  }

  finishOnboarding() {
    const newCompany: CompanyData = {
      id: Math.random().toString(36).substr(2, 9),
      cnpj: this.companyForm.cnpj,
      name: this.companyForm.name,
      municipality: this.companyForm.municipality,
      state: this.companyForm.state,
      type: this.companyForm.type,
      currentRegime: this.companyForm.currentRegime,
      simplesAnexo: this.companyForm.simplesAnexo,
      simplesFatorR: this.companyForm.simplesFatorR,
      annualRevenue: this.companyForm.annualRevenue,
      payrollCosts: this.companyForm.payrollCosts,
      cnae: '6201-5/00',
      suppliers: []
    };
    this.simulations.update(list => [...list, newCompany]);
    this.view.set('dashboard');
    this.activeTab.set('overview');
  }

  // Profile Actions
  updateName() {
    alert('Nome atualizado com sucesso!');
  }

  requestDeleteAccount() {
    this.showDeleteModal.set(true);
    console.log('Código enviado para e-mail (simulado): 123456');
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.deleteCodeInput = '';
  }

  confirmDeleteAccount() {
    if (this.deleteCodeInput === this.sentCode) {
      alert('Sua conta foi excluída permanentemente.');
      this.showDeleteModal.set(false);
      this.handleLogout();
    } else {
      alert('Código inválido. Verifique seu e-mail.');
    }
  }

  // AI Actions
  async askLegislativeSummary(topic: string) {
    this.aiQuery = `Faça um resumo técnico completo sobre a legislação de ${topic}, destacando as principais regras atuais e detalhando o impacto previsto para 2026 na Reforma Tributária (IBS/CBS/Imposto Seletivo). Mencione especificamente que no caso de ISS e ICMS o processo de extinção completa se dará somente em 2033. Cite leis específicas como LC 123, LC 116, RICMS ou RIPI onde aplicável.`;
    await this.askAI();
  }

  async askAI() {
    if (!this.aiQuery.trim() || this.isThinking()) return;
    const userPrompt = this.aiQuery;
    this.chatHistory.update(h => [...h, { role: 'user', text: userPrompt }]);
    this.aiQuery = '';
    this.isThinking.set(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: userPrompt,
        config: { 
          tools: [{ googleSearch: {} }],
          systemInstruction: `Você é um Consultor Tributário Sênior de elite especialista em legislação brasileira.
          Domínio Técnico obrigatório:
          1. ISS: LC 116/03, conflitos de competência e extinção para o IBS (processo final em 2033).
          2. ICMS: Substituição tributária, Convênios CONFAZ e transição para o IBS (processo final em 2033).
          3. IPI & Indústria: RIPI, créditos físicos/financeiros e o novo Imposto Seletivo (Sin Tax).
          4. Simples Nacional: LC 123/06, Fator R e o regime híbrido pós-2026.
          
          Responda de forma executiva, baseada em lei, sempre citando os impactos da Reforma PLP 68/2024.`
        },
      });

      const text = response.text || 'Não foi possível obter uma resposta técnica no momento.';
      const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = rawSources.map((chunk: any) => ({
        title: chunk.web?.title || 'Diário Oficial / Fonte Governamental',
        uri: chunk.web?.uri || '#'
      }));

      this.chatHistory.update(h => [...h, { role: 'model', text, sources }]);
    } catch (err) {
      this.chatHistory.update(h => [...h, { role: 'model', text: 'Erro ao consultar base de dados. Verifique sua conexão.' }]);
    } finally {
      this.isThinking.set(false);
    }
  }

  clearChat() {
    this.chatHistory.set([{ 
      role: 'model', 
      text: 'Chat reiniciado. Como posso ajudar com sua estratégia tributária hoje?' 
    }]);
  }
}

bootstrapApplication(App).catch(err => console.error(err));
