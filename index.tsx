
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
  PieChart,
  MapPin,
  ClipboardList,
  Wallet,
  Coins,
  Target,
  CreditCard,
  Info,
  AlertCircle
} from 'lucide-angular';

import { CompanyData, CompanyType, TaxRegime, ViewState, SimulationResult, CNAE, ServiceCategory } from './components/types';
import { runSimulation, lookupCNPJ } from './components/taxService';
import { AuthService } from './services/authService';

registerLocaleData(localePt);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  template: `
    <div [ngSwitch]="view()" class="min-h-screen font-sans">
      
      <!-- Landing Page -->
      <div *ngSwitchCase="'landing'" class="bg-white min-h-screen animate-fade-in overflow-x-hidden">
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

          <!-- SEÇÃO DE PREÇOS -->
          <div class="py-24 border-t border-slate-100">
            <div class="text-center mb-16">
              <h2 class="text-4xl font-black text-slate-900 mb-4">Escolha seu plano estratégico</h2>
              <p class="text-slate-500 font-medium">Investimento inteligente com retorno garantido em economia fiscal.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col hover:border-brand-200 transition-all">
                <div class="mb-8">
                  <span class="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2 block">Mensal</span>
                  <div class="flex items-baseline gap-1">
                    <span class="text-3xl font-black text-slate-900">R$ 99,90</span>
                    <span class="text-slate-400 font-medium">/mês</span>
                  </div>
                </div>
                <ul class="space-y-4 mb-8 flex-1 text-sm text-slate-600 font-medium">
                  <li class="flex items-center gap-2"><lucide-icon [name]="CheckCircle" class="h-4 w-4 text-brand-600"></lucide-icon> Análises Ilimitadas</li>
                  <li class="flex items-center gap-2"><lucide-icon [name]="CheckCircle" class="h-4 w-4 text-brand-600"></lucide-icon> Reforma 2026 Completa</li>
                  <li class="flex items-center gap-2"><lucide-icon [name]="CheckCircle" class="h-4 w-4 text-brand-600"></lucide-icon> Suporte via Chat AI</li>
                </ul>
                <button (click)="view.set('register')" class="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all">Começar Mensal</button>
              </div>

              <div class="bg-white p-8 rounded-[2.5rem] border-2 border-slate-900 shadow-xl flex flex-col scale-105 relative z-10">
                <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">30% OFF - Semestral</div>
                <div class="mb-8 mt-2">
                  <span class="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2 block">Semestral</span>
                  <div class="flex items-baseline gap-1">
                    <span class="text-4xl font-black text-slate-900">R$ 69,93</span>
                    <span class="text-slate-400 font-medium">/mês</span>
                  </div>
                  <span class="text-[10px] font-bold text-brand-600 mt-1 block">Total: R$ 419,58 /semestre</span>
                </div>
                <ul class="space-y-4 mb-8 flex-1 text-sm text-slate-900 font-bold">
                  <li class="flex items-center gap-2"><lucide-icon [name]="CheckCircle" class="h-4 w-4 text-brand-600"></lucide-icon> Todos os recursos Pro</li>
                  <li class="flex items-center gap-2"><lucide-icon [name]="CheckCircle" class="h-4 w-4 text-brand-600"></lucide-icon> Exportação PDF Ilimitada</li>
                  <li class="flex items-center gap-2"><lucide-icon [name]="CheckCircle" class="h-4 w-4 text-brand-600"></lucide-icon> Grounding Google Search</li>
                </ul>
                <button (click)="view.set('register')" class="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">Assinar Semestral</button>
              </div>

              <div class="bg-brand-50 p-8 rounded-[2.5rem] border border-brand-200 shadow-sm flex flex-col hover:border-brand-300 transition-all">
                <div class="mb-8">
                  <span class="text-brand-600 font-bold text-[10px] uppercase tracking-widest mb-2 block">Anual - 40% OFF</span>
                  <div class="flex items-baseline gap-1">
                    <span class="text-3xl font-black text-slate-900">R$ 59,94</span>
                    <span class="text-slate-400 font-medium">/mês</span>
                  </div>
                  <span class="text-[10px] font-bold text-slate-500 mt-1 block">Total: R$ 719,28 /ano</span>
                </div>
                <ul class="space-y-4 mb-8 flex-1 text-sm text-slate-600 font-medium">
                  <li class="flex items-center gap-2"><lucide-icon [name]="CheckCircle" class="h-4 w-4 text-brand-600"></lucide-icon> Máximo Desconto</li>
                  <li class="flex items-center gap-2"><lucide-icon [name]="CheckCircle" class="h-4 w-4 text-brand-600"></lucide-icon> Prioridade em Novas Leis</li>
                  <li class="flex items-center gap-2"><lucide-icon [name]="CheckCircle" class="h-4 w-4 text-brand-600"></lucide-icon> Acesso Master Multi-empresa</li>
                </ul>
                <button (click)="view.set('register')" class="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all">Assinar Anual</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <!-- Login Screen -->
      <div *ngSwitchCase="'login'" class="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-fade-in">
        <div class="w-full max-w-md">
          <div class="text-center mb-8">
             <div (click)="view.set('landing')" class="inline-flex items-center gap-2 cursor-pointer mb-6 group">
                <div class="bg-brand-600 p-1 rounded-lg group-hover:bg-brand-700 transition-colors"><lucide-icon [name]="BarChart2" class="h-5 w-5 text-white"></lucide-icon></div>
                <span class="text-xl font-black text-slate-900">TaxStrategist</span>
             </div>
             <h2 class="text-3xl font-bold text-slate-900">Bem-vindo de volta</h2>
             <p class="text-slate-500 mt-2">Entre para gerenciar suas análises fiscais.</p>
          </div>
          
          <div class="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
            <!-- Error Alert -->
            <div *ngIf="authError()" class="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 animate-fade-in">
              <lucide-icon [name]="AlertCircle" class="h-5 w-5 shrink-0"></lucide-icon>
              <span class="text-sm font-bold">{{ authError() }}</span>
            </div>

            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-widest">E-mail</label>
                <div class="relative">
                  <lucide-icon [name]="Mail" class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"></lucide-icon>
                  <input type="email" [(ngModel)]="authForm.email" placeholder="nome@empresa.com" class="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all">
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-widest">Senha</label>
                <div class="relative">
                  <lucide-icon [name]="Lock" class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"></lucide-icon>
                  <input type="password" [(ngModel)]="authForm.password" placeholder="••••••••" class="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all">
                </div>
              </div>
              <button (click)="handleLogin()" [disabled]="isAuthenticating()" class="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2">
                <lucide-icon *ngIf="isAuthenticating()" [name]="Loader2" class="h-5 w-5 animate-spin"></lucide-icon>
                Entrar
              </button>
            </div>

            <div class="mt-8 text-center">
              <p class="text-slate-500 text-sm">Não tem uma conta? <button (click)="view.set('register')" class="text-brand-600 font-bold hover:underline">Cadastre-se</button></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Register Screen -->
      <div *ngSwitchCase="'register'" class="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-fade-in">
        <div class="w-full max-w-md">
          <div class="text-center mb-8">
             <div (click)="view.set('landing')" class="inline-flex items-center gap-2 cursor-pointer mb-6 group">
                <div class="bg-brand-600 p-1 rounded-lg group-hover:bg-brand-700 transition-colors"><lucide-icon [name]="BarChart2" class="h-5 w-5 text-white"></lucide-icon></div>
                <span class="text-xl font-black text-slate-900">TaxStrategist</span>
             </div>
             <h2 class="text-3xl font-bold text-slate-900">Crie sua conta</h2>
             <p class="text-slate-500 mt-2">Comece a economizar impostos hoje mesmo.</p>
          </div>

          <div class="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
            <!-- Error Alert -->
            <div *ngIf="authError()" class="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 animate-fade-in">
              <lucide-icon [name]="AlertCircle" class="h-5 w-5 shrink-0"></lucide-icon>
              <span class="text-sm font-bold">{{ authError() }}</span>
            </div>

            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-widest">Nome Completo</label>
                <div class="relative">
                  <lucide-icon [name]="User" class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"></lucide-icon>
                  <input type="text" [(ngModel)]="authForm.name" placeholder="Ex: João da Silva" class="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all">
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-widest">E-mail Corporativo</label>
                <div class="relative">
                  <lucide-icon [name]="Mail" class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"></lucide-icon>
                  <input type="email" [(ngModel)]="authForm.email" placeholder="nome@empresa.com" class="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all">
                </div>
              </div>
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-widest">Senha</label>
                  <div class="relative">
                    <lucide-icon [name]="Lock" class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"></lucide-icon>
                    <input type="password" [(ngModel)]="authForm.password" placeholder="Mínimo 6 caracteres" class="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all">
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-widest">Confirmar Senha</label>
                  <div class="relative">
                    <lucide-icon [name]="ShieldCheck" class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"></lucide-icon>
                    <input type="password" [(ngModel)]="authForm.confirmPassword" placeholder="Repita sua senha" class="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all">
                  </div>
                </div>
              </div>
              <button (click)="handleRegister()" [disabled]="isAuthenticating()" class="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2">
                <lucide-icon *ngIf="isAuthenticating()" [name]="Loader2" class="h-5 w-5 animate-spin"></lucide-icon>
                Criar Conta
              </button>
            </div>

            <div class="mt-8 text-center">
              <p class="text-slate-500 text-sm">Já tem uma conta? <button (click)="view.set('login')" class="text-brand-600 font-bold hover:underline">Faça login</button></p>
            </div>
          </div>
        </div>
      </div>

      <!-- ONBOARDING -->
      <div *ngSwitchCase="'onboarding'" class="bg-slate-50 min-h-screen flex items-center justify-center p-6 animate-fade-in">
        <div class="max-w-3xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
          
          <!-- Stepper Header -->
          <div class="bg-slate-900 p-8 text-white relative">
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center gap-2">
                 <div class="bg-brand-600 p-1.5 rounded-lg"><lucide-icon [name]="Building2" class="h-5 w-5"></lucide-icon></div>
                 <h2 class="text-xl font-black">Nova Análise</h2>
              </div>
              <span class="text-slate-400 font-bold text-sm uppercase tracking-widest">Passo {{ onboardingStep() }} de 3</span>
            </div>
            <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
               <div class="h-full bg-brand-500 transition-all duration-500" [style.width.%]="(onboardingStep() / 3) * 100"></div>
            </div>
          </div>

          <div class="p-10">
            <!-- Passo 1: CNPJ e Seleção de CNAE -->
            <div *ngIf="onboardingStep() === 1" class="space-y-8 animate-fade-in">
              <div>
                <h3 class="text-2xl font-black text-slate-900 mb-2">Identificação e Atividades</h3>
                <p class="text-slate-500">Insira o CNPJ para carregar os dados cadastrais da RFB.</p>
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

              <!-- Listagem de CNAEs para Seleção -->
              <div *ngIf="companyForm.name" class="animate-fade-in space-y-4">
                <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 class="font-black text-slate-900">{{ companyForm.name }}</h4>
                    <p class="text-xs text-slate-500 font-medium">{{ companyForm.municipality }} - {{ companyForm.state }}</p>
                  </div>
                  <div class="bg-brand-600 p-2 rounded-xl"><lucide-icon [name]="CheckCircle" class="h-5 w-5 text-white"></lucide-icon></div>
                </div>

                <div>
                  <label class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Selecione a atividade base para o cálculo tributário:</label>
                  <div class="space-y-2">
                    <!-- CNAE Principal -->
                    <button 
                      (click)="selectCnae(allFetchedCnaes()[0])"
                      [class.ring-2]="companyForm.selectedCnae?.code === allFetchedCnaes()[0]?.code"
                      [class.ring-brand-500]="companyForm.selectedCnae?.code === allFetchedCnaes()[0]?.code"
                      [class.bg-brand-50]="companyForm.selectedCnae?.code === allFetchedCnaes()[0]?.code"
                      class="w-full p-4 rounded-2xl border bg-white hover:bg-slate-50 transition-all text-left flex items-start gap-3 relative">
                      <div class="bg-slate-100 p-2 rounded-xl mt-1"><lucide-icon [name]="ClipboardList" class="h-4 w-4 text-slate-500"></lucide-icon></div>
                      <div>
                        <span class="block text-[10px] font-black text-brand-600 uppercase tracking-tighter">Atividade Principal</span>
                        <span class="block font-bold text-slate-800 text-sm leading-tight">{{ allFetchedCnaes()[0]?.code }} - {{ allFetchedCnaes()[0]?.description }}</span>
                        <span class="inline-block mt-1 px-2 py-0.5 rounded-full bg-slate-200 text-[8px] font-black uppercase text-slate-600">{{ allFetchedCnaes()[0]?.type }}</span>
                      </div>
                      <div *ngIf="companyForm.selectedCnae?.code === allFetchedCnaes()[0]?.code" class="absolute right-4 top-1/2 -translate-y-1/2">
                        <lucide-icon [name]="CheckCircle" class="h-5 w-5 text-brand-600"></lucide-icon>
                      </div>
                    </button>

                    <!-- CNAEs Secundários -->
                    <div *ngIf="allFetchedCnaes().length > 1" class="pt-2">
                       <span class="text-[10px] font-bold text-slate-400 uppercase ml-2">Secundários</span>
                       <div class="space-y-2 mt-2">
                         <button 
                            *ngFor="let cnae of allFetchedCnaes().slice(1)"
                            (click)="selectCnae(cnae)"
                            [class.ring-2]="companyForm.selectedCnae?.code === cnae.code"
                            [class.ring-brand-500]="companyForm.selectedCnae?.code === cnae.code"
                            [class.bg-brand-50]="companyForm.selectedCnae?.code === cnae.code"
                            class="w-full p-4 rounded-2xl border bg-white hover:bg-slate-50 transition-all text-left flex items-start gap-3">
                            <div class="bg-slate-100 p-2 rounded-xl mt-1"><lucide-icon [name]="ClipboardList" class="h-4 w-4 text-slate-400"></lucide-icon></div>
                            <div>
                              <span class="block font-bold text-slate-700 text-xs leading-tight">{{ cnae.code }} - {{ cnae.description }}</span>
                              <span class="inline-block mt-1 px-2 py-0.5 rounded-full bg-slate-100 text-[8px] font-black uppercase text-slate-500">{{ cnae.type }}</span>
                            </div>
                         </button>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-end pt-4">
                <button 
                  (click)="nextStep()" 
                  [disabled]="!companyForm.selectedCnae"
                  class="bg-brand-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-500/20 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50">
                  Definir Perfil <lucide-icon [name]="ArrowRight" class="h-5 w-5"></lucide-icon>
                </button>
              </div>
            </div>

            <!-- Passo 2: Perfil Tributário -->
            <div *ngIf="onboardingStep() === 2" class="space-y-8 animate-fade-in">
               <div>
                 <h3 class="text-2xl font-black text-slate-900 mb-2">Perfil Tributário</h3>
                 <p class="text-slate-500">Baseado no CNAE: <span class="font-bold text-slate-900">{{ companyForm.selectedCnae?.description }}</span></p>
               </div>

               <div class="p-6 bg-brand-50 rounded-3xl border border-brand-100 flex items-center gap-4">
                  <div class="bg-white p-3 rounded-2xl shadow-sm"><lucide-icon [name]="Info" class="text-brand-600 h-6 w-6"></lucide-icon></div>
                  <p class="text-sm text-brand-900 font-medium">
                    Atividade identificada como: <strong>{{ companyForm.type }}</strong>. 
                  </p>
               </div>

               <div class="space-y-4">
                  <label class="text-sm font-bold text-slate-700 uppercase tracking-widest">Regime Tributário Atual</label>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button 
                      *ngFor="let regime of regimes" 
                      (click)="setTaxRegime(regime)"
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
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Enquadramento de Anexo Sugerido</label>
                    <div class="flex flex-wrap gap-2">
                      <button 
                        *ngFor="let anexo of getAvailableAnnexes()"
                        (click)="companyForm.simplesAnexo = anexo"
                        [class.bg-brand-600]="companyForm.simplesAnexo === anexo"
                        [class.text-white]="companyForm.simplesAnexo === anexo"
                        class="px-4 py-2 border rounded-xl text-xs font-bold transition-all shadow-sm">
                        {{ anexo }}
                      </button>
                    </div>
                  </div>
                  
                  <div *ngIf="companyForm.type === 'Serviço'" class="pt-4 border-t border-slate-200 mt-4 space-y-4">
                     <div>
                       <label class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Sub-categoria para Reforma 2026</label>
                       <div class="grid grid-cols-1 gap-2">
                         <button 
                            *ngFor="let cat of serviceCategories"
                            (click)="companyForm.serviceCategory = cat.value"
                            [class.bg-brand-600]="companyForm.serviceCategory === cat.value"
                            [class.text-white]="companyForm.serviceCategory === cat.value"
                            class="p-4 rounded-xl border text-xs font-bold transition-all flex justify-between items-center group">
                            {{ cat.label }}
                            <lucide-icon *ngIf="companyForm.serviceCategory === cat.value" [name]="CheckCircle" class="h-4 w-4"></lucide-icon>
                         </button>
                       </div>
                     </div>
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
                 <p class="text-slate-500">Projeção de valores para o cenário {{ companyForm.currentRegime }}.</p>
               </div>

               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div class="space-y-2">
                   <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Faturamento Anual (R$)</label>
                   <div class="relative group">
                     <lucide-icon [name]="Wallet" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-brand-600 transition-colors"></lucide-icon>
                     <input type="number" [(ngModel)]="companyForm.annualRevenue" placeholder="0.00" class="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 text-lg font-bold">
                   </div>
                 </div>
                 <div class="space-y-2">
                   <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Custo de Folha Anual (R$)</label>
                   <div class="relative group">
                     <lucide-icon [name]="Coins" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-brand-600 transition-colors"></lucide-icon>
                     <input type="number" [(ngModel)]="companyForm.payrollCosts" placeholder="0.00" class="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 text-lg font-bold">
                   </div>
                 </div>
               </div>

               <div class="flex justify-between pt-4">
                  <button (click)="prevStep()" class="text-slate-500 font-bold hover:text-slate-900 transition-all flex items-center gap-2">
                    <lucide-icon [name]="ArrowLeft" class="h-4 w-4"></lucide-icon> Voltar
                  </button>
                  <button (click)="finishOnboarding()" [disabled]="!companyForm.annualRevenue" class="bg-brand-600 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-brand-500/40 hover:scale-105 transition-all flex items-center gap-3">
                    Gerar Análise <lucide-icon [name]="PieChart" class="h-6 w-6"></lucide-icon>
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
            <button (click)="activeTab.set('overview')" [class.bg-white]="activeTab() === 'overview'" class="text-xs font-bold px-4 py-2 rounded-lg transition-all">Análises</button>
            <button (click)="activeTab.set('ai')" [class.bg-white]="activeTab() === 'ai'" class="text-xs font-bold px-4 py-2 rounded-lg transition-all">IA Legislativa</button>
            <button (click)="activeTab.set('profile')" [class.bg-white]="activeTab() === 'profile'" class="text-xs font-bold px-4 py-2 rounded-lg transition-all">Perfil</button>
          </div>
          <div class="flex items-center gap-4">
             <span class="text-xs font-bold text-slate-500">{{ currentUser()?.name }}</span>
             <button (click)="handleLogout()" class="text-slate-500 font-bold text-sm hover:text-red-600 transition-colors">Sair</button>
          </div>
        </nav>

        <div class="max-w-7xl mx-auto p-8">
          <div *ngIf="activeTab() === 'overview'" class="space-y-8 animate-fade-in">
             <div *ngIf="simulations().length > 0; else emptyState">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div *ngFor="let sim of simulations()" class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                     <div class="flex justify-between items-start mb-6">
                        <div class="bg-brand-50 w-12 h-12 rounded-2xl flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all"><lucide-icon [name]="Building2" class="h-6 w-6"></lucide-icon></div>
                        <span class="text-[10px] px-2 py-1 rounded-full bg-slate-900 text-white font-black uppercase">{{ sim.currentRegime }}</span>
                     </div>
                     <h4 class="font-black text-slate-900 text-lg mb-2 truncate">{{ sim.name }}</h4>
                     <p class="text-[10px] text-slate-400 font-bold mb-4">{{ sim.cnpj }}</p>
                     
                     <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                        <div class="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                           <lucide-icon [name]="Target" class="h-3 w-3"></lucide-icon> Atividade Base
                        </div>
                        <span class="text-[10px] font-bold text-slate-700 leading-tight block truncate">{{ sim.selectedCnae.description }}</span>
                     </div>

                     <div class="pt-6 border-t border-slate-50 flex justify-between items-center">
                        <div class="flex flex-col">
                           <span class="text-[8px] font-bold text-slate-400 uppercase">Faturamento Anual</span>
                           <span class="text-brand-600 font-black">R$ {{ sim.annualRevenue | number:'1.2-2' }}</span>
                        </div>
                        <button class="bg-slate-100 text-slate-400 p-2 rounded-xl hover:bg-brand-600 hover:text-white transition-all"><lucide-icon [name]="ChevronRight" class="h-5 w-5"></lucide-icon></button>
                     </div>
                  </div>
                </div>
             </div>
             <ng-template #emptyState>
                <div class="text-center py-20 bg-white rounded-[3rem] border shadow-2xl max-w-2xl mx-auto">
                  <div class="bg-brand-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-brand-600"><lucide-icon [name]="Building2" class="h-12 w-12"></lucide-icon></div>
                  <h2 class="text-3xl font-black mb-4">Pronto para começar?</h2>
                  <p class="text-slate-500 mb-10">Sua jornada rumo à eficiência fiscal 2026 começa aqui.</p>
                  <button (click)="startNewSimulation()" class="bg-brand-600 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-105 transition-all">Iniciar Nova Análise</button>
                </div>
             </ng-template>
          </div>

          <!-- Aba Perfil -->
          <div *ngIf="activeTab() === 'profile'" class="animate-fade-in max-w-2xl mx-auto">
             <div class="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
                <div class="flex items-center gap-6 mb-10">
                   <div class="bg-brand-600 w-20 h-20 rounded-3xl flex items-center justify-center text-white text-3xl font-black">
                      {{ currentUser()?.name?.charAt(0) }}
                   </div>
                   <div>
                      <h2 class="text-2xl font-black text-slate-900">{{ currentUser()?.name }}</h2>
                      <p class="text-slate-500 font-medium">{{ currentUser()?.email }}</p>
                   </div>
                </div>

                <div class="space-y-6">
                   <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Membro desde</span>
                      <span class="font-bold text-slate-700">{{ currentUser()?.createdAt | date:'shortDate':'':'pt-BR' }}</span>
                   </div>
                   <button class="w-full p-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Alterar Senha</button>
                   <button (click)="handleLogout()" class="w-full p-4 border-2 border-red-50 text-red-500 rounded-2xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                      <lucide-icon [name]="LogOut" class="h-5 w-5"></lucide-icon> Encerrar Sessão
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  `]
})
export class App implements OnInit {
  view = signal<ViewState>('landing');
  activeTab = signal<'overview' | 'ai' | 'profile'>('overview');
  
