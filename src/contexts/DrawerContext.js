import React, { createContext, useContext, useState } from "react";

const DrawerStateContext = createContext();
const DrawerUpdaterContext = createContext();

const DrawerProvider = props => {
  const [drawerState, setDrawerState] = useState({
    open: false,
    row: null,
    column: null,
    component: null,
    subComponent: null,
  });
  return (
    <DrawerStateContext.Provider value={drawerState}>
      <DrawerUpdaterContext.Provider value={setDrawerState}>
        {props.children}
      </DrawerUpdaterContext.Provider>
    </DrawerStateContext.Provider>
  );
};

function useDrawerState() {
  return useContext(DrawerStateContext);
}

function useDrawerUpdater() {
  return useContext(DrawerUpdaterContext);
}

export { DrawerProvider, useDrawerState, useDrawerUpdater };
