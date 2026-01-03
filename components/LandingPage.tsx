import React from 'react';
import { ViewState } from '../types';
import { ArrowRight, BarChart2, ShieldCheck, PieChart, TrendingUp, CheckCircle2 } from 'lucide-react';

interface Props {
  onNavigate: (view: ViewState) => void;
  onDemo: () => void;
}

export const LandingPage: React.FC<Props> = ({ onNavigate, onDemo }) => {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
              <div className="bg-brand-600 rounded-lg p-1.5">
                <BarChart2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">TaxStrategist 2026</span>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-700">
              <span className="sr-only">Abrir menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="#features" className="text-sm font-semibold leading-6 text-slate-900 hover:text-brand-600 transition-colors">Funcionalidades</a>
            <a href="#benefits" className="text-sm font-semibold leading-6 text-slate-900 hover:text-brand-600 transition-colors">Benefícios</a>
            <a href="#pricing" className="text-sm font-semibold leading-6 text-slate-900 hover:text-brand-600 transition-colors">Planos</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
            <button onClick={() => onNavigate('login')} className="text-sm font-semibold leading-6 text-slate-900 hover:text-brand-600 transition-colors">
              Entrar <span aria-hidden="true">&rarr;</span>
            </button>
            <button 
              onClick={() => onNavigate('register')}
              className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 transition-all"
            >
              Começar Grátis
            </button>
          </div>
        </nav>
      </header>

      <main className="isolate">
        {/* Hero section */}
        <div className="relative pt-14">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
          </div>
          <div className="py-24 sm:py-32 lg:pb-40">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <div className="mb-8 flex justify-center">
                  <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-600 ring-1 ring-slate-900/10 hover:ring-slate-900/20">
                    Preparado para a Reforma Tributária? <a href="#" className="font-semibold text-brand-600"><span className="absolute inset-0" aria-hidden="true"></span>Saiba mais <span aria-hidden="true">&rarr;</span></a>
                  </div>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                  Inteligência Tributária para o Futuro do seu Negócio
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  Compare o cenário atual com a Reforma 2026. Simule regimes tributários (Simples, Presumido, Real e IVA), identifique economias e planeje a transição da sua empresa com dados precisos.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <button
                    onClick={onDemo}
                    className="rounded-md bg-brand-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 transition-all flex items-center"
                  >
                    Fazer Simulação Agora <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                  <button onClick={() => onNavigate('login')} className="text-sm font-semibold leading-6 text-slate-900">
                    Já tenho conta <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
              
              {/* Feature Mockup */}
              <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <div className="rounded-md bg-white p-8 shadow-2xl ring-1 ring-slate-900/10 grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Fake Dashboard Elements */}
                      <div className="md:col-span-2 space-y-4">
                          <div className="h-8 w-1/3 bg-slate-200 rounded animate-pulse"></div>
                          <div className="h-64 w-full bg-slate-50 rounded-lg border border-slate-100 flex items-end justify-around p-4">
                              <div className="w-16 h-[60%] bg-blue-200 rounded-t-lg"></div>
                              <div className="w-16 h-[80%] bg-brand-500 rounded-t-lg relative">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded">Economia</div>
                              </div>
                              <div className="w-16 h-[40%] bg-slate-300 rounded-t-lg"></div>
                          </div>
                      </div>
                      <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                              <div className="h-5 w-5 bg-emerald-500 rounded-full mb-2"></div>
                              <div className="h-4 w-2/3 bg-emerald-200 rounded mb-2"></div>
                              <div className="h-3 w-full bg-emerald-100 rounded"></div>
                          </div>
                          <div className="p-4 rounded-lg bg-white border border-slate-100 shadow-sm">
                              <div className="h-4 w-1/2 bg-slate-200 rounded mb-3"></div>
                              <div className="space-y-2">
                                <div className="h-2 w-full bg-slate-100 rounded"></div>
                                <div className="h-2 w-full bg-slate-100 rounded"></div>
                                <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
            <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="mx-auto max-w-7xl px-6 lg:px-8 py-24 bg-slate-50 rounded-3xl">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-brand-600">Análise Completa</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Tudo que você precisa para decidir o melhor regime
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Nossa plataforma cruza dados de faturamento, folha, compras e atividade (CNAE) para projetar o impacto financeiro exato da nova legislação.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
                    <TrendingUp className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Comparativo Lado a Lado
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">Visualize seu imposto atual vs. Reforma 2026. Entenda se sua carga tributária vai aumentar ou diminuir.</dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
                    <ShieldCheck className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Compliance & Segurança
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">Regras atualizadas conforme PLP 68/2024 (Reforma) e Lei Complementar 123/2006 (Simples).</dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
                    <PieChart className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Análise de Créditos (IVA)
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">Calculamos o potencial de crédito sobre suas compras (IBS/CBS) para reduzir o imposto a pagar no Lucro Real e Novo Regime.</dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
                    <CheckCircle2 className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Planejamento Estratégico
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">Receba recomendações automáticas sobre qual caminho seguir: manter-se no Simples ou migrar para o Lucro Real/Presumido.</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-slate-500">
              &copy; 2024 TaxStrategist. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};