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
  MailCheck
} from 'lucide-angular';

import { CompanyData, CompanyType, TaxRegime, ViewState, SimulationResult } from './components/types';

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

          <!-- Persuasive SaaS Benefits Section -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            <div class="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
              <div class="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-brand-600 transition-colors">
                <lucide-icon [name]="Zap" class="text-brand-600 h-6 w-6 group-hover:text-white"></lucide-icon>
              </div>
              <h3 class="text-lg font-bold mb-3">Agilidade Estratégica</h3>
              <p class="text-slate-500 text-sm leading-relaxed">
                De startups no Simples a corporações no Lucro Real, processe gigabytes de legislação em milissegundos.
              </p>
            </div>

            <div class="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
              <div class="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-brand-600 transition-colors">
                <lucide-icon [name]="Clock" class="text-brand-600 h-6 w-6 group-hover:text-white"></lucide-icon>
              </div>
              <h3 class="text-lg font-bold mb-3">Compliance em Tempo Real</h3>
              <p class="text-slate-500 text-sm leading-relaxed">
                Nossa infraestrutura absorve cada nova instrução normativa da Receita Federal instantaneamente.
              </p>
            </div>

            <div class="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
              <div class="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-brand-600 transition-colors">
                <lucide-icon [name]="TrendingUp" class="text-brand-600 h-6 w-6 group-hover:text-white"></lucide-icon>
              </div>
              <h3 class="text-lg font-bold mb-3">Escalabilidade Inteligente</h3>
              <p class="text-slate-500 text-sm leading-relaxed">
                Pequenas empresas acessam ferramentas enterprise, grandes grupos consolidam filiais sem esforço.
              </p>
            </div>

            <div class="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
              <div class="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-brand-600 transition-colors">
                <lucide-icon [name]="ShieldCheck" class="text-brand-600 h-6 w-6 group-hover:text-white"></lucide-icon>
              </div>
              <h3 class="text-lg font-bold mb-3">Segurança Bancária</h3>
              <p class="text-slate-500 text-sm leading-relaxed">
                Dados criptografados e redundância geográfica sob os mais altos padrões internacionais de segurança.
              </p>
            </div>
          </div>

          <!-- PRICING SECTION -->
          <div class="mb-24 text-center">
            <h2 class="text-3xl md:text-5xl font-black text-slate-900 mb-4">Planos que cabem no seu negócio</h2>
            <p class="text-slate-500 mb-12">Escolha a recorrência ideal para sua empresa e economize.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <!-- Mensal -->
              <div class="bg-white border-2 border-slate-100 p-10 rounded-[2.5rem] shadow-sm flex flex-col items-center">
                <span class="text-slate-400 font-bold uppercase text-xs tracking-widest mb-6">Mensal</span>
                <div class="flex items-baseline gap-1 mb-8">
                  <span class="text-slate-400 font-bold">R$</span>
                  <span class="text-5xl font-black text-slate-900">99,90</span>
                  <span class="text-slate-400">/mês</span>
                </div>
                <p class="text-slate-500 text-sm mb-8">Ideal para consultas pontuais e pequenas simulações mensais.</p>
                <button (click)="view.set('register')" class="w-full py-4 border-2 border-slate-900 rounded-2xl font-bold hover:bg-slate-900 hover:text-white transition-all">Assinar Agora</button>
              </div>

              <!-- Semestral -->
              <div class="bg-white border-2 border-brand-200 p-10 rounded-[2.5rem] shadow-xl shadow-brand-500/10 flex flex-col items-center relative scale-105 z-10">
                <div class="absolute -top-4 bg-brand-600 text-white px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1">
                  <lucide-icon [name]="Tag" class="h-3 w-3"></lucide-icon> 30% DE DESCONTO
                </div>
                <span class="text-brand-600 font-bold uppercase text-xs tracking-widest mb-6">Semestral</span>
                <div class="flex flex-col items-center mb-8">
                  <div class="flex items-baseline gap-1">
                    <span class="text-slate-400 font-bold">R$</span>
                    <span class="text-5xl font-black text-slate-900">69,93</span>
                    <span class="text-slate-400">/mês</span>
                  </div>
                  <span class="text-xs text-brand-600 font-bold mt-1">Cobrado semestralmente (R$ 419,58)</span>
                </div>
                <p class="text-slate-500 text-sm mb-8">O equilíbrio perfeito para o seu planejamento fiscal contínuo.</p>
                <button (click)="view.set('register')" class="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all">Mais Vendido</button>
              </div>

              <!-- Anual -->
              <div class="bg-white border-2 border-slate-100 p-10 rounded-[2.5rem] shadow-sm flex flex-col items-center">
                <div class="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black mb-4 flex items-center gap-1">
                  <lucide-icon [name]="Gift" class="h-2.5 w-2.5"></lucide-icon> MELHOR VALOR
                </div>
                <span class="text-slate-400 font-bold uppercase text-xs tracking-widest mb-6">Anual</span>
                <div class="flex flex-col items-center mb-8">
                  <div class="flex items-baseline gap-1">
                    <span class="text-slate-400 font-bold">R$</span>
                    <span class="text-5xl font-black text-slate-900">59,94</span>
                    <span class="text-slate-400">/mês</span>
                  </div>
                  <span class="text-xs text-brand-600 font-bold mt-1">40% OFF - R$ 719,28 à vista</span>
                </div>
                <p class="text-slate-500 text-sm mb-8">Para empresas que levam a estratégia tributária ao nível máximo.</p>
                <button (click)="view.set('register')" class="w-full py-4 border-2 border-slate-900 rounded-2xl font-bold hover:bg-slate-900 hover:text-white transition-all">Economizar Agora</button>
              </div>
            </div>
          </div>

          <div class="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
             <div class="relative z-10">
               <h2 class="text-3xl md:text-5xl font-bold text-white mb-6">Pronto para a Reforma 2026?</h2>
               <p class="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
                 Mais que um software, o TaxStrategist é sua bússola para navegar na transição do IVA Dual. Simule hoje e economize amanhã.
               </p>
               <div class="flex flex-wrap justify-center gap-4">
                 <button (click)="view.set('register')" class="text-white font-bold hover:text-brand-400 transition-colors">Cadastre-se para uma demonstração</button>
               </div>
             </div>
             <div class="absolute top-0 right-0 w-64 h-64 bg-brand-600/10 blur-[100px]"></div>
             <div class="absolute bottom-0 left-0 w-64 h-64 bg-brand-900/50 blur-[100px]"></div>
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
             <p class="text-slate-500 mt-2">Acesse sua inteligência fiscal</p>
          </div>

          <div class="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700">E-mail</label>
                <div class="relative">
                  <lucide-icon [name]="Mail" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5"></lucide-icon>
                  <input type="email" [(ngModel)]="authForm.email" placeholder="nome@empresa.com" class="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all">
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <label class="text-sm font-bold text-slate-700">Senha</label>
                  <button class="text-xs font-bold text-brand-600 hover:text-brand-700">Esqueceu a senha?</button>
                </div>
                <div class="relative">
                  <lucide-icon [name]="Lock" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5"></lucide-icon>
                  <input [type]="showPassword ? 'text' : 'password'" [(ngModel)]="authForm.password" placeholder="••••••••" class="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all">
                  <button (click)="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <lucide-icon [name]="showPassword ? EyeOff : Eye" class="h-5 w-5"></lucide-icon>
                  </button>
                </div>
              </div>

              <button (click)="handleLogin()" [disabled]="isAuthenticating()" class="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/30 hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center transition-all">
                <lucide-icon *ngIf="isAuthenticating()" [name]="Loader2" class="animate-spin mr-2 h-5 w-5"></lucide-icon>
                <span>{{ isAuthenticating() ? 'Acessando...' : 'Entrar' }}</span>
              </button>

              <div class="relative py-4">
                <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-100"></div></div>
                <div class="relative flex justify-center text-xs uppercase"><span class="bg-white px-2 text-slate-400 font-bold">Ou continue com</span></div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <button class="flex items-center justify-center gap-2 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm transition-all">
                  <img src="https://www.google.com/favicon.ico" class="h-4 w-4"> Google
                </button>
                <button class="flex items-center justify-center gap-2 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm transition-all">
                  <img src="https://www.microsoft.com/favicon.ico" class="h-4 w-4"> Microsoft
                </button>
              </div>
            </div>
          </div>
          <p class="text-center mt-8 text-slate-500 text-sm">
            Não tem uma conta? <button (click)="view.set('register')" class="text-brand-600 font-bold hover:underline">Cadastre-se grátis</button>
          </p>
        </div>
      </div>

      <!-- Register Screen -->
      <div *ngSwitchCase="'register'" class="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-fade-in">
        <div class="w-full max-w-md">
          <div class="text-center mb-8">
             <div (click)="view.set('landing')" class="inline-flex items-center gap-2 cursor-pointer mb-6">
                <div class="bg-brand-600 p-1 rounded-lg"><lucide-icon [name]="BarChart2" class="h-5 w-5 text-white"></lucide-icon></div>
                <span class="text-xl font-black text-slate-900">TaxStrategist</span>
             </div>
             <h2 class="text-3xl font-bold text-slate-900">Crie sua conta</h2>
             <p class="text-slate-500 mt-2">Inicie sua jornada rumo à eficiência fiscal</p>
          </div>

          <div class="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700">Nome Completo</label>
                <div class="relative">
                  <lucide-icon [name]="User" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5"></lucide-icon>
                  <input type="text" [(ngModel)]="authForm.name" placeholder="Ex: João Silva" class="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all">
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700">E-mail Corporativo</label>
                <div class="relative">
                  <lucide-icon [name]="Mail" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5"></lucide-icon>
                  <input type="email" [(ngModel)]="authForm.email" placeholder="nome@empresa.com" class="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all">
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700">Senha</label>
                <div class="relative">
                  <lucide-icon [name]="Lock" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5"></lucide-icon>
                  <input type="password" [(ngModel)]="authForm.password" placeholder="Mínimo 8 caracteres" class="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all">
                </div>
              </div>

              <div class="flex items-start gap-3 py-2">
                <input type="checkbox" id="terms" class="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500">
                <label for="terms" class="text-xs text-slate-500 leading-relaxed">
                  Concordo com os <button class="text-brand-600 font-bold hover:underline">Termos de Serviço</button> e a <button class="text-brand-600 font-bold hover:underline">Política de Privacidade</button>.
                </label>
              </div>

              <button (click)="handleRegister()" [disabled]="isAuthenticating()" class="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/30 hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center transition-all">
                <lucide-icon *ngIf="isAuthenticating()" [name]="Loader2" class="animate-spin mr-2 h-5 w-5"></lucide-icon>
                <span>{{ isAuthenticating() ? 'Criando conta...' : 'Criar Conta' }}</span>
              </button>
            </div>
          </div>
          <p class="text-center mt-8 text-slate-500 text-sm">
            Já tem uma conta? <button (click)="view.set('login')" class="text-brand-600 font-bold hover:underline">Fazer login</button>
          </p>
        </div>
      </div>

      <!-- Onboarding -->
      <div *ngSwitchCase="'onboarding'" class="bg-slate-50 min-h-screen flex items-center justify-center p-4">
        <div class="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center border border-slate-100 animate-fade-in">
           <div class="bg-brand-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <lucide-icon [name]="Sparkles" class="text-brand-600 h-10 w-10"></lucide-icon>
           </div>
           <h2 class="text-3xl font-bold mb-4 text-slate-900">Olá, {{ authForm.name || 'Estrategista' }}!</h2>
           <p class="text-slate-500 mb-8 leading-relaxed">Vamos configurar sua primeira empresa para análise tributária automática.</p>
           <button (click)="view.set('dashboard')" class="bg-brand-600 text-white w-full py-5 rounded-2xl font-bold text-lg shadow-lg hover:bg-brand-700 transition-all flex items-center justify-center">
              Começar Configuração <lucide-icon [name]="ArrowRight" class="ml-2 h-5 w-5"></lucide-icon>
           </button>
        </div>
      </div>

      <!-- Dashboard Com IA -->
      <div *ngSwitchCase="'dashboard'" class="bg-slate-50 min-h-screen">
        <nav class="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-50">
          <div class="flex items-center gap-2 cursor-pointer" (click)="activeTab.set('overview')">
            <div class="bg-brand-600 p-1 rounded-lg shadow-sm shadow-brand-200"><lucide-icon [name]="BarChart2" class="h-4 w-4 text-white"></lucide-icon></div>
            <span class="font-bold text-slate-900">TaxStrategist <span class="text-brand-600">Pro</span></span>
          </div>
          <div class="flex gap-1 bg-slate-100 p-1 rounded-xl">
            <button (click)="activeTab.set('overview')" [class.bg-white]="activeTab() === 'overview'" [class.shadow-sm]="activeTab() === 'overview'" class="text-xs font-bold flex items-center gap-2 px-4 py-2 rounded-lg transition-all">
               <lucide-icon [name]="Database" class="h-3.5 w-3.5" [class.text-brand-600]="activeTab() === 'overview'"></lucide-icon> Simulações
            </button>
            <button (click)="activeTab.set('ai')" [class.bg-white]="activeTab() === 'ai'" [class.shadow-sm]="activeTab() === 'ai'" class="text-xs font-bold flex items-center gap-2 px-4 py-2 rounded-lg transition-all">
               <lucide-icon [name]="Scale" class="h-3.5 w-3.5" [class.text-brand-600]="activeTab() === 'ai'"></lucide-icon> Consultoria & Leis
            </button>
            <button (click)="activeTab.set('profile')" [class.bg-white]="activeTab() === 'profile'" [class.shadow-sm]="activeTab() === 'profile'" class="text-xs font-bold flex items-center gap-2 px-4 py-2 rounded-lg transition-all">
               <lucide-icon [name]="Settings" class="h-3.5 w-3.5" [class.text-brand-600]="activeTab() === 'profile'"></lucide-icon> Perfil
            </button>
          </div>
          <button (click)="handleLogout()" class="text-slate-500 font-bold text-sm flex items-center hover:text-red-500 transition-colors">
            <lucide-icon [name]="LogOut" class="h-4 w-4 mr-1"></lucide-icon> Sair
          </button>
        </nav>

        <div class="max-w-7xl mx-auto p-8">
          
          <!-- Aba de Simulações -->
          <div *ngIf="activeTab() === 'overview'" class="space-y-8 animate-fade-in">
             
             <!-- Dashboard Com Conteúdo -->
             <ng-container *ngIf="simulations().length > 0; else emptyState">
                <div class="flex justify-between items-center">
                   <div>
                     <h1 class="text-3xl font-black text-slate-900">Inteligência Fiscal</h1>
                     <p class="text-slate-500">Cenários baseados no PLP 68/2024 e legislação vigente.</p>
                   </div>
                   <button (click)="view.set('onboarding')" class="bg-brand-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-brand-700 transition-all flex items-center gap-2 shadow-lg shadow-brand-500/20">
                     <lucide-icon [name]="Plus" class="h-4 w-4"></lucide-icon> Nova Empresa
                   </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div *ngFor="let sim of simulations()" class="col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-brand-200 transition-colors cursor-pointer group">
                     <div>
                       <div class="bg-brand-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:text-white transition-all">
                         <lucide-icon [name]="Building2" class="h-5 w-5"></lucide-icon>
                       </div>
                       <h4 class="font-bold text-slate-800 leading-tight">{{ sim.name }}</h4>
                       <p class="text-xs text-slate-400 mt-1">CNAE: {{ sim.cnae }}</p>
                     </div>
                     <div class="mt-4 pt-4 border-t flex flex-col gap-2">
                       <span class="text-[10px] font-bold text-slate-400 uppercase">Status Legais</span>
                       <div class="flex items-center gap-1 text-amber-600 text-[10px] font-bold">
                         <lucide-icon [name]="ShieldAlert" class="h-3 w-3"></lucide-icon> Alerta Reforma 2026
                       </div>
                     </div>
                  </div>
                  
                  <div class="md:col-span-3 bg-brand-600 p-10 rounded-3xl text-white shadow-xl shadow-brand-500/20 relative overflow-hidden">
                     <div class="relative z-10">
                       <p class="text-xs font-bold text-brand-200 uppercase tracking-widest mb-3">Simulação Consolidada</p>
                       <h3 class="text-4xl md:text-5xl font-black">Economia de R$ 12.450 <span class="text-lg font-normal text-brand-200">/mês</span></h3>
                       <p class="mt-6 text-sm text-brand-100 max-w-lg leading-relaxed">Suas empresas estão otimizadas. Recomendamos manter o enquadramento atual para o próximo semestre.</p>
                       <button class="mt-8 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 backdrop-blur-md">
                         Ver Relatório Completo <lucide-icon [name]="ArrowRight" class="h-4 w-4"></lucide-icon>
                       </button>
                     </div>
                     <lucide-icon [name]="TrendingUp" class="absolute -right-16 -bottom-16 h-64 w-64 text-brand-500 opacity-20 rotate-12"></lucide-icon>
                  </div>
                </div>
             </ng-container>

             <!-- Empty State UI -->
             <ng-template #emptyState>
                <div class="flex flex-col items-center justify-center py-20 animate-fade-in">
                  <div class="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 max-w-2xl w-full text-center relative overflow-hidden">
                    <div class="absolute -top-24 -right-24 w-48 h-48 bg-brand-50 rounded-full blur-3xl opacity-50"></div>
                    <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-50 rounded-full blur-3xl opacity-50"></div>
                    
                    <div class="relative z-10">
                      <div class="bg-brand-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
                        <lucide-icon [name]="Building2" class="text-brand-600 h-10 w-10"></lucide-icon>
                      </div>
                      <h2 class="text-3xl font-black text-slate-900 mb-4">Sua jornada estratégica <br/><span class="text-brand-600">começa agora.</span></h2>
                      <p class="text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
                        Parece que você ainda não tem empresas cadastradas. Configure seu primeiro CNPJ para iniciar as simulações da Reforma Tributária.
                      </p>
                      
                      <div class="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <button (click)="view.set('onboarding')" class="bg-brand-600 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-brand-500/30 hover:scale-105 transition-all flex items-center gap-3">
                          <lucide-icon [name]="Plus" class="h-5 w-5"></lucide-icon> Cadastrar Empresa
                        </button>
                        <button (click)="activeTab.set('ai')" class="bg-slate-100 text-slate-700 px-8 py-5 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all flex items-center gap-3">
                          <lucide-icon [name]="Scale" class="h-5 w-5"></lucide-icon> Ver Legislação
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
             </ng-template>

          </div>

          <!-- Aba de Consultoria & Legislação -->
          <div *ngIf="activeTab() === 'ai'" class="animate-fade-in">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <!-- Painel Lateral de Legislação -->
              <div class="lg:col-span-4 space-y-6">
                <div class="bg-white p-6 rounded-[2.5rem] border shadow-sm">
                   <h3 class="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                     <lucide-icon [name]="BookOpen" class="h-5 w-5 text-brand-600"></lucide-icon> Centro Legislativo
                   </h3>
                   <p class="text-xs text-slate-500 mb-6 leading-relaxed">Clique para obter um resumo técnico e as alterações de 2026 para cada tributo.</p>
                   
                   <div class="space-y-3">
                     <button (click)="askLegislativeSummary('Simples Nacional')" class="w-full p-4 rounded-2xl border bg-slate-50 hover:bg-brand-50 hover:border-brand-200 transition-all text-left group">
                        <div class="flex justify-between items-center mb-1">
                          <span class="text-sm font-bold text-slate-800">Simples Nacional</span>
                          <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-bold uppercase group-hover:bg-brand-600 group-hover:text-white">Estável</span>
                        </div>
                        <p class="text-[10px] text-slate-400">LC 123/06 • Transição IBS/CBS Híbrido</p>
                     </button>

                     <button (click)="askLegislativeSummary('ICMS Estadual')" class="w-full p-4 rounded-2xl border bg-slate-50 hover:bg-brand-50 hover:border-brand-200 transition-all text-left group">
                        <div class="flex justify-between items-center mb-1">
                          <span class="text-sm font-bold text-slate-800">ICMS (Estadual)</span>
                          <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold uppercase group-hover:bg-brand-600 group-hover:text-white">Extinção</span>
                        </div>
                        <p class="text-[10px] text-slate-400">RICMS • Convergência para IBS em 2026</p>
                     </button>

                     <button (click)="askLegislativeSummary('ISS Municipal')" class="w-full p-4 rounded-2xl border bg-slate-50 hover:bg-brand-50 hover:border-brand-200 transition-all text-left group">
                        <div class="flex justify-between items-center mb-1">
                          <span class="text-sm font-bold text-slate-800">ISS (Municipal)</span>
                          <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold uppercase group-hover:bg-brand-600 group-hover:text-white">Extinção</span>
                        </div>
                        <p class="text-[10px] text-slate-400">LC 116/03 • Convergência para IBS</p>
                     </button>

                     <button (click)="askLegislativeSummary('IPI e Indústria')" class="w-full p-4 rounded-2xl border bg-slate-50 hover:bg-brand-50 hover:border-brand-200 transition-all text-left group">
                        <div class="flex justify-between items-center mb-1">
                          <span class="text-sm font-bold text-slate-800">IPI & Indústria</span>
                          <span class="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold uppercase group-hover:bg-brand-600 group-hover:text-white">Seletivo</span>
                        </div>
                        <p class="text-[10px] text-slate-400">RIPI • Imposto Seletivo 2026</p>
                     </button>
                   </div>
                </div>

                <div class="bg-brand-900 p-6 rounded-[2rem] text-white">
                   <div class="flex items-center gap-2 mb-3">
                     <lucide-icon [name]="History" class="h-4 w-4 text-brand-300"></lucide-icon>
                     <span class="text-xs font-bold uppercase tracking-widest text-brand-300">Última Atualização</span>
                   </div>
                   <p class="text-sm font-medium mb-1">Base: Março 2024</p>
                   <p class="text-[10px] text-brand-400 leading-relaxed">Monitorando PLP 68/2024 e novas regulamentações do CONFAZ em tempo real via Google Search.</p>
                </div>
              </div>

              <!-- Janela do Chat -->
              <div class="lg:col-span-8">
                <div class="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden flex flex-col h-[75vh]">
                  <div class="p-6 bg-slate-50 border-b flex justify-between items-center">
                    <div class="flex items-center gap-3">
                      <div class="bg-brand-600 p-2.5 rounded-xl shadow-md shadow-brand-200"><lucide-icon [name]="Sparkles" class="h-5 w-5 text-white"></lucide-icon></div>
                      <div>
                        <h2 class="font-bold text-slate-900 leading-none">Consultor de Legislação Integrada</h2>
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
                            <p class="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-tighter">Fontes Oficiais Consultadas</p>
                            <div class="flex flex-wrap gap-2">
                              <a *ngFor="let source of msg.sources" [href]="source.uri" target="_blank" class="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] text-brand-600 hover:bg-brand-50 hover:border-brand-200 transition-all">
                                <lucide-icon [name]="ExternalLink" class="h-3 w-3"></lucide-icon> {{ source.title }}
                              </a>
                            </div>
                          </div>
                       </div>
                    </div>
                    <div *ngIf="isThinking()" class="flex justify-start animate-pulse">
                      <div class="bg-slate-100 p-5 rounded-2xl rounded-tl-none flex items-center gap-3">
                        <lucide-icon [name]="Loader2" class="h-4 w-4 animate-spin text-brand-600"></lucide-icon>
                        <span class="text-sm font-medium text-slate-500">Acessando base da Receita e Diário Oficial...</span>
                      </div>
                    </div>
                  </div>

                  <div class="p-6 bg-white border-t">
                    <div class="flex gap-3">
                      <input 
                        [(ngModel)]="aiQuery" 
                        (keyup.enter)="askAI()"
                        placeholder="Ex: Qual o impacto do IBS na indústria de eletrônicos?" 
                        class="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm">
                      <button (click)="askAI()" [disabled]="isThinking() || !aiQuery.trim()" class="bg-brand-600 text-white p-4 rounded-2xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 disabled:opacity-50 transition-all">
                        <lucide-icon [name]="ArrowRight" class="h-6 w-6"></lucide-icon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Aba de Perfil -->
          <div *ngIf="activeTab() === 'profile'" class="animate-fade-in max-w-4xl mx-auto space-y-8">
             <div class="flex items-center gap-4 mb-2">
                <div class="bg-brand-100 p-4 rounded-3xl"><lucide-icon [name]="User" class="h-8 w-8 text-brand-600"></lucide-icon></div>
                <div>
                  <h1 class="text-3xl font-black text-slate-900">Meu Perfil</h1>
                  <p class="text-slate-500">Gerencie suas informações e segurança da conta.</p>
                </div>
             </div>

             <!-- Informações Gerais -->
             <div class="bg-white rounded-[2.5rem] border p-8 shadow-sm">
                <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <lucide-icon [name]="Briefcase" class="h-5 w-5 text-brand-600"></lucide-icon> Informações da Conta
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
                    <input type="text" [(ngModel)]="profileForm.name" class="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 transition-all">
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase">E-mail (Não alterável)</label>
                    <input type="email" [value]="authForm.email" disabled class="w-full p-4 bg-slate-100 border rounded-2xl text-slate-400 cursor-not-allowed">
                  </div>
                </div>
                <div class="mt-8 flex justify-end">
                   <button (click)="updateName()" class="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 transition-all">Salvar Alterações</button>
                </div>
             </div>

             <!-- Segurança -->
             <div class="bg-white rounded-[2.5rem] border p-8 shadow-sm">
                <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <lucide-icon [name]="Key" class="h-5 w-5 text-brand-600"></lucide-icon> Alterar Senha
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase">Senha Atual</label>
                    <input type="password" [(ngModel)]="profileForm.currentPass" class="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 transition-all">
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase">Nova Senha</label>
                    <input type="password" [(ngModel)]="profileForm.newPass" class="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 transition-all">
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase">Confirmar Nova Senha</label>
                    <input type="password" [(ngModel)]="profileForm.confirmPass" class="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 transition-all">
                  </div>
                </div>
                <div class="mt-8 flex justify-end">
                   <button (click)="updatePassword()" class="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">Atualizar Senha</button>
                </div>
             </div>

             <!-- Zona de Perigo -->
             <div class="bg-red-50 rounded-[2.5rem] border border-red-100 p-8 shadow-sm">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 class="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
                      <lucide-icon [name]="Trash2" class="h-5 w-5"></lucide-icon> Excluir Conta
                    </h3>
                    <p class="text-sm text-red-600/70">Esta ação é permanente. Todos os seus dados de simulações e empresas serão deletados imediatamente.</p>
                  </div>
                  <button (click)="requestDeleteAccount()" class="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200">Excluir Minha Conta</button>
                </div>
             </div>
          </div>

        </div>
      </div>

      <!-- Modal de Exclusão com Código -->
      <div *ngIf="showDeleteModal()" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
         <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeDeleteModal()"></div>
         <div class="bg-white w-full max-w-md rounded-[3rem] p-10 relative z-10 shadow-2xl animate-fade-in border border-slate-100">
            <div class="bg-red-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
               <lucide-icon [name]="MailCheck" class="text-red-600 h-10 w-10"></lucide-icon>
            </div>
            <h2 class="text-2xl font-black text-center text-slate-900 mb-4">Confirmação de Segurança</h2>
            <p class="text-center text-slate-500 mb-8 leading-relaxed">Enviamos um código de 6 dígitos para seu e-mail corporativo. Insira-o abaixo para confirmar a exclusão.</p>
            
            <div class="flex gap-2 justify-center mb-8">
               <input 
                 type="text" 
                 maxlength="6" 
                 [(ngModel)]="deleteCodeInput" 
                 placeholder="000000" 
                 class="w-full p-5 text-center text-3xl font-black tracking-[1em] bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all">
            </div>

            <div class="space-y-3">
              <button (click)="confirmDeleteAccount()" [disabled]="deleteCodeInput.length < 6" class="w-full bg-red-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-red-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                Excluir Definitivamente
              </button>
              <button (click)="closeDeleteModal()" class="w-full py-4 text-slate-500 font-bold hover:text-slate-700 transition-all">Cancelar</button>
            </div>
            <p class="text-[10px] text-center text-slate-400 mt-6 uppercase font-bold tracking-widest">Atenção: Não há volta após este passo.</p>
         </div>
      </div>

    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes bounceSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    .animate-bounce-slow { animation: bounceSlow 3s infinite ease-in-out; }
    input::placeholder { color: #94a3b8; }
  `]
})
export class App implements OnInit {
  view = signal<ViewState>('landing');
  activeTab = signal<'overview' | 'ai' | 'profile'>('overview');
  
  // Auth State
  isAuthenticating = signal(false);
  showPassword = false;
  authForm = {
    name: '',
    email: '',
    password: ''
  };

  // Profile Form State
  profileForm = {
    name: '',
    currentPass: '',
    newPass: '',
    confirmPass: ''
  };

  // Account Deletion State
  showDeleteModal = signal(false);
  deleteCodeInput = '';
  sentCode = '123456'; // Código simulado

  // AI State
  aiQuery = '';
  isThinking = signal(false);
  chatHistory = signal<{role: 'user' | 'model', text: string, sources?: any[]}[]>([]);

  // Simulation State
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
  Shield = Shield; MailCheck = MailCheck;

  ngOnInit() {
    this.chatHistory.set([{
      role: 'model',
      text: 'Bem-vindo ao Centro de Inteligência Tributária. Estou configurado com toda a legislação federal (IRPJ, CSLL, IPI/Indústria, Simples Nacional), estadual (ICMS) e municipal (ISS), incluindo as regras do IVA Dual da Reforma 2026. Como posso orientá-lo hoje?'
    }]);
  }

  handleLogin() {
    if (!this.authForm.email || !this.authForm.password) return;
    this.isAuthenticating.set(true);
    setTimeout(() => {
      this.isAuthenticating.set(false);
      this.view.set('dashboard');
      this.profileForm.name = this.authForm.name || 'Estrategista';
    }, 1500);
  }

  handleRegister() {
    if (!this.authForm.email || !this.authForm.password || !this.authForm.name) return;
    this.isAuthenticating.set(true);
    setTimeout(() => {
      this.isAuthenticating.set(false);
      this.view.set('onboarding');
      this.profileForm.name = this.authForm.name;
    }, 2000);
  }

  handleLogout() {
    this.view.set('landing');
    this.authForm = { name: '', email: '', password: '' };
    this.simulations.set([]);
  }

  // Profile Actions
  updateName() {
    if (!this.profileForm.name.trim()) return;
    this.authForm.name = this.profileForm.name;
    alert('Nome atualizado com sucesso!');
  }

  updatePassword() {
    if (!this.profileForm.currentPass || !this.profileForm.newPass) {
       alert('Preencha os campos de senha.');
       return;
    }
    if (this.profileForm.newPass !== this.profileForm.confirmPass) {
       alert('As novas senhas não coincidem.');
       return;
    }
    alert('Senha alterada com sucesso!');
    this.profileForm.currentPass = '';
    this.profileForm.newPass = '';
    this.profileForm.confirmPass = '';
  }

  requestDeleteAccount() {
    this.showDeleteModal.set(true);
    console.log('Código enviado para e-mail:', this.sentCode);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.deleteCodeInput = '';
  }

  confirmDeleteAccount() {
    if (this.deleteCodeInput === this.sentCode) {
      alert('Sua conta e todos os dados foram removidos permanentemente.');
      this.showDeleteModal.set(false);
      this.handleLogout();
    } else {
      alert('Código inválido. Verifique seu e-mail.');
    }
  }

  async askLegislativeSummary(topic: string) {
    this.aiQuery = `Faça um resumo técnico completo sobre a legislação atual de ${topic}, incluindo as principais regras de cálculo e detalhando TODAS as alterações previstas para 2026 na Reforma Tributária (IBS/CBS/Imposto Seletivo). Cite leis específicas (Ex: LC 123, RICMS, etc).`;
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
          systemInstruction: `Você é um Consultor Tributário Sênior e Advogado Especialista em Direito Tributário Brasileiro. 
          Sua especialidade cobre:
          1. ISS: LC 116/03 e transição para o IBS.
          2. ICMS: Regras estaduais, Convênios CONFAZ e convergência para o IBS.
          3. INDÚSTRIA: IPI (RIPI), créditos físicos e financeiros, e o novo Imposto Seletivo.
          4. SIMPLES NACIONAL: LC 123/06, Fator R, e o regime híbrido pós-2026.
          5. REFORMA TRIBUTÁRIA: PLP 68/2024 e o IVA Dual.
          
          Forneça respostas altamente técnicas, baseadas em lei, curtas mas completas. Sempre cite o impacto da Reforma 2026.`
        },
      });

      const text = response.text || "Erro ao processar consulta legislativa.";
      const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = rawSources.map((chunk: any) => ({
        title: chunk.web?.title || 'Base Legal Oficial',
        uri: chunk.web?.uri || '#'
      }));

      this.chatHistory.update(h => [...h, { role: 'model', text, sources }]);
    } catch (err) {
      console.error('Erro na consulta AI:', err);
      this.chatHistory.update(h => [...h, { 
        role: 'model', 
        text: 'Erro de conexão com o Diário Oficial. Tente novamente.' 
      }]);
    } finally {
      this.isThinking.set(false);
    }
  }

  clearChat() {
    this.chatHistory.set([{
      role: 'model',
      text: 'Chat reiniciado. O Centro Legislativo está pronto para novas consultas sobre ISS, ICMS, Indústria ou Simples Nacional.'
    }]);
  }
}

bootstrapApplication(App).catch(err => console.error(err));
