import React, { createContext, useContext } from "react";
import useDrag from "../hooks/useDragState";

const DragStateContext = createContext();
const DragUpdaterContext = createContext();

const DragProvider = props => {
  const [state, dispatch] = useDrag(props.initialValue);
  return (
    <DragStateContext.Provider value={state}>
      <DragUpdaterContext.Provider value={dispatch}>
        {props.children}
      </DragUpdaterContext.Provider>
    </DragStateContext.Provider>
  );
};

function useDragState() {
  return useContext(DragStateContext);
}

function useDragUpdater() {
  const dispatch = useContext(DragUpdaterContext);
  return dispatch;
  // return useCallback(dispatch, [dispatch]);
}

export { DragProvider, useDragState, useDragUpdater };
