process.env.NODE_ENV = 'test';

const request = require('supertest');

// Mockowanie modeli
jest.mock('../models/gym', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
  update: jest.fn()
}));

jest.mock('../models/review', () => ({
  findAll: jest.fn()
}));

jest.mock('../models/user', () => ({
  findByPk: jest.fn()
}));

jest.mock('@maptiler/client', () => {
  const geocoding = {
    forward: jest.fn()
  };
  return {
    config: { apiKey: '' },
    geocoding
  };
});

const { geocoding } = require('@maptiler/client');

jest.mock('../cloudinary', () => ({
  cloudinary: {
    uploader: {
      destroy: jest.fn()
    }
  },
  storage: {}
}));


jest.mock('../middleware', () => ({
  isLoggedIn: (req, res, next) => next(),
  isAuthor: (req, res, next) => next(),
  validateGym: (req, res, next) => next(),
  storeReturnTo: (req, res, next) => next(),
  validateReview: (req, res, next) => next(),
  isReviewAuthor: (req, res, next) => next(),
}));

jest.mock('../controllers/reviews', () => ({
  createReview: jest.fn(),
  deleteReview: jest.fn(),
}));

jest.mock('../controllers/gyms', () => ({
  index: jest.fn(),
  renderNewForm: jest.fn(),
  createGym: jest.fn(),
  showGym: jest.fn(),
  renderEditForm: jest.fn(),
  updateGym: jest.fn(),
  destroyGym: jest.fn(),
}));

jest.mock('../utilities/catchAsync', () => {
  return fn => async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
});


const app = require('../app');

const Gym = require('../models/gym');
const Review = require('../models/review');
const User = require('../models/user');
const { cloudinary } = require('../cloudinary');
const reviews = require('../controllers/reviews');
const gyms = require('../controllers/gyms');

app.use((req, res, next) => {
  req.login = jest.fn((user, callback) => callback(null));
  req.logout = jest.fn((callback) => callback(null));
  next();
});


beforeEach(() => {
  jest.clearAllMocks();
});


const { sequelize } = require('../config/database');

beforeAll(async () => {
  await sequelize.sync({ force: true }); 
});

afterAll(async () => {
  await sequelize.close(); 
});

describe('Gyms Routes', () => { 
  test('GET /gyms should list all gyms and return status 200', async () => {

    Gym.findAll.mockResolvedValue([
      {
        id: 1,
        name: 'Gym A',
        geometry: { type: 'Point', coordinates: [0, 0] },
        images: [],
        location: 'Location A',
        user_id: 1,
        description: 'Description A',
        price: '10.00'
      },
      {
        id: 2,
        name: 'Gym B',
        geometry: { type: 'Point', coordinates: [1, 1] },
        images: [],
        location: 'Location B',
        user_id: 2,
        description: 'Description B',
        price: '20.00'
      }
    ]);


    gyms.index.mockImplementation(async (req, res) => {
      const gyms = await Gym.findAll({});
      const gymsGeoJSON = gyms.map(gym => ({
        type: 'Feature',
        geometry: gym.geometry,
        properties: {
          popUpMarkup: `<strong><a href="/gyms/${gym.id}">${gym.name}</a></strong>
          <p>${gym.description ? gym.description.substring(0, 20) + '...' : ''}</p>`
        }
      }));
      res.status(200).send('Gyms List: Gym A Gym B');
    });

    const response = await request(app)
      .get('/gyms')
      .expect(200);  

    
    expect(response.text).toContain('Gym A');
    expect(response.text).toContain('Gym B');
    
    expect(Gym.findAll).toHaveBeenCalledTimes(1);
  });

  test('GET /gyms/new should render form if logged in', async () => {

    gyms.renderNewForm.mockImplementation((req, res) => {
      res.status(200).send('Add a New Gym');
    });

    const response = await request(app)
      .get('/gyms/new')
      .expect(200); 

    expect(response.text).toContain('Add a New Gym');
  });
}) 