import { Dispatch, SetStateAction } from "react";
import { FieldError } from "react-hook-form";
import CSS from "csstype";

const AuthInput = ({
  placeholder,
  onChange,
  style,
  label,
  error,
  value,
  type,
}: {
  value?: any;
  type?: string;
  label?: string;
  error?: FieldError;
  placeholder?: string;
  style?: CSS.Properties;
  onChange: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div style={style} className="input-wrap">
      <div style={{ color: !!error ? "red" : "" }} className="input-label">
        {label}
      </div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={!!error ? "input-invalid" : ""}
      />
    </div>
  );
};

export default AuthInput;
