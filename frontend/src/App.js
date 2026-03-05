import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedUser, setLoggedUser] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("username");

    if (token) {
      setIsAuthenticated(true);
      setLoggedUser(savedUser);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/login/",
          { username, password }
        );

        localStorage.setItem("token", res.data.access);
        localStorage.setItem("username", username);

        setLoggedUser(username);
        setIsAuthenticated(true);
        setMessage("");
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/register/",
          { username, email, password }
        );

        setMessage("Usuario registrado correctamente");

        // Volver automáticamente al login después de .5 segundos
        setTimeout(() => {
          setIsLogin(true);
          setMessage("");
        }, 500);
      }

    } catch (error) {
      setMessage("Error: credenciales inválidas ");
    }

    // Limpiar campos
        setUsername("");
        setEmail("");
        setPassword("");

        
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setLoggedUser("");
  };

  if (isAuthenticated) {
    return (
      <div className="container">
        <div className="card">
          <h2>Bienvenido {loggedUser} </h2>
          <p>Has iniciado sesión correctamente.</p>
          <button onClick={logout}>Cerrar sesión</button> 
        </div>
      </div>
    );

  }

  return (
    <div className="container">
      <div className="card">
        <h2>{isLogin ? "Iniciar Sesión" : "Registrarse"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {!isLogin && (
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            {isLogin ? "Login" : "Registrar"}
          </button>
        </form>

        <p>{message}</p>

        <span onClick={() => {
          setIsLogin(!isLogin);
          setMessage("");
        }}>
          {isLogin
            ? "¿No tienes cuenta? Regístrate"
            : "¿Ya tienes cuenta? Inicia sesión"}
        </span>
      </div>
    </div>
  );
}

export default App;
