import React, { useEffect, useState, useRef, useReducer } from "react";
import styled from "@emotion/styled";
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import debounceFn from "debounce-fn";
import Popover, { positionDefault } from "@reach/popover";
import { SketchPicker } from "react-color";
import { Sx } from "@theme-ui/editor";
import { useThemeUI } from "theme-ui";

import { useDragState, useDragUpdater } from "../contexts/DragContext";
import { UPDATE_PROP } from "../hooks/useDragState";
// import WYSIWYG from './Slate';
import WYSIWYG from "./Wysiwyg";
import { useSDK } from "../contexts/ContentfulSDK";

const debounce = (callback, options) => {
  const debounced = debounceFn(callback, options);
  return e => {
    e.persist();
    return debounced(e);
  };
};

const Label = styled.label`
  font-size: 14px;
  display: block;
  padding-bottom: 8px;
`;

const PropContainer = styled.div`
  font-size: 12px;
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

const WYSIWYGButton = React.memo(
  ({ action, value, definition, uuid, mapKey }) => {
    const dispatch = useDragUpdater();
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
  }
);

const ColorPicker = ({ value = "#66beb2", onChange }) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        ref={ref}
        onClick={() => setIsOpen(v => !v)}
        css={{
          border: "none",
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer"
        }}
      >
        <div
          css={{
            width: "36px",
            height: "15px",
            borderRadius: "2px",
            background: value
          }}
        />
      </button>
      {isOpen ? (
        <Popover targetRef={ref} position={positionDefault}>
          <SketchPicker
            color={value}
            onChangeComplete={v => {
              onChange(v.hex);
              setIsOpen(false);
            }}
          />
        </Popover>
      ) : null}
    </div>
  );
};

const bmReducer = (state, next) => ({ ...state, ...next });
const BoxModel = ({ value = {}, onChange }) => {
  const [style, setStyle] = useReducer(bmReducer, value);
  useEffect(() => {
    onChange(style);
  }, [style, onChange]);
  return (
    <div css={{ fontSize: "12px" }}>
      <Sx.Padding
        value={style}
        onChange={v => {
          setStyle(v);
        }}
      />
    </div>
  );
};

const Typography = ({ value = {}, onChange }) => {
  const { theme } = useThemeUI();
  const [style, setStyle] = useReducer(bmReducer, value);
  useEffect(() => {
    onChange(style);
  }, [style, onChange]);
  return (
    <Sx.Typography
      value={style}
      theme={theme}
      onChange={value => setStyle(value)}
    />
  );
};

const Media = ({ value, onChange }) => {
  const sdk = useSDK();
  return (
    <>
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
          sdk.dialogs.selectSingleAsset().then(data => {
            console.log("data", data);
            onChange(data?.fields?.file["en-US"].url);
          });
        }}
      >
        Select from media library
      </Button>
    </>
  );
};

export const PropView = React.memo(props => {
  const { action, value, definition, uuid, mapKey } = props;
  const dispatch = useDragUpdater();
  switch (definition.type) {
    case "text":
      return (
        <PropContainer>
          <Label>{definition.displayName}</Label>
          <Input
            type="text"
            defaultValue={value}
            placeholder={definition.placeholder}
            onChange={debounce(
              e =>
                dispatch({
                  type: action,
                  payload: {
                    id: uuid,
                    mapKey: mapKey,
                    name: definition.name,
                    value: e.target.value
                  }
                }),
              { wait: 100 }
            )}
          />
        </PropContainer>
      );
    case "url":
      return (
        <PropContainer>
          <Label>{definition.displayName}</Label>
          <Input
            type="url"
            defaultValue={value}
            placeholder={definition.placeholder}
            onChange={debounce(
              e =>
                dispatch({
                  type: action,
                  payload: {
                    id: uuid,
                    mapKey: mapKey,
                    name: definition.name,
                    value: e.target.value
                  }
                }),
              { wait: 100 }
            )}
          />
        </PropContainer>
      );
    case "color":
      return (
        <PropContainer>
          <Label>{definition.displayName}</Label>
          <ColorPicker
            type="color"
            value={value}
            onChange={value =>
              dispatch({
                type: action,
                payload: {
                  id: uuid,
                  mapKey: mapKey,
                  name: definition.name,
                  value: value
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
            {definition.options.map(option => {
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
          <Media
            value={value}
            onChange={url => {
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
          />
        </PropContainer>
      );
    case "range":
      return (
        <PropContainer>
          <Label>{definition.displayName}</Label>
          <Input
            type="range"
            defaultValue={value}
            min={definition.min}
            max={definition.max}
            step={definition.step}
            onChange={debounce(
              e =>
                dispatch({
                  type: action,
                  payload: {
                    id: uuid,
                    mapKey: mapKey,
                    name: definition.name,
                    value: e.target.value
                  }
                }),
              { wait: 100 }
            )}
          />
        </PropContainer>
      );
    case "box-model":
      return (
        <PropContainer>
          <Label>{definition.displayName}</Label>
          <BoxModel
            onChange={v => {
              dispatch({
                type: action,
                payload: {
                  id: uuid,
                  mapKey: mapKey,
                  name: definition.name,
                  value: v
                }
              });
            }}
            value={value}
          />
        </PropContainer>
      );

    case "checkbox":
      return (
        <PropContainer>
          <Label>{definition.displayName}</Label>
          <input
            type="checkbox"
            defaultChecked={value}
            onChange={debounce(
              e =>
                dispatch({
                  type: action,
                  payload: {
                    id: uuid,
                    mapKey: mapKey,
                    name: definition.name,
                    value: e.target.checked
                  }
                }),
              { wait: 100 }
            )}
          />
          <span>{definition.label}</span>
        </PropContainer>
      );
    case "WYSIWYG":
      return <WYSIWYGButton {...props} />;
    case "typography":
      return (
        <PropContainer>
          <Label>{definition.displayName}</Label>
          <Typography
            value={value}
            onChange={v => {
              dispatch({
                type: action,
                payload: {
                  id: uuid,
                  mapKey: mapKey,
                  name: definition.name,
                  value: v
                }
              });
            }}
          />
        </PropContainer>
      );
    default:
      return (
        <p>Field of type {definition.type} has not been implemented yet.</p>
      );
  }
});

const Prop = props => {
  const state = useDragState();
  const value = state[props.mapKey][props.uuid].props[props.definition.name];
  return <PropView action={UPDATE_PROP} value={value} {...props} />;
};

export default Prop;
