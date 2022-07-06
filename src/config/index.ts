export default {
  mongoDbUrl: process.env.DB_URL || '',
  api: {
    PORT: process.env.PORT || 3000,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
  },
};
