import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Presentacion } from "../components/Presntacion";
import { UserOutlined, LockOutlined, CheckCircleOutlined, PhoneOutlined, IdcardOutlined } from "@ant-design/icons";
import { Space, Table, Spin, Tag, Button, Select, Affix, message, Modal, Alert, Form, Input, Row, Col } from "antd";
import axios from "axios";
import icono from "../img/salud.png";
import { Subtitulo, Titulo } from "../components/Titulos";

export function Salud() {
  const [categotriOptions, setcategotriOptions] = useState([]);
  const [categoValtriOptions, setcategoValtriOptions] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [idAlumnos, setIdAlumnos] = useState("");
  const [error, setError] = useState("");
  const [errorval, setErrorval] = useState("");
  const [catego, setCatego] = useState("");
  const [categoval, setCategoval] = useState(""); 
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState("");
  const [valorIdSeleccionado, setValorIdSeleccionado] = useState('');
  const [showCheckSelect, setShowCheckSelect] = useState(false); 
  const [opcionesCheck, setOpcionesCheck] = useState([]); 
  const [opcionesSeleccionadasCheck, setOpcionesSeleccionadasCheck] = useState([]);
  const [showCheckSelectAlergias, setShowCheckSelectAlergias] = useState(false);
  const [showCheckSelectVacunas, setShowCheckSelectVacunas] = useState(false);
  const [opcionesSeleccionadasAlergias, setOpcionesSeleccionadasAlergias] = useState([]);
  const [opcionesSeleccionadasVacunas, setOpcionesSeleccionadasVacunas] = useState([]);
  const [alergiasOptions, setAlergiasOptions] = useState([]);
  const [vacunasOptions, setVacunasOptions] = useState([]);

  const obtenerCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:3000/categoria");
      setcategotriOptions(response.data);
    } catch (error) {
      console.error("Error al obtener valores de las categorias:", error);
    }
  };

  const obtenerValorCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:3000/valorCategoria");
      setcategoValtriOptions(response.data);
    } catch (error) {
      console.error("Error al obtener valores de las categorias:", error);
    }
  };

  useEffect(() => {
    const obtenerAlergias = async () => {
      try {
        const response = await axios.get("http://localhost:3000/alergias");
        setAlergiasOptions(response.data);
      } catch (error) {
        console.error("Error al obtener datos de alergias:", error);
      }
    };

    obtenerAlergias();
  }, []);

  useEffect(() => {
    const obtenerVacunas = async () => {
      try {
        const response = await axios.get("http://localhost:3000/vacunas");
        setVacunasOptions(response.data);
      } catch (error) {
        console.error("Error al obtener datos de vacunas:", error);
      }
    };

    obtenerVacunas();
  }, []);
 
  //YAAA
  const handleGuardar = async () => {
    if (catego.trim() === "") {
      setError("Categoria no puede estar vacío.");
    }
    if (categoval.trim() === "") {
      setErrorval("Valor no puede estar vacío.");
    }

    if (catego.trim() === "" || categoval.trim() === "") {
      return;
    }
    try {
      await axios.post("http://localhost:3000/Insercategorias", {
        categoria: catego.trim(),
        valor: categoval.trim()
      });
      message.success("Categoría guardada correctamente.");
      obtenerCategorias();
      setModalVisible(false);
      setError("");
      setErrorval("");
      setCatego(""); // Limpiar el campo de la nueva categoría después de guardar
      setCategoval(""); // Limpiar el campo del valor de la nueva categoría después de guardar
    } catch (error) {
      console.error("Error al guardar la categoría:", error);
      message.error("Error al guardar la categoría");
    }
  };
  
  //VALORES UNICOS YA
  const handleGuardarDato = async () => {
    try {
      if (categoria.trim() === "" || valor.trim() === "") {
        message.error("Por favor, complete todos los campos.");
        return;
      }
      const response = await axios.post("http://localhost:3000/verificarSalAlumn", {
        idAlumnos: idAlumnos,
        categoria: categoria.trim()
      });
      if (response.data.exists) {
        message.error("Ya existe un registro para este alumno con la misma categoría.");
        return;
      }
      await axios.post("http://localhost:3000/guardarDatosSalud", {
        idAlumnos: idAlumnos,
        categoria: categoria.trim(),
        valor: valor.trim()
      });
      message.success("Datos de salud guardados correctamente.");
      setModalVisible(false);
      setCategoria("");
      setValor("");
    } catch (error) {
      console.error("Error al guardar los datos de salud:", error);
      message.error("Error al guardar los datos de salud");
    }
  };

  //VALORES MULTIVALOR  YAAA
  const handleGuardarDatoSelect = async () => {
    try {
      if (categoria.trim() === "") {
        message.error("Por favor, selecciona una categoría.");
        return;
      }

      if (opcionesSeleccionadasCheck.length === 0) {
        message.error("Por favor, selecciona al menos una opción.");
        return;
      }

       // Enviar los datos al backend
       console.log("ID del alumno:", idAlumnos);
       console.log("Opciones seleccionadas de discapacidades:", opcionesSeleccionadasCheck);
 
       await axios.post("http://localhost:3000/guardarDiscapacidades", {
         idAlumnos: idAlumnos,
         opcionesDiscapacitados: opcionesSeleccionadasCheck
       });
       
       message.success("Datos de salud guardados correctamente.");
       setModalVisible(false);

    } catch (error) {
      console.error("Error al guardar los datos de salud:", error);
      message.error("Error al guardar los datos de salud");
    }
  };

  //VALORES MULTIVALOR YAYAYAYAY
  const handleGuardarAlergias = async () => {
    try {
      if (categoria.trim() === "") {
        message.error("Por favor, selecciona una categoría.");
        return;
      }
      if (opcionesSeleccionadasAlergias.length === 0) {
        message.error("Por favor, selecciona al menos una opción.");
        return;
      }
      // Enviar los datos al backend
      console.log("ID del alumno:", idAlumnos);
      console.log("Opciones seleccionadas de alergias:", opcionesSeleccionadasAlergias);

      await axios.post("http://localhost:3000/guardarAlergias", {
        idAlumnos: idAlumnos,
        opcionesAlergias: opcionesSeleccionadasAlergias
      });
      
      message.success("Datos de salud guardados correctamente.");
      setModalVisible(false);
    } catch (error) {
      console.error("Error al guardar los datos de salud:", error);
      message.error("Error al guardar los datos de salud");
    }
  };
  
  //VALORES MULTIVALOR  
  const handleGuardarVacunas = async () => {
    try {
      if (categoria.trim() === "") {
        message.error("Por favor, selecciona una categoría.");
        return;
      }

      if (opcionesSeleccionadasVacunas.length === 0) {
        message.error("Por favor, selecciona al menos una opción.");
        return;
      }

           // Enviar los datos al backend
           console.log("ID del alumno:", idAlumnos);
           console.log("Opciones seleccionadas de vacunas:", opcionesSeleccionadasVacunas);
     
           await axios.post("http://localhost:3000/guardarVacunas", {
             idAlumnos: idAlumnos,
             opcionesVacunas: opcionesSeleccionadasVacunas
           });
           
           message.success("Datos de salud guardados correctamente.");
           setModalVisible(false);
    } catch (error) {
      console.error("Error al guardar los datos de salud:", error);
      message.error("Error al guardar los datos de salud");
    }
  };

  useEffect(() => {
    obtenerCategorias();
    obtenerValorCategorias();
  }, []);

  const handleRegistrarClick = (idAlumnos, nombre) => {
    console.log("ID del alumno:", idAlumnos);
    console.log("Nombre:", nombre);
    setIdAlumnos(idAlumnos);
    setNombreAlumno(nombre);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleSelectChange = (value) => {
    // Lógica para mostrar el select en forma de check si se selecciona el valor 99
    if (value === "99") {
      setShowCheckSelect(true);
      setShowCheckSelectAlergias(false);
      setShowCheckSelectVacunas(false);
      // Ocultar el selector de alergias cuando se selecciona la opción 99
      obtenerOpcionesCheck(); // Función para obtener los datos del select tipo check desde el backend
    } else if (value === "97") {
      setShowCheckSelect(false); // Ocultar el selector de check
      setShowCheckSelectAlergias(false); // Mostrar el selector de alergias
      setShowCheckSelectVacunas(true);

    } else if (value === "88") {
      setShowCheckSelect(false); // Ocultar el selector de check
      setShowCheckSelectAlergias(true); // Mostrar el selector de alergias
      setShowCheckSelectVacunas(false);
    }
    else {
      setShowCheckSelect(false); // Ocultar el selector de check
      setShowCheckSelectAlergias(false); // Ocultar el selector de alergias
      setShowCheckSelectVacunas(false);
    }
  };

  const obtenerOpcionesCheck = async () => {
    try {
      const response = await axios.get("http://localhost:3000/discapacidad");
      setOpcionesCheck(response.data);
    } catch (error) {
      console.error("Error al obtener datos de discapacidades:", error);
      message.error("Error al obtener datos de discapacidades");
    }
  };
  useEffect(() => {
    obtenerOpcionesCheck();
  }, []);


  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (/^[A-Za-z\u00C0-\u017F\s]*$/.test(inputValue)) {
      setCatego(inputValue);
      setError("");
    } else {
      setError("El valor de la categoría no puede contener números ni caracteres especiales.");
    }
  };

  // Agrega esta función para ordenar los registros por el nombre completo del alumno
  const ordenarRegistrosPorNombre = (registros) => {
    return registros.sort((a, b) => {
      const nombreCompletoA = `${a.nombre_completo} ${a.apellido_paterno} ${a.apellido_materno}`.toUpperCase();
      const nombreCompletoB = `${b.nombre_completo} ${b.apellido_paterno} ${b.apellido_materno}`.toUpperCase();
      return nombreCompletoA.localeCompare(nombreCompletoB);
    });
  };

  // En el useEffect que obtiene los registros, utiliza la función de ordenamiento
  useEffect(() => {
    const obtenerRegistros = async () => {
      try {
        const response = await axios.get("http://localhost:3000/alumnos");
        console.log("Respuesta del servidor:", response);
        const registrosOrdenados = ordenarRegistrosPorNombre(response.data); // Ordena los registros
        setRegistros(registrosOrdenados); // Establece los registros ordenados en el estado
      } catch (error) {
        console.error("Error al obtener registros:", error);
      } finally {
        setLoading(false); // Desactivar el indicador de carga independientemente del resultado
      }
    };

    obtenerRegistros();
  }, []);


  // En el mapeo de la tabla, utiliza los registros ordenados
  const columns = [
    {
      title: "No",
      dataIndex: "idAlumnos",
      key: "idAlumnos",
      render: (text, record, index) => index + 1
    },
    {
      title: "Nombre / apellido paterno y materno",
      dataIndex: "nombre_completo",
      key: "nombre_completo",
    },
    {
      title: "Grado",
      dataIndex: "grado_id",
      key: "grado_id",
    },
    {
      title: "Grupo",
      dataIndex: "nombre_grupo",
      key: "nombre_grupo",
    },
    {
      title: "Sexo",
      dataIndex: "sexo",
      key: "sexo",
    },
    {
      title: "Acciones de salud",
      key: "action",
      render: (_, record) => (
        <Button size="middle" onClick={() => handleRegistrarClick(record.idAlumnos, record.nombre)}>
          Registrar
        </Button>
      ),
    },
  ];

  return (
    <>
      <Affix><Header /></Affix>
      <Presentacion
        tit={"Panel de salud"}
        icono={
          <img
            src={icono}
            className="lg:w-[280px] lg:translate-x-32 lg:-translate-y-10 text-white celular:translate-x-2 lg:z-50"
          />
        }
      />
      <Titulo tit={"Datos médicos del alumno"} />
      <Row style={{ marginLeft: "20px" }}>
        {/* Lista de categorías existentes */}
        <Col span={8}>
          <label>Categorias existentes:</label>
          <Row gutter={[30, 30]}>
            {Array.from({ length: Math.ceil(categotriOptions.length / 10) }, (_, groupIndex) => (
              <Col span={20} key={groupIndex}>
                <ul>
                  {categotriOptions
                    .slice(groupIndex * 10, (groupIndex + 1) * 10)
                    .map((option, index) => (
                      <li key={index}>{option.label}</li>
                    ))}
                </ul>
              </Col>
            ))}
          </Row>
        </Col>
        <Col span={15}>
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: "20px", width: "50%" }}>
              <label htmlFor="nuevaCategoria">
                Nueva categoría:
              </label><br></br>
              <Input
                id="nuevaCategoria"
                placeholder="Ingrese la nueva categoría"
                style={{ width: "100%" }}
                value={catego}
                onChange={handleChange}
              />
              <div style={{ marginLeft: "0px", marginTop: "5px", color: "red" }}>
                {error && <span>{error}</span>}
              </div>
              <br></br>
              <label htmlFor="nuevaCategoria">
                que será en:
              </label>
              <Form.Item
                name="categoval"
                rules={[
                  {
                    required: true,
                    message: "Selecciona un valor",
                  },
                ]}
              >
                <Select
                  placeholder="Ejemplo: Números.... "
                  suffixIcon={<IdcardOutlined />}
                  onChange={handleSelectChange}
                  value={categoval}
                  style={{ width: "100%" }}
                >
                  {categoValtriOptions.map((option) => (
                    <Option key={option.value} value={option.value.toString()}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <div style={{ marginLeft: "0px", marginTop: "5px", color: "red" }}>
                {errorval && <span>{errorval}</span>}
              </div>
              <Button
                type="primary"
                style={{ marginLeft: "0px", color: "black", width: "100%" }}
                onClick={handleGuardar}>
                Guardar
              </Button>
            </div>
            <div style={{ width: "50%" }}>
              <Alert
                message="Instrucciones"
                description="Por favor, ingrese las medidas en centímetros y el peso en kilogramos."
                type="info"
                showIcon
              />
            </div>
          </div>
        </Col>
      </Row>
      <br></br>


      <div className="w-10/12 mx-auto" style={{ textAlign: "center" }}>
        {loading ? (
          <Spin size="large" />
        ) : (
          <Table columns={columns} dataSource={registros} bordered />
        )}
      </div>
      <br></br>
      <Modal
        title={`Registrar salud de ${nombreAlumno}`}
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancelar
          </Button>,
          categoria === "88" ? (
            <Button key="submit" onClick={handleGuardarAlergias}>
              Registrar alergias
            </Button>
          ) :
            categoria === "97" ? (
              <Button key="submit" onClick={handleGuardarVacunas}>
                Registrar vacunas
              </Button>
            ) :
              categoria === "99" ? (
                <Button key="submit" onClick={handleGuardarDatoSelect}>
                  Registrar discapacidades
                </Button>
              ) :
                (
                  <Button key="submit" onClick={handleGuardarDato}>
                    Registrar
                  </Button>
                ),
        ]}
      >


        <Form layout="vertical">
          <label>Categoría:</label>
          <Form.Item
            name="categoria"
            rules={[
              {
                required: true,
                message: "Seleccione una categoría",
              },
            ]}
          >
            <Select
              placeholder="Ejemplo: Peso.... "
              suffixIcon={<IdcardOutlined />}
              onChange={(value, option) => {
                setCategoria(value.toString());
                setValorIdSeleccionado(option.valor_id.toString());
                setValor("");
                if (["99"].includes(value)) {
                  setShowCheckSelect(true);
                  setShowCheckSelectVacunas(false);
                  setShowCheckSelectAlergias(false); 
                } else if (value === "88") {
                  setShowCheckSelect(false); 
                  setShowCheckSelectVacunas(false);
                  setShowCheckSelectAlergias(true);
                } else if (value === "97") {
                  setShowCheckSelect(false); 
                  setShowCheckSelectAlergias(false); 
                  setShowCheckSelectVacunas(true); 
                } else {
                  setShowCheckSelect(false);
                  setShowCheckSelectAlergias(false); 
                  showCheckSelectVacunas(false);
                }
              }}
              value={categoria}
            >
              {categotriOptions.map((option) => (
                <Option key={option.value} value={option.value.toString()} valor_id={option.valor_id}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {showCheckSelect && (
            <>
              <label>Selecciona opciones:</label>
              <Form.Item
                name="checkSelect"
                rules={[
                  {
                    required: true,
                    message: "Seleccione al menos una opción",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Selecciona opciones"
                  onChange={(values) => {
                    console.log("Valores seleccionados:", values);
                    setOpcionesSeleccionadasCheck(values); // Actualizar el estado con las opciones seleccionadas
                  }}
                  style={{ width: "100%" }}
                >
                  {opcionesCheck.map((opcion) => (
                    <Option key={opcion.value} value={opcion.value.toString()}>
                      {opcion.label}
                    </Option>
                  ))}
                </Select>

              </Form.Item>
            </>
          )}

          {showCheckSelectAlergias && (
            <>
              <label>Selecciona alergias:</label>
              <Form.Item
                name="alergiasSelect"
                rules={[
                  {
                    required: true,
                    message: "Seleccione al menos una alergia",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Selecciona alergias"
                  onChange={(values) => {
                    console.log("Alergias seleccionadas:", values);
                    setOpcionesSeleccionadasAlergias(values);
                    // Aquí puedes actualizar el estado con las alergias seleccionadas si es necesario
                  }}
                  style={{ width: "100%" }}
                >
                  {alergiasOptions.map((option) => (
                    <Option key={option.value} value={option.value.toString()}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          {showCheckSelectVacunas && (
            <>
              <label>Selecciona alergias:</label>
              <Form.Item
                name="vacunasSelect"
                rules={[
                  {
                    required: true,
                    message: "Seleccione al menos una vacuna",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Selecciona vacunas"
                  onChange={(values) => {
                    console.log("Vacunas seleccionadas:", values);
                    setOpcionesSeleccionadasVacunas(values);
                    // Aquí puedes actualizar el estado con las alergias seleccionadas si es necesario
                  }}
                  style={{ width: "100%" }}
                >
                  {vacunasOptions.map((option) => (
                    <Option key={option.value} value={option.value.toString()}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

       
          {!["99", "97", "88"].includes(categoria) && (
            <>
              <label>Valor:</label>
              <Form.Item
                name="valor"
                rules={[
                  {
                    required: true,
                    message: "Ingrese el valor de la categoría",
                  }
                ]}
              >
                <Input
                  id="valor"
                  placeholder="Ejemplo: 150 cm"
                  prefix={<UserOutlined />}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (valorIdSeleccionado === '1') {
                      if (/^[A-Za-z\u00C0-\u017F\s]*$/.test(inputValue)) {
                        setValor(inputValue);
                      } else {
                        message.error("Ingresa solo letras en este campo.");
                      }
                    } else if (valorIdSeleccionado === '2') {
                      if (/^\d*\.?\d*$/.test(inputValue)) {
                        setValor(inputValue);
                      } else {
                        message.error("Ingresa solo números, incluyendo el punto decimal si es necesario.");
                      }
                    } else {
                      setValor(inputValue);
                    }
                  }}
                  value={valor}
                />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
      <Footer />
    </>
  );
}
