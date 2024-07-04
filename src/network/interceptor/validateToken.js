import store from '../../store';
import { FETCH_AUTH, SET_PROFILE, REFRESH_TOKEN } from '../../store/types';

export const validateToken = async () => {
  try {
    const response = await store.dispatch(FETCH_AUTH);

    if (response.validation) {
      const user = {
        id: response.data.user.id,
        email: response.data.user.email,
        name:response.data.user.name,
        role: response.data.user.role.id,
        refresh_token: response.data.user.refresh_token,
      };

      await store.commit(SET_PROFILE, user);

      return true;
    }

    if (response === 'access expired') {
      const refreshResponse = await store.dispatch(REFRESH_TOKEN);
      const userBody = refreshResponse?.data;

      const user = {
        id: userBody.id,
        email: userBody.email,
        name: userBody.name,
        role: { id: userBody.role.id },
        refresh_token: userBody.refresh_token,
      };

      await store.commit(SET_PROFILE, user);

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};
