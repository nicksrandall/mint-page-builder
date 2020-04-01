import React from "react";

import { Widget } from "./Widget";
import { useDragUpdater } from "../contexts/DragContext";
import { DELETE_WIDGET, CLONE_WIDGET } from "../hooks/useDragState";
import { useDrawerUpdater } from "../contexts/DrawerContext";

const Comp = React.memo(({ rowID, columnID, widget, index }) => {
  const dispatch = useDragUpdater();
  const setDrawerState = useDrawerUpdater();
  return (
    <Widget
      widget={widget}
      index={index}
      onDelete={() =>
        dispatch({
          type: DELETE_WIDGET,
          payload: { columnID, id: widget.id, index: index }
        })
      }
      onClone={() =>
        dispatch({
          type: CLONE_WIDGET,
          payload: { columnID, id: widget.id, index: index }
        })
      }
      onSettings={() =>
        setDrawerState({
          open: true,
          row: rowID,
          column: columnID,
          component: widget.id,
          subComponent: null,
        })
      }
    />
  );
});

export default Comp;
