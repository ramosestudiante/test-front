import { createApp } from "vue";
import VueCookies from "vue-cookies";
import dayjs from "dayjs";

const app = createApp({});
app.use(VueCookies);

const cookieHandler = () => ({
  setTokens: (payload) => {
    const accessTokenExpire = dayjs().add(2, "day").toDate();
    const refreshTokenExpire = dayjs().add(10, "days").toDate();

    VueCookies.set("accessToken", payload.access_token, accessTokenExpire);
    VueCookies.set("refreshToken", payload.refresh_token, refreshTokenExpire);
  },
  getAccessToken: () => VueCookies.get("accessToken"),
  getRefreshToken: () => VueCookies.get("refreshToken"),
  removeToken: () => {
    VueCookies.remove("accessToken");
    VueCookies.remove("refreshToken");
  },
});

export default cookieHandler;
