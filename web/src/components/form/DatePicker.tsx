import CSS from "csstype";
import { format } from "date-fns";
import { FieldError } from "react-hook-form";

const DatePicker = ({
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
  const _value = value
    ? format(value, "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-dd");

  return (
    <div style={style} className="input-wrap">
      <div style={{ color: !!error ? "red" : "" }} className="input-label">
        {label}
      </div>
      <input
        type="date"
        {...formData}
        defaultValue={_value}
        placeholder={placeholder}
        className={!!error ? "input-invalid" : ""}
      />
    </div>
  );
};

export default DatePicker;