  // Auth State
  authForm = { name: '', email: '', password: '', confirmPassword: '' };
  isAuthenticating = signal(false);
  authError = signal<string | null>(null);
  currentUser = signal<any | null>(null);
  private authService = new AuthService();

  // Onboarding
  onboardingStep = signal(1);
  isSearchingCNPJ = signal(false);
  allFetchedCnaes = signal<CNAE[]>([]);
  
  companyForm = {
    cnpj: '',
    name: '',
    municipality: '',
    state: '',
    selectedCnae: null as CNAE | null,
    type: CompanyType.Servico,
    serviceCategory: ServiceCategory.Padrao,
    currentRegime: TaxRegime.Simples,
    simplesAnexo: 'Anexo III',
    simplesFatorR: false,
    industryHarmfulProduct: false,
    annualRevenue: 0,
    payrollCosts: 0
  };

  companyTypes = [
    { label: 'Serviço', value: CompanyType.Servico, icon: Briefcase },
    { label: 'Comércio', value: CompanyType.Comercio, icon: Tag },
    { label: 'Indústria', value: CompanyType.Industria, icon: Database }
  ];

  serviceCategories = [
    { label: 'Serviço Geral (Padrão)', value: ServiceCategory.Padrao },
    { label: 'Saúde ou Educação (Redução 60%)', value: ServiceCategory.SaudeEducacao },
    { label: 'Profissional Liberal (Redução 30%)', value: ServiceCategory.ProfissionalLiberal }
  ];

