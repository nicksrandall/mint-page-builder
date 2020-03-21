import React, { useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import Tooltip from "@reach/tooltip";
import "@reach/tooltip/styles.css";

import DragContext from "../contexts/DragContext";
import styled from "@emotion/styled";
import { DELETE_WIDGET, CLONE_WIDGET } from "../hooks/useDragState";
import Icon from "./Icon";

const HeaderControl = styled.button({
  color: "inherit",
  background: "transparent",
  outline: "none",
  border: "none",
  padding: 0,
  margin: 0
});

const Widget = ({
  rowID,
  columnID,
  widget,
  index,
  drawerState,
  setDrawerState
}) => {
  const { dispatch } = useContext(DragContext);
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
              {Object.keys(widget.props).map(name => {
                return (
                  <div
                    key={name}
                    css={{
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    <strong>{name}:</strong>
                    {` `}
                    <Tooltip
                      css={{
                        padding: "4px",
                        fontSize: "12px",
                        background: "#ccc",
                        color: "#000",
                        border: "none"
                      }}
                      label={widget.props[name]}
                    >
                      <span>{widget.props[name]}</span>
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Widget;
