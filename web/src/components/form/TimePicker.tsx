import CSS from "csstype";
import { FieldError } from "react-hook-form";

const TimePicker = ({
  placeholder,
  formData,
  style,
  label,
  error,
  value,
}: {
  value?: any;
  formData: any;
  placeholder?: string;
  error?: FieldError;
  label?: string;
  style?: CSS.Properties;
}) => {
  return (
    <div style={style} className="input-wrap">
      <div style={{ color: !!error ? "red" : "" }} className="input-label">
        {label}
      </div>
      <input
        type="time"
        {...formData}
        defaultValue={value}
        placeholder={placeholder}
        className={!!error ? "input-invalid" : ""}
      />
    </div>
  );
};

export default TimePicker;
