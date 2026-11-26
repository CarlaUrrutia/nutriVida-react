export default function authHeader() {
  const sesion = JSON.parse(localStorage.getItem('nutrivida_sesion'));

  if (sesion && sesion.token) {
    return { headers: { Authorization: `Bearer ${sesion.token}` } };
  }

  return {};
}
