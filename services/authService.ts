
/**
 * AuthService
 * Gerencia o registro, login e persistência de sessão de usuários.
 */

export interface UserAccount {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  createdAt: string;
}

export class AuthService {
  private USERS_KEY = 'tax_strategist_users';
  private SESSION_KEY = 'tax_strategist_session';

  private getUsers(): UserAccount[] {
    try {
      const data = localStorage.getItem(this.USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Erro ao ler usuários do localStorage', e);
      return [];
    }
  }

  private saveUsers(users: UserAccount[]) {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Erro ao salvar usuários no localStorage', e);
    }
  }

  /**
   * Verifica se a senha atende aos requisitos de segurança:
   * - Mínimo 8 caracteres
   * - Pelo menos uma letra maiúscula
   * - Pelo menos um número
   */
  validatePasswordComplexity(password: string): { isValid: boolean; error?: string } {
    if (password.length < 8) return { isValid: false, error: 'A senha deve ter pelo menos 8 caracteres.' };
    if (!/[A-Z]/.test(password)) return { isValid: false, error: 'A senha deve conter pelo menos uma letra maiúscula.' };
    if (!/[0-9]/.test(password)) return { isValid: false, error: 'A senha deve conter pelo menos um número.' };
    return { isValid: true };
  }

  register(userData: UserAccount): { success: boolean; message: string } {
    if (!userData.email || !userData.password || !userData.name || !userData.confirmPassword) {
      return { success: false, message: 'Todos os campos são obrigatórios.' };
    }

    if (userData.password !== userData.confirmPassword) {
      return { success: false, message: 'As senhas não coincidem.' };
    }

    const complexity = this.validatePasswordComplexity(userData.password);
    if (!complexity.isValid) {
      return { success: false, message: complexity.error! };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return { success: false, message: 'Formato de e-mail inválido.' };
    }

    const users = this.getUsers();
    if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, message: 'Este e-mail já está em uso.' };
    }

    const { confirmPassword: _, ...userToSave } = userData;
    const newUser = {
      ...userToSave,
      email: userToSave.email.toLowerCase(),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    
    console.log('Usuário registrado com sucesso:', newUser.email);
    return { success: true, message: 'Conta criada com sucesso!' };
  }

  login(email: string, password: string): { success: boolean; user?: UserAccount; message: string } {
    if (!email || !password) {
      return { success: false, message: 'E-mail e senha são obrigatórios.' };
    }

    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (!user) {
      return { success: false, message: 'E-mail ou senha incorretos.' };
    }

    const { password: _, ...safeUser } = user;
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(safeUser));
    
    return { success: true, user: safeUser as UserAccount, message: 'Login bem-sucedido!' };
  }

  logout() {
    localStorage.removeItem(this.SESSION_KEY);
  }

  getCurrentUser(): UserAccount | null {
    const session = localStorage.getItem(this.SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}
