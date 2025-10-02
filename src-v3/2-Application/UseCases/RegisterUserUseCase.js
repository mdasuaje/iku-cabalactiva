// src-v3/2-Application/UseCases/RegisterUserUseCase.js
import { User } from '../../1-Domain/Entities/User.js';

/**
 * Register User Use Case
 * Orchestrates the business logic for user registration
 * Following Clean Architecture principles
 */
class RegisterUserUseCase {
  constructor(userRepository, passwordHasher = null) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher || this._defaultPasswordHasher;
  }

  /**
   * Register a new user in the system
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's plain text password
   * @returns {Promise<Object>} Registration result with user data (no password)
   * @throws {Error} If registration fails
   */
  async execute({ email, password }) {
    // Input validation
    this._validateInput({ email, password });

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const passwordHash = await this.passwordHasher(password);

    // Create user entity
    const user = new User({ email, passwordHash });

    // Save user to repository
    const savedUser = await this.userRepository.save(user);

    // Return safe user data (no password hash)
    return {
      success: true,
      user: savedUser.toJSON(),
      message: 'User registered successfully'
    };
  }

  /**
   * Validate input data
   * @private
   */
  _validateInput({ email, password }) {
    if (!email || typeof email !== 'string') {
      throw new Error('Email is required and must be a string');
    }

    if (!password || typeof password !== 'string') {
      throw new Error('Password is required and must be a string');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      throw new Error('Password must contain at least one lowercase letter, one uppercase letter, and one number');
    }
  }

  /**
   * Default password hasher (simple implementation for testing)
   * In production, use bcrypt or similar
   * @private
   */
  async _defaultPasswordHasher(password) {
    // Simple hash for testing - DO NOT use in production
    const crypto = await import('crypto');
    return crypto.createHash('sha256').update(password + 'salt').digest('hex');
  }
}

export { RegisterUserUseCase };