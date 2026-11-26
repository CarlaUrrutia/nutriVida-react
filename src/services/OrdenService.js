import api from './api';
import authHeader from './authHeader';

class OrdenService {
  crearOrden(items) {
    return api.post('/ordenes', { items }, authHeader()).then((r) => r.data);
  }

  misOrdenes() {
    return api.get('/ordenes/mias', authHeader()).then((r) => r.data);
  }
}

const ordenService = new OrdenService();

export default ordenService;
