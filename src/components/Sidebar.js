import React, { useRef, useEffect } from "react";

import ThemeSettings from "./ThemeSettings";
import ComponentSettings from "./ComponentSettings";
import ColumnSettings from "./ColumnSettings";
import RowSettings from "./RowSettings";

const Drawer = ({ depth, maxDepth, open, children }) => {
  const previous = useRef(0);
  useEffect(() => {
    const d = maxDepth;
    return () => {
      previous.current = d;
    };
  }, [maxDepth]);
  return (
    <div
      css={{
        position: "absolute",
        width: "270px",
        top: `${depth * 48}px`,
        height: `calc(100vh - ${(depth + 1) * 48}px)`,
        left: 0,
        background: "#fff",
        transition: "transform 250ms ease-out",
        transitionDelay: open
          ? `${200 * depth}ms`
          : `${200 * (previous.current - depth)}ms`,
        transform: open ? "translate3d(0%, 0, 0)" : "translate3d(110%, 0, 0)",
        borderLeft: "1px solid rgba(0,0,0,0.14)",
        boxShadow:
          "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)"
      }}
    >
      {children}
    </div>
  );
};

const Sidebar = ({ data, state, setState }) => {
  const maxDepth = state.component ? 2 : state.column ? 1 : 0;
  return (
    <div
      css={{
        position: "relative",
        width: "270px",
        height: "calc(100vh - 56px)",
        borderLeft: "1px solid rgba(0,0,0,0.14)",
        flexShrink: 0,
        flexGrow: 0
      }}
    >
      <ThemeSettings
        onClick={() =>
          setState({ row: null, column: null, component: null })
        }
      />
      <Drawer depth={1} maxDepth={maxDepth} open={!!state.row}>
        <RowSettings
          row={data.rowMap[state.row]}
          onClick={() => setState(state => ({ ...state, column: null, component: null }))}
        />
      </Drawer>
      <Drawer depth={2} maxDepth={maxDepth} open={!!state.column}>
        <ColumnSettings
          column={data.columnMap[state.column]}
          onClick={() =>
            setState(state => ({ ...state, component: null }))
          }
        />
      </Drawer>
      <Drawer depth={3} maxDepth={maxDepth} open={!!state.component}>
        <ComponentSettings
          component={data.componentMap[state.component]}
        />
      </Drawer>
    </div>
  );
};

export default Sidebar;