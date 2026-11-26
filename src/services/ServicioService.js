import axios from 'axios';
import authHeader from './authHeader';

const BASE_URL = 'http://localhost:8080/servicios';

class ServicioService {
  getAllServicios() {
    return axios.get(BASE_URL);
  }

  getServicioById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }

  createServicio(servicio) {
    return axios.post(BASE_URL, servicio, authHeader());
  }

  updateServicio(id, servicio) {
    return axios.put(`${BASE_URL}/${id}`, servicio, authHeader());
  }

  deleteServicio(id) {
    return axios.delete(`${BASE_URL}/${id}`, authHeader());
  }
}

const servicioService = new ServicioService();

export default servicioService;
