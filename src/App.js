import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import './App.css';
import RepositoriesPage from "./RepositoriesPage";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/repositories" element={<RepositoriesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
