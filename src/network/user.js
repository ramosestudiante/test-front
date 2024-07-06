import config from "../config";

const appConfig = config();

const apiUrl = appConfig.baseURL;

const network = (client) => ({
  userLogged: () => client.get(`${apiUrl}/api/validatetoken`),
  tokenRefresh:(payload)=>client.post(`${apiUrl}/api/refresh`,null,{
    headers: {
      'Authorization': `Bearer ${payload}`,
    },
  }),
  allUser: (page, per_page, search) =>
    client.get(`${apiUrl}/api/users`, {
      params: {
        page: page || undefined,
        per_page: per_page || undefined,
        search: search|| undefined,
      },
    }),
  deleteUser: (id) => client.delete(`${apiUrl}/api/users/${id}`),
  updateUser: (id, payload) =>
    client.patch(`${apiUrl}/api/users/${id}`, payload),
  createUser: (payload) => client.post(`${apiUrl}/api/users`, payload),
  showUser: (id) => client.get(`${apiUrl}/api/users/${id}`),
});

export default network;
