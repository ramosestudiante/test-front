import config from "../config";

const appConfig = config();

const apiUrl = appConfig.baseURL;

const network = (client) => ({
  login: (payload) => client.post(`${apiUrl}/api/login`, payload),
  register: (payload) => client.post(`${apiUrl}/api/register`, payload),
});

export default network;
