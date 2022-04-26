import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import moment from "moment";
import "moment/locale/es";

const Firestore = (props) => {
  const [tareas, setTareas] = useState([]);
  const [tarea, setTarea] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [id, setId] = useState("");
  const [error, setError] = useState(null);
  const [ultimo, setUltimo] = useState(null);
  const [desactivarVerMas, setDesactivarVerMas] = useState(false);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setDesactivarVerMas(true);
        const data = await db
          .collection(props.user.uid)
          .limit(6)
          .orderBy("fecha")
          .get();

        const arrayData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUltimo(data.docs[data.docs.length - 1]);

        console.log(arrayData);

        setTareas(arrayData);

        //comprobar si existen mas documentos por leer
        const query = await db
          .collection(props.user.uid)
          .limit(6)
          .orderBy("fecha")
          .startAfter(data.docs[data.docs.length - 1])
          .get();
        //si query esta vacio desctivamos el ver más...
        if (query.empty) {
          console.log("no hay mas docs");
          setDesactivarVerMas(true);
        } else {
          setDesactivarVerMas(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    obtenerDatos();
  }, [props.user.uid]);

  const verMas = async () => {
    try {
      const data = await db
        .collection(props.user.uid)
        .limit(6)
        .orderBy("fecha")
        .startAfter(ultimo) //comienza despues del doc que ingresemos en los ()
        .get();

      const arrayData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTareas([...tareas, ...arrayData]);
      setUltimo(data.docs[data.docs.length - 1]); // para que no se repitan los documentos

      const query = await db
        .collection(props.user.uid)
        .limit(6)
        .orderBy("fecha")
        .startAfter(data.docs[data.docs.length - 1])
        .get();
      //si query esta vacio desctivamos el ver más...
      if (query.empty) {
        console.log("no hay mas docs");
        setDesactivarVerMas(true);
      } else {
        setDesactivarVerMas(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const agregar = async (e) => {
    e.preventDefault();

    if (!tarea.trim()) {
      setError("Ingrese una tarea");
      return;
    }
    try {
      const nuevaTarea = {
        name: tarea,
        fecha: Date.now(),
      };

      const data = await db.collection(props.user.uid).add(nuevaTarea);

      setTareas([...tareas, { ...nuevaTarea, id: data.id }]);
      setError(null);
      setTarea("");
    } catch (error) {
      console.log(error);
    }
    console.log(tarea);
  };

  const eliminar = async (id) => {
    try {
      await db.collection(props.user.uid).doc(id).delete();

      const arrayFiltrado = tareas.filter((item) => item.id !== id);
      setTareas(arrayFiltrado);
    } catch (error) {
      console.log(error);
    }
  };

  const activarEdicion = (item) => {
    setModoEdicion(true);
    setTarea(item.name);
    setId(item.id);
  };

  const editar = async (e) => {
    e.preventDefault();
    if (!tarea.trim()) {
      setError("Ingresa una tarea");
      return;
    }
    try {
      await db.collection(props.user.uid).doc(id).update({
        name: tarea,
      });

      const arrayEditado = tareas.map((item) =>
        item.id === id ? { id: item.id, fecha: item.fecha, name: tarea } : item
      );
      setTareas(arrayEditado);
      setModoEdicion(false);
      setError(null);
      setTarea("");
      setId("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container mt-4">
        <hr />
        <div className="row mt-4">
          <div className="col-md-6">
            <h4>Lista de tareas</h4>

            <ul className="list-group mb-4">
              {tareas.length === 0 ? (
                <li className="list-group-item">No hay tareas</li>
              ) : (
                tareas.map((item) => (
                  <li className="list-group-item" key={item.id}>
                    {item.name} - {moment(item.fecha).format("l")}
                    <button
                      className="btn btn-danger btn-sm float-end mx-2"
                      onClick={() => eliminar(item.id)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="btn btn-warning btn-sm float-end"
                      onClick={() => activarEdicion(item)}
                    >
                      Editar
                    </button>
                  </li>
                ))
              )}
            </ul>
            {desactivarVerMas ? null : (
              <p
                className="text-center text-primary"
                type="button"
                onClick={() => verMas()}
              >
                ver más...
              </p>
            )}
          </div>
          <div className="col-md-6">
            <h4>{modoEdicion ? "Editar Tarea" : "Agregar Tarea"}</h4>
            <form onSubmit={modoEdicion ? editar : agregar}>
              {error ? <span className="text-danger">{error}</span> : null}
              <input
                type="text"
                placeholder="Ingrese tarea"
                className="form-control mb-2 mt-1 mb-4"
                onChange={(e) => setTarea(e.target.value)}
                value={tarea}
              />
              <button
                className={
                  modoEdicion
                    ? "btn btn-warning btn col-md-12"
                    : "btn btn-dark btn col-md-12"
                }
                type="submit"
              >
                {modoEdicion ? "Editar" : "Agregar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Firestore;
