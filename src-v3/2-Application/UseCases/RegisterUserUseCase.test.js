// src-v3/2-Application/UseCases/RegisterUserUseCase.test.js
import { RegisterUserUseCase } from './RegisterUserUseCase.js';
import { User } from '../../1-Domain/Entities/User.js';
import { GoogleSheetsUserRepository } from '../../3-Infrastructure/Persistence/GoogleSheetsUserRepository.js';

/**
 * Mock User Repository for testing
 */
class MockUserRepository {
  constructor() {
    this.users = [];
  }

  async save(user) {
    const savedUser = new User({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt
    });
    this.users.push(savedUser);
    return savedUser;
  }

  async findByEmail(email) {
    return this.users.find(user => user.email === email) || null;
  }

  async findById(id) {
    return this.users.find(user => user.id === id) || null;
  }

  async existsByEmail(email) {
    return this.users.some(user => user.email === email);
  }

  async deleteById(id) {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  // Helper for tests
  clear() {
    this.users = [];
  }
}

/**
 * Mock Password Hasher for testing
 */
const mockPasswordHasher = async (password) => {
  return `hashed_${password}_test`;
};

describe('RegisterUserUseCase', () => {
  let useCase;
  let mockRepository;

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    useCase = new RegisterUserUseCase(mockRepository, mockPasswordHasher);
  });

  describe('Successful Registration', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@iku-cabalactiva.com',
        password: 'ValidPass123'
      };