  regimes = [TaxRegime.Simples, TaxRegime.Presumido, TaxRegime.Real];
  simulations = signal<CompanyData[]>([]);

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
  ArrowLeft = ArrowLeft; MapPin = MapPin; ClipboardList = ClipboardList;
  Wallet = Wallet; Coins = Coins; Target = Target; CreditCard = CreditCard; Info = Info;
  AlertCircle = AlertCircle;

  ngOnInit() {
    this.authError.set(null);
  }

  // --- AUTH LOGIC ---
  async handleLogin() {
    this.authError.set(null);
    this.isAuthenticating.set(true);

    // Simula latência de rede
    await new Promise(r => setTimeout(r, 800));

    const result = this.authService.login(this.authForm.email, this.authForm.password);
    
    if (result.success) {
      this.currentUser.set(result.user);
      this.view.set('dashboard');
    } else {
      this.authError.set(result.message);
    }
    this.isAuthenticating.set(false);
  }

  async handleRegister() {
    this.authError.set(null);
    this.isAuthenticating.set(true);

    // Simula latência de rede
    await new Promise(r => setTimeout(r, 1200));

    const result = this.authService.register({
      name: this.authForm.name,
      email: this.authForm.email,
      password: this.authForm.password,
      confirmPassword: this.authForm.confirmPassword,
      createdAt: ''
    });

    if (result.success) {
      // Auto-login após registro
      const loginResult = this.authService.login(this.authForm.email, this.authForm.password);
      this.currentUser.set(loginResult.user);
      this.view.set('onboarding');
    } else {
      this.authError.set(result.message);
    }
    this.isAuthenticating.set(false);
  }

