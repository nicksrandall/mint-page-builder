import React, { useMemo } from "react";
import { Draggable } from "react-beautiful-dnd";
import Tooltip from "@reach/tooltip";
import "@reach/tooltip/styles.css";

import styled from "@emotion/styled";
import { DELETE_WIDGET, CLONE_WIDGET } from "../hooks/useDragState";
import Icon from "./Icon";
import { useDragUpdater } from "../contexts/DragContext";
import { useDrawerState, useDrawerUpdater } from "../contexts/DrawerContext";
import registry from "../utils/componentRegistery";

const HeaderControl = styled.button({
  color: "inherit",
  background: "transparent",
  outline: "none",
  border: "none",
  padding: 0,
  margin: 0
});

const Widget = React.memo(({ rowID, columnID, widget, index }) => {
  const dispatch = useDragUpdater();
  const setDrawerState = useDrawerUpdater();
  const drawerState = useDrawerState();
  const propKeys = useMemo(() => Object.keys(widget.props).sort(), [
    widget.props
  ]);

  return (
    <Draggable draggableId={widget.id} index={index}>
      {(provided, snapshot) => (
        <div
          css={{ padding: "8px 0" }}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
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
                background:
                  drawerState.component === widget.id ? "#66beb2" : "#fff",
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
                  onClick={() =>
                    setDrawerState({
                      open: true,
                      row: rowID,
                      column: columnID,
                      component: widget.id
                    })
                  }
                >
                  {widget.name}
                </span>
              </div>
              <div>
                <HeaderControl
                  onClick={() =>
                    setDrawerState({
                      open: true,
                      row: rowID,
                      column: columnID,
                      component: widget.id
                    })
                  }
                >
                  <Icon fontSize="16px" icon="settings" label="Settings" />
                </HeaderControl>
                <HeaderControl
                  onClick={() =>
                    dispatch({
                      type: DELETE_WIDGET,
                      payload: { columnID, id: widget.id, index: index }
                    })
                  }
                >
                  <Icon fontSize="16px" icon="delete" label="Delete" />
                </HeaderControl>
                <HeaderControl
                  onClick={() =>
                    dispatch({
                      type: CLONE_WIDGET,
                      payload: { columnID, id: widget.id, index: index }
                    })
                  }
                >
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
                  return (
                    <div
                      key={name}
                      css={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      <strong>{name}:</strong>
                      {` `}
                      <Display type={type} value={widget.props[name]} />
                    </div>
                  );
                })
              ) : (
                <p>This widget has not configurable props</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
});

const Display = ({ type, value }) => {
  switch (type) {
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
            whiteSpace: 'normal',
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
            whiteSpace: 'normal',
            wordWrap: "break-word"
          }}
          label={<img src={value} css={{ width: '300px' }} alt="larger thumbnail" />}
        >
          <img css={{ height: "24px", display: "inline-block" }} src={value} alt="thumbnail" />
        </Tooltip>
      );
    case "color":
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
            whiteSpace: 'normal',
            wordWrap: "break-word"
          }}
          label={value}
        >
          <div
            css={{
              backgroundColor: value,
              width: "24px",
              height: "24px",
              display: "inline-block"
            }}
          />
        </Tooltip>
      );
  }
};

export default Widget;
