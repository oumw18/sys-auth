import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Verify() {
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 300s = 5 min
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Transformer les secondes restantes en minutes:secondes
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email non trouvé, veuillez vous réinscrire !");
      return navigate("/register");
    }
    try {
      const res = await api.post("/auth/verify-code", { code, email });
      toast.success(res.data.message);
      localStorage.removeItem("email");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la vérification");
    }
  };

  const handleResendCode = async () => {
    try {
      if (!email) {
        toast.error("Email non trouvé, veuillez vous réinscrire !");
        return navigate("/register");
      }
      const res = await api.post("/auth/resend-code", { email });
      toast.success(res.data.message);
      setTimeLeft(300);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de l'envoi du code"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-accent mb-4">
          Vérification OTP
        </h2>
        <p className="text-center text-gray-500 mb-4">
          Entrez le code à 6 chiffres envoyé sur votre email
        </p>
        <input
          className="input w-full bg-white text-center text-2xl"
          type="text"
          placeholder="000000"
          maxLength={6}
          inputMode="numeric"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          className="btn btn-accent w-full"
          type="submit"
          disabled={timeLeft <= 0}
        >
          Vérifier
        </button>
        <p className="text-center text-gray-500 mt-4">{formatTime(timeLeft)}</p>
        <p>
          Code non reçu ?{" "}
          <span
            className="text-blue-500 cursor-pointer underline"
            onClick={handleResendCode}
          >
            Renvoyer le code
          </span>
        </p>
      </form>
    </div>
  );
}
