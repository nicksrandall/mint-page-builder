import React, { useState } from "react";
import styled from "@emotion/styled";
import { Draggable, Droppable } from "react-beautiful-dnd";
import uuid from "@lukeed/uuid";

import ComponentModal from "./ComponentModal";
import Icon from "./Icon";
import { ADD_WIDGET, DELETE_COLUMN, CLONE_COLUMN } from "../hooks/useDragState";
import Widget from "./Component";
import {useDragState, useDragUpdater} from "../contexts/DragContext";
import {useDrawerState, useDrawerUpdater} from "../contexts/DrawerContext";

const Sizing = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0 4px;
  font-size: 16px;
`;

const HeaderControl = styled.button({
  color: "inherit",
  background: "transparent",
  outline: "none",
  border: "none",
  padding: 0,
  margin: 0
});

const Column = React.memo(({ rowID, column, index }) => {
  const state = useDragState();
  const dispatch = useDragUpdater();
  const setDrawerState = useDrawerUpdater();
  const drawerState = useDrawerState();
  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <div
          css={{
            flexShrink: 0,
            width: "300px",
            display: "block",
            padding: "16px"
          }}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Droppable droppableId={column.id} type="WIDGET" direction="vertical">
            {(dropProvided, dropSnapshot) => (
              <div
                css={{
                  background: "#fff",
                  border:
                    snapshot.isDragging || dropSnapshot.isDraggingOver
                      ? "1px solid #66beb2"
                      : "1px solid rgba(0,0,0,0.14)",
                  transition: "box-shadow 200ms cubic-bezier(.25,.8,.25,1)",
                  boxShadow: snapshot.isDragging
                    ? "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)"
                    : "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
                }}
              >
                <div
                  css={{
                    display: "flex",
                    padding: "4px",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom:
                      snapshot.isDragging || dropSnapshot.isDraggingOver
                        ? "1px solid #66beb2"
                        : "1px solid rgba(0,0,0,0.14)",
                    background:
                      drawerState.column === column.id ? "#66beb2" : "#fff",
                    color: drawerState.column === column.id ? "#fff" : "#000"
                  }}
                >
                  <div css={{ display: "flex", alignItems: "center" }}>
                    <Icon
                      label="Move"
                      fontSize="16px"
                      icon="drag_indicator"
                      {...provided.dragHandleProps}
                    />
                    <div
                      css={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer"
                      }}
                      onClick={() =>
                        setDrawerState({
                          open: true,
                          row: rowID,
                          column: column.id,
                          component: null,
                          subComponent: null,
                        })
                      }
                    >
                      <Sizing>
                        <Icon
                          icon="phone_iphone"
                          fontSize="12px"
                          label={`Content spans ${column.props.mobileSpan} columns on mobile`}
                        />
                        {column.props.mobileSpan}
                      </Sizing>
                      <Sizing>
                        <Icon
                          icon="tablet_mac"
                          fontSize="12px"
                          label={`Content spans ${column.props.tabletSpan} columns on tablet`}
                        />
                        {column.props.tabletSpan}
                      </Sizing>
                      <Sizing>
                        <Icon
                          icon="desktop_mac"
                          fontSize="12px"
                          label={`Content spans ${column.props.desktopSpan} columns on desktop`}
                        />
                        {column.props.desktopSpan}
                      </Sizing>
                    </div>
                  </div>
                  <div>
                    <HeaderControl
                      onClick={() =>
                        setDrawerState({
                          open: true,
                          row: rowID,
                          column: column.id,
                          component: null,
                          subComponent: null,
                        })
                      }
                    >
                      <Icon icon="settings" fontSize="16px" label="Settings" />
                    </HeaderControl>
                    <HeaderControl
                      onClick={() =>
                        dispatch({
                          type: DELETE_COLUMN,
                          payload: { index, rowID, id: column.id }
                        })
                      }
                    >
                      <Icon icon="delete" fontSize="16px" label="Delete" />
                    </HeaderControl>
                    <HeaderControl
                      onClick={() =>
                        dispatch({
                          type: CLONE_COLUMN,
                          payload: { index, rowID, id: column.id }
                        })
                      }
                    >
                      <Icon icon="file_copy" fontSize="16px" label="Clone" />
                    </HeaderControl>
                  </div>
                </div>
                <div
                  css={{
                    padding: "8px"
                  }}
                >
                  <div
                    ref={dropProvided.innerRef}
                    {...dropProvided.droppableProps}
                  >
                    {column.components.length === 0 ? (
                      <>
                        <div
                          css={{
                            width: "100%",
                            textAlign: "center",
                            padding: "24px",
                            color: "#999",
                            border: dropSnapshot.isDraggingOver
                              ? "1px dashed #66beb2"
                              : "1px dashed rgba(0,0,0,0.14)",
                            marginBottom: "8px"
                          }}
                        >
                          Drag a component here or add a new one.
                        </div>
                        <div css={{ display: "none" }}>
                          {dropProvided.placeholder}
                        </div>
                      </>
                    ) : (
                      <>
                        {column.components.map((id, index) => (
                          <Widget
                            key={id}
                            widget={state.componentMap[id]}
                            index={index}
                            rowID={rowID}
                            columnID={column.id}
                          />
                        ))}
                        {dropProvided.placeholder}
                      </>
                    )}
                  </div>
                  <div css={{ textAlign: "center" }}>
                    <button
                      onClick={open}
                      css={{
                        width: "100%",
                        border: "1px dashed rgba(0,0,0,0)",
                        padding: "12px 24px",
                        background: "transparent",
                        "&:hover": {
                          color: "#66beb2",
                          border: "1px dashed rgba(0,0,0,0.14)"
                        }
                      }}
                    >
                      <Icon
                        icon="add_circle_outline"
                        fontSize="20px"
                        label="Add Component"
                      />
                    </button>
                  </div>
                  <ComponentModal
                    isOpen={showDialog}
                    close={close}
                    onSelectComponent={name => {
                      const id = uuid();
                      dispatch({
                        type: ADD_WIDGET,
                        payload: { columnID: column.id, name, id }
                      });
                      setDrawerState({
                        row: rowID,
                        column: column.id,
                        component: id,
                        subComponent: null,
                      });
                    }}
                  />
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
});

export default Column;
