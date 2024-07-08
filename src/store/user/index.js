import {
  allUser,
  updateUser,
  deleteUser,
  showUser,
  createUser,
  userLogged,
  tokenRefresh
} from "../../network";

import {
  FETCH_USERS,
  SET_USERS,
  GET_USERS,
  UPDATE_USER,
  DELETE_USER,
  GET_USER,
  SET_USER,
  SHOW_USER,
  CREATE_USER,
  TOKEN_VALIDATION,
  REFRESH_TOKEN,
  GET_USER_TOKEN_EXP
} from "./types";

const store = {};
const getDefaultState = () => ({
  users: [],
  page: null,
  per_page: null,
  user: {},
});

store.state = getDefaultState();

store.getters = {
  [GET_USERS]: (state) => state.users,
  [GET_USER]: (state) => state.user,
  [GET_USER_TOKEN_EXP](state){
    return state.user.refresh_token;
  },
};

store.mutations = {
  [SET_USERS](state, payload) {
    state.users = payload;
  },
  [SET_USER](state, payload) {
    state.user = payload;
  },
};

store.actions = {
  [FETCH_USERS]({ commit }, { page, per_page, search }) {
    return new Promise((resolve, reject) => {
      allUser(page, per_page, search).then(
        (resp) => {
          commit(SET_USERS, resp.data.users);
          resolve(resp.data.users);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
  [UPDATE_USER]({ commit }, { id, payload }) {
    return new Promise((resolve, reject) => {
      updateUser(id, payload).then(
        (resp) => {
          resolve(resp.data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
  [DELETE_USER]({ commit }, { id }) {
    return new Promise((resolve, reject) => {
      deleteUser(id).then(
        (resp) => {
          resolve(resp.data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
  [SHOW_USER]({ commit }, id) {
    return new Promise((resolve, reject) => {
      showUser(id).then(
        (resp) => {
          commit(SET_USER, resp.data.user);
          resolve(resp.data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
  [CREATE_USER]({ commit }, { payload }) {
    return new Promise((resolve, reject) => {
      createUser(payload).then(
        (resp) => {
          resolve(resp.data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
  [TOKEN_VALIDATION](){
    return new Promise((resolve,reject)=>{
      userLogged()
        .then((resp)=>{
          resolve(resp.data);
        })
        .catch((err)=>{
          reject(err);
        });
    });
  },
  [REFRESH_TOKEN]({_},payload ){
    return new Promise((resolve, reject) => {
      tokenRefresh(payload)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default store;
