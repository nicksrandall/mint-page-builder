import React, { Suspense, useMemo, useCallback, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { ThemeProvider } from "theme-ui";
import { base } from "@theme-ui/presets";

import {
  ADD_ROW,
  REORDER_ROW,
  REORDER_WIDGET,
  REORDER_COLUMN,
  REORDER_SUB_WIDGET
} from "./hooks/useDragState";
import Sidebar from "./components/Sidebar";
import Row from "./components/Row";
import {
  DragProvider,
  useDragState,
  useDragUpdater
} from "./contexts/DragContext";
import { DrawerProvider, useDrawerUpdater } from "./contexts/DrawerContext";
import Icon from "./components/Icon";
import mq from "./utils/mediaQueries";
import { unformat } from "./utils/formatJSON";
import { SDKContext } from "./contexts/ContentfulSDK";
import { RegistryContext } from "./contexts/RegistryContext";

const Preview = React.lazy(() => import("./components/Preview"));

const Rows = () => {
  const state = useDragState();
  return (
    <Droppable droppableId="row" type="ROW" direction="vertical">
      {provided => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {state.ordered.map((id, index) => (
            <Row row={state.rowMap[id]} index={index} key={id} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

const AddMore = () => {
  const dispatch = useDragUpdater();
  return (
    <div css={{ textAlign: "center" }}>
      <button
        onClick={() => dispatch({ type: ADD_ROW })}
        css={{
          width: "100%",
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
  );
};

const Drag = ({ children }) => {
  const dispatch = useDragUpdater();
  const onDragEnd = useCallback(
    result => {
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

      if (result.type === "SUB_WIDGET") {
        dispatch({ type: REORDER_SUB_WIDGET, payload: result });
      }
    },
    [dispatch]
  );
  return <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>;
};

const MenuButton = () => {
  const setDrawerState = useDrawerUpdater();
  return (
    <button
      css={mq({
        position: "fixed",
        top: 12,
        right: 12,
        display: ["block", "block", "none"],
        color: "#fff",
        background: "#66beb2",
        border: "none",
        outline: "none",
        padding: "12px"
      })}
      onClick={() => setDrawerState(state => ({ ...state, open: !state.open }))}
    >
      <Icon icon="menu" />
    </button>
  );
};

const App = ({ sdk, registry }) => {
  const [showJSON, setShowJSON] = useState(false);
  const value = useMemo(() => {
    return unformat(sdk.parameters.invocation.initialValue);
  }, [sdk.parameters.invocation.initialValue]);

  const onClose = useCallback(data => sdk.close(data), [sdk]);
  const toggleJSON = useCallback(() => setShowJSON(v => !v), []);

  return (
    <RegistryContext.Provider value={registry}>
      <SDKContext.Provider value={sdk}>
        <ThemeProvider theme={base}>
          <DragProvider sdk={sdk} initialValue={value}>
            <DrawerProvider>
              {showJSON ? (
                <Suspense fallback={<div>loading...</div>}>
                  <Preview onClose={toggleJSON} />
                </Suspense>
              ) : (
                <Drag>
                  <div
                    css={{
                      display: "flex",
                      height: "100%",
                      overflow: "hidden",
                      position: "relative"
                    }}
                  >
                    {/* content area */}
                    <div
                      css={{
                        backgroundColor: "#f8f8f8",
                        width: "100%",
                        height: "100vh",
                        flexGrow: 1,
                        flexShrink: 1,
                        overflowX: "hidden"
                      }}
                    >
                      <div css={{ padding: "16px" }}>
                        <Rows />
                        <AddMore />
                      </div>
                    </div>
                    {/* side bar */}
                    <MenuButton />
                    <Sidebar onSave={onClose} toggleJson={toggleJSON} />
                  </div>
                </Drag>
              )}
            </DrawerProvider>
          </DragProvider>
        </ThemeProvider>
      </SDKContext.Provider>
    </RegistryContext.Provider>
  );
};

export default App;
