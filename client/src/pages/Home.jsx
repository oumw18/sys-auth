import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Home() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/")
      .then((res) => setMessage(res.data.message))
      .catch(() => navigate("/login"));
  }, [navigate]);
  return (
    <div>
      <Navbar />
      <main>{message}</main>
    </div>
  );
}
