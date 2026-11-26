import axios from 'axios';
import authHeader from './authHeader';

const BASE_URL = 'http://localhost:8080/profesionales';

class ProfesionalService {
  getAllProfesionales() {
    return axios.get(BASE_URL, authHeader());
  }

  getProfesionalById(id) {
    return axios.get(`${BASE_URL}/${id}`, authHeader());
  }

  createProfesional(profesional) {
    return axios.post(BASE_URL, profesional, authHeader());
  }

  updateProfesional(id, profesional) {
    return axios.put(`${BASE_URL}/${id}`, profesional, authHeader());
  }

  deleteProfesional(id) {
    return axios.delete(`${BASE_URL}/${id}`, authHeader());
  }
}

const profesionalService = new ProfesionalService();

export default profesionalService;
