import React from "react";
import { Link } from "react-router-dom";

export default function Page404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 space-y-4">
      <p className="text-lg font-bold">Page 404 - Not Found</p>
      <Link to="/" className="text-accent underline">
        Retour à l'accueil
      </Link>
    </div>
  );
}
