// src-v3/1-Domain/Entities/User.js
export class User {
  constructor({ email, passwordHash }) {
    this.email = email;
    this.passwordHash = passwordHash;
  }

  isValid() {
    // TODO: Implement validation
    return false;
  }
}