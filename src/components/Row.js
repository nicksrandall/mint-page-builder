import React, { useContext } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "@emotion/styled";

import Icon from "./Icon";
import { CLONE_ROW, ADD_COLUMN, DELETE_ROW } from "../hooks/useDragState";
import DragContext from "../contexts/DragContext";
import Column from "./Column";

const RowButton = styled.button`
  color: inherit;
  background: transparent;
  padding: 8px;
  margin: 0;
  outline: none;
  border: none;
`;

const Row = ({ row, index, drawerState, setDrawerState }) => {
  const { state, dispatch } = useContext(DragContext);
  return (
    <Draggable draggableId={row.id} index={index}>
      {(provided, snapshot) => (
        <div
          css={{ padding: "8px 0" }}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Droppable droppableId={row.id} type="COLUMN" direction="horizontal">
            {(dropProvided, dropSnapshot) => (
              <div
                css={{
                  border: dropSnapshot.isDraggingOver
                    ? "1px solid #66beb2"
                    : "1px solid rgba(0,0,0,0.14)",
                  background: "#fff",
                  display: "flex",
                  transition: "box-shadow 200ms cubic-bezier(.25,.8,.25,1)",
                  boxShadow: snapshot.isDragging
                    ? "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)"
                    : "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
                }}
              >
                <div
                  css={{
                    display: "flex",
                    flexDirection: "column",
                    alignSelf: "stretch",
                    borderRight: dropSnapshot.isDraggingOver
                      ? "1px solid #66beb2"
                      : "1px solid rgba(0,0,0,0.14)",
                    background: drawerState.row === row.id ? "#66beb2" : "#fff",
                    color: drawerState.row === row.id ? "#fff" : "#000"
                  }}
                >
                  <RowButton as="div" {...provided.dragHandleProps}>
                    <Icon icon="drag_indicator" label="Move" />
                  </RowButton>
                  <RowButton
                    onClick={() =>
                      setDrawerState({
                        open: true,
                        row: row.id,
                        column: null,
                        component: null
                      })
                    }
                  >
                    <Icon icon="settings" label="Settings" />
                  </RowButton>
                  <RowButton
                    onClick={() =>
                      dispatch({ type: DELETE_ROW, payload: { index } })
                    }
                  >
                    <Icon icon="delete" label="Delete" />
                  </RowButton>
                  <RowButton
                    onClick={() =>
                      dispatch({
                        type: CLONE_ROW,
                        payload: { index, id: row.id }
                      })
                    }
                  >
                    <Icon icon="file_copy" label="Clone" />
                  </RowButton>
                </div>
                <div
                  css={{
                    overflow: "auto",
                    width: "100%",
                    padding: "16px"
                  }}
                >
                  <div
                    css={{ display: "flex", flewWrap: "wrap" }}
                    ref={dropProvided.innerRef}
                    {...dropProvided.droppableProps}
                  >
                    {row.columns.length ? (
                      <>
                        {row.columns.map((id, idx) => {
                          return (
                            <Column
                              rowID={row.id}
                              columnCount={row.columns.length}
                              column={state.columnMap[id]}
                              drawerState={drawerState}
                              setDrawerState={setDrawerState}
                              index={idx}
                              key={id}
                            />
                          );
                        })}
                        {dropProvided.placeholder}
                      </>
                    ) : (
                      <div
                        css={{
                          width: "100%",
                          textAlign: "center",
                          padding: "24px",
                          color: "#999",
                          border: dropSnapshot.isDraggingOver
                            ? "1px dashed #66beb2"
                            : "1px dashed rgba(0,0,0,0.14)",
                          margin: "8px"
                        }}
                      >
                        Drag a column here or add a new one.
                      </div>
                    )}
                    <div css={{ padding: "16px" }}>
                      <button
                        css={{
                          border: "1px dashed rgba(0,0,0,0)",
                          background: "transparent",
                          width: "100%",
                          height: "100%",
                          textAlign: "center",
                          padding: "24px",
                          "&:hover": {
                            color: "#66beb2",
                            border: "1px dashed rgba(0,0,0,0.14)"
                          }
                        }}
                        onClick={() =>
                          dispatch({
                            type: ADD_COLUMN,
                            payload: { id: row.id }
                          })
                        }
                      >
                        <Icon
                          icon="add_circle_outline"
                          fontSize="20px"
                          label="Add Component"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Row;
