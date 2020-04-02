import React, { useMemo } from "react";
import { Draggable } from "react-beautiful-dnd";
import Tooltip from "@reach/tooltip";
import "@reach/tooltip/styles.css";

import styled from "@emotion/styled";
import Icon from "./Icon";
import { useDrawerState } from "../contexts/DrawerContext";
import { useRegistry } from "../contexts/RegistryContext";
import { useDragState } from "../contexts/DragContext";

const HeaderControl = styled.button({
  color: "inherit",
  background: "transparent",
  outline: "none",
  border: "none",
  padding: 0,
  margin: 0
});

const Display = ({ type, value }) => {
  switch (type) {
    case "boolean":
      return value ? "Yes" : "No";
    case "text":
      return (
        <Tooltip
          css={{
            padding: "4px",
            fontSize: "12px",
            background: "#ccc",
            maxWidth: "300px",
            color: "#000",
            border: "none",
            wordWrap: "break-word",
            whiteSpace: "normal"
          }}
          label={value}
        >
          <span>{value}</span>
        </Tooltip>
      );
    case "image":
      return (
        <Tooltip
          css={{
            padding: "4px",
            fontSize: "12px",
            background: "#ccc",
            maxWidth: "300px",
            color: "#000",
            border: "none",
            whiteSpace: "normal",
            wordWrap: "break-word"
          }}
          label={
            <img src={value} css={{ width: "292px" }} alt="larger thumbnail" />
          }
        >
          <img
            css={{ height: "24px", display: "inline-block" }}
            src={value}
            alt="thumbnail"
          />
        </Tooltip>
      );
    case "color":
      return (
        <Tooltip
          css={{
            padding: "4px",
            fontSize: "12px",
            background: "#ccc",
            maxWidth: "300px",
            color: "#000",
            border: "none",
            whiteSpace: "normal",
            wordWrap: "break-word"
          }}
          label={value}
        >
          <div
            css={{
              backgroundColor: value,
              border: "1px solid #000",
              width: "22px",
              height: "22px",
              display: "inline-block"
            }}
          />
        </Tooltip>
      );
    case "json":
    default:
      return (
        <Tooltip
          css={{
            padding: "4px",
            fontSize: "12px",
            background: "#ccc",
            maxWidth: "300px",
            color: "#000",
            border: "none",
            whiteSpace: "pre"
          }}
          label={JSON.stringify(value, null, "  ")}
        >
          <span>{JSON.stringify(value)}</span>
        </Tooltip>
      );
  }
};

export const WidgetView = ({
  widget,
  provided,
  snapshot,
  onSettings,
  onDelete,
  onClone
}) => {
  const drawerState = useDrawerState();
  const propKeys = useMemo(() => Object.keys(widget.props).sort(), [
    widget.props
  ]);

  const registry = useRegistry();
  return (
    <div
      css={{
        border: snapshot.isDragging
          ? "1px solid #66beb2"
          : "1px solid rgba(0,0,0,0.14)",
        background: "#fff",
        transition: "box-shadow 200ms cubic-bezier(.25,.8,.25,1)",
        boxShadow: snapshot.isDragging
          ? "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)"
          : "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
      }}
    >
      <div
        css={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "4px",
          background: drawerState.component === widget.id ? "#66beb2" : "#fff",
          color: drawerState.component === widget.id ? "#fff" : "#000",
          borderBottom: snapshot.isDragging
            ? "1px solid #66beb2"
            : "1px solid rgba(0,0,0,0.14)"
        }}
      >
        <div css={{ display: "flex", alignItems: "center" }}>
          <Icon
            fontSize="16px"
            icon="drag_indicator"
            label="Move"
            {...provided.dragHandleProps}
          />
          <span
            css={{ fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
            onClick={onSettings}
          >
            {widget.name}
          </span>
        </div>
        <div>
          <HeaderControl onClick={onSettings}>
            <Icon fontSize="16px" icon="settings" label="Settings" />
          </HeaderControl>
          <HeaderControl onClick={onDelete}>
            <Icon fontSize="16px" icon="delete" label="Delete" />
          </HeaderControl>
          <HeaderControl onClick={onClone}>
            <Icon fontSize="16px" icon="file_copy" label="Clone" />
          </HeaderControl>
        </div>
      </div>
      <div
        css={{
          padding: "4px"
        }}
      >
        {propKeys.length ? (
          propKeys.map(name => {
            const type = registry.getPropDisplayType(widget.name, name);
            const displayName = registry.getPropDisplayName(widget.name, name);
            return (
              <div
                key={name}
                css={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                <div css={{ fontWeight: 700, paddingRight: "8px" }}>
                  {displayName}:
                </div>
                <Display type={type} value={widget.props[name]} />
              </div>
            );
          })
        ) : (
          <p>This widget has not configurable props</p>
        )}
      </div>
      {Array.isArray(widget.children) && widget.children.length ? (
        <div
          css={{
            padding: "4px"
          }}
        >
          <ChildrenList childs={widget.children} />
        </div>
      ) : null}
    </div>
  );
};

const ChildrenList = ({ childs }) => {
  const state = useDragState();
  return (
    <>
      <div css={{ fontWeight: 700, paddingRight: "8px", fontSize: "12px" }}>
        Children:
      </div>
      <ul css={{margin: 0}}>
      {childs.map(id => {
        const comp = state.subComponentMap[id];
        return (
          <li key={id} css={{ fontSize: "12px" }}>
            {comp.name}
          </li>
        );
      })}
      </ul>
    </>
  );
};

export const Widget = ({ widget, index, onSettings, onDelete, onClone }) => {
  return (
    <Draggable draggableId={widget.id} index={index}>
      {(provided, snapshot) => (
        <div
          css={{ padding: "8px 0" }}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <WidgetView
            provided={provided}
            snapshot={snapshot}
            widget={widget}
            onSettings={onSettings}
            onClone={onClone}
            onDelete={onDelete}
          />
        </div>
      )}
    </Draggable>
  );
};
