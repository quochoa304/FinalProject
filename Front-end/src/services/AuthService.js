import axios from 'axios';

const API_URL = 'http://localhost:8080';

class AuthService {
  login(email, password) {
    return axios.post(API_URL + '/login', { email, password });
  }
  logout() {
    return axios.post(API_URL + '/logout');
  }
  

  register(firstName, lastName, email, password) {
    return axios.post(API_URL + '/registration', {
      firstName,
      lastName,
      email,
      password
    });
  }

  async checkEmailExists(email) {
    try {
      const response = await axios.get(API_URL + `/user/check-email?email=${email}`);
      return response.data.exists;
    } catch (error) {
      throw error.response.data || 'An unknown error occurred';
    }
  }


  async registerFromGoogle(googleData) {
    const { email } = googleData.profileObj;
    const { familyName, givenName } = googleData.profileObj;


        const response = await axios.post(API_URL + '/registration', {
            firstName: familyName,
            lastName: givenName,
            email,
            password: googleData.profileObj.googleId,
        });
        return response.data;
    
}

  
}

export default new AuthService();
