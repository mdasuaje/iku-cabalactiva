// src-v3/1-Domain/Entities/User.js
class User {
  constructor({ email, passwordHash }) {
    this.email = email;
    this.passwordHash = passwordHash;
  }

  isValid() {
    if (!this.email || !this.passwordHash) {
      return false;
    }
    // Expresión regular simple para validación de email.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }
}

module.exports = { User };