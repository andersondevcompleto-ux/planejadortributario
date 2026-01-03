
import React, { useState } from 'react';
import { ViewState } from '../types';
import { Mail, Lock, ArrowLeft, Beaker, CheckCircle, AlertTriangle } from 'lucide-react';
import { z } from 'zod';
import { sanitizeInput } from '../services/security';

interface Props {
  view: 'login' | 'register';
  onNavigate: (view: ViewState) => void;
  onSuccess: (isTestUser?: boolean) => void;
}

// Zod Schemas for Security Validation
const loginSchema = z.object({
  email: z.string().email("Formato de e-mail inválido").min(5, "E-mail muito curto"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
});

const registerSchema = loginSchema.extend({
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export const Auth: React.FC<Props> = ({ view, onNavigate, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Rate Limiting State (Security)
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // States for Password Recovery
  const [isResetting, setIsResetting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Rate Limiting Check
    if (isLocked) {
      setError("Muitas tentativas falhas. Aguarde 30 segundos.");
      return;
    }

    if (attempts >= 5) {
      setIsLocked(true);
      setError("Bloqueio de segurança por excesso de tentativas.");
      setTimeout(() => {
        setIsLocked(false);
        setAttempts(0);
        setError("");
      }, 30000); // 30 seconds lockout
      return;
    }

    // 2. Input Sanitization
    const cleanEmail = sanitizeInput(email.trim());
    
    // 3. Schema Validation (Zod)
    try {
      if (view === 'register') {
        registerSchema.parse({ email: cleanEmail, password, confirmPassword });
      } else {
        loginSchema.parse({ email: cleanEmail, password });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return; // Stop execution
      }
    }

    // Handle Password Reset Logic
    if (isResetting) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setResetSent(true);
      }, 1500);
      return;
    }

    setLoading(true);

    // Check for Test User credentials
    if (view === 'login' && cleanEmail === 'teste@tax.com' && password === '123456') {
      setTimeout(() => {
        setLoading(false);
        setAttempts(0);
        onSuccess(true); 
      }, 1000);
      return;
    } else if (view === 'login' && cleanEmail !== 'teste@tax.com' && password.length > 0) {
      // Simulation of auth failure for unknown users (mock) if not registering
      // For this demo app we allow any login, but in real scenario we would increment attempts here
      // setAttempts(prev => prev + 1);
    }

    // Simulate standard API call
    setTimeout(() => {
      setLoading(false);
      if (view === 'register') {
        onNavigate('onboarding'); 
      } else {
        onSuccess(false); 
      }
    }, 1000);
  };

  const fillTestCredentials = () => {
    setEmail('teste@tax.com');
    setPassword('123456');
    setError('');
  };

  const resetState = () => {
    setIsResetting(false);
    setResetSent(false);
    setError('');
  };

  // Render Password Recovery View
  if (isResetting) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <button 
            onClick={resetState}
            className="flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para Login
          </button>
          <h2 className="text-center text-3xl font-extrabold text-slate-900">
            Recuperar Senha
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Informe o e-mail associado à sua conta para receber as instruções.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
            {resetSent ? (
              <div className="text-center animate-fade-in">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">E-mail enviado!</h3>
                <p className="mt-2 text-sm text-slate-500 mb-6">
                  Se o e-mail <strong>{email}</strong> estiver cadastrado, você receberá um link para redefinir sua senha em instantes.
                </p>
                <button
                  onClick={resetState}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                  Voltar para o Login
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700">
                    E-mail corporativo
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="reset-email"
                      type="email"
                      required
                      className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md p-2 border bg-white"
                      placeholder="voce@empresa.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render Login/Register View
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
        </button>
        <h2 className="text-center text-3xl font-extrabold text-slate-900">
          {view === 'login' ? 'Acesse sua conta' : 'Crie sua conta grátis'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {view === 'login' ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
          <button 
            onClick={() => {
              onNavigate(view === 'login' ? 'register' : 'login');
              setError('');
              setPassword('');
              setConfirmPassword('');
              setAttempts(0);
            }}
            className="font-medium text-brand-600 hover:text-brand-500"
          >
            {view === 'login' ? 'Cadastre-se' : 'Faça login'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                E-mail corporativo
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md p-2 border bg-white"
                  placeholder="voce@empresa.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md p-2 border bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              {/* Forgot Password Link */}
              {view === 'login' && (
                <div className="flex items-center justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setIsResetting(true)}
                    className="text-sm font-medium text-brand-600 hover:text-brand-500"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              )}
            </div>

            {view === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                  Confirmar Senha
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md p-2 border bg-white"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm text-center font-medium bg-red-50 p-3 rounded border border-red-200 flex items-center justify-center">
                 <AlertTriangle className="h-4 w-4 mr-2" />
                 {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isLocked}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 ${loading || isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processando...' : (view === 'login' ? 'Entrar' : 'Criar Conta')}
            </button>
          </form>

          {/* Test User Helper */}
          {view === 'login' && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={fillTestCredentials}
                className="w-full flex items-center justify-center space-x-2 text-sm text-slate-500 hover:text-brand-600 hover:bg-slate-50 py-2 rounded-md transition-colors border border-dashed border-slate-300 hover:border-brand-300"
              >
                <Beaker className="h-4 w-4" />
                <span>Usar credenciais de teste</span>
              </button>
            </div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Ou continue com</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                Google
              </button>
              <button className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                Microsoft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
