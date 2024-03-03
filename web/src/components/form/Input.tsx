import CSS from "csstype";
import { FieldError } from "react-hook-form";

const Input = ({
  placeholder,
  formData,
  style,
  label,
  error,
  value,
  type,
}: {
  value?: any;
  formData: any;
  placeholder?: string;
  error?: FieldError;
  label?: string;
  type?: string;
  style?: CSS.Properties;
}) => {
  return (
    <div style={style} className="input-wrap">
      <div style={{ color: !!error ? "red" : "" }} className="input-label">
        {label}
      </div>
      <input
        id={label}
        type={type}
        {...formData}
        defaultValue={value}
        placeholder={placeholder}
        className={!!error ? "input-invalid" : ""}
      />
    </div>
  );
};

export default Input;
