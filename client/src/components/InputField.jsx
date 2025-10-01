import React from "react";

export default function InputField({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="input bg-white w-full focus:input-accent"
        placeholder={placeholder}
      />
    </div>
  );
}
