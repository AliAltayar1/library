import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const Button = ({ text = "button", cn = "" }) => {
  return (
    <button
      className={twMerge(
        "rounded-xl px-4 py-2 cursor-pointer transform transition-all duration-300  whitespace-nowrap text-white",
        cn
      )}
    >
      {text}
    </button>
  );
};

export default Button;
