
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
  ShieldCheck,
  Wallet,
  Coins,
  PieChart,
  ClipboardList,
  Target,
  Info,
  AlertCircle,
  TrendingUp,
  Briefcase,
  Tag,
  FileText,
  History,
  Settings,
  Trash2,
  Key,
  Shield,
  MailCheck,
  DollarSign,
  Scale,
  Zap,
  Globe,
  Clock,
  Layers,
  FileDown,
  ChevronLeft
} from 'lucide-angular';

import { CompanyData, CompanyType, TaxRegime, ViewState, SimulationResult, CNAE, ServiceCategory } from './components/types';
import { lookupCNPJ, getSimplesAnexoForCNAE, runSimulation } from './components/taxService';
import { AuthService } from './services/authService';
import { generatePDF } from './services/pdfService';

registerLocaleData(localePt);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  template: `
    <div [ngSwitch]="view()" class="min-h-screen font-sans bg-slate-50 text-slate-900">
      
      <!-- Landing Page -->
      <div *ngSwitchCase="'landing'" class="bg-white min-h-screen animate-fade-in overflow-x-hidden">
        <!-- Navigation -->
        <nav class="p-6 max-w-7xl mx-auto flex justify-between items-center border-b border-slate-50">
          <div class="flex items-center gap-2">
            <div class="bg-brand-600 p-1.5 rounded-lg shadow-lg shadow-brand-500/20"><lucide-icon [name]="BarChart2" class="h-6 w-6 text-white"></lucide-icon></div>
            <span class="text-xl font-black tracking-tight text-slate-900">TaxStrategist <span class="text-brand-600">2026</span></span>
          </div>
          <div class="hidden md:flex items-center gap-8 font-bold text-sm text-slate-500">
            <a href="#beneficios" class="hover:text-brand-600 transition-colors">Benefícios</a>
            <a href="#precos" class="hover:text-brand-600 transition-colors">Preços</a>
            <a href="#ia" class="hover:text-brand-600 transition-colors">IA Legislativa</a>
          </div>
          <div class="flex items-center gap-4">
            <button (click)="view.set('login')" class="font-bold text-slate-600 hover:text-brand-600 transition-colors">Entrar</button>
            <button (click)="view.set('register')" class="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg">Criar Conta</button>
          </div>
        </nav>
        
        <!-- Hero Section -->
        <main class="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-8 border border-brand-100">
            <lucide-icon [name]="Sparkles" class="h-3 w-3"></lucide-icon> INTELIGÊNCIA FISCAL PREDITIVA
          </div>
          <h1 class="text-6xl md:text-8xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tighter">
            Não apenas calcule. <br/>
            <span class="text-brand-600">Domine a Reforma.</span>
          </h1>
          <p class="text-xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            Simule o impacto da Reforma Tributária 2026 (PLP 68/2024) em segundos. Transforme incerteza legislativa em vantagem competitiva e economia real.
          </p>
          <div class="flex flex-col md:flex-row items-center justify-center gap-4 mb-20">
            <button (click)="view.set('register')" class="bg-brand-600 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-brand-500/40 hover:scale-105 transition-all flex items-center gap-3">
              Começar Análise Grátis <lucide-icon [name]="ArrowRight" class="h-6 w-6"></lucide-icon>
            </button>
          </div>

          <!-- Feature Cards -->
          <section id="beneficios" class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left py-20">
            <div class="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-brand-200 transition-all group">
              <div class="bg-brand-100 w-14 h-14 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-all">
                <lucide-icon [name]="ShieldCheck" class="h-8 w-8"></lucide-icon>
              </div>
              <h3 class="text-2xl font-black text-slate-900 mb-4">Conformidade Total</h3>
              <p class="text-slate-500 font-medium leading-relaxed">
                Algoritmos atualizados em tempo real com o PLP 68/2024. Esteja sempre um passo à frente das mudanças no IVA Dual, CBS e IBS.
              </p>
            </div>
            <div class="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-brand-200 transition-all group">
              <div class="bg-brand-100 w-14 h-14 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-all">
                <lucide-icon [name]="Zap" class="h-8 w-8"></lucide-icon>
              </div>
              <h3 class="text-2xl font-black text-slate-900 mb-4">Economia Instantânea</h3>
              <p class="text-slate-500 font-medium leading-relaxed">
                Identifique o melhor enquadramento em segundos e visualize onde cada real de imposto está indo.
              </p>
            </div>
            <div class="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-brand-200 transition-all group">
              <div class="bg-brand-100 w-14 h-14 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-all">
                <lucide-icon [name]="Globe" class="h-8 w-8"></lucide-icon>
              </div>
              <h3 class="text-2xl font-black text-slate-900 mb-4">IA Legislativa</h3>
              <p class="text-slate-500 font-medium leading-relaxed">
                Consultoria 24/7 conectada ao Congresso Nacional. Pergunte sobre qualquer artigo da lei e receba respostas fundamentadas.
              </p>
            </div>
          </section>
        </main>
      </div>

      <!-- Login Screen -->
      <div *ngSwitchCase="'login'" class="min-h-screen flex items-center justify-center p-6 animate-fade-in bg-slate-50">
        <div class="w-full max-w-md">
          <div (click)="view.set('landing')" class="flex items-center justify-center gap-2 mb-10 cursor-pointer group">
            <div class="bg-brand-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform"><lucide-icon [name]="BarChart2" class="h-6 w-6 text-white"></lucide-icon></div>
            <span class="text-2xl font-black text-slate-900">TaxStrategist</span>
          </div>
          
          <div class="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-white">
            <h2 class="text-3xl font-black text-slate-900 mb-2">Bem-vindo</h2>
            <p class="text-slate-500 mb-8 font-medium">Acesse sua inteligência fiscal.</p>
            
            <div *ngIf="authError()" class="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 animate-shake">
              <lucide-icon [name]="AlertCircle" class="h-5 w-5 shrink-0"></lucide-icon>
              <span class="text-sm font-bold">{{ authError() }}</span>
            </div>

            <div class="space-y-5">
              <input type="email" [(ngModel)]="authForm.email" placeholder="seu@email.com" class="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 font-medium">
              <input type="password" [(ngModel)]="authForm.password" (keyup.enter)="handleLogin()" placeholder="Senha" class="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500">
              <button (click)="handleLogin()" [disabled]="isAuthenticating()" class="w-full bg-brand-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-700 transition-all flex items-center justify-center gap-2">
                <lucide-icon *ngIf="isAuthenticating()" [name]="Loader2" class="h-5 w-5 animate-spin"></lucide-icon>
                Entrar no Painel
              </button>
            </div>
            <p class="mt-8 text-center text-slate-500 text-sm font-medium">Não possui conta? <button (click)="view.set('register')" class="text-brand-600 font-bold hover:underline">Cadastre-se agora</button></p>
          </div>
        </div>
      </div>

      <!-- Register Screen -->
      <div *ngSwitchCase="'register'" class="min-h-screen flex items-center justify-center p-6 animate-fade-in bg-slate-50">
        <div class="w-full max-w-md">
          <div class="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-white">
            <h2 class="text-3xl font-black text-slate-900 mb-2">Criar Conta</h2>
            <p class="text-slate-500 mb-8 font-medium">Inicie sua jornada estratégica.</p>

            <div *ngIf="authError()" class="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 animate-shake">
              <lucide-icon [name]="AlertCircle" class="h-5 w-5 shrink-0"></lucide-icon>
              <span class="text-sm font-bold">{{ authError() }}</span>
            </div>

            <div *ngIf="registrationSuccess()" class="mb-6 p-6 bg-green-50 border border-green-200 rounded-2xl flex flex-col items-center gap-3 text-green-700 animate-slide-up">
              <lucide-icon [name]="CheckCircle" class="h-10 w-10 text-green-500"></lucide-icon>
              <span class="text-lg font-black">Conta criada com sucesso!</span>
              <p class="text-sm font-medium text-center">Redirecionando para o perfil...</p>
            </div>

            <div *ngIf="!registrationSuccess()" class="space-y-4">
              <input type="text" [(ngModel)]="authForm.name" placeholder="Nome Completo" class="w-full p-4 bg-white border border-slate-200 rounded-2xl font-medium outline-none focus:ring-2 focus:ring-brand-500">
              <input type="email" [(ngModel)]="authForm.email" placeholder="E-mail Profissional" class="w-full p-4 bg-white border border-slate-200 rounded-2xl font-medium outline-none focus:ring-2 focus:ring-brand-500">
              <input type="password" [(ngModel)]="authForm.password" placeholder="Senha Forte" class="w-full p-4 bg-white border border-slate-200 rounded-2xl font-medium outline-none focus:ring-2 focus:ring-brand-500">
              <input type="password" [(ngModel)]="authForm.confirmPassword" placeholder="Confirmar Senha" class="w-full p-4 bg-white border border-slate-200 rounded-2xl font-medium outline-none focus:ring-2 focus:ring-brand-500">
              <button (click)="handleRegister()" [disabled]="isAuthenticating()" class="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2 mt-4">
                <lucide-icon *ngIf="isAuthenticating()" [name]="Loader2" class="h-5 w-5 animate-spin"></lucide-icon>
                Finalizar Cadastro
              </button>
            </div>
            <p *ngIf="!registrationSuccess()" class="mt-8 text-center text-slate-500 text-sm font-medium">Já tem conta? <button (click)="view.set('login')" class="text-brand-600 font-bold hover:underline">Fazer Login</button></p>
          </div>
        </div>
      </div>

      <!-- Onboarding -->
      <div *ngSwitchCase="'onboarding'" class="bg-slate-100 min-h-screen flex items-center justify-center p-6 animate-fade-in">
        <div class="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white flex flex-col md:flex-row">
          <div class="bg-slate-900 md:w-80 p-10 text-white flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-12">
                <div class="bg-brand-600 p-1.5 rounded-lg"><lucide-icon [name]="BarChart2" class="h-5 w-5"></lucide-icon></div>
                <span class="font-black">TaxStrategist</span>
              </div>
              <div class="space-y-8">
                <div class="flex gap-4 items-center" [class.opacity-40]="onboardingStep() !== 1"><div class="w-8 h-8 rounded-full border-2 border-brand-500 flex items-center justify-center text-xs font-black">1</div><span class="text-sm font-bold">Identificação</span></div>
                <div class="flex gap-4 items-center" [class.opacity-40]="onboardingStep() !== 2"><div class="w-8 h-8 rounded-full border-2 border-brand-500 flex items-center justify-center text-xs font-black">2</div><span class="text-sm font-bold">Perfil Fiscal</span></div>
                <div class="flex gap-4 items-center" [class.opacity-40]="onboardingStep() !== 3"><div class="w-8 h-8 rounded-full border-2 border-brand-500 flex items-center justify-center text-xs font-black">3</div><span class="text-sm font-bold">Finanças</span></div>
              </div>
            </div>
          </div>
          <div class="flex-1 p-12">
            <div *ngIf="onboardingStep() === 1" class="space-y-8 animate-fade-in">
              <h3 class="text-3xl font-black text-slate-900 mb-2">Qual o CNPJ da empresa?</h3>
              <div class="relative">
                <input type="text" [(ngModel)]="companyForm.cnpj" placeholder="00.000.000/0000-00" class="w-full pl-6 pr-32 py-6 bg-white border border-slate-200 rounded-[1.5rem] text-2xl font-black outline-none">
                <button (click)="searchCNPJ()" class="absolute right-3 top-3 bottom-3 bg-slate-900 text-white px-6 rounded-2xl font-bold">Consultar</button>
              </div>
              <div *ngIf="companyForm.name" class="p-8 bg-brand-50 rounded-[2rem] border border-brand-100 animate-slide-up">
                <h4 class="text-xl font-black text-slate-900">{{ companyForm.name }}</h4>
                <button (click)="nextStep()" class="mt-8 w-full py-5 bg-slate-900 text-white rounded-2xl font-black">Confirmar e Continuar</button>
              </div>
            </div>
            <div *ngIf="onboardingStep() === 2" class="space-y-8 animate-fade-in">
              <h3 class="text-3xl font-black text-slate-900">Perfil Inteligente Detectado</h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="p-5 bg-slate-50 rounded-2xl border text-center">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Anexo Sugerido</span>
                  <span class="font-black text-slate-900">{{ companyForm.simplesAnexo }}</span>
                </div>
                <div class="p-5 bg-slate-50 rounded-2xl border text-center">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Fator R</span>
                  <span class="font-black" [class.text-brand-600]="companyForm.simplesFatorR">{{ companyForm.simplesFatorR ? 'Sim' : 'Não' }}</span>
                </div>
              </div>
              <button (click)="nextStep()" class="w-full py-5 bg-brand-600 text-white rounded-2xl font-black">Confirmar Perfil</button>
            </div>
            <div *ngIf="onboardingStep() === 3" class="space-y-8 animate-fade-in">
              <h3 class="text-3xl font-black text-slate-900">Projeção Financeira</h3>
              <div class="space-y-4">
                <input type="number" [(ngModel)]="companyForm.annualRevenue" placeholder="Faturamento Anual" class="w-full p-5 border rounded-2xl font-black bg-white">
                <input type="number" [(ngModel)]="companyForm.payrollCosts" placeholder="Custo de Folha Anual" class="w-full p-5 border rounded-2xl font-black bg-white">
              </div>
              <button (click)="finishOnboarding()" class="w-full py-6 bg-brand-600 text-white rounded-2xl font-black text-xl shadow-2xl">GERAR ANÁLISE</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard -->
      <div *ngSwitchCase="'dashboard'" class="bg-slate-50 min-h-screen">
        <nav class="bg-white border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
          <div class="flex items-center gap-2 cursor-pointer" (click)="activeTab.set('overview'); selectedSimulation.set(null)">
            <div class="bg-brand-600 p-1.5 rounded-lg shadow-sm"><lucide-icon [name]="BarChart2" class="h-4 w-4 text-white"></lucide-icon></div>
            <span class="font-black text-slate-900 tracking-tight">TaxStrategist <span class="text-brand-600">Pro</span></span>
          </div>
          <div class="flex gap-1 bg-slate-100 p-1 rounded-2xl">
            <button (click)="activeTab.set('overview'); selectedSimulation.set(null)" [class.bg-white]="activeTab() === 'overview'" class="text-xs font-bold px-5 py-2.5 rounded-xl transition-all">Empresas</button>
            <button (click)="activeTab.set('ai')" [class.bg-white]="activeTab() === 'ai'" class="text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2">
              <lucide-icon [name]="Sparkles" class="h-3 w-3 text-brand-600"></lucide-icon> IA Legislativa
            </button>
            <button (click)="activeTab.set('profile')" [class.bg-white]="activeTab() === 'profile'" class="text-xs font-bold px-5 py-2.5 rounded-xl transition-all">Perfil</button>
          </div>
          <div class="flex items-center gap-4">
             <div class="hidden md:block text-right">
                <p class="text-[10px] font-black text-slate-400 leading-none mb-1 uppercase tracking-tighter">Conta Ativa</p>
                <p class="text-sm font-black text-slate-900 leading-none">{{ currentUser()?.name }}</p>
             </div>
             <button (click)="handleLogout()" class="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-red-500 transition-all"><lucide-icon [name]="LogOut" class="h-5 w-5"></lucide-icon></button>
          </div>
        </nav>

        <main class="max-w-7xl mx-auto p-8 lg:p-12">
          
          <!-- Visão Detalhada de uma Simulação -->
          <div *ngIf="selectedSimulation()" class="animate-fade-in space-y-8">
            <div class="flex items-center justify-between mb-8">
               <button (click)="selectedSimulation.set(null)" class="flex items-center gap-2 text-slate-500 font-bold hover:text-brand-600 transition-all">
                 <lucide-icon [name]="ChevronLeft" class="h-5 w-5"></lucide-icon> Voltar ao Painel
               </button>
               <div class="flex gap-3">
                  <button (click)="exportPDF(selectedSimulation()!)" class="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-slate-50 shadow-sm transition-all">
                    <lucide-icon [name]="FileDown" class="h-5 w-5 text-brand-600"></lucide-icon> Exportar PDF
                  </button>
                  <button (click)="askAiAboutCompany(selectedSimulation()!)" class="bg-brand-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-brand-700 shadow-lg shadow-brand-500/20 transition-all">
                    <lucide-icon [name]="Sparkles" class="h-5 w-5"></lucide-icon> Consultar IA
                  </button>
               </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <!-- Card de Info da Empresa -->
               <div class="lg:col-span-1 space-y-6">
                  <div class="bg-white p-8 rounded-[2.5rem] border shadow-sm">
                     <div class="bg-brand-50 w-16 h-16 rounded-2xl flex items-center justify-center text-brand-600 mb-6">
                        <lucide-icon [name]="Building2" class="h-8 w-8"></lucide-icon>
                     </div>
                     <h2 class="text-2xl font-black text-slate-900 mb-2">{{ selectedSimulation()?.name }}</h2>
                     <p class="text-sm font-bold text-slate-400 tracking-widest uppercase mb-6">{{ selectedSimulation()?.cnpj }}</p>
                     
                     <div class="space-y-4">
                        <div class="p-4 bg-slate-50 rounded-2xl border flex justify-between items-center">
                           <span class="text-xs font-bold text-slate-500">Regime Atual</span>
                           <span class="text-xs font-black text-slate-900">{{ selectedSimulation()?.currentRegime }}</span>
                        </div>
                        <div class="p-4 bg-slate-50 rounded-2xl border flex justify-between items-center">
                           <span class="text-xs font-bold text-slate-500">Faturamento Anual</span>
                           <span class="text-xs font-black text-slate-900">{{ selectedSimulation()?.annualRevenue | currency:'BRL':'symbol':'1.0-0':'pt-BR' }}</span>
                        </div>
                        <div class="p-4 bg-slate-50 rounded-2xl border flex justify-between items-center">
                           <span class="text-xs font-bold text-slate-500">Folha Anual</span>
                           <span class="text-xs font-black text-slate-900">{{ selectedSimulation()?.payrollCosts | currency:'BRL':'symbol':'1.0-0':'pt-BR' }}</span>
                        </div>
                     </div>
                  </div>

                  <div class="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative">
                     <div class="absolute -right-4 -bottom-4 opacity-10"><lucide-icon [name]="Zap" class="h-32 w-32"></lucide-icon></div>
                     <h3 class="text-xl font-black mb-4 flex items-center gap-2">
                        <lucide-icon [name]="Target" class="h-5 w-5 text-brand-500"></lucide-icon> Resumo Estratégico
                     </h3>
                     <p class="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                        {{ getDetailedSimulationResult(selectedSimulation()!)?.recommendation }}
                     </p>
                     <div class="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <span class="text-[10px] font-black text-brand-400 uppercase tracking-widest block mb-1">Economia Estimada</span>
                        <span class="text-2xl font-black text-white">{{ getDetailedSimulationResult(selectedSimulation()!)?.savingsMonthly | currency:'BRL':'symbol':'1.2-2':'pt-BR' }} /mês</span>
                     </div>
                  </div>
               </div>

               <!-- Comparativo de Scenários -->
               <div class="lg:col-span-2 space-y-8">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div class="bg-white p-8 rounded-[2.5rem] border shadow-sm border-slate-200">
                        <div class="flex justify-between items-center mb-8">
                           <h4 class="text-lg font-black text-slate-900">Legislação Atual</h4>
                           <span class="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-black uppercase text-slate-500">Vigente</span>
                        </div>
                        <div class="space-y-6">
                           <div *ngFor="let rank of getDetailedSimulationResult(selectedSimulation()!)?.currentScenario?.ranking" 
                                [class.border-brand-500]="rank.regime === getDetailedSimulationResult(selectedSimulation()!)?.currentScenario?.bestRegime"
                                class="p-5 rounded-2xl border transition-all">
                              <div class="flex justify-between items-center mb-2">
                                 <span class="text-sm font-black">{{ rank.regime }}</span>
                                 <span class="text-xs font-bold px-2 py-0.5 rounded bg-slate-50">{{ rank.effectiveRate | number:'1.2-2' }}%</span>
                              </div>
                              <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                 <div class="bg-brand-500 h-full transition-all duration-1000" [style.width.%]="rank.effectiveRate * 2.5"></div>
                              </div>
                              <p class="text-[10px] font-bold text-slate-400 mt-2">{{ rank.taxAmountMonthly | currency:'BRL':'symbol':'1.2-2':'pt-BR' }} /mês</p>
                           </div>
                        </div>
                     </div>

                     <div class="bg-white p-8 rounded-[2.5rem] border shadow-sm border-brand-100 ring-1 ring-brand-50">
                        <div class="flex justify-between items-center mb-8">
                           <h4 class="text-lg font-black text-slate-900">Reforma 2026</h4>
                           <span class="bg-brand-100 px-3 py-1 rounded-lg text-[10px] font-black uppercase text-brand-600">IVA Dual</span>
                        </div>
                        <div class="space-y-6">
                           <div *ngFor="let rank of getDetailedSimulationResult(selectedSimulation()!)?.reformScenario?.ranking"
                                [class.border-brand-500]="rank.regime === getDetailedSimulationResult(selectedSimulation()!)?.reformScenario?.bestRegime"
                                class="p-5 rounded-2xl border transition-all">
                              <div class="flex justify-between items-center mb-2">
                                 <span class="text-sm font-black">{{ rank.regime }}</span>
                                 <span class="text-xs font-bold px-2 py-0.5 rounded bg-slate-50">{{ rank.effectiveRate | number:'1.2-2' }}%</span>
                              </div>
                              <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                 <div class="bg-brand-500 h-full transition-all duration-1000" [style.width.%]="rank.effectiveRate * 2.5"></div>
                              </div>
                              <p class="text-[10px] font-bold text-slate-400 mt-2">{{ rank.taxAmountMonthly | currency:'BRL':'symbol':'1.2-2':'pt-BR' }} /mês</p>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div class="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                     <h4 class="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                        <lucide-icon [name]="Info" class="h-5 w-5 text-brand-500"></lucide-icon> Detalhes Técnicos (Memória de Cálculo)
                     </h4>
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-4">
                           <h5 class="text-xs font-black text-slate-400 uppercase tracking-widest">Base de Dados</h5>
                           <ul class="space-y-3">
                              <li class="flex items-center gap-3 text-sm font-medium text-slate-600">
                                 <lucide-icon [name]="CheckCircle" class="h-4 w-4 text-green-500"></lucide-icon> CNAE Ativo: {{ selectedSimulation()?.selectedCnae?.code }}
                              </li>
                              <li class="flex items-center gap-3 text-sm font-medium text-slate-600">
                                 <lucide-icon [name]="CheckCircle" class="h-4 w-4 text-green-500"></lucide-icon> Fator R Detectado: {{ selectedSimulation()?.simplesFatorR ? 'Sim' : 'Não' }}
                              </li>
                           </ul>
                        </div>
                        <div class="space-y-4">
                           <h5 class="text-xs font-black text-slate-400 uppercase tracking-widest">Projeção 2026</h5>
                           <p class="text-sm text-slate-500 font-medium leading-relaxed">
                              O cálculo do IVA considera o crédito financeiro pleno sobre aquisições, simulando alíquota base de 26,5% (CBS + IBS).
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <!-- Conteúdo Principal do Dashboard -->
          <div *ngIf="activeTab() === 'overview' && !selectedSimulation()" class="animate-fade-in space-y-12">
             
             <!-- Sumário no Topo -->
             <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="bg-white p-6 rounded-[2rem] border shadow-sm group hover:border-brand-500 transition-all">
                   <div class="flex items-center gap-4">
                      <div class="bg-brand-50 p-3 rounded-xl text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all"><lucide-icon [name]="Building2" class="h-6 w-6"></lucide-icon></div>
                      <div>
                        <span class="text-[10px] font-black text-slate-400 uppercase block">Empresas</span>
                        <span class="text-xl font-black text-slate-900">{{ simulations().length }}</span>
                      </div>
                   </div>
                </div>
                <div class="bg-white p-6 rounded-[2rem] border shadow-sm group hover:border-brand-500 transition-all">
                   <div class="flex items-center gap-4">
                      <div class="bg-green-50 p-3 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all"><lucide-icon [name]="TrendingUp" class="h-6 w-6"></lucide-icon></div>
                      <div>
                        <span class="text-[10px] font-black text-slate-400 uppercase block">Economia Total</span>
                        <span class="text-xl font-black text-slate-900">{{ totalIdentifiedSavings() | currency:'BRL':'symbol':'1.0-0':'pt-BR' }}</span>
                      </div>
                   </div>
                </div>
                <div class="bg-white p-6 rounded-[2rem] border shadow-sm group hover:border-brand-500 transition-all">
                   <div class="flex items-center gap-4">
                      <div class="bg-orange-50 p-3 rounded-xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all"><lucide-icon [name]="ShieldAlert" class="h-6 w-6"></lucide-icon></div>
                      <div>
                        <span class="text-[10px] font-black text-slate-400 uppercase block">Risco Fiscal</span>
                        <span class="text-xl font-black text-slate-900">Baixo</span>
                      </div>
                   </div>
                </div>
                <div class="bg-white p-6 rounded-[2rem] border shadow-sm group hover:border-brand-500 transition-all">
                   <div class="flex items-center gap-4">
                      <div class="bg-slate-50 p-3 rounded-xl text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all"><lucide-icon [name]="History" class="h-6 w-6"></lucide-icon></div>
                      <div>
                        <span class="text-[10px] font-black text-slate-400 uppercase block">Simulações</span>
                        <span class="text-xl font-black text-slate-900">{{ simulations().length * 3 }}</span>
                      </div>
                   </div>
                </div>
             </div>

             <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                   <h1 class="text-4xl font-black text-slate-900 mb-2">Minhas Estratégias</h1>
                   <p class="text-slate-500 font-medium">Análises persistentes salvas na nuvem.</p>
                </div>
                <button (click)="startNewSimulation()" class="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:scale-105 transition-all">
                  <lucide-icon [name]="PlusCircle" class="h-6 w-6"></lucide-icon> Nova Empresa
                </button>
             </div>

             <div *ngIf="simulations().length > 0; else emptySims" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div *ngFor="let sim of simulations(); let i = index" class="bg-white p-8 rounded-[2.5rem] border shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col justify-between h-full">
                   <div class="absolute top-0 right-0 p-8 opacity-5"><lucide-icon [name]="Building2" class="h-24 w-24"></lucide-icon></div>
                   <div>
                     <div class="flex items-center justify-between mb-4">
                        <div class="bg-slate-50 p-2 rounded-lg text-slate-400"><lucide-icon [name]="Building2" class="h-5 w-5"></lucide-icon></div>
                        <span class="text-[10px] font-black px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">Simulado</span>
                     </div>
                     <h4 class="font-black text-slate-900 text-xl mb-1 truncate">{{ sim.name }}</h4>
                     <p class="text-xs text-slate-400 font-bold mb-6 tracking-widest">{{ sim.cnpj }}</p>
                     
                     <div class="space-y-3 mb-6">
                        <div class="p-4 bg-slate-50 rounded-2xl border flex justify-between items-center group-hover:bg-white transition-all">
                           <span class="text-[10px] font-black text-slate-400 uppercase">Imposto Mensal</span>
                           <span class="text-sm font-black text-slate-900">{{ getDetailedSimulationResult(sim)?.currentScenario?.taxAmountMonthly | currency:'BRL':'symbol':'1.0-0':'pt-BR' }}</span>
                        </div>
                        <div class="p-4 bg-brand-50/50 rounded-2xl border border-brand-100 flex justify-between items-center">
                           <span class="text-[10px] font-black text-brand-600 uppercase">Efetiva 2026</span>
                           <span class="text-sm font-black text-brand-900">{{ getDetailedSimulationResult(sim)?.reformScenario?.effectiveRate | number:'1.2-2' }}%</span>
                        </div>
                     </div>
                   </div>
                   
                   <div class="pt-6 border-t flex justify-between items-center mt-4">
                      <button (click)="removeSimulation(i)" class="text-slate-300 hover:text-red-500 p-2 transition-colors"><lucide-icon [name]="Trash2" class="h-5 w-5"></lucide-icon></button>
                      <button (click)="selectedSimulation.set(sim)" class="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-600 transition-all flex items-center gap-2">
                        Ver Detalhes <lucide-icon [name]="ChevronRight" class="h-4 w-4"></lucide-icon>
                      </button>
                   </div>
                </div>
             </div>
             
             <ng-template #emptySims>
                <div class="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-300 max-w-2xl mx-auto">
                  <div class="bg-slate-50 w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-slate-300"><lucide-icon [name]="Building2" class="h-10 w-10"></lucide-icon></div>
                  <h2 class="text-2xl font-black mb-2">Inicie sua Estratégia</h2>
                  <p class="text-slate-400 font-medium mb-8">Adicione sua primeira empresa para visualizar o impacto da Reforma Tributária.</p>
                  <button (click)="startNewSimulation()" class="bg-brand-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-brand-500/20 hover:scale-105 transition-all">Cadastrar Empresa</button>
                </div>
             </ng-template>
          </div>

          <!-- Conteúdo da aba IA Legislativa (Simplificado) -->
          <div *ngIf="activeTab() === 'ai'" class="animate-fade-in max-w-4xl mx-auto space-y-8">
             <!-- ... [O chat de IA permanece similar, mas integrado com o contexto da empresa selecionada se houver] ... -->
             <div class="bg-slate-900 p-10 rounded-[3rem] text-white flex justify-between items-center relative overflow-hidden shadow-2xl">
                <div class="absolute top-0 right-0 p-12 opacity-10"><lucide-icon [name]="Sparkles" class="h-40 w-40"></lucide-icon></div>
                <div class="relative z-10">
                   <h2 class="text-4xl font-black mb-4">Consultoria Fiscal IA</h2>
                   <p class="text-slate-400 font-medium text-lg max-w-xl">Tire dúvidas complexas sobre o PLP 68/2024.</p>
                </div>
             </div>
             <div class="bg-white p-10 rounded-[3rem] shadow-sm border h-[550px] flex flex-col">
                <div class="flex-1 overflow-y-auto space-y-6 mb-6 pr-2 custom-scrollbar">
                   <div *ngFor="let msg of chatHistory()" [class.flex-row-reverse]="msg.role === 'user'" class="flex gap-4">
                      <div [class.bg-brand-600]="msg.role === 'user'" [class.bg-slate-100]="msg.role === 'ai'" class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0">
                         <lucide-icon [name]="msg.role === 'user' ? User : Sparkles" class="h-5 w-5" [class.text-white]="msg.role === 'user'" [class.text-brand-600]="msg.role === 'ai'"></lucide-icon>
                      </div>
                      <div [class.bg-brand-50]="msg.role === 'user'" [class.bg-slate-50]="msg.role === 'ai'" class="p-5 rounded-[1.5rem] max-w-[85%] border border-slate-100">
                        <p class="text-sm font-medium leading-relaxed" [innerHTML]="msg.content"></p>
                      </div>
                   </div>
                   <div *ngIf="isTypingAi()" class="flex gap-4 animate-pulse">
                      <div class="bg-slate-100 w-10 h-10 rounded-2xl flex items-center justify-center"><lucide-icon [name]="Loader2" class="h-5 w-5 animate-spin text-slate-400"></lucide-icon></div>
                      <div class="bg-slate-50 p-6 rounded-[1.5rem] w-32 h-12"></div>
                   </div>
                </div>
                <div class="relative group">
                   <input type="text" [(ngModel)]="aiPrompt" (keyup.enter)="askAi()" placeholder="Pergunte sobre a Reforma ou Enquadramento..." class="w-full pl-6 pr-20 py-6 bg-white border border-slate-200 rounded-[1.5rem] font-bold outline-none focus:ring-4 focus:ring-brand-500/10 transition-all group-hover:border-brand-200">
                   <button (click)="askAi()" [disabled]="!aiPrompt || isTypingAi()" class="absolute right-3 top-3 bottom-3 bg-brand-600 text-white px-6 rounded-2xl font-black hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20">
                     <lucide-icon [name]="ArrowRight" class="h-5 w-5"></lucide-icon>
                   </button>
                </div>
             </div>
          </div>

          <!-- Aba Perfil -->
          <div *ngIf="activeTab() === 'profile'" class="animate-fade-in max-w-2xl mx-auto">
             <div class="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-sm text-center">
                <div class="bg-slate-100 w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-xl">
                   <span class="text-4xl font-black text-slate-400">{{ currentUser()?.name?.charAt(0) }}</span>
                </div>
                <h2 class="text-3xl font-black text-slate-900 mb-2">{{ currentUser()?.name }}</h2>
                <p class="text-slate-400 font-bold tracking-widest uppercase text-xs mb-10">{{ currentUser()?.email }}</p>
                <button (click)="handleLogout()" class="w-full p-5 bg-red-50 text-red-500 rounded-2xl font-black hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                   <lucide-icon [name]="LogOut" class="h-5 w-5"></lucide-icon> Encerrar Sessão
                </button>
             </div>
          </div>
        </main>
      </div>

    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-slide-up { animation: slideUp 0.4s ease-out; }
    .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
  `]
})
export class App implements OnInit {
  view = signal<ViewState>('landing');
  activeTab = signal<'overview' | 'ai' | 'profile'>('overview');
  selectedSimulation = signal<CompanyData | null>(null);
  registrationSuccess = signal(false);
  
