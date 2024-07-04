import { userLogged, login, register } from "../../network";
import cookieHandler from "../../utils/helpers/cookie.handler";

import {
  FETCH_AUTH,
  LOG_IN,
  SET_PROFILE,
  GET_LOGGED_USER,
  REGISTER,
  IS_LOGGED_IN,
  SET_LOGGED_IN,
  ISLOGIN,
  LOG_OUT,
  GET_LOGGED_USER_TYPE,
  GET_TYPE_LOGGED,
} from "../types";

const store = {};
const getDefaultState = () => ({
  user: null,
  isLoggedIn: false,
});

store.state = getDefaultState();

store.getters = {
  [GET_LOGGED_USER](state) {
    return state.user;
  },
  [IS_LOGGED_IN]: (state) => state.isLoggedIn,
  [GET_LOGGED_USER_TYPE](state) {
    return state.user?.role_id;
  },
  [GET_TYPE_LOGGED](state) {
    return state?.user?.role_id === 1 ? "Admin" : "User";
  },
};

store.mutations = {
  [SET_PROFILE](state, payload) {
    state.user = payload;
  },
  [SET_LOGGED_IN](state, value) {
    state.isLoggedIn = value;
  },
};

store.actions = {
  [FETCH_AUTH]({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await userLogged();
        const access_token= cookieHandler().getAccessToken();
        const refresh_token= cookieHandler().getRefreshToken();
        commit(SET_PROFILE, response.data.user);
        resolve({
          ...response.data,
          access_token,
          refresh_token
        });
      } catch (error) {
        console.error("Error en FETCH_AUTH:", error);
        reject(error);
      }
    });
  },
  [LOG_IN]({ commit }, payload) {
    return new Promise((resolve, reject) => {
      login(payload).then(
        (resp) => {
          // console.log('ressssssssss',resp.data);
          // commit(SET_PROFILE, resp.data.user);
          cookieHandler().setTokens(resp.data);
          resolve(resp.data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
  [REGISTER]({ commit }, payload) {
    return new Promise((resolve, reject) => {
      register(payload).then(
        (resp) => {
          resolve(resp.data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
  [ISLOGIN]({ commit }) {
    return new Promise((resolve, reject) => {
      const token = cookieHandler().getAccessToken();
      if (token) {
        commit(SET_LOGGED_IN, true);
      } else {
        commit(SET_LOGGED_IN, false);
      }
      resolve(token);
    });
  },
  [LOG_OUT]({ commit }) {
    return new Promise((resolve, reject) => {
      try {
        cookieHandler().removeToken();
        commit(SET_PROFILE, null);
        commit(SET_LOGGED_IN, false);
        resolve(true);
      } catch (error) {
        console.error("Error in LOG_OUT:", error);
        reject(error);
      }
    });
  },
};

export default store;
