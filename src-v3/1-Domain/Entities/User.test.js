// src-v3/1-Domain/Entities/User.test.js
const { User } = require('./User');

describe('User Entity', () => {
  describe('Valid User Creation', () => {
    it('should create a user with a valid email and hashed password', () => {
      const userData = { email: 'test@iku-cabalactiva.com', passwordHash: 'hashed_password_12345' };
      const user = new User(userData);
      
      expect(user.email).toBe('test@iku-cabalactiva.com');
      expect(user.passwordHash).toBe('hashed_password_12345');
      expect(user.id).toMatch(/^user_[a-z0-9]+$/);
      expect(user.createdAt).toBeTruthy();
      expect(user.isValid()).toBe(true);
    });

    it('should normalize email to lowercase', () => {
      const userData = { email: 'TEST@IKU-CABALACTIVA.COM', passwordHash: 'hashed_password_12345' };
      const user = new User(userData);
      
      expect(user.email).toBe('test@iku-cabalactiva.com');
    });

    it('should trim whitespace from email', () => {
      const userData = { email: '  test@iku-cabalactiva.com  ', passwordHash: 'hashed_password_12345' };
      const user = new User(userData);
      
      expect(user.email).toBe('test@iku-cabalactiva.com');
    });
  });

  describe('Invalid User Creation - Email Validation', () => {
    it('should throw error for missing email', () => {
      expect(() => {
        new User({ passwordHash: 'hashed_password_12345' });
      }).toThrow('Email is required and must be a string');
    });

    it('should throw error for empty email', () => {
      expect(() => {
        new User({ email: '', passwordHash: 'hashed_password_12345' });
      }).toThrow('Email cannot be empty');
    });

    it('should throw error for null email', () => {
      expect(() => {
        new User({ email: null, passwordHash: 'hashed_password_12345' });
      }).toThrow('Email is required and must be a string');
    });

    it('should throw error for non-string email', () => {
      expect(() => {
        new User({ email: 12345, passwordHash: 'hashed_password_12345' });
      }).toThrow('Email is required and must be a string');
    });

    it('should throw error for invalid email format', () => {
      expect(() => {
        new User({ email: 'invalid-email', passwordHash: 'hashed_password_12345' });
      }).toThrow('Invalid email format');
    });

    it('should throw error for email without @', () => {
      expect(() => {
        new User({ email: 'testiku-cabalactiva.com', passwordHash: 'hashed_password_12345' });
      }).toThrow('Invalid email format');
    });

    it('should throw error for email without domain', () => {
      expect(() => {
        new User({ email: 'test@', passwordHash: 'hashed_password_12345' });
      }).toThrow('Invalid email format');
    });
  });

  describe('Invalid User Creation - Password Validation', () => {
    it('should throw error for missing password hash', () => {
      expect(() => {
        new User({ email: 'test@iku-cabalactiva.com' });
      }).toThrow('Password hash is required and must be a string');
    });

    it('should throw error for empty password hash', () => {
      expect(() => {
        new User({ email: 'test@iku-cabalactiva.com', passwordHash: '' });
      }).toThrow('Password hash too short');
    });

    it('should throw error for short password hash', () => {
      expect(() => {
        new User({ email: 'test@iku-cabalactiva.com', passwordHash: '1234567' });
      }).toThrow('Password hash too short');
    });

    it('should throw error for null password hash', () => {
      expect(() => {
        new User({ email: 'test@iku-cabalactiva.com', passwordHash: null });
      }).toThrow('Password hash is required and must be a string');
    });
  });

  describe('User JSON Serialization', () => {
    it('should exclude password hash from JSON output', () => {
      const userData = { email: 'test@iku-cabalactiva.com', passwordHash: 'hashed_password_12345' };
      const user = new User(userData);
      const json = user.toJSON();
      
      expect(json.email).toBe('test@iku-cabalactiva.com');
      expect(json.id).toBeTruthy();
      expect(json.createdAt).toBeTruthy();
      expect(json.passwordHash).toBeUndefined();
    });

    it('should create user from JSON data', () => {
      const jsonData = {
        id: 'user_test123',
        email: 'test@iku-cabalactiva.com',
        createdAt: '2025-01-01T00:00:00.000Z',
        passwordHash: 'hashed_password_12345'
      };
      
      const user = User.fromJSON(jsonData);
      
      expect(user.id).toBe('user_test123');
      expect(user.email).toBe('test@iku-cabalactiva.com');
      expect(user.createdAt).toBe('2025-01-01T00:00:00.000Z');
      expect(user.isValid()).toBe(true);
    });
  });
});