  handleLogout() { 
    this.currentUser.set(null);
    this.view.set('landing'); 
    this.simulations.set([]); 
    this.authForm = { name: '', email: '', password: '', confirmPassword: '' };
  }

  // --- ONBOARDING LOGIC ---
  getAvailableAnnexes(): string[] {
    const type = this.companyForm.type;
    if (type === CompanyType.Comercio) return ['Anexo I'];
    if (type === CompanyType.Industria) return ['Anexo II'];
    return ['Anexo III', 'Anexo IV', 'Anexo V'];
  }

  setTaxRegime(regime: TaxRegime) {
    this.companyForm.currentRegime = regime;
    this.ensureValidAnnex();
  }

  selectCnae(cnae: CNAE) {
    this.companyForm.selectedCnae = cnae;
    this.companyForm.type = cnae.type;
    this.ensureValidAnnex();
  }

  ensureValidAnnex() {
    const available = this.getAvailableAnnexes();
    if (!available.includes(this.companyForm.simplesAnexo)) {
      this.companyForm.simplesAnexo = available[0];
    }
    if (this.companyForm.simplesAnexo !== 'Anexo V') this.companyForm.simplesFatorR = false;
  }

  startNewSimulation() {
    this.companyForm = { ...this.companyForm, cnpj: '', name: '', selectedCnae: null, annualRevenue: 0 };
    this.onboardingStep.set(1);
    this.view.set('onboarding');
  }

