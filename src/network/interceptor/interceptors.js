import axios from 'axios';
import cookieHandler from '../../utils/helpers/cookie.handler';
import eventBus from '../../utils/helpers/eventBus';
import router from '../../route';
import { REFRESH_TOKEN } from '../../store/types';
import store from '../../store'

const authorization = (http) => ({
  authRequest: (request) => {
    const accessToken = cookieHandler().getAccessToken();
    if (accessToken) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }
    return request;
  },

  tokenResponse: async (error) => {
    const { config, response } = error;

    const { getRefreshToken,getAccessToken, setTokens } = cookieHandler();
    if (response.status === 401) {

      if (!window.refreshing) {
        const refreshToken = getRefreshToken();
        window.refreshing = true;
        try {
          const refresh = await store.dispatch(REFRESH_TOKEN, refreshToken);
          if (refresh && (refresh.status === 201 || refresh.status == 200)) {
            setTokens(refresh.data);
            axios.defaults.headers.common['Authorization'] = `Bearer ${refresh.data.access_token}`;
            window.refreshing = false;
            window.logout = false;
            eventBus.dispatch('refreshed');
            return http(config);
          }
          throw new Error('unauthorized');
        } catch (e) {
          router.push({name:'Login'})
          window.refreshing = false;
          window.logout = true;
          return Promise.reject(error);
        }
      }

      return new Promise((resolve) => {
        eventBus.addEventListener('refreshed', () => {
          eventBus.remove('refreshed');
          resolve(http(config));
        });
      });
    }
    return Promise.reject(error);
  }
});

export default authorization;
