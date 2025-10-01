import { Eye, EyeOff } from "lucide-react";
export default function BtnShowPass({ onClick, showPassword }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-2 top-2 text-gray-500 hover:text-accent focus:outline-none bg-white pl-2 z-10"
      tabIndex={-1}
    >
      {showPassword ? <Eye /> : <EyeOff />}
    </button>
  );
}
