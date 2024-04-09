import React, { useEffect } from "react";
import NotFound from "./errores/404";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { Home } from "./views/Home";
import { Terminos } from "./views/Terminos";
import { Quien } from "./views/Quiensoy";
import { Politicas } from "./views/Politicas";
import { Cookies } from "./views/Cookies";
import { Regalu } from "./views/RegAlumnos";
import "./index.css";
import SearchComponent from "./views/Misalumnos";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { Login } from "./views/Login";
import { Salud } from "./views/Salud";
import { Preguntas } from "./views/Preguntas";
import { Escoger } from "./views/Escogerexa";
import { Historial } from "./views/Historial";
import { ModA } from "./views/Modalumnos";
import { ReContraseña } from "./views/ReContraseña";
import { Re2Contraseña } from "./views/Re2Contraseña";
import { Registro } from "./views/Registro";
import { RegistroF } from "./views/RegistroF";
import { Solicitud } from "./views/Solicitud";
import { Mapa } from "./views/Mapa";
import { Logout } from "./components/Logout";
import { AdminRe } from "./views/AdminRe";
import { AdminRe2 } from "./views/AdminRe2";
import { AdminSol } from "./views/AdminSol";
import { AsigGrupo } from "./views/AsigGrupo";
import { Asignados } from "./views/Asignados";
import{SaludDatos} from "./views/SaludDatos";
import{ReSalud} from "./views/ReSalud";

 
// Componente ScrollToTop
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />, //ya
  },
  {
    path: "/Login",
    element: <Login />, //ya
  },
  {
    path: "/Terminos",
    element: <Terminos />, //ya
  },
  {
    path: "/Quien",
    element: <Quien />, //ya
  },
  {
    path: "/Politicas",
    element: <Politicas />, //ya
  },
  {
    path: "/Cookies",
    element: <Cookies />, //ya
  },
  {
    path: "/RegA",
    element: <Regalu />, //ya
  },
  {
    path: "/MiLista",
    element: <SearchComponent />, //ya
  },
  {
    path: "/Salud",
    element: <Salud />, //falta
  },
  {
    path: "/Preguntas",
    element: <Preguntas />, //falta
  },
  {
    path: "/esExamen",
    element: <Escoger />, //falta
  },
  {
    path: "/Historial",
    element: <Historial />, //falta
  },
  {
    path: "/modal",
    element: <ModA />, //falta
  },
  {
    path: "*",
    element: <NotFound />, //falta
  },
  {
    path: "/ReContraseña",
    element: <ReContraseña />, //falta
  },
  {
    path: "/Re2Contraseña",
    element: <Re2Contraseña />, //falta
  },
  {
    path: "/Solicitud",
    element: <Solicitud />, //falta
  },
  {
    path: "/Mapa",
    element: <Mapa />, //falta
  },
  {
    path: "/Logout",
    element: <Logout />,
  },
  {
    path: "/AdminRe",
    element: <AdminRe />, //falta
  },
  {
    path: "/AdminRe2",
    element: <AdminRe2 />, //falta
  },
  {
    path: "/AdminSol",
    element: <AdminSol />, //falta
  },
  {
    path: "/RegistroF",
    element: <RegistroF />, //falta
  },
  {
    path: "/Inicio",
    element: <Home />, //ya
  },
  {
    path: "/AsigGrupo",
    element: <AsigGrupo />,
  }, 
  {
    path: "/Asignados",
    element: <Asignados />,
  },
  {
    path: "/SaludDatos",
    element: <SaludDatos/>
  }
  ,
  {
    path: "/ReSalud",
    element: <ReSalud/>
  }

   
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <RouterProvider router={router}>
      <ScrollToTop />
    </RouterProvider>
  </>
);
