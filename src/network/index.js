// network.js
import axios from 'axios';
import authInterceptor from './interceptor/interceptors';
import config from '../config';
import authNetwork from './auth';
import userNetwork from './user';

const { baseURL } = config();

const httpConfig = {
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

const privateHttp = axios.create(httpConfig);
const publicHttp = axios.create(httpConfig);

const interceptor = authInterceptor(privateHttp);

// Interceptor para solicitudes
privateHttp.interceptors.request.use(
  interceptor.authRequest,
  (error) => Promise.reject(error)
);

// Interceptor para respuestas
privateHttp.interceptors.response.use(
  (response) => response,
  interceptor.tokenResponse
);

const Auth = authNetwork(publicHttp);
const User = userNetwork(privateHttp);

export const { login, register } = Auth;
export const {
  userLogged,
  allUser,
  updateUser,
  deleteUser,
  showUser,
  createUser,
  tokenRefresh,
} = User;

// Crear un objeto de red y exportarlo como predeterminado
const network = {
  login: Auth.login,
  register: Auth.register,
  userLogged: User.userLogged,
  tokenRefresh: User.tokenRefresh,
  allUser: User.allUser,
  updateUser: User.updateUser,
  deleteUser: User.deleteUser,
  showUser: User.showUser,
  createUser: User.createUser,
};

export default network;
