function Seccion({ id, titulo, className, children }) {
  return (
    <section id={id} className={className || "seccion"}>
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}

export default Seccion;
