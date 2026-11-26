import api from './api';
import authHeader from './authHeader';

class ClienteService {
  getAllClientes() {
    return api.get('/clientes', authHeader());
  }

  getClienteById(id) {
    return api.get(`/clientes/${id}`, authHeader());
  }

  createCliente(cliente) {
    return api.post('/clientes', cliente, authHeader());
  }

  updateCliente(id, cliente) {
    return api.put(`/clientes/${id}`, cliente, authHeader());
  }

  deleteCliente(id) {
    return api.delete(`/clientes/${id}`, authHeader());
  }
}

const clienteService = new ClienteService();

export default clienteService;
