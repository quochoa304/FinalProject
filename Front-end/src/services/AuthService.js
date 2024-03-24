import axios from 'axios';

const API_URL = 'http://localhost:8080';

class AuthService {
  login(email, password) {
    return axios.post(API_URL + '/login', { email, password });
  }

  register(firstName, lastName, email, password) {
    return axios.post(API_URL + '/registration', {
      firstName,
      lastName,
      email,
      password
    });
  }
}

export default new AuthService();
