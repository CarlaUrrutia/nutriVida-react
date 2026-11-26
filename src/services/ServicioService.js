import api from './api';
import authHeader from './authHeader';

class ServicioService {
  getAllServicios() {
    return api.get('/servicios');
  }

  getServicioById(id) {
    return api.get(`/servicios/${id}`);
  }

  createServicio(servicio) {
    return api.post('/servicios', servicio, authHeader());
  }

  updateServicio(id, servicio) {
    return api.put(`/servicios/${id}`, servicio, authHeader());
  }

  deleteServicio(id) {
    return api.delete(`/servicios/${id}`, authHeader());
  }
}

const servicioService = new ServicioService();

export default servicioService;
