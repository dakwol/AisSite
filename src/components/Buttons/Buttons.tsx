import React from "react";
import "./styles.scss";

type ButtonsProps = {
  text: string;
  onClick: () => void;
  ico?: string;
  className?: string;
  circle?: number;
  image?: string;
  stileImage?: string;
  disabled?: boolean;
};

const Buttons: React.FC<ButtonsProps> = ({
  text,
  onClick,
  ico,
  className,
  circle,
  image,
  stileImage,
  disabled,
}) => {
  return (
    <button
      className={`button__container ${ico ? "iconContainer" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {typeof circle === "number" && (
        <div className="circleNumber">{circle}</div>
      )}

      {ico && <object type="image/svg+xml" data={ico}></object>}
      {image && <img src={image} className={stileImage}></img>}
      {text}
    </button>
  );
};

export default Buttons;
