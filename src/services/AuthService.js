import axios from 'axios';

const BASE_URL = 'http://localhost:8080/auth';

class AuthService {
  login(username, password) {
    return axios.post(`${BASE_URL}/login`, { username, password }).then((response) => response.data);
  }
}

const authService = new AuthService();

export default authService;
