import "../css/Login.css";
import "../css/botones.css";
import { Form, Table, Select, message, Spin, Progress, Button, Input, Modal } from 'antd';
import { ExclamationCircleOutlined, IdcardOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";
import { Subtitulo, Notificacion, Contenido } from "../components/Titulos";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CSPMetaTag } from "../components/CSPMetaTag";
import { Login } from "./Login";

const { Option } = Select;
const { confirm } = Modal;

export function Asignados() {
    const [grupoOptions, setGrupoOptions] = useState([]);
    const [gradoOptions, setGradoOptions] = useState([]);

    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true); // Estado para controlar la carga
    const [plantel, setPlantel] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null); // Estado para almacenar el usuario seleccionado
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad de la ventana emergente
    const [valorPreguntaSecreta, setValorPreguntaSecreta] = useState(""); // Estado para almacenar el valor de la pregunta secreta

    const [borrarModalVisible, setBorrarModalVisible] = useState(false);

    useEffect(() => {
        obtenerRegistros();
        obtenerGrupo();
        obtenerGrado();
    }, []);


    const plantelTextos = {
        1: 'Zona 12',
        2: 'Benito Juárez',
        3: 'Héroe Agustín'
    };

    const sesionTextos = {
        1: 'Supervisor',
        2: 'Director',
        3: 'Maestro'
    };
    const obtenerRegistros = async () => {
        try {
            const response = await axios.get("http://localhost:3000/asignaciong", {
                params: {
                    plantel: plantel 
                }
            });

            console.log("Respuesta del servidor:", response);
            if (response.data.success) {
                setRegistros(response.data.docentes);
                setLoading(false);
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            console.error("Error al obtener registros:", error);
            message.error("Error al obtener registros");
        }
    };


    const obtenerGrado = async () => {
        try {
            const response = await axios.get("http://localhost:3000/grado");
            setGradoOptions(response.data); 
        } catch (error) {
            console.error("Error al obtener valores de grados:", error);
        }
    };


    const obtenerGrupo = async () => {
        try {
            const response = await axios.get("http://localhost:3000/grupo"); 
            setGrupoOptions(response.data);  
        } catch (error) {
            console.error("Error al obtener valores de grupos:", error);
        }
    };

    const handleActualizar = (record) => {
        setSelectedUser(record);
        setModalVisible(true); 
    };

    
    const handleCancel = () => {
        setModalVisible(false); 
    };

    const mostrarModalBorrar = (record) => {
        setSelectedUser(record);
        setBorrarModalVisible(true);
    };
    
    const handleCancelarBorrar = () => {
        setBorrarModalVisible(false);
    };
    

    const actualizarFormSubmit = async (values) => {
        try {
            const response = await axios.post("http://localhost:3000/actualizar_asignacion", {
                docenteId: selectedUser.id, // Usar la CURP del usuario seleccionado
                grupo: values.grupo,
                grado: values.grado
            });
    
            console.log("Respuesta del servidor:", response);
    
            if (response.data.success) {
                message.success("Asignación actualizada correctamente");
                // Actualizar la lista de registros para reflejar los cambios
                obtenerRegistros();
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            console.error("Error al asignar grupo y grado:", error);
            message.error("Error al asignar grupo y grado");
        }
        setModalVisible(false);
    };
    const borrarFormSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:3000/borrar_asignacion", {
                docenteId: selectedUser.id,
            });
    
            console.log("Respuesta del servidor:", response);
    
            if (response.data.success) {
                message.success("Asignación borrada correctamente");
                // Actualizar la lista de registros para reflejar los cambios
                obtenerRegistros();
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            console.error("Error al borrar asignación:", error);
            message.error("Error al borrar asignación");
        }
        setBorrarModalVisible(false);
    };
    
    const columns = [
        {
            title: "CURP",
            dataIndex: "docente_curp",
            key: "docente_curp",
        },
        {
            title: "Plantel",
            dataIndex: "docente_plantel",
            key: "docente_plantel",
            render: (text, record) => (
                <span>
                    {plantelTextos[record.docente_plantel]}
                </span>
            ),
        },
        {
            title: "Nombre",
            dataIndex: "nombre",
            key: "nombre",
        },
        {
            title: "Apellido paterno",
            dataIndex: "aPaterno",
            key: "aPaterno",
        },
        {
            title: "Apellido materno",
            dataIndex: "aMaterno",
            key: "aMaterno",
        },
        {
            title: "Grado",
            dataIndex: "grado_id",
            key: "grado_id",
        },
        {
            title: "Grupo",
            dataIndex: "grupo_id",
            key: "grupo_id",
        },
        {
            title: "Acciones",
            key: "acciones",
            render: (text, record) => (
                <span>
                    <Button className="acciones-button" onClick={() => handleActualizar(record)}>Actualizar</Button>
                    <Button className="acciones-button" onClick={() => mostrarModalBorrar(record)}>Borrar</Button>
                </span>
            ),
        },
        
    ];

    return (
        <>
            <CSPMetaTag />
            <Header />
            <div className="boxAdmin">
                <ScrollToTop />
                <Subtitulo subTit={"Docentes"} />
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <Table dataSource={registros} columns={columns} />
                )}
            </div>
            <Footer />

            {/* Ventana emergente */}
            <Modal
                title="Actualizar asignación"
                visible={modalVisible}
                onCancel={handleCancel}
                footer={null}>
                <p>Docente: {selectedUser && `${selectedUser.nombre} ${selectedUser.aPaterno} ${selectedUser.aMaterno}`}</p>

                {/* Formulario */}
                <Form onFinish={actualizarFormSubmit}>
                    <Contenido conTit={"Grupo"} />
                    <Form.Item
                        name="grupo"
                        rules={[
                            {
                                required: true,
                                message: (
                                    <Notificacion
                                        noti={"Seleccione un grupo"}/>
                                ),
                            },
                        ]}
                    >
                        <Select
                            placeholder="Ejemplo: A"
                            suffixIcon={<IdcardOutlined />}>
                            {grupoOptions.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Contenido conTit={"Grado"}/>
                    <Form.Item
                        name="grado"
                        rules={[
                            {
                                required: true,
                                message: (
                                    <Notificacion
                                        noti={"Seleccione un grado"}/>
                                ),
                            },
                        ]}
                    >
                        <Select
                            placeholder="Ejemplo: 4"
                            suffixIcon={<IdcardOutlined />}>
                            {gradoOptions.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Asignar
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>



              {/* Ventana emergente */}
              <Modal
                title="Borrar asignación"
                visible={borrarModalVisible}
                onCancel={handleCancelarBorrar}
                footer={null}>
                <p>Docente: {selectedUser && `${selectedUser.nombre} ${selectedUser.aPaterno} ${selectedUser.aMaterno}`}</p>

                {/* Formulario */}
                <Form onFinish={borrarFormSubmit}>
                  
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Borrar
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}