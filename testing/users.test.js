process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app'); 
const { sequelize } = require('../config/database');
const User = require('../models/user'); 

jest.mock('../models/user', () => {
  return {
    create: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn()
  };
});

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe('User Registration', () => {
  test('should register a new user and redirect', async () => {
    User.create.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashedpassword',
    });

    User.findByPk.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    });

    const response = await request(app)
      .post('/register')
      .send({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      })
      .expect(302);

    expect(response.header.location).toBe('/gyms');
    expect(User.create).toHaveBeenCalledTimes(1);
    expect(User.create).toHaveBeenCalledWith({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',  
    });
  });
});

describe('Render Register Page', () => {
  test('should render the registration page', async () => {
    const response = await request(app)
      .get('/register')
      .expect(200);

    expect(response.text).toContain('Register');
  });
});

describe('Render Login Page', () => {
  test('should render the login page', async () => {
    const response = await request(app)
      .get('/login')
      .expect(200);

    expect(response.text).toContain('Login');
  });
});

describe('Render Login Page', () => {
  test('should render the login page', async () => {
    const response = await request(app)
      .get('/login')
      .expect(200);

    expect(response.text).toContain('Login');
  });
});

describe('User Login', () => {
  test('should log in a user and redirect to /gyms', async () => {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 10);

    User.findOne.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      password: hashedPassword,
    });

    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(302);

    expect(response.header.location).toBe('/gyms');
  });

  test('should fail to log in with invalid credentials and redirect to /login', async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post('/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      })
      .expect(302);

    expect(response.header.location).toBe('/login');
  });
});

describe('User Logout', () => {
  test('should log out a user and redirect to /gyms', async () => {
    const response = await request(app)
      .get('/logout')
      .expect(302);

    expect(response.header.location).toBe('/gyms');
  });
});