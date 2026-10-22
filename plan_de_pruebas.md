# Plan de Pruebas — NutriVida

Pruebas unitarias del formulario de **Registro** (`src/views/Registro.jsx`), hechas con **Vitest** + **React Testing Library**, siguiendo el patrón **AAA (Arrange – Act – Assert)** visto en clase.

Se concentran en Registro porque es el componente con más reglas de validación del proyecto, lo que permite cubrir el mínimo de 10 pruebas con casos reales y no artificiales.

## Cómo correrlas

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npm run test
```

`npm run test` deja Vitest corriendo en modo observación (vuelve a correr las pruebas solo con guardar un archivo). Para cortarlo, `Ctrl + C` en la terminal.

## Casos cubiertos

| # | Caso | Qué se prueba | Resultado esperado |
|---|------|----------------|---------------------|
| 1 | Renderizado | El formulario muestra todos sus campos y el botón "Registrarse" | Todos los campos están presentes en el DOM |
| 2 | Nombre vacío | Enviar el formulario sin nombre | Alerta "El nombre esta vacio!" |
| 3 | Nombre inválido | Nombre con números o símbolos (`Juan123`) | Alerta "El nombre solo debe contener letras" |
| 4 | Apellido vacío | Enviar el formulario sin apellido | Alerta "El apellido está vacio!" |
| 5 | RUT inválido | RUT con puntos (`12.345.678-9`) en vez del formato pedido | Alerta de formato de RUT |
| 6 | Correo no permitido | Correo de un dominio fuera de la lista (`@yahoo.com`) | Alerta de correo inválido |
| 7 | Contraseña corta | Contraseña de menos de 6 caracteres | Alerta de longitud mínima |
| 8 | Contraseñas distintas | Contraseña y confirmación no coinciden | Alerta "Las contraseñas no coinciden" |
| 9 | Menor de edad | Fecha de nacimiento de una persona de menos de 18 años | Alerta de edad mínima |
| 10 | Objetivo no seleccionado | Enviar el formulario sin elegir un objetivo nutricional | Alerta pidiendo seleccionar un objetivo |
| 11 | Registro exitoso | Todos los campos válidos | Se muestra "Registro exitoso!" |

## Resultado

_(Completar después de correr `npm run test`: cuántas pruebas pasaron, y pegar o adjuntar una captura del resultado por consola.)_
