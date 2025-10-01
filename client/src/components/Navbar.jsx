import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if(!confirm("Voulez-vous vraiment vous déconnecter ?")) return;
    await api.post("/auth/logout");
    navigate("/login");
  };

  return (
    <header>
      <nav className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <ChevronDown />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">daisyUI</a>
        </div>
        <div className="navbar-end">
          <a className="btn" onClick={handleLogout}>
            Déconnexion
          </a>
        </div>
      </nav>
    </header>
  );
}
