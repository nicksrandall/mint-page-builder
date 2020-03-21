import React, { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import styled from "@emotion/styled";

import useDragState, {
  ADD_ROW,
  REORDER_ROW,
  REORDER_WIDGET,
  REORDER_COLUMN
} from "./hooks/useDragState";
import Sidebar from "./components/Sidebar";
import Row from "./components/Row";
import Preview from "./components/Preview";
import DragContext from "./contexts/DragContext";
import Icon from "./components/Icon";

const HeaderButton = styled.button`
  background: ${({ active }) => (active ? "#fff" : "#a9ebe2")};
  border: 1px solid #a9ebe2;
  outline: none;
  padding: 8px 12px;
  cursor: pointer;
`;

const App = () => {
  const [preview, setPreview] = useState(false);
  const [state, dispatch] = useDragState();
  const [drawerState, setDrawerState] = useState({
    row: null,
    column: null,
    component: null
  });

  const onDragEnd = result => {
    const { source, destination } = result;
    if (!result.destination) {
      return;
    }

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (result.type === "ROW") {
      dispatch({ type: REORDER_ROW, payload: result });
    }

    if (result.type === "COLUMN") {
      dispatch({ type: REORDER_COLUMN, payload: result });
    }

    if (result.type === "WIDGET") {
      dispatch({ type: REORDER_WIDGET, payload: result });
    }
  };

  return (
    <DragContext.Provider value={{ state, dispatch }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          css={{ display: "flex", flexDirection: "column", height: "100vh" }}
        >
          {/* app bar */}
          <div
            css={{
              height: "56px",
              width: "100%",
              background: "#66beb2",
              color: "#fff",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              boxShadow: "0 2px 4px rgba(0,0,0,.5)",
              zIndex: 1
            }}
          >
            <div css={{ fontSize: "24px" }}>Mint</div>
            <div>
              <HeaderButton active={!preview} onClick={() => setPreview(false)}>
                Settings
              </HeaderButton>
              <HeaderButton active={preview} onClick={() => setPreview(true)}>
                Preview
              </HeaderButton>
            </div>
          </div>
          {preview ? (
            <Preview state={state} />
          ) : (
            <div css={{ display: "flex", height: "100%", overflow: "hidden" }}>
              {/* content area */}
              <div
                css={{
                  backgroundColor: "#f8f8f8",
                  width: "100%",
                  height: "100%",
                  flexGrow: 1,
                  flexShrink: 1,
                  overflowX: "hidden"
                }}
              >
                <div css={{ padding: "16px" }}>
                  <Droppable droppableId="row" type="ROW" direction="vertical">
                    {provided => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {state.ordered.map((id, index) => (
                          <Row
                            row={state.rowMap[id]}
                            drawerState={drawerState}
                            setDrawerState={setDrawerState}
                            index={index}
                            key={id}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <div css={{ textAlign: "center" }}>
                    <button
                      onClick={() => dispatch({ type: ADD_ROW })}
                      css={{
                        width: '100%',
                        border: "1px dashed rgba(0,0,0,0)",
                        padding: "24px",
                        background: "transparent",
                        "&:hover": {
                          color: "#66beb2",
                          border: "1px dashed rgba(0,0,0,0.14)"
                        }
                      }}
                    >
                      <Icon icon="add_circle_outline" fontSize="24px" label="Add Row" />
                    </button>
                  </div>
                </div>
              </div>
              {/* side bar */}
              <Sidebar
                data={state}
                state={drawerState}
                setState={setDrawerState}
              />
            </div>
          )}
        </div>
      </DragDropContext>
    </DragContext.Provider>
  );
};

export default App;
