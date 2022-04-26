import React from "react";
import { Link, NavLink } from "react-router-dom";
import { auth } from "../firebase";
import { withRouter } from "react-router-dom";
import note from "../img/note.png";

const NavBar = (props) => {
  const cerrarSesion = () => {
    auth.signOut().then(() => {
      props.history.push("/login");
    });
  };

  return (
    <div className="navbar navbar-dark bg-dark">
      <Link className="navbar-brand mx-2" to="/">
        <img src={note} alt="logo" style={{ width: 50 }} />
      </Link>
      <div>
        <div className="d-flex">
          <NavLink className="btn btn-dark mx-2" to="/" exact>
            inicio
          </NavLink>
          {props.firebaseUser !== null ? (
            <NavLink className="btn btn-dark mx-2" to="/admin">
              Mi lista
            </NavLink>
          ) : null}

          {props.firebaseUser !== null ? (
            <button className="btn btn-dark" onClick={() => cerrarSesion()}>
              Cerrar Sesión
            </button>
          ) : (
            <NavLink className="btn btn-dark mx-4" to="/login">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default withRouter(NavBar);
