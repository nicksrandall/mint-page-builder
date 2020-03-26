import React from "react";

import { format } from "../utils/formatJSON";
import { useDragState } from "../contexts/DragContext";

const SaveButton = ({ onSave }) => {
  const state = useDragState();
  return (
    <button
      css={{
        padding: "12px 24px",
        border: "none",
        width: '100%',
        background: "#66beb2",
        border: "1px solid #66beb2",
        textTransform: 'uppercase',
        fontWeight: 500,
        color: "#fff",
        "&:hover": {
          color: "#66beb2",
          background: "#fff",
        }
      }}
      onClick={() => onSave(format(state))}
    >
      Save layout
    </button>
  );
};

const TemplateSettings = ({ onClick, onSave }) => {
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
    </div>
  );
};

export default TemplateSettings;
