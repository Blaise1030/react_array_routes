import React, { ReactElement, useContext, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router";
import { BrowserRouter, Link } from "react-router-dom";
import { AuthContext } from "./App";

type RouteType = {
  children?: Array<RouteType>;
  component?: ReactElement;
  gaurd?: any;
  path: string;
};

const Router = () => {
  const { accessRole, isLogin } = useContext(AuthContext);
  const routes: Array<RouteType> = [
    {
      path: "/login",
      component: <Login />,
    },
    {
      path: "/home",
      component: <HomepageLayout />,
      gaurd: { requiresAuth: { value: true, redirection: "/login" } },
      children: [
        {
          path: "student",
          component: <Student />,
          gaurd: {
            accessRole: { value: "STUDENT", redirection: "/home/teacher" },
          },
        },
        {
          path: "teacher",
          component: <Teacher />,
          gaurd: {
            accessRole: { value: "TEACHER", redirection: "/home/student" },
          },
        },
      ],
    },
    {
      path: "*",
      component: <Page id={"Not Found"} />,
    },
  ];

  const pathGen = (
    { path, component, children, gaurd }: RouteType,
    key: any
  ) => {
    return (
      <React.Fragment key={key}>
        {!children && <Route element={rGaurd(gaurd, component)} path={path} />}
        {children && (
          <Route element={rGaurd(gaurd, component)} path={path}>
            {children.map((r) =>
              !component
                ? pathGen({ ...r, path: `${path}/${r.path}` }, r.path)
                : pathGen(r, r.path)
            )}
          </Route>
        )}
      </React.Fragment>
    );
  };

  const rGaurd: (g: any, c?: ReactElement) => ReactElement | undefined = (
    gaurd: any,
    component?: ReactElement
  ) => {
    if (!gaurd) return component;
    if (gaurd["requiresAuth"] && gaurd["requiresAuth"]?.value && !isLogin)
      return <Navigate to={gaurd["requiresAuth"].redirection} />;
    if (gaurd["accessRole"] && gaurd["accessRole"]?.value !== accessRole)
      return <Navigate to={gaurd["accessRole"].redirection} />;
    return component;
  };

  return (
    <BrowserRouter>
      <Routes>{routes.map((r) => pathGen(r, r.path))}</Routes>
    </BrowserRouter>
  );
};

const Page = ({ id }: { id: string }) => {
  return (
    <div
      style={{
        border: "1px solid black",
      }}
    >
      {id}
      <Outlet />
    </div>
  );
};

const HomepageLayout = () => {
  return (
    <div>
      <header
        style={{ backgroundColor: "red", color: "white", padding: "1rem" }}
      >
        This is the header
      </header>
      <nav
        style={{
          backgroundColor: "blue",
          position: "fixed",
          height: "100vh",
          width: "200px",
          color: "white",
          left: 0,
        }}
      >
        This is the navigation bar
      </nav>
      <Outlet />
    </div>
  );
};

const Student = () => {
  const { logout } = useContext(AuthContext);
  return (
    <div
      style={{
        flexDirection: "column",
        display: "flex",
        margin: "auto",
        width: "200px",
      }}
    >
      <span>This is the student home page</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const Teacher = () => {
  const { logout } = useContext(AuthContext);
  return (
    <div
      style={{
        flexDirection: "column",
        display: "flex",
        margin: "auto",
        width: "200px",
      }}
    >
      <span>This is the Teacher home page</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const Login = () => {
  const { login, toggleRole, accessRole, isLogin } = useContext(AuthContext);
  return (
    <div
      style={{
        flexDirection: "column",
        display: "flex",
        margin: "auto",
        width: "200px",
      }}
    >
      <div
        style={{
          flexDirection: "column",
          display: "flex",
          marginBottom: "200px",
        }}
      >
        <span>This is the login page</span>
        <span>Login as {accessRole}</span>
        <span>Has Login: {isLogin.toString()}</span>
        <button onClick={toggleRole}>Change role</button>
        <button onClick={login}>Login</button>
      </div>

      <Link to="/home/student">Go To Student Homepage</Link>
      <Link to="/home/teacher">Go To Teacher Homepage</Link>
    </div>
  );
};

export default Router;
