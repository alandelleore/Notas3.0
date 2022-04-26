import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Admin from "./components/Admin";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import Reset from "./components/Reset";
import Spinner from "./components/Spinner";
import { auth } from "./firebase";

function App() {
  const [firebaseUser, setFirebaseUser] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        setFirebaseUser(user);
      } else {
        setFirebaseUser(null);
      }
    });
  }, []);

  return firebaseUser !== false ? (
    <Router>
      <div className="container">
        <NavBar firebaseUser={firebaseUser} />
        <Switch>
          <Route path="/" exact>
            <h3>Notas 3.0</h3>
            <p>
              Pequeña aplicación que permite crear listas de tareas generando
              previamente un usuario que almacenara la informacion cargada.
            </p>
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/reset">
            <Reset />
          </Route>
        </Switch>
      </div>
    </Router>
  ) : (
    <Spinner />
  );
}

export default App;
