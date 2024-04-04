import axios from 'axios';

const API_URL = 'http://localhost:8080';

class AuthService {

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('Authorization');
    window.location.href = '/login';
    return axios.post(API_URL + '/logout');
  }

  async register(firstName, lastName, email, password) {
    const response = await axios.post( '/registration', {
      firstName,
      lastName,
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  async registerFromGoogle(googleData) {
    const { email, googleId: password, familyName: firstName, givenName: lastName } = googleData.profileObj;
    const response = await axios.post('/registration', {
      firstName,
      lastName,
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }
}

export default new AuthService();
