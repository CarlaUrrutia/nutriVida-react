import api from './api';

class AuthService {
  login(username, password) {
    return api.post('/auth/login', { username, password }).then((r) => r.data);
  }

  registro(data) {
    return api.post('/auth/registro', data).then((r) => r.data);
  }
}

const authService = new AuthService();

export default authService;
