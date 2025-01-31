export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://e-com-back-phi.vercel.app/api'
  : 'http://localhost:5000/api';

export const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://e-com-back-phi.vercel.app'
  : 'http://localhost:5000'; 