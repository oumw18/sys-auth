import { useState } from "react";
import InputField from "../components/InputField";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import BtnShowPass from "../components/BtnShowPass";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Traitement du formulaire ici
    try {
      await api.post("/auth/login", form);
      toast.success("Connexion réussie !");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la connexion");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-accent mb-4">
          Connexion
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <InputField
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Votre email"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="password">
              Mot de passe
            </label>
            <div className="relative">
              <InputField
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Votre mot de passe"
              />
              <BtnShowPass onClick={togglePassword} showPassword={showPassword} />
            </div>
            <p>
              Mots de passe oublié ?{" "}
              <Link
                to="/forgot-password"
                className="text-accent hover:underline"
              >
                Réinitialiser
              </Link>
            </p>
          </div>
        </div>
        <button type="submit" className="btn btn-accent w-full">
          Se connecter
        </button>
        <p className="text-center">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-accent hover:underline">
            S'inscrire
          </Link>
        </p>
      </form>
    </div>
  );
}
