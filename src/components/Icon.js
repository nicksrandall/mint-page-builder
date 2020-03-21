import React from "react";
import Tooltip from "@reach/tooltip";
import "@reach/tooltip/styles.css";

const Icon = ({
  icon,
  fontSize = "24px",
  className,
  label,
  ...props
}) =>
  label ? (
    <Tooltip
      label={label}
      css={{
        padding: "4px",
        fontSize: "12px",
        background: "#ccc",
        color: "#000",
        border: "none"
      }}
    >
      <i
        className={`material-icons ${className}`}
        css={{ fontSize: fontSize }}
        {...props}
      >
        {icon}
      </i>
    </Tooltip>
  ) : (
    <i
      className={`material-icons ${className}`}
      css={{ fontSize: fontSize }}
      {...props}
    >
      {icon}
    </i>
  );

export default Icon;
