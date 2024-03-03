// internal imports
import { colors } from "constants/colors";
// types
import { ColorPickerProps, ColorPickerItemProps } from "types/ui";

const ColorPicker = ({ color, setColor }: ColorPickerProps) => {
  return (
    <div className="d-flex justify-content-between mt-2 ps-3 pe-3">
      {colors?.map((c: string) => (
        <ColorItem key={c} color={c} value={color} setColor={setColor} />
      ))}
    </div>
  );
};

export default ColorPicker;

const ColorItem = ({ color, value, setColor }: ColorPickerItemProps) => {
  const isSelected = value === color;
  return (
    <div
      onClick={() => setColor(color)}
      className="shadow-sm color-picker-item"
      style={{
        borderWidth: isSelected ? 1.5 : "1px",
        borderColor: isSelected ? "#5a64db" : "#dde2e5",
      }}
    >
      <div
        style={{ background: color }}
        className="w-100 h-100 rounded-circle"
      />
    </div>
  );
};
