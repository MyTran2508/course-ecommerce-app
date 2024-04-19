import { CustomButtonProps } from "@/types/ComponentProps";
import { iconMap } from "@/utils/map";
import React from "react";

function CustomButton({
  title,
  containerStyles,
  handleClick,
  icon,
  iconStyles,
  type,
}: CustomButtonProps) {
  return (
    <button
      disabled={false}
      typeof={type !== undefined ? type : "button"}
      className={`custom-btn ${containerStyles}`}
      onClick={handleClick}
    >
      {icon &&
        iconMap[icon] &&
        React.createElement(iconMap[icon], {
          className: iconStyles,
        })}
      {title}
    </button>
  );
}

export default CustomButton;
