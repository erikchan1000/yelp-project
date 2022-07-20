import "./App.css";
import React from "react";
import Login from "./components/Login";
import { AuthProvider } from "./components/Firebase/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";
import UpdateProfile from "./components/UpdateProfile";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <Container
        className="d-flex align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "30rem", maxHeight: "" }}>
          <Router>
            <AuthProvider>
              <Routes>
                <Route
                  exact
                  path="/"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/update-profile"
                  element={
                    <PrivateRoute>
                      <UpdateProfile />
                    </PrivateRoute>
                  }
                />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Routes>
            </AuthProvider>
          </Router>
        </div>
      </Container>
    </div>
  );
}

export default App;
