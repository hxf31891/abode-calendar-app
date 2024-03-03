import CSS from "csstype";

const TextArea = ({
  placeholder,
  formData,
  value,
  style,
  label,
}: {
  formData: any;
  placeholder?: string;
  label?: string;
  style?: CSS.Properties;
  value?: string;
}) => {
  return (
    <div style={style} className="input-wrap">
      <div className="input-label">{label}</div>
      <textarea
        placeholder={placeholder}
        defaultValue={value}
        {...formData}
      ></textarea>
    </div>
  );
};

export default TextArea;
