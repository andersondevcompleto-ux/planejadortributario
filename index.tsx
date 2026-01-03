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
  Gift
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
            <div class="bg-brand-600 p-1 rounded-md"><lucide-icon [name]="BarChart2" class="h-4 w-4 text-white"></lucide-icon></div>
            <span class="font-bold">TaxStrategist <span class="text-brand-600">Pro</span></span>
          </div>
          <div class="flex gap-6">
            <button (click)="activeTab.set('overview')" [class.text-brand-600]="activeTab() === 'overview'" class="text-sm font-bold flex items-center gap-2">
               <lucide-icon [name]="Database" class="h-4 w-4"></lucide-icon> Simulações
            </button>
            <button (click)="activeTab.set('ai')" [class.text-brand-600]="activeTab() === 'ai'" class="text-sm font-bold flex items-center gap-2">
               <lucide-icon [name]="MessageSquare" class="h-4 w-4"></lucide-icon> Consultoria AI
            </button>
          </div>
          <button (click)="handleLogout()" class="text-slate-500 font-bold text-sm flex items-center hover:text-red-500 transition-colors">
            <lucide-icon [name]="LogOut" class="h-4 w-4 mr-1"></lucide-icon> Sair
          </button>
        </nav>

        <div class="max-w-7xl mx-auto p-8">
          
          <!-- Aba de Simulações -->
          <div *ngIf="activeTab() === 'overview'" class="space-y-8 animate-fade-in">
             <div class="flex justify-between items-center">
                <div>
                  <h1 class="text-3xl font-black">Inteligência Fiscal</h1>
                  <p class="text-slate-500">Cenários baseados no PLP 68/2024 e legislação vigente.</p>
                </div>
                <button (click)="view.set('onboarding')" class="bg-white border px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                  <lucide-icon [name]="PlusCircle" class="h-4 w-4"></lucide-icon> Nova Empresa
                </button>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div class="col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div class="bg-brand-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4"><lucide-icon [name]="BookOpen" class="text-brand-600 h-5 w-5"></lucide-icon></div>
                  <h4 class="font-bold text-slate-800">CNAE 62.01-5/00</h4>
                  <p class="text-xs text-slate-400">Desenvolvimento de Software</p>
                  <div class="mt-4 pt-4 border-t flex flex-col gap-2">
                    <span class="text-[10px] font-bold text-slate-400 uppercase">Alertas Legais</span>
                    <div class="flex items-center gap-1 text-amber-600 text-[10px] font-bold">
                      <lucide-icon [name]="ShieldAlert" class="h-3 w-3"></lucide-icon> PLP 68/2024: IVA Dual
                    </div>
                  </div>
               </div>
               <div class="md:col-span-3 bg-brand-600 p-8 rounded-3xl text-white shadow-xl shadow-brand-500/20 relative overflow-hidden">
                  <div class="relative z-10">
                    <p class="text-xs font-bold text-brand-200 uppercase tracking-widest mb-2">Simulação Consolidada</p>
                    <h3 class="text-4xl font-black">Economia de R$ 12.450,00 <span class="text-lg font-normal text-brand-200">/mês</span></h3>
                    <p class="mt-4 text-sm text-brand-100 max-w-lg leading-relaxed">Seu enquadramento no Simples Nacional continua vantajoso mesmo após a transição parcial em 2026.</p>
                  </div>
                  <lucide-icon [name]="BarChart2" class="absolute -right-10 -bottom-10 h-48 w-48 text-brand-500 opacity-20"></lucide-icon>
               </div>
             </div>
          </div>

          <!-- Aba de Consultoria AI (Legislação Federal) -->
          <div *ngIf="activeTab() === 'ai'" class="animate-fade-in max-w-4xl mx-auto">
            <div class="bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col h-[70vh]">
              <div class="p-6 bg-slate-50 border-b flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <div class="bg-brand-600 p-2 rounded-xl"><lucide-icon [name]="Sparkles" class="h-5 w-5 text-white"></lucide-icon></div>
                  <div>
                    <h2 class="font-bold text-slate-900 leading-none">Consultor de Legislação Federal</h2>
                    <span class="text-[10px] text-brand-600 font-bold uppercase tracking-wider">Base Gemini 3 Pro + Google Search</span>
                  </div>
                </div>
                <button (click)="clearChat()" class="text-slate-400 hover:text-red-500 transition-colors"><lucide-icon [name]="XCircle" class="h-5 w-5"></lucide-icon></button>
              </div>

              <div class="flex-1 overflow-y-auto p-6 space-y-6" #chatContainer>
                <div *ngFor="let msg of chatHistory()" [class]="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
                   <div [class]="msg.role === 'user' ? 'bg-brand-600 text-white rounded-2xl rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-2xl rounded-tl-none'" class="max-w-[80%] p-4 shadow-sm">
                      <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ msg.text }}</p>
                      
                      <!-- Grounding Sources -->
                      <div *ngIf="msg.sources?.length" class="mt-4 pt-4 border-t border-slate-200/50">
                        <p class="text-[10px] font-bold text-slate-400 mb-2 uppercase">Referências Legais</p>
                        <div class="flex flex-wrap gap-2">
                          <a *ngFor="let source of msg.sources" [href]="source.uri" target="_blank" class="flex items-center gap-1 bg-white px-2 py-1 rounded border text-[10px] text-brand-600 hover:bg-brand-50 transition-colors">
                            <lucide-icon [name]="ExternalLink" class="h-2.5 w-2.5"></lucide-icon> {{ source.title }}
                          </a>
                        </div>
                      </div>
                   </div>
                </div>
                <div *ngIf="isThinking()" class="flex justify-start animate-pulse">
                  <div class="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <lucide-icon [name]="Loader2" class="h-4 w-4 animate-spin text-brand-600"></lucide-icon>
                    <span class="text-sm font-medium text-slate-500">Consultando legislação federal...</span>
                  </div>
                </div>
              </div>

              <div class="p-4 bg-white border-t">
                <div class="flex gap-2">
                  <input 
                    [(ngModel)]="aiQuery" 
                    (keyup.enter)="askAI()"
                    placeholder="Ex: Qual o limite de faturamento do Simples em 2026?" 
                    class="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm">
                  <button (click)="askAI()" [disabled]="isThinking() || !aiQuery.trim()" class="bg-brand-600 text-white p-4 rounded-2xl shadow-lg hover:bg-brand-700 disabled:opacity-50 transition-all">
                    <lucide-icon [name]="ArrowRight" class="h-5 w-5"></lucide-icon>
                  </button>
                </div>
                <p class="text-[10px] text-slate-400 text-center mt-3">Sempre valide informações críticas com um contador especializado.</p>
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
    input::placeholder { color: #94a3b8; }
  `]
})
export class App implements OnInit {
  view = signal<ViewState>('landing');
  activeTab = signal<'overview' | 'ai'>('overview');
  
  // Auth State
  isAuthenticating = signal(false);
  showPassword = false;
  authForm = {
    name: '',
    email: '',
    password: ''
  };

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

  ngOnInit() {
    // Carregar dados fictícios se estiver vazio
    if (this.simulations().length === 0) {
      this.simulations.set([{
        cnpj: '00.394.460/0001-41',
        name: 'RECEITA FEDERAL DO BRASIL',
        municipality: 'Brasília',
        state: 'DF',
        annualRevenue: 4800000,
        payrollCosts: 1200000,
        type: CompanyType.Servico,
        currentRegime: TaxRegime.Simples,
        cnae: '8411-6/00',
        suppliers: []
      }]);
    }

    // Mensagem de boas-vindas do Consultor
    this.chatHistory.set([{
      role: 'model',
      text: 'Olá! Sou seu assistente tributário especializado em legislação federal. Posso tirar dúvidas sobre Simples Nacional, Lucro Presumido, IRPJ, CSLL e as mudanças da Reforma Tributária 2026. Como posso ajudar hoje?'
    }]);
  }

  handleLogin() {
    if (!this.authForm.email || !this.authForm.password) return;
    this.isAuthenticating.set(true);
    // Simulação de delay de rede
    setTimeout(() => {
      this.isAuthenticating.set(false);
      this.view.set('dashboard');
    }, 1500);
  }

  handleRegister() {
    if (!this.authForm.email || !this.authForm.password || !this.authForm.name) return;
    this.isAuthenticating.set(true);
    setTimeout(() => {
      this.isAuthenticating.set(false);
      this.view.set('onboarding');
    }, 2000);
  }

  handleLogout() {
    this.view.set('landing');
    this.authForm = { name: '', email: '', password: '' };
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
          systemInstruction: "Você é um consultor tributário sênior especializado em legislação brasileira (Receita Federal, Planalto, Reforma Tributária). Forneça respostas precisas, citando leis se possível. Use uma linguagem profissional e clara."
        },
      });

      const text = response.text || "Desculpe, não consegui processar essa consulta agora.";
      const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = rawSources.map((chunk: any) => ({
        title: chunk.web?.title || 'Link Oficial',
        uri: chunk.web?.uri || '#'
      }));

      this.chatHistory.update(h => [...h, { role: 'model', text, sources }]);
    } catch (err) {
      console.error('Erro na consulta AI:', err);
      this.chatHistory.update(h => [...h, { 
        role: 'model', 
        text: 'Ocorreu um erro ao consultar a base da Receita Federal. Por favor, tente novamente em instantes.' 
      }]);
    } finally {
      this.isThinking.set(false);
    }
  }

  clearChat() {
    this.chatHistory.set([{
      role: 'model',
      text: 'Chat reiniciado. Em que posso ajudar com a legislação tributária?'
    }]);
  }
}

bootstrapApplication(App).catch(err => console.error(err));
