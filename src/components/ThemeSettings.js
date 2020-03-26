import React from "react";

import { format } from "../utils/formatJSON";
import { useDragState } from "../contexts/DragContext";

const Button = ({ children, ...props }) => {
  return (
    <button
      css={{
        padding: "12px 24px",
        width: "100%",
        background: "#66beb2",
        border: "1px solid #66beb2",
        textTransform: "uppercase",
        fontWeight: 500,
        color: "#fff",
        "&:hover": {
          color: "#66beb2",
          background: "#fff"
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

const SaveButton = ({ onSave }) => {
  const state = useDragState();
  return <Button onClick={() => onSave(format(state))}>Save layout</Button>;
};

const TemplateSettings = ({ onClick, onSave, toggleJson }) => {
  return (
    <div css={{ width: "100%" }}>
      <div
        onClick={onClick}
        css={{
          cursor: "pointer",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          height: "48px"
        }}
      >
        <span css={{ paddingLeft: "8px" }}>Template Settings</span>
      </div>
      <div css={{ padding: "8px" }}>
        <SaveButton onSave={onSave} />
      </div>
      <div css={{ padding: "8px" }}>
        <Button
          css={{
            color: "#66beb2",
            background: "#fff"
          }}
          onClick={toggleJson}
        >
          View JSON
        </Button>
      </div>
    </div>
  );
};

export default TemplateSettings;
