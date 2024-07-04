import router from '../../route';
import {
  TOKEN_VALIDATION,
  REFRESH_TOKEN,
  FETCH_AUTH,
} from '../../store/types';
import store from '../../store';
import cookieHandler from '../../utils/helpers/cookie.handler';

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.map((cb) => cb(token));
}

function addRefreshSubscriber(cb) {
  refreshSubscribers.push(cb);
}

const authorization = (http) => ({
  // Interceptor para solicitudes
  authRequest: (request) => {
    const accessToken = cookieHandler().getAccessToken();
    if (accessToken) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }
    return request;
  },

  // Interceptor para respuestas
  tokenResponse: async (error) => {
    const { config, response } = error;
    if (response?.status === 401 && !config._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        config._retry = true;
        try {
          const refreshToken = cookieHandler().getRefreshToken();
          const refreshResponse = await store.dispatch(REFRESH_TOKEN, refreshToken);
          console.log('eentraa');
          console.log('refresssh', refreshResponse);

          
          isRefreshing = false;
          cookieHandler().setAccessToken(access_token);
          onRefreshed(access_token);
          refreshSubscribers = [];
          config.headers.Authorization = `Bearer ${access_token}`;
          return http(config);
        } catch (e) {
          isRefreshing = false;
          router.push({ name: 'Login' });
          return Promise.reject(error);
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((token) => {
          config.headers.Authorization = `Bearer ${token}`;
          resolve(http(config));
        });
      });
    }

    return Promise.reject(error);
  },
});

export default authorization;
