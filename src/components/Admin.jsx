import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { withRouter } from "react-router-dom";
import Firestore from "./Firestore";
import Spinner from "./Spinner";

const Admin = (props) => {
  const [user, setUser] = useState(null);
  const [load, setLoad] = useState(true);

  const fecha = new Date();

  useEffect(() => {
    if (auth.currentUser) {
      console.log("existe un usuario");
      setUser(auth.currentUser);
      console.log(auth.currentUser);
      setTimeout(() => {
        setLoad(false);
      }, 800);
    } else {
      console.log("no existe el usuario");
      props.history.push("/login");
    }
  }, [props.history]);

  return (
    <>
      {load ? (
        <h5 className="text-center mt-5">
          <Spinner />
        </h5>
      ) : (
        <div>
          <p className="mx-2">
            User : {auth.currentUser.email}
            <span className="float-end">{fecha.toLocaleDateString()}</span>
          </p>

          {user && <Firestore user={user} />}
        </div>
      )}
    </>
  );
};

export default withRouter(Admin);
