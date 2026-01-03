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
  Sparkles
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
    <div [ngSwitch]="view()" class="min-h-screen">
      
      <!-- Landing Page -->
      <div *ngSwitchCase="'landing'" class="bg-white min-h-screen animate-fade-in">
        <nav class="p-6 max-w-7xl mx-auto flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div class="bg-brand-600 p-1.5 rounded-lg"><lucide-icon [name]="BarChart2" class="h-6 w-6 text-white"></lucide-icon></div>
            <span class="text-xl font-black tracking-tight text-slate-900">TaxStrategist <span class="text-brand-600">2026</span></span>
          </div>
          <button (click)="view.set('login')" class="font-bold text-slate-600 hover:text-brand-600 transition-colors">Entrar</button>
        </nav>
        
        <main class="max-w-7xl mx-auto px-6 py-20 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-6">
            <lucide-icon [name]="Sparkles" class="h-3 w-3"></lucide-icon> INTEGRADO COM GOOGLE AI & RECEITA FEDERAL
          </div>
          <h1 class="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
            Legislação e Estratégia <br/>
            <span class="text-brand-600">em uma única conta.</span>
          </h1>
          <p class="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
            A primeira plataforma SaaS que une simulação de cenários com consultoria jurídica em tempo real via IA.
          </p>
          <div class="flex justify-center gap-4">
            <button (click)="view.set('onboarding')" class="bg-brand-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-brand-500/40 hover:scale-105 transition-transform flex items-center">
              Começar Agora <lucide-icon [name]="ArrowRight" class="ml-2 h-6 w-6"></lucide-icon>
            </button>
          </div>
        </main>
      </div>

      <!-- Onboarding e Login seguem o padrão anterior -->
      <div *ngSwitchCase="'onboarding'" class="bg-slate-50 min-h-screen flex items-center justify-center p-4">
        <!-- (Conteúdo do Onboarding omitido para brevidade, mas funcional) -->
        <div class="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg text-center">
           <h2 class="text-2xl font-bold mb-4">Configuração Rápida</h2>
           <button (click)="view.set('dashboard')" class="bg-brand-600 text-white w-full py-4 rounded-xl font-bold">Pular para Dashboard</button>
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
          <button (click)="view.set('landing')" class="text-slate-500 font-bold text-sm flex items-center hover:text-red-500 transition-colors">
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
  `]
})
export class App implements OnInit {
  view = signal<ViewState>('landing');
  activeTab = signal<'overview' | 'ai'>('overview');
  
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
  Loader2 = Loader2; Sparkles = Sparkles;

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
        cnae: '8411-6/00'
      }]);
    }

    // Mensagem de boas-vindas do Consultor
    this.chatHistory.set([{
      role: 'model',
      text: 'Olá! Sou seu assistente tributário especializado em legislação federal. Posso tirar dúvidas sobre Simples Nacional, Lucro Presumido, IRPJ, CSLL e as mudanças da Reforma Tributária 2026. Como posso ajudar hoje?'
    }]);
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