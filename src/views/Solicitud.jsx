import "../css/Login.css";
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Select, message, Checkbox, Progress } from 'antd';
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";
import { UserOutlined, LockOutlined, CheckCircleOutlined, PhoneOutlined, IdcardOutlined } from "@ant-design/icons";
import { Subtitulo, Notificacion, Contenido } from "../components/Titulos";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CSPMetaTag } from "../components/CSPMetaTag";
import CryptoJS from 'crypto-js';

const { Option } = Select;

export function Solicitud() {
  const [plantelOptions, setPlantelOptions] = useState([]);
  const [sesionOptions, setSesionOptions] = useState([]);
  const [preguntasSecretasOptions, setPreguntasSecretasOptions] = useState([]);
  const [contrasenaFortaleza, setContrasenaFortaleza] = useState(0);
  const [checked, setChecked] = useState(false);
  const [formValues, setFormValues] = useState({});
  const handleFormValuesChange = (changedValues, allValues) => {
    setFormValues(allValues);
  };


  const obtenerValoresPlantel = async () => {
    try {
      const response = await axios.get("https://012zona.vercel.app/plantel");
      setPlantelOptions(response.data);
    } catch (error) {
      console.error("Error al obtener valores del plantel:", error);
    }
  };
  const obtenerValoresSesion = async () => {
    try {
      const response = await axios.get("/api/sesiones");
      setSesionOptions(response.data);
    } catch (error) {
      console.error("Error al obtener valores de sesiones:", error);
    }
  };

  const obtenerValoresPreguntasSecretas = async () => {
    try {
      const response = await axios.get(
        "https://012zona.vercel.app/preguntas-secretas"
      );
   
      setPreguntasSecretasOptions(response.data);
    } catch (error) {
      console.error("Error al obtener valores de preguntas secretas:", error);
    }
  };

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordsMatchMessage, setPasswordsMatchMessage] = useState("");
  useEffect(() => {
    obtenerValoresPlantel();
  }, []);
  useEffect(() => {
    obtenerValoresSesion();
  }, []);
  useEffect(() => {
    obtenerValoresPreguntasSecretas();
  }, []);


  const onFinish = async (values) => {
    try {
   
      const dataToInsert = {
        curp: values.curp,
        plantel: values.plantel,
        sesion: values.sesion,
        nombre: values.nombre,
        aPaterno: values.aPaterno,
        aMaterno: values.aMaterno,
        correo: values.correo
      };

  
      // Verificar si la CURP ya existe en la base de datos (primera verificación)
      const curpExistsInSoli = await axios.post('https://012zona.vercel.app/verificar-curpSoli', { curp: values.curp });
  
      // Verificar si la CURP ya existe en otra ruta (segunda verificación)
      const curpExists = await axios.post('https://012zona.vercel.app/verificar-curp', { curp: values.curp });
  
      // Verificar si el correo ya existe en la tabla de registros (tercera verificación)
      const correoExists = await axios.post('https://012zona.vercel.app/verificar-correo', { correo: values.correo });
  
      // Verificar si el correo ya existe en la tabla de registrosoli (cuarta verificación)
      const correoExistsInSoli = await axios.post('https://012zona.vercel.app/verificar-correoSoli', { correo: values.correo });
  
      if (curpExistsInSoli.data.exists) {
        // Mostrar mensaje de error si la CURP ya existe en la solicitud
        message.error('La CURP ya está asociada a una solicitud existente.');
      } else if (curpExists.data.exists) {
        // Mostrar mensaje de error si la CURP ya existe en el sistema
        message.error('La CURP ya está registrada en el sistema.');
      } else if (correoExists.data.exists) {
        // Mostrar mensaje de error si el correo ya existe en la base de datos
        message.error('El correo ya está registrado en el sistema.');
      } else if (correoExistsInSoli.data.exists) {
        // Mostrar mensaje de error si el correo ya existe en la tabla registrosoli
        message.error('El correo ya está asociado a una solicitud existente.');
      } else {
        // Todas las verificaciones pasaron, realizar la solicitud al servidor para insertar los datos
        const response = await axios.post('https://012zona.vercel.app/insertar-solicitud', dataToInsert);
        message.success('Solicitud enviada. Se le notificará a través del correo proporcionado sobre la aceptación o rechazo de la misma.');
        navigate('/');
      }
    } catch (error) {
      console.error('Error al insertar datos en la base de datos:', error);
      message.error('Error al mandar la solicitud. Por favor, inténtalo de nuevo.');
    }
  };
  

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error(
      <Contenido conTit={"Por favor, completa todos los campos."} />
    );
  };
  return (
    <>
      <CSPMetaTag />

      <Header />
      <div className="Simon">
        <ScrollToTop />
        <div className="login-box">
          <Subtitulo subTit={"Pre-Registro"} />
          <Form
            name="loginForm"
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onValuesChange={handleFormValuesChange}
          >
            <Contenido conTit={"Curp:"} />
            <Form.Item
              name="curp"
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value || typeof value !== "string") {
                      throw new Error(
                        "Por favor, ingrese su CURP"
                      );
                    }
                    const trimmedValue = value.trim();
                    if (/[a-z]/.test(trimmedValue)) {
                      throw new Error("La CURP solo debe contener mayúsculas");
                    }
                    const uppercasedValue = trimmedValue.toUpperCase();
                    const pattern = /^[A-Z]{4}\d{6}[HM]{1}[A-Z\d]{5}[0-9A-Z]{2}$/;
                    if (uppercasedValue.length !== 18) {
                      throw new Error(
                        "La CURP debe tener 18 letras mayúsculas/números)"
                      );
                    }
                    if (!pattern.test(uppercasedValue)) {
                      throw new Error("La CURP no es válida");
                    }
                    if (value !== trimmedValue) {
                      throw new Error(
                        "La CURP no debe contener espacios al inicio, en medio o al final"
                      );
                    }
                  },
                },
              ]}
            >
              <Input
                prefix={<CheckCircleOutlined />}
                placeholder="Ejemplo: MAPA850210MVERXXA1"
              />
            </Form.Item>

            <Contenido conTit={"Plantel de trabajo:"} />
            <Form.Item
              name="plantel"
              rules={[
                {
                  required: true,
                  message:
                    "Seleccione su plantel de trabajo",
                },
              ]}
            >
              <Select
                placeholder="Ejemplo: Escuela Primaria Bilingüe.... "
                suffixIcon={<IdcardOutlined />}
              >
                {plantelOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Contenido conTit={"Sesión:"} />
            <Form.Item
              name="sesion"
              rules={[
                {
                  required: true,
                  message: (
                    <Notificacion
                      noti={
                        "Seleccione su tipo de sesión"
                      }
                    />
                  ),
                },
              ]}
            >
              <Select
                placeholder="Ejemplo: Maestro"
                suffixIcon={<IdcardOutlined />}
              >
                {sesionOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Contenido conTit={"Nombre(s):"} />
            <Form.Item
              name="nombre"
              rules={[
                {
                  required: true,
                  message: (
                    <Notificacion
                      noti={"Ingrese su nombre(s)"}
                    />
                  ),
                },
                {
                  validator: (_, value) => {
                    const trimmedValue = value && value.trim();
                    if (/^[A-Z]/.test(trimmedValue)) {
                      if (value !== trimmedValue) {
                        return Promise.reject("No se permiten espacios.");
                      }
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "La primera letra debe ser mayúscula."
                    );
                  },
                },
                {
                  pattern: /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]{3,25}$/,
                  message: "Solo letras, longitud entre 3 y 25.",
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Ejemplo: Reyna" />
            </Form.Item>

            <Contenido conTit={"Apellido Paterno:"} />
            <Form.Item
              name="aPaterno"
              rules={[
                {
                  required: true,
                  message: (
                    <Notificacion
                      noti={
                        "Ingrese su apellido paterno"
                      }
                    />
                  ),
                },
                {
                  validator: (_, value) => {
                    const trimmedValue = value && value.trim();
                    if (/^[A-Z]/.test(trimmedValue)) {
                      if (value !== trimmedValue) {
                        return Promise.reject(
                          "No se permiten espacios inicio/final."
                        );
                      }
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "La primera letra debe ser mayúscula."
                    );
                  },
                },
                {
                  pattern: /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]{3,15}$/,
                  message: "Solo letras, longitud entre 3 y 15.",
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Ejemplo: Vite" />
            </Form.Item>

            <Contenido conTit={"Apellido Materno:"} />
            <Form.Item
              name="aMaterno"
              rules={[
                {
                  required: true,
                  message: (
                    <Notificacion
                      noti={
                        "Ingrese su apellido materno"
                      }
                    />
                  ),
                },
                {
                  validator: (_, value) => {
                    const trimmedValue = value && value.trim();
                    if (/^[A-Z]/.test(trimmedValue)) {
                      if (value !== trimmedValue) {
                        return Promise.reject(
                          "No se permiten espacios al inicio/final."
                        );
                      }
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "La primera letra debe ser mayúscula."
                    );
                  },
                },
                {
                  pattern: /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]{3,15}$/,
                  message: "Solo letras, longitud entre 3 y 15.",
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Ejemplo: Vera" />
            </Form.Item>


            <Contenido conTit={"Correo:"} />
            <Form.Item
              name="correo"
              rules={[
                {
                  required: true,
                  message: <Notificacion noti={"Ingrese su correo"} />,
                },
                {
                  pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
                  message: "Ingrese un correo electrónico válido en minúsculas",
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="ejemplo@gmail.com" />
            </Form.Item>



            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={!formValues.curp || !formValues.plantel || !formValues.sesion || !formValues.nombre || !formValues.aPaterno || !formValues.aMaterno || !formValues.correo}>
                Solicitar registro
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Footer />
    </>
  );
}