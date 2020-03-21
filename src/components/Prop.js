import React, { useContext, useState } from "react";
import styled from "@emotion/styled";
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

import DragContext from "../contexts/DragContext";
import { UPDATE_PROP } from "../hooks/useDragState";
// import WYSIWYG from './Slate';
import WYSIWYG from "./Wysiwyg";

const Label = styled.label`
  font-size: 14px;
  display: block;
  padding-bottom: 8px;
`;

const PropContainer = styled.div`
  padding-bottom: 24px;
`;

const Input = styled.input`
  padding: 8px;
  width: 100%;
`;

const Button = styled.button`
  padding: 8px 12px;
  border: none;
  outline: none;
  text-transform: uppercase;
  background: #66beb2;
  color: #fff;
`;

const Select = styled.select`
  width: 100%;
  display: block;
  padding: 8px;
`;

const Number = ({ placeholder }) => {
  return (
    <div
      css={{
        padding: "8px",
        width: "100%",
      }}
    >
      <Input css={{textAlign: 'center'}} type="number" placeholder={placeholder} />
    </div>
  );
};

const WYSIWYGButton = ({ action, value, definition, uuid, mapKey }) => {
  const { dispatch } = useContext(DragContext);
  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  return (
    <PropContainer>
      <Label>{definition.displayName}</Label>
      <Button onClick={open}>Edit Content</Button>

      <Dialog
        css={{
          width: "90%",
          padding: "0",
          background: "#fff"
        }}
        isOpen={showDialog}
        onDismiss={close}
        aria-label="Add component"
      >
        <WYSIWYG
          html={value}
          handleClose={close}
          handleSave={value => {
            dispatch({
              type: action,
              payload: {
                id: uuid,
                mapKey: mapKey,
                name: definition.name,
                value: value
              }
            });
            close();
          }}
        />
      </Dialog>
    </PropContainer>
  );
};

export const PropView = props => {
  const { action, value, definition, uuid, mapKey } = props;
  const { dispatch } = useContext(DragContext);
  switch (definition.type) {
    case "text":
      return (
        <PropContainer>
          <Label>{definition.displayName}</Label>
          <Input
            type="text"
            value={value}
            placeholder={definition.placeholder}
            onChange={e =>
              dispatch({
                type: action,
                payload: {
                  id: uuid,
                  mapKey: mapKey,
                  name: definition.name,
                  value: e.target.value
                }
              })
            }
          />
        </PropContainer>
      );
    case "color":
      return (
        <PropContainer>
          <Label>{definition.displayName}</Label>
          <input
            type="color"
            value={value}
            onChange={e =>
              dispatch({
                type: action,
                payload: {
                  id: uuid,
                  mapKey: mapKey,
                  name: definition.name,
                  value: e.target.value
                }
              })
            }
          />
        </PropContainer>
      );
    case "select":
      return (
        <PropContainer>
          <Label>{definition.displayName}</Label>
          <Select
            value={value}
            onChange={e =>
              dispatch({
                type: action,
                payload: {
                  id: uuid,
                  mapKey: mapKey,
                  name: definition.name,
                  value: e.target.value
                }
              })
            }
          >
            {definition.values.map(option => {
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </Select>
        </PropContainer>
      );
    case "media":
      return (
        <PropContainer>
          <Label>{definition.displayName}</Label>
          {value ? (
            <img
              src={value}
              alt="selected media"
              css={{
                border: "1px solid #000",
                width: "100%",
                marginBottom: "8px"
              }}
            />
          ) : (
            <div
              css={{
                border: "1px solid #000",
                padding: "32px",
                textAlign: "center",
                marginBottom: "8px",
                overflowWrap: "break-word"
              }}
            >
              No image set
            </div>
          )}
          <Button
            onClick={() => {
              const url = prompt(
                "Normally, this would interface with the media library from CMS. For now just enter a url to an image:"
              );
              dispatch({
                type: action,
                payload: {
                  id: uuid,
                  mapKey: mapKey,
                  name: definition.name,
                  value: url
                }
              });
            }}
          >
            Select from media library
          </Button>
        </PropContainer>
      );
    case "range":
      return (
        <PropContainer>
          <Label>{definition.displayName}</Label>
          <Input
            type="range"
            value={value}
            min={definition.min}
            max={definition.max}
            step={definition.step}
            onChange={e =>
              dispatch({
                type: action,
                payload: {
                  id: uuid,
                  mapKey: mapKey,
                  name: definition.name,
                  value: e.target.value
                }
              })
            }
          />
        </PropContainer>
      );
    case "box-model":
      return (
        <PropContainer>
          <Label>{definition.displayName}</Label>
          <div css={{ width: "50%", margin: "0 auto" }}>
            <Number placeholder="top" />
          </div>
          <div css={{ display: "flex" }}>
            <Number placeholder="left" />
            <Number placeholder="right" />
          </div>
          <div css={{ width: "50%", margin: "0 auto" }}>
            <Number placeholder="bottom" />
          </div>
        </PropContainer>
      );

    case "checkbox":
      return (
        <PropContainer>
          <Label>{definition.displayName}</Label>
          <input
            type="checkbox"
            checked={value}
            onChange={e =>
              dispatch({
                type: action,
                payload: {
                  id: uuid,
                  mapKey: mapKey,
                  name: definition.name,
                  value: e.target.checked
                }
              })
            }
          />
          <span>{definition.label}</span>
        </PropContainer>
      );
    case "WYSIWYG":
      return <WYSIWYGButton {...props} />;
    default:
      return (
        <p>Field of type {definition.type} has not been implemented yet.</p>
      );
  }
};

const Prop = props => {
  const { state } = useContext(DragContext);
  const value = state[props.mapKey][props.uuid].props[props.definition.name];
  return <PropView action={UPDATE_PROP} value={value} {...props} />;
};

export default Prop;
