import React from "react";
import { Dialog } from "@reach/dialog";
import VisuallyHidden from "@reach/visually-hidden";

// reach base styles
import "@reach/dialog/styles.css";

import Icon from "./Icon";
import registry from "../utils/componentRegistery";

const Tile = ({ icon, name, onClick }) => {
  return (
    <div css={{ padding: "12px", width: "25%" }}>
      <button
        css={{
          cursor: "pointer",
          width: "100%",
          padding: "16px",
          border: "1px solid rgba(0,0,0,0.14)",
          background: "#fff",
          "&:hover": {
            background: "#66beb2",
          }
        }}
        onClick={onClick}
      >
        <Icon icon={icon} fontSize="24px" />
        <div>{name}</div>
      </button>
    </div>
  );
};

const Modal = ({ isOpen, close, onSelectComponent }) => {
  return (
    <Dialog
      css={{
        width: "90%",
        maxWidth: "768px",
        position: "relative"
      }}
      isOpen={isOpen}
      onDismiss={close}
      aria-label="Add component"
    >
      <button
        css={{
          position: "absolute",
          right: "10px",
          top: 0,
          padding: "5px",
          border: "none",
          outline: "none",
          fontSize: "28px"
        }}
        onClick={close}
      >
        <VisuallyHidden>Close</VisuallyHidden>
        <span aria-hidden>×</span>
      </button>
      <h2>Select a component to insert</h2>
      <div css={{ display: "flex", flexWrap: "wrap", margin: '0 -12px' }}>
        {registry.getComponents().map(component => {
          return (
            <Tile
              key={component.name}
              icon={component.icon}
              name={component.name}
              onClick={() => {
                onSelectComponent(component.name);
                close();
              }}
            />
          );
        })}
      </div>
    </Dialog>
  );
};

export default Modal;
