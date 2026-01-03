
import React, { useState, useEffect } from 'react';
import { ViewState, CompanyData, HistoryEntry } from './types';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Pricing } from './components/Pricing';

// Mock Data Inicial
const DEMO_SIMULATIONS: CompanyData[] = [
  {
    id: '1',
    name: 'TechSolutions Ltda',
    cnpj: '12.345.678/0001-90',
    municipality: 'São Paulo',
    state: 'SP',
    cnae: '6201-5/00',
    type: 'Serviço' as any,
    currentRegime: 'Lucro Presumido' as any,
    annualRevenue: 4800000,
    payrollCosts: 1200000,
    createdAt: new Date('2024-02-15'),
    suppliers: [],
    isPremium: false
  },
  {
    id: '2',
    name: 'Comércio Silva & Filhos',
    cnpj: '98.765.432/0001-10',
    municipality: 'Curitiba',
    state: 'PR',
    cnae: '4711-3/02',
    type: 'Comércio' as any,
    currentRegime: 'Simples Nacional' as any,
    annualRevenue: 2400000,
    payrollCosts: 300000,
    createdAt: new Date('2024-03-10'),
    suppliers: [],
    isPremium: true
  }
];

function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [simulations, setSimulations] = useState<CompanyData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSims = localStorage.getItem('tax_strategist_simulations');
    if (savedSims) {
      try {
        const parsed = JSON.parse(savedSims);
        const hydrated = parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt)
        }));
        setSimulations(hydrated);
      } catch (e) {
        setSimulations(DEMO_SIMULATIONS);
      }
    } else {
      setSimulations(DEMO_SIMULATIONS);
    }

    const savedHistory = localStorage.getItem('tax_strategist_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        const hydrated = parsed.map((h: any) => ({
          ...h,
          timestamp: new Date(h.timestamp)
        }));
        setHistory(hydrated);
      } catch (e) {}
    }
    
    // Mark as initialized to enable saving
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever simulations or history change, but only after init
  useEffect(() => {
    if (!isInitialized) return;

    if (simulations.length > 0) {
      localStorage.setItem('tax_strategist_simulations', JSON.stringify(simulations));
    }
  }, [simulations, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    
    localStorage.setItem('tax_strategist_history', JSON.stringify(history));
  }, [history, isInitialized]);

  const addToHistory = (action: string) => {
    const newEntry: HistoryEntry = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      timestamp: new Date()
    };
    setHistory(prev => [newEntry, ...prev].slice(0, 3));
  };

  // Navigation Handlers
  const handleLoginSuccess = (isTestUser?: boolean) => {
    setIsAuthenticated(true);
    setView('dashboard');
    addToHistory('Fez login no sistema');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('landing');
    setEditingId(null);
  };

  const handleNewAnalysis = () => {
    setEditingId(null);
    setView('onboarding');
    addToHistory('Iniciou nova análise');
  };

  const handleEditSimulation = (id: string) => {
    setEditingId(id);
    setView('onboarding');
  };

  const handleDeleteSimulation = (id: string) => {
    const sim = simulations.find(s => s.id === id);
    if (window.confirm('Tem certeza que deseja excluir esta simulação?')) {
      setSimulations(prev => prev.filter(s => s.id !== id));
      if (sim) addToHistory(`Excluiu simulação: ${sim.name}`);
    }
  };

  const handleOnboardingComplete = (data: CompanyData) => {
    if (editingId) {
      setSimulations(prev => prev.map(s => s.id === editingId ? { ...data, id: editingId, createdAt: s.createdAt } : s));
      addToHistory(`Editou simulação: ${data.name}`);
    } else {
      const newSim = { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: new Date() };
      setSimulations(prev => [newSim, ...prev]);
      addToHistory(`Concluiu análise de: ${data.name}`);
    }
    setEditingId(null);
    setView('dashboard');
  };

  const handleUpgrade = () => {
    setView('pricing');
  };

  const handlePaymentSuccess = () => {
    setSimulations(prev => prev.map(s => ({ ...s, isPremium: true })));
    setView('dashboard');
    addToHistory('Fez upgrade para o Plano Premium');
  };

  // View Routing
  switch (view) {
    case 'landing':
      return <LandingPage onNavigate={setView} onDemo={() => setView('register')} />;
    
    case 'login':
      return <Auth view="login" onNavigate={setView} onSuccess={handleLoginSuccess} />;
    
    case 'register':
      return <Auth view="register" onNavigate={setView} onSuccess={handleLoginSuccess} />;
    
    case 'onboarding':
      return (
        <Onboarding 
          onComplete={handleOnboardingComplete} 
          onCancel={() => setView('dashboard')}
          initialData={editingId ? simulations.find(s => s.id === editingId) : null}
        />
      );

    case 'dashboard':
      if (!isAuthenticated) return <Auth view="login" onNavigate={setView} onSuccess={handleLoginSuccess} />;
      return (
        <Dashboard 
          simulations={simulations}
          history={history}
          onUpgrade={handleUpgrade}
          onLogout={handleLogout}
          onNewAnalysis={handleNewAnalysis}
          onEditSimulation={handleEditSimulation}
          onDeleteSimulation={handleDeleteSimulation}
        />
      );
      
    case 'pricing':
      return <Pricing onClose={() => setView('dashboard')} onSuccess={handlePaymentSuccess} />;

    default:
      return <LandingPage onNavigate={setView} onDemo={() => setView('register')} />;
  }
}

export default App;