  nextStep() { if (this.onboardingStep() < 3) this.onboardingStep.update(s => s + 1); }
  prevStep() { if (this.onboardingStep() > 1) this.onboardingStep.update(s => s - 1); }

  async searchCNPJ() {
    if (!this.companyForm.cnpj || this.companyForm.cnpj.length < 11) return alert('CNPJ Inválido');
    this.isSearchingCNPJ.set(true);
    try {
      const data = await lookupCNPJ(this.companyForm.cnpj);
      this.companyForm.name = data.name;
      this.companyForm.municipality = data.municipality;
      this.companyForm.state = data.state;
      this.allFetchedCnaes.set([data.primaryCnae, ...data.secondaryCnaes]);
      this.selectCnae(data.primaryCnae);
    } catch (err) { alert('Erro ao buscar CNPJ.'); } 
    finally { this.isSearchingCNPJ.set(false); }
  }

  finishOnboarding() {
    if (!this.companyForm.selectedCnae) return;
    const newCompany: CompanyData = {
      ...this.companyForm,
      id: Math.random().toString(36).substr(2, 9),
      selectedCnae: this.companyForm.selectedCnae,
      suppliers: []
    } as any;
    this.simulations.update(list => [...list, newCompany]);
    this.view.set('dashboard');
    this.activeTab.set('overview');
  }
}

bootstrapApplication(App).catch(err => console.error(err));
