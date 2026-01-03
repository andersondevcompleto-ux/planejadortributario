import { describe, it, expect } from 'vitest';
import { validateCNPJStrict, sanitizeInput } from '../../services/security';

describe('Security Service', () => {
  describe('CNPJ Validator', () => {
    it('deve validar um CNPJ real e correto', () => {
      // CNPJ da Receita Federal (exemplo público)
      expect(validateCNPJStrict('00394460000141')).toBe(true);
      expect(validateCNPJStrict('00.394.460/0001-41')).toBe(true);
    });

    it('deve rejeitar CNPJs com todos os números iguais', () => {
      expect(validateCNPJStrict('11111111111111')).toBe(false);
      expect(validateCNPJStrict('00000000000000')).toBe(false);
    });

    it('deve rejeitar CNPJs com tamanho inválido', () => {
      expect(validateCNPJStrict('1234567890123')).toBe(false); // 13 digitos
    });

    it('deve rejeitar CNPJs com dígitos verificadores incorretos', () => {
      expect(validateCNPJStrict('00394460000142')).toBe(false); // Fim 42 em vez de 41
    });
  });

  describe('Input Sanitization', () => {
    it('deve escapar tags HTML para prevenir XSS básico', () => {
      const dirty = '<script>alert("xss")</script>';
      const clean = sanitizeInput(dirty);
      expect(clean).not.toContain('<script>');
      expect(clean).toContain('&lt;script&gt;');
    });

    it('deve manter textos normais intactos', () => {
      const text = 'Empresa de Software LTDA';
      expect(sanitizeInput(text)).toBe(text);
    });
  });
});