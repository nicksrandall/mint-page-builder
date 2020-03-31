import React, { useMemo } from "react";

import { useRegistry } from "../contexts/RegistryContext";
import { SectionHeading } from "./DrawerUtils";
import Prop from "./Prop";

const handleSubmit = e => e.preventDefault();
const ComponentProps = ({ name, uuid }) => {
  const registry = useRegistry();
  const spec = useMemo(() => registry.getDefinition(name), [name, registry]);
  return (
    <form action="" onSubmit={handleSubmit}>
      {spec.props.map(prop => {
        return (
          <Prop
            definition={prop}
            uuid={uuid}
            key={prop.name}
            mapKey="componentMap"
          />
        );
      })}
    </form>
  );
};

const Settings = ({ component }) => {
  if (!component) return null;
  return (
    <div css={{ width: "100%" }}>
      <div css={{ width: "100%" }}>
        <div
          css={{
            padding: "8px",
            display: "flex",
            alignItems: "center",
            height: "48px"
          }}
        >
          <span css={{ paddingLeft: "8px" }}>Component Settings</span>
        </div>
      </div>
      <div css={{ padding: "8px" }}>
        <SectionHeading>Props</SectionHeading>
        <ComponentProps name={component.name} uuid={component.id} />
      </div>
    </div>
  );
};

export default Settings;
