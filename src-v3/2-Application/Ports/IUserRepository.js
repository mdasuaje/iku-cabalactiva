// src-v3/2-Application/Ports/IUserRepository.js
/**
 * User Repository Interface
 * Defines the contract for user persistence operations
 * Following the Dependency Inversion Principle of Clean Architecture
 */
class IUserRepository {
  /**
   * Save a new user to the persistence layer
   * @param {User} user - The user entity to save
   * @returns {Promise<User>} The saved user with generated ID
   * @throws {Error} If user already exists or validation fails
   */
  async save(user) {
    throw new Error('Method not implemented');
  }

  /**
   * Find a user by email address
   * @param {string} email - The email to search for
   * @returns {Promise<User|null>} The user if found, null otherwise
   */
  async findByEmail(email) {
    throw new Error('Method not implemented');
  }

  /**
   * Find a user by their unique ID
   * @param {string} id - The user ID to search for
   * @returns {Promise<User|null>} The user if found, null otherwise
   */
  async findById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Check if a user with the given email exists
   * @param {string} email - The email to check
   * @returns {Promise<boolean>} True if user exists, false otherwise
   */
  async existsByEmail(email) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete a user by their ID
   * @param {string} id - The user ID to delete
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async deleteById(id) {
    throw new Error('Method not implemented');
  }
}

export { IUserRepository };