export const routesByRole = {
  "guest": [
    { name: "PreRegistro", path: "/Solicitud" },
    { name: "Registro", path: "/RegistroF" },
    { name: "Login", path: "/Login" },
    { name: "¿Quiénes somos?", path: "/Quien" }

  ],
  "1": [
    { name: "Inicio", path: "/" },
    { name: "Usuarios", path: "/AdminRe" },
    { name: "Historial", path: "/AdminRe2" },
    { name: "Solicitudes", path: "/AdminSol" },
    { name: "Preguntas", path: "/Preguntas" },
    { name: "Mapa", path: "/Mapa" },
    { name:"Salir", path:"/Logout"}

  ],
  "2": [
    { name: "Inicio", path: "/" },
    {
      name: "Alumnos",
      submenu: [
        { name: "Registrar", path: "/RegA" },
        { name: "Mis alumnos", path: "/MiLista" },
        { name: "Modificar mi lista", path: "/modal" },
      ],
    },
    {
      name: "Salud",
      submenu: [
        { name: "Registro", path: "/RegA" },
        { name: "Actualización", path: "/MiLista" },
        { name: "Descarga de reporte", path: "/modal" },
      ],
    },

    {
      name: "Examen",
      submenu: [
        { name: "Registro", path: "/RegA" },
        { name: "Actualización", path: "/MiLista" },
        { name: "Descarga de reporte", path: "/modal" },
      ],
    },
    { name: "¿Quiénes somos?", path: "/Quien" },
    { name: "Preguntas", path: "/Preguntas" },
    { name: "Mapa", path: "/Mapa" },
    { name:"Salir", path:"/Logout"}

  ],
  "3": [
    { name: "Inicio", path: "/" },
    {
      name: "Salud",
      submenu: [
        { name: "Registro", path: "/RegA" },
        { name: "Actualización", path: "/MiLista" },
        { name: "Descarga de reporte", path: "/modal" },
      ],
    },
    {
      name: "Docentes",
      submenu: [
        { name: "Asignar", path: "/AsigGrupo" }, 
        { name: "Actualizar/borrar", path: "/Asignados" }, 
      ],
    },
    { name: "¿Quiénes somos?", path: "/Quien" },
    { name:"Salir", path:"/Logout"}
  ],
};