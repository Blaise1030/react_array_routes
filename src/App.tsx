import { createContext, useContext, useState } from "react";
import "./App.css";
import Router from "./router";

export const AuthContext = createContext({
  accessRole: "STUDENT",
  isLogin: false,
  login: () => {},
  logout: () => {},
  toggleRole: () => {},
});

function App() {
  const [loginCredentials, setLoginCredentials] = useState({
    accessRole: "STUDENT",
    isLogin: false,
  });

  const toggleRole = () => {
    setLoginCredentials({
      ...loginCredentials,
      accessRole:
        loginCredentials.accessRole === "STUDENT" ? "TEACHER" : "STUDENT",
    });
  };

  const login = () => {
    setLoginCredentials({
      ...loginCredentials,
      isLogin: true,
    });
  };

  const logout = () => {
    setLoginCredentials({
      ...loginCredentials,
      isLogin: false,
    });
  };

  return (
    <div className="App">
      <AuthContext.Provider
        value={{
          login,
          logout,
          toggleRole,
          isLogin: loginCredentials.isLogin,
          accessRole: loginCredentials.accessRole,
        }}
      >
        <Router />
      </AuthContext.Provider>
    </div>
  );
}

export default App;
