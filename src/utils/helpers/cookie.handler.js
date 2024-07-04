import { createApp } from 'vue';
import VueCookies from 'vue-cookies';
import dayjs from 'dayjs';


const app = createApp({});
app.use(VueCookies);

const cookieHandler = () => ({
  setTokens: (payload) => {

    const defaultExpireDate = dayjs().add(5, 'hour').toDate()
    const defaultRefreshExpireDate = dayjs().add(7, 'days').toDate();
    
    const accessTokenExpireDate = payload.expires_at ? dayjs(payload.expires_at).toDate() : defaultExpireDate;
    const refreshTokenExpireDate = payload.refresh_expires_at ? dayjs(payload.refresh_expires_at).toDate() : defaultRefreshExpireDate;
    
    const accessToken = payload.access_token;
    const refreshToken = payload.refresh_token || generateRefreshToken();

    app.config.globalProperties.$cookies.set('accessToken', payload.access_token, accessTokenExpireDate);
    app.config.globalProperties.$cookies.set('refreshToken', payload.refresh_token, refreshTokenExpireDate);
  },
  getAccessToken: () => app.config.globalProperties.$cookies.get('accessToken'),
  getRefreshToken: () => app.config.globalProperties.$cookies.get('refreshToken'),
  removeToken: () => {
    app.config.globalProperties.$cookies.remove('accessToken');
    app.config.globalProperties.$cookies.remove('refreshToken');
  }
});

export default cookieHandler;