  // Auth State
  authForm = { name: '', email: '', password: '', confirmPassword: '' };
  isAuthenticating = signal(false);
  authError = signal<string | null>(null);
  currentUser = signal<any | null>(null);
  private authService = new AuthService();

  // AI State
  aiPrompt = '';
  isTypingAi = signal(false);
  chatHistory = signal<{role: 'user' | 'ai', content: string, sources?: any[]}[]>([]);

  // Onboarding State
  onboardingStep = signal(1);
  isSearchingCNPJ = signal(false);
  simulations = signal<CompanyData[]>([]);
  
  totalIdentifiedSavings = computed(() => {
    return this.simulations().reduce((acc, sim) => {
      const res = runSimulation(sim);
      return acc + (res.savingsMonthly * 12);
    }, 0);
  });

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
    annualRevenue: 0,
    payrollCosts: 0
  };

  // Icons
  BarChart2 = BarChart2; ArrowRight = ArrowRight; Building2 = Building2; 
  Search = Search; LogOut = LogOut; Database = Database; 
  PlusCircle = PlusCircle; ChevronRight = ChevronRight; Download = Download;
  CheckCircle = CheckCircle; ShieldAlert = ShieldAlert; MessageSquare = MessageSquare;
  BookOpen = BookOpen; ExternalLink = ExternalLink; XCircle = XCircle;
  Loader2 = Loader2; Sparkles = Sparkles; Mail = Mail; Lock = Lock;
  User = User; ShieldCheck = ShieldCheck; Wallet = Wallet; Coins = Coins; 
  PieChart = PieChart; ArrowLeft = ArrowLeft; ClipboardList = ClipboardList; 
  Target = Target; Info = Info; AlertCircle = AlertCircle; 
  Trash2 = Trash2; Zap = Zap; Scale = Scale; Globe = Globe; 
  Clock = Clock; Layers = Layers; TrendingUp = TrendingUp; History = History;
  FileDown = FileDown; ChevronLeft = ChevronLeft;

  ngOnInit() {
    this.checkAuth();
  }

  private checkAuth() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser.set(user);
      const saved = localStorage.getItem(`tax_sims_${user.email}`);
      if (saved) {
        this.simulations.set(JSON.parse(saved));
      }
      this.view.set('dashboard');
    } else {
      this.view.set('landing');
    }
  }

  async handleLogin() {
    this.authError.set(null);
    this.isAuthenticating.set(true);
    try {
      await new Promise(r => setTimeout(r, 600)); // Pequeno delay UX
      const result = this.authService.login(this.authForm.email, this.authForm.password);
      if (result.success) {
        this.currentUser.set(result.user);
        this.checkAuth();
      } else {
        this.authError.set(result.message);
      }
    } finally {
      this.isAuthenticating.set(false);
    }
  }

  async handleRegister() {
    this.authError.set(null);
    this.isAuthenticating.set(true);
    try {
      await new Promise(r => setTimeout(r, 800)); // Simula processamento
      const result = this.authService.register({
        name: this.authForm.name,
        email: this.authForm.email,
        password: this.authForm.password,
        confirmPassword: this.authForm.confirmPassword,
        createdAt: ''
      });

      if (result.success) {
        this.registrationSuccess.set(true);
        
        // Efetua login automático
        const loginRes = this.authService.login(this.authForm.email, this.authForm.password!);
        if (loginRes.success) {
          this.currentUser.set(loginRes.user);
          
          // Aguarda para o usuário ver a mensagem de sucesso
          await new Promise(r => setTimeout(r, 1500));
          
          // Limpa formulário
          this.authForm = { name: '', email: '', password: '', confirmPassword: '' };
          
          // Redireciona
          this.view.set('onboarding');
        }
      } else {
        this.authError.set(result.message);
      }
    } catch (err) {
      console.error('Erro crítico no registro', err);
      this.authError.set('Ocorreu um erro inesperado ao gravar seu cadastro.');
    } finally {
      this.isAuthenticating.set(false);
    }
  }

  handleLogout() { 
    this.authService.logout();
    this.currentUser.set(null);
    this.registrationSuccess.set(false);
    this.view.set('landing'); 
  }

  getDetailedSimulationResult(sim: CompanyData): SimulationResult {
    return runSimulation(sim);
  }

  exportPDF(sim: CompanyData) {
    const result = runSimulation(sim);
    generatePDF(sim, result);
  }

  askAiAboutCompany(sim: CompanyData) {
    const result = runSimulation(sim);
    this.activeTab.set('ai');
    this.aiPrompt = `Analise a empresa ${sim.name}. Cenário atual: ${result.currentScenario.bestRegime} (${result.currentScenario.effectiveRate.toFixed(2)}%). Cenário Reforma: ${result.reformScenario.bestRegime} (${result.reformScenario.effectiveRate.toFixed(2)}%). Qual sua opinião estratégica?`;
    this.askAi();
  }

  async askAi() {
    if (!this.aiPrompt || this.isTypingAi()) return;
    const userMsg = this.aiPrompt;
    this.chatHistory.update(h => [...h, { role: 'user', content: userMsg }]);
    const currentPrompt = this.aiPrompt;
    this.aiPrompt = '';
    this.isTypingAi.set(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: currentPrompt,
        config: {
          systemInstruction: "Você é um consultor fiscal de elite focado em empresas brasileiras e Reforma Tributária (IVA).",
          tools: [{ googleSearch: {} }]
        }
      });
      this.chatHistory.update(h => [...h, { role: 'ai', content: response.text || "" }]);
    } catch (err) {
      this.chatHistory.update(h => [...h, { role: 'ai', content: "Erro na conexão com IA." }]);
    } finally {
      this.isTypingAi.set(false);
    }
  }

  async searchCNPJ() {
    if (!this.companyForm.cnpj) return;
    this.isSearchingCNPJ.set(true);
    try {
      const data = await lookupCNPJ(this.companyForm.cnpj);
      this.companyForm.name = data.name;
      this.companyForm.selectedCnae = data.primaryCnae;
      this.companyForm.municipality = data.municipality;
      this.companyForm.state = data.state;
      const suggestions = getSimplesAnexoForCNAE(data.primaryCnae.code);
      this.companyForm.simplesAnexo = suggestions.anexo;
      this.companyForm.simplesFatorR = suggestions.subjectToFactorR;
    } finally {
      this.isSearchingCNPJ.set(false);
    }
  }

  nextStep() { this.onboardingStep.update(s => s + 1); }

  finishOnboarding() {
    const user = this.currentUser();
    if (!user) return;

    const simulation: CompanyData = { 
      ...this.companyForm, 
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      suppliers: [] 
    } as any;
    
    this.simulations.update(s => {
      const newList = [...s, simulation];
      localStorage.setItem(`tax_sims_${user.email}`, JSON.stringify(newList));
      return newList;
    });
    this.view.set('dashboard');
    this.activeTab.set('overview');
  }

  removeSimulation(index: number) {
    const user = this.currentUser();
    if (!user) return;

    this.simulations.update(s => {
      const newList = s.filter((_, i) => i !== index);
      localStorage.setItem(`tax_sims_${user.email}`, JSON.stringify(newList));
      return newList;
    });
  }

  startNewSimulation() {
    this.onboardingStep.set(1);
    this.companyForm = { ...this.companyForm, cnpj: '', name: '', annualRevenue: 0, payrollCosts: 0 };
    this.view.set('onboarding');
  }
}

bootstrapApplication(App).catch(err => console.error(err));