      const result = await useCase.execute(userData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('User registered successfully');
      expect(result.user.email).toBe('test@iku-cabalactiva.com');
      expect(result.user.id).toBeTruthy();
      expect(result.user.createdAt).toBeTruthy();
      expect(result.user.passwordHash).toBeUndefined(); // Should not be exposed
    });

    it('should hash the password correctly', async () => {
      const userData = {
        email: 'test@iku-cabalactiva.com',
        password: 'ValidPass123'
      };

      await useCase.execute(userData);
      const savedUser = await mockRepository.findByEmail('test@iku-cabalactiva.com');
      
      expect(savedUser.passwordHash).toBe('hashed_ValidPass123_test');
    });

    it('should normalize email to lowercase', async () => {
      const userData = {
        email: 'TEST@IKU-CABALACTIVA.COM',
        password: 'ValidPass123'
      };

      const result = await useCase.execute(userData);
      
      expect(result.user.email).toBe('test@iku-cabalactiva.com');
    });
  });

  describe('Validation Errors', () => {
    it('should throw error for missing email', async () => {
      const userData = {
        password: 'ValidPass123'
      };

      await expect(useCase.execute(userData)).rejects.toThrow('Email is required and must be a string');
    });

    it('should throw error for invalid email type', async () => {
      const userData = {
        email: 12345,
        password: 'ValidPass123'
      };

      await expect(useCase.execute(userData)).rejects.toThrow('Email is required and must be a string');
    });

    it('should throw error for missing password', async () => {
      const userData = {
        email: 'test@iku-cabalactiva.com'
      };

      await expect(useCase.execute(userData)).rejects.toThrow('Password is required and must be a string');
    });

    it('should throw error for invalid password type', async () => {
      const userData = {
        email: 'test@iku-cabalactiva.com',
        password: 12345
      };

      await expect(useCase.execute(userData)).rejects.toThrow('Password is required and must be a string');
    });

    it('should throw error for short password', async () => {
      const userData = {
        email: 'test@iku-cabalactiva.com',
        password: '1234567'
      };

      await expect(useCase.execute(userData)).rejects.toThrow('Password must be at least 8 characters long');
    });

    it('should throw error for weak password (no uppercase)', async () => {
      const userData = {
        email: 'test@iku-cabalactiva.com',
        password: 'validpass123'
      };

      await expect(useCase.execute(userData)).rejects.toThrow('Password must contain at least one lowercase letter, one uppercase letter, and one number');
    });

    it('should throw error for weak password (no lowercase)', async () => {
      const userData = {
        email: 'test@iku-cabalactiva.com',
        password: 'VALIDPASS123'
      };

      await expect(useCase.execute(userData)).rejects.toThrow('Password must contain at least one lowercase letter, one uppercase letter, and one number');
    });

    it('should throw error for weak password (no numbers)', async () => {
      const userData = {
        email: 'test@iku-cabalactiva.com',
        password: 'ValidPassword'
      };

      await expect(useCase.execute(userData)).rejects.toThrow('Password must contain at least one lowercase letter, one uppercase letter, and one number');
    });

    it('should throw error for invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'ValidPass123'
      };

      await expect(useCase.execute(userData)).rejects.toThrow('Invalid email format');
    });
  });

  describe('Business Logic Errors', () => {
    it('should throw error when user already exists', async () => {
      const userData = {
        email: 'test@iku-cabalactiva.com',
        password: 'ValidPass123'
      };

      // Register user first time
      await useCase.execute(userData);

      // Try to register same user again
      await expect(useCase.execute(userData)).rejects.toThrow('User with this email already exists');
    });
  });

  describe('Repository Integration', () => {
    it('should save user to repository', async () => {
      const userData = {
        email: 'test@iku-cabalactiva.com',
        password: 'ValidPass123'
      };

      await useCase.execute(userData);
      const savedUser = await mockRepository.findByEmail('test@iku-cabalactiva.com');
      
      expect(savedUser).toBeTruthy();
      expect(savedUser.email).toBe('test@iku-cabalactiva.com');
      expect(savedUser.passwordHash).toBeTruthy();
    });

    it('should check for existing users before registration', async () => {
      // Pre-populate repository
      const existingUser = new User({
        email: 'existing@iku-cabalactiva.com',
        passwordHash: 'existing_hash'
      });
      await mockRepository.save(existingUser);

      const userData = {
        email: 'existing@iku-cabalactiva.com',
        password: 'ValidPass123'
      };

      await expect(useCase.execute(userData)).rejects.toThrow('User with this email already exists');
    });
  });

  describe('Password Hashing', () => {
    it('should use custom password hasher when provided', async () => {
      const customHasher = async (password) => `custom_${password}`;
      const customUseCase = new RegisterUserUseCase(mockRepository, customHasher);

      const userData = {
        email: 'test@iku-cabalactiva.com',
        password: 'ValidPass123'
      };

      await customUseCase.execute(userData);
      const savedUser = await mockRepository.findByEmail('test@iku-cabalactiva.com');
      
      expect(savedUser.passwordHash).toBe('custom_ValidPass123');
    });

    it('should use default hasher when none provided', async () => {
      const defaultUseCase = new RegisterUserUseCase(mockRepository);

      const userData = {
        email: 'test@iku-cabalactiva.com',
        password: 'ValidPass123'
      };

      await defaultUseCase.execute(userData);
      const savedUser = await mockRepository.findByEmail('test@iku-cabalactiva.com');
      
      expect(savedUser.passwordHash).toBeTruthy();
      expect(savedUser.passwordHash).not.toBe('ValidPass123'); // Should be hashed
    });
  });
});

// AÑADIR ESTE NUEVO BLOQUE AL FINAL DEL ARCHIVO
describe('RegisterUserUseCase (Integration)', () => {
  // Esta prueba requiere que el persistence-agent esté corriendo en Docker.
  it('should register a user using the real persistence agent', async () => {
    const realRepo = new GoogleSheetsUserRepository();
    const useCase = new RegisterUserUseCase(realRepo);
    const userEmail = `integration-test-${Date.now()}@iku.com`;

    // 1. Verificar que el usuario no existe
    const existsBefore = await realRepo.existsByEmail(userEmail);
    expect(existsBefore).toBe(false);
    
    // 2. Ejecutar el caso de uso para registrarlo
    await useCase.execute({ email: userEmail, password: 'ValidPass123' });

    // 3. Verificar que el usuario ahora sí existe
    const existsAfter = await realRepo.existsByEmail(userEmail);
    expect(existsAfter).toBe(true);
  });
});