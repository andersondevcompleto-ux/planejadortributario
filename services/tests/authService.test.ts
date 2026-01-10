
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService, UserAccount } from '../authService';

describe('AuthService (TDD Advanced)', () => {
  let authService: AuthService;

  beforeEach(() => {
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; }
      };
    })();
    
    vi.stubGlobal('localStorage', localStorageMock);
    authService = new AuthService();
  });

  it('deve validar complexidade de senha (falha sem maiúscula)', () => {
    const result = authService.validatePasswordComplexity('senha123');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('letra maiúscula');
  });

  it('deve validar complexidade de senha (falha sem número)', () => {
    const result = authService.validatePasswordComplexity('SenhaSemNumero');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('número');
  });

  it('deve validar complexidade de senha (sucesso)', () => {
    const result = authService.validatePasswordComplexity('SenhaForte123');
    expect(result.isValid).toBe(true);
  });

  it('deve persistir a sessão após o login', () => {
    const user: UserAccount = {
      name: 'João',
      email: 'joao@teste.com',
      password: 'SenhaForte123',
      confirmPassword: 'SenhaForte123',
      createdAt: ''
    };
    authService.register(user);
    authService.login('joao@teste.com', 'SenhaForte123');
    
    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.getCurrentUser()?.email).toBe('joao@teste.com');
  });

  it('deve limpar a sessão após o logout', () => {
    const user: UserAccount = {
      name: 'João',
      email: 'joao@teste.com',
      password: 'SenhaForte123',
      confirmPassword: 'SenhaForte123',
      createdAt: ''
    };
    authService.register(user);
    authService.login('joao@teste.com', 'SenhaForte123');
    authService.logout();
    
    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.getCurrentUser()).toBe(null);
  });

  it('deve tratar e-mails como case-insensitive no login', () => {
    const user: UserAccount = {
      name: 'João',
      email: 'Joao@Teste.com',
      password: 'SenhaForte123',
      confirmPassword: 'SenhaForte123',
      createdAt: ''
    };
    authService.register(user);
    const result = authService.login('joao@teste.com', 'SenhaForte123');
    expect(result.success).toBe(true);
  });
});
