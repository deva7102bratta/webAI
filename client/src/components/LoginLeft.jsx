import React from 'react';
import logo from "../assets/logo.svg";
import bgImg from "../assets/bg-img.png";

const LoginLeft = () => {
  return (
    <div
      style={{ backgroundImage: `url(${bgImg})` }}
      className="flex w-2/5 bg-cover bg-center bg-no-repeat flex-col justify-between p-12 shrink-0 select-none"
    >
      <div>
        <img src={logo} alt="Logo" className="size-9.5" />
        <span className="text-4xl font-medium text-white">
          WebAI
        </span>
      </div>

      <div>
        <h2 className="text-3xl text-white font-medium leading-snug mb-3 tracking-tight">
          Build your presence on web
        </h2>

        <p className="text-zinc-300">
          Describe what you need preview instantly, and customize your site in
          real-time. React with clean JSX, verified layouts, and instant code
          exports.
        </p>

        <p className="text-zinc-300 text-sm mt-12">
          Copyright {new Date().getFullYear()} BuilderAI
        </p>
      </div>
    </div>
  );
};

export default LoginLeft;