
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService, UserAccount } from '../authService';

describe('AuthService (TDD)', () => {
  let authService: AuthService;

  beforeEach(() => {
    // Mock do localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        clear: () => { store = {}; }
      };
    })();
    
    vi.stubGlobal('localStorage', localStorageMock);
    authService = new AuthService();
  });

  it('deve registrar um novo usuário com sucesso', () => {
    const newUser: UserAccount = {
      name: 'João Silva',
      email: 'joao@teste.com',
      password: 'senha123',
      createdAt: ''
    };

    const result = authService.register(newUser);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Conta criada com sucesso!');
  });

  it('não deve permitir registro com e-mail duplicado', () => {
    const user: UserAccount = {
      name: 'João Silva',
      email: 'joao@teste.com',
      password: 'senha123',
      createdAt: ''
    };

    authService.register(user);
    const result = authService.register(user);
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('Este e-mail já está em uso.');
  });

  it('deve realizar login com sucesso para credenciais válidas', () => {
    const user: UserAccount = {
      name: 'João Silva',
      email: 'joao@teste.com',
      password: 'senha123',
      createdAt: ''
    };

    authService.register(user);
    const result = authService.login('joao@teste.com', 'senha123');
    
    expect(result.success).toBe(true);
    expect(result.user?.email).toBe('joao@teste.com');
  });

  it('deve falhar no login com senha incorreta', () => {
    const user: UserAccount = {
      name: 'João Silva',
      email: 'joao@teste.com',
      password: 'senha123',
      createdAt: ''
    };

    authService.register(user);
    const result = authService.login('joao@teste.com', 'senha_errada');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('E-mail ou senha incorretos.');
  });
});
