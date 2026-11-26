import api from './api';
import authHeader from './authHeader';

class ProfesionalService {
  getAllProfesionales() {
    return api.get('/profesionales', authHeader());
  }

  getProfesionalById(id) {
    return api.get(`/profesionales/${id}`, authHeader());
  }

  createProfesional(profesional) {
    return api.post('/profesionales', profesional, authHeader());
  }

  updateProfesional(id, profesional) {
    return api.put(`/profesionales/${id}`, profesional, authHeader());
  }

  deleteProfesional(id) {
    return api.delete(`/profesionales/${id}`, authHeader());
  }
}

const profesionalService = new ProfesionalService();

export default profesionalService;
