import "../css/Login.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link } from "react-router-dom";
import { ScrollToTop } from "../components/ScrollToTop"; 
import { Form, Input, Button, Select, message, notification } from "antd";
import { CheckCircleOutlined, LockOutlined, IdcardOutlined } from "@ant-design/icons";
import { Subtitulo, Contenido } from "../components/Titulos";
import ReCAPTCHA from "react-google-recaptcha";
import { CSPMetaTag } from "../components/CSPMetaTag";
const { Option } = Select;
 
export function Login() {

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({});
  const [buttonBlocked, setButtonBlocked] = useState(false);

  // Función para manejar cambios en los valores del formulario
  const handleFormValuesChange = (changedValues, allValues) => {
    setFormValues(allValues);
  };

  const [userRole, setUserRole] = useState(null);
  const onChange = () => {
    console.log("Recapcha");
  };

  const navigate = useNavigate();
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

 
  const onFinish = async (values) => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        curp: values.curp,
        contrasena: values.contrasena,
      });
  
      if (response.data.success) {
        console.log("Inicio de sesión exitoso");
        message.success("Inicio de sesión exitoso");
        localStorage.setItem("userRole", response.data.role);
        const userRole = response.data.role;
        setUserRole(userRole);
  
        // Redirigir a la ruta correspondiente según el rol
        if (userRole === 1) {
          navigate("/");
        } else if (userRole === 2) {
          navigate("/");
        } else if (userRole === 3) {
          navigate("/");
        } else {
          navigate("/"); 
        }
      }  else {
        // Inicio de sesión fallido
        message.error(response.data.message || "Credenciales incorrectas");
        const updatedFailedAttempts = failedAttempts + 1;
        setFailedAttempts(updatedFailedAttempts);
  
        // Si hay 3 intentos fallidos, actualizar estado_cuenta a 2
        if (updatedFailedAttempts === 3) {
          try {
            message.error("Cuenta bloqueada.");
            await axios.post("http://localhost:3000/updateEstadoCuenta", {
              curp: values.curp,
            });
            setButtonBlocked(true); // Bloquear el botón
          } catch (error) {
            console.error("Error al actualizar estado_cuenta:", error);
          }
        }
      }
      
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      message.error("Inicio de sesión fallido: Usuario no encontrado.");
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Por favor, completa todos los campos.");
  };
  return (
    <>
      <CSPMetaTag />
      <Header />
      <div className="Simon">
        <ScrollToTop />
        <div className="login-box">
          <Subtitulo subTit={"Inicio de sesión"} />
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
                      throw new Error("Ingrese su CURP");
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

            <Contenido conTit={"Contraseña:"} />
            <Form.Item
              name="contrasena"
              rules={[
                {
                  required: true,
                  message: "Ingrese su contraseña",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Ingrese su contraseña"
              />
            </Form.Item>

            <Link to="/ReContraseña">
              <Contenido conTit={"¿Olvidó su contraseña?"} />{" "}
            </Link>

            <Form.Item
              name="recaptcha"
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value) {
                      throw new Error("Por favor, completa el reCAPTCHA");
                    }
                  },
                },
              ]}
            >
              <ReCAPTCHA
                //sitekey="6LdZ4IMpAAAAADeX3M_zwV4kduNHhAhd7Ad6xUEx" EN LINEA
                sitekey="6Ld3nIspAAAAAAYW8viw6xH-drNf_a0sgXm6WhYI"
                onChange={onChange}/>
            </Form.Item>

            {messageText && (
              <p style={{ color: "red", textAlign: "center" }}>{messageText}</p>
            )}
 
{buttonBlocked && (
  <div style={{ color: 'red', marginTop: '10px' }}>
    Su cuenta ha sido bloqueada. Revise su correo para instrucciones de recuperación.
  </div>
)}

<Form.Item>
  <Button type="primary" htmlType="submit" disabled={!formValues.curp || !formValues.contrasena || !formValues.recaptcha || buttonBlocked}>
    Ingresar
  </Button>
</Form.Item>

          </Form>
        </div>
      </div>
      <Footer />
    </>
  );
}