// src-v3/1-Domain/Entities/User.js
class User {
  constructor({ email, passwordHash, id = null, createdAt = null }) {
    this.id = id || this._generateId();
    this.email = this._validateAndNormalizeEmail(email);
    this.passwordHash = this._validatePasswordHash(passwordHash);
    this.createdAt = createdAt || new Date().toISOString();
  }

  _generateId() {
    return 'user_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  _validateAndNormalizeEmail(email) {
    if (email === null || email === undefined) {
      throw new Error('Email is required and must be a string');
    }
    
    if (typeof email !== 'string') {
      throw new Error('Email is required and must be a string');
    }
    
    const normalizedEmail = email.trim().toLowerCase();
    
    if (normalizedEmail.length === 0) {
      throw new Error('Email cannot be empty');
    }
    
    if (normalizedEmail.length > 254) {
      throw new Error('Email too long (max 254 characters)');
    }
    
    // RFC 5322 compliant email regex (simplified but robust)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(normalizedEmail)) {
      throw new Error('Invalid email format');
    }
    
    return normalizedEmail;
  }

  _validatePasswordHash(passwordHash) {
    if (passwordHash === null || passwordHash === undefined) {
      throw new Error('Password hash is required and must be a string');
    }
    
    if (typeof passwordHash !== 'string') {
      throw new Error('Password hash is required and must be a string');
    }
    
    if (passwordHash.trim().length < 8) {
      throw new Error('Password hash too short (minimum 8 characters)');
    }
    
    return passwordHash.trim();
  }

  isValid() {
    try {
      return !!(this.id && this.email && this.passwordHash && this.createdAt);
    } catch (error) {
      return false;
    }
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt
      // Note: passwordHash is intentionally excluded from JSON for security
    };
  }

  static fromJSON(data) {
    return new User({
      id: data.id,
      email: data.email,
      passwordHash: data.passwordHash || 'placeholder_hash',
      createdAt: data.createdAt
    });
  }
}

module.exports = { User };