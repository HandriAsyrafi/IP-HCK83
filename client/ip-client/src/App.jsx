// import { useEffect } from "react";
// import axios from "axios";
import Login from "./pages/Login.page";
import Home from "./pages/Home.page"; // Create this component
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
