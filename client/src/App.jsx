import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import FileSender from "./components/FileSender";
import FileReceiver from "./components/FileReceiver";
import About from "./pages/About";
import Contact from "./pages/Contact";
import LandingPage from "./pages/LandingPage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import History from "./components/History";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/signup" element={<SignUp setIsAuthenticated={setIsAuthenticated}/>} />
      <Route
        path="/send"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <FileSender />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receive"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <FileReceiver />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sent"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <History />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default App;
