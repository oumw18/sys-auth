import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import InputField from "../components/InputField";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import BtnShowPass from "../components/BtnShowPass";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("Les mots de passe ne correspondent pas.");
    }

    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });

      toast.success(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-accent mb-4">
          Réinitialisation du mot de passe
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="password">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <InputField
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Votre mot de passe"
              />
              <BtnShowPass
                onClick={togglePassword}
                showPassword={showPassword}
              />
            </div>
          </div>
          <div>
            <label
              className="block text-gray-700 mb-1"
              htmlFor="confirm-password"
            >
              Confirme le mot de passe
            </label>
            <div className="relative">
              <InputField
                type={showPassword ? "text" : "password"}
                id="confirm-password"
                name="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmez votre mot de passe"
              />
              <BtnShowPass
                onClick={togglePassword}
                showPassword={showPassword}
              />
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-accent w-full">
          Envoyé
        </button>
      </form>
    </div>
  );
}
