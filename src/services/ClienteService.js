import axios from 'axios';
import authHeader from './authHeader';

const BASE_URL = 'http://localhost:8080/clientes';

class ClienteService {
  getAllClientes() {
    return axios.get(BASE_URL, authHeader());
  }

  getClienteById(id) {
    return axios.get(`${BASE_URL}/${id}`, authHeader());
  }

  createCliente(cliente) {
    return axios.post(BASE_URL, cliente, authHeader());
  }

  updateCliente(id, cliente) {
    return axios.put(`${BASE_URL}/${id}`, cliente, authHeader());
  }

  deleteCliente(id) {
    return axios.delete(`${BASE_URL}/${id}`, authHeader());
  }
}

const clienteService = new ClienteService();

export default clienteService;
