import { createContext, useContext } from "react";

const SDKContext = createContext();

function useSDK() {
  return useContext(SDKContext);
}

export { useSDK, SDKContext };
