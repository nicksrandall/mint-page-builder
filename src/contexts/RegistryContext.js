import { createContext, useContext } from "react";

const RegistryContext = createContext();

function useRegistry() {
  return useContext(RegistryContext);
}

export { useRegistry, RegistryContext };
