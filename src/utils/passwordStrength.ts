// Força da senha mostrada no cadastro e na recuperação de senha (barras + regras de PasswordStrengthSection).
export function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: "", color: "#D9DDE7" };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Za-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return { score: 1, label: "Senha fraca", color: "#E62325" };
  if (score <= 4) return { score: 2, label: "Senha média", color: "#FBBC04" };
  return { score: 3, label: "Senha forte", color: "#2E7D32" };
}

export function getPasswordRules(password: string) {
  return {
    minLength: password.length >= 6,
    hasLetter: /[A-Za-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };
}
