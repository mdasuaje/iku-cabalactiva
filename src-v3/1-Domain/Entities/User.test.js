// src-v3/1-Domain/Entities/User.test.js
import { User } from './User';

describe('User Entity', () => {
  it('should create a user with a valid email and hashed password', () => {
    const userData = { email: 'test@iku-cabalactiva.com', passwordHash: 'hashed_password' };
    const user = new User(userData);
    expect(user.email).toBe(userData.email);
    expect(user.isValid()).toBe(true);
  });

  it('should fail to create a user with an invalid email', () => {
    const userData = { email: 'invalid-email', passwordHash: 'hashed_password' };
    const user = new User(userData);
    expect(user.isValid()).toBe(false);
  });
});