
/**
 * AuthService
 * Gerencia o registro e login de usuários com persistência em localStorage.
 */

export interface UserAccount {
  name: string;
  email: string;
  password?: string;
  createdAt: string;
}

export class AuthService {
  private STORAGE_KEY = 'tax_strategist_users';

  private getUsers(): UserAccount[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveUsers(users: UserAccount[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  }

  /**
   * Registra um novo usuário.
   * Valida se o e-mail já existe.
   */
  register(userData: UserAccount): { success: boolean; message: string } {
    if (!userData.email || !userData.password || !userData.name) {
      return { success: false, message: 'Todos os campos são obrigatórios.' };
    }

    if (!userData.email.includes('@')) {
      return { success: false, message: 'E-mail inválido.' };
    }

    const users = this.getUsers();
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Este e-mail já está em uso.' };
    }

    users.push({
      ...userData,
      createdAt: new Date().toISOString()
    });

    this.saveUsers(users);
    return { success: true, message: 'Conta criada com sucesso!' };
  }

  /**
   * Realiza o login do usuário.
   */
  login(email: string, password: string): { success: boolean; user?: UserAccount; message: string } {
    if (!email || !password) {
      return { success: false, message: 'E-mail e senha são obrigatórios.' };
    }

    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { success: false, message: 'E-mail ou senha incorretos.' };
    }

    // Remove password for security before returning user object
    const { password: _, ...safeUser } = user;
    return { success: true, user: safeUser as UserAccount, message: 'Login bem-sucedido!' };
  }
}
