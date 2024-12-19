import React, { useState } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import FileSender from "./components/FileSender";
import FileReceiver from "./components/FileReceiver";
import About from "./pages/About";
import Contact from "./pages/Contact";
import LandingPage from "./pages/LandingPage";
import Login from "./components/Login";
import History from "./components/History";
import ProtectedRoute from "./routes/ProtectedRoute";
import SignUp from "./components/Signup";

const App = () => {
  // Simulate authentication state (replace with real auth logic)
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="login" element={<Login />} />
      <Route path="send" element={<FileSender />} />
      <Route path="receive" element={<FileReceiver />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="sent"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <History />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<div>Page not Found</div>} />
    </Routes>
  );
};

export default App;
