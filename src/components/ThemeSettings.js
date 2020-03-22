import React from "react";

import { SectionHeading } from "./DrawerUtils";
import { PropView } from "./Prop";
import { UPDATE_THEME } from "../hooks/useDragState";
import {useDragState} from "../contexts/DragContext";

const templateSpec = {
  name: "Template",
  props: [
    {
      name: "template",
      displayName: "Template",
      type: "select",
      defaultValue: "main",
      values: [
        { label: "Main", value: "main" },
        { label: "No Header", value: "no-header" },
        { label: "News", value: "news" }
      ]
    },
    {
      name: "logo",
      displayName: "Logo",
      type: "media",
      defaultVlaue: "/some/path/logo.png"
    }
  ]
};

const Prop = props => {
  const state = useDragState();
  const value = state.template.props[props.definition.name];
  return <PropView action={UPDATE_THEME} value={value} {...props} />;
};

const handleSubmit = e => e.preventDefault();
const TemplateProps = () => {
  return (
    <form action="" onSubmit={handleSubmit}>
      {templateSpec.props.map(prop => {
        return (
          <Prop
            definition={prop}
            mapKey="template"
            uuid="template"
            key={prop.name}
          />
        );
      })}
    </form>
  );
};

const TemplateSettings = ({onClick}) => {
  return (
    <div css={{ width: "100%" }}>
      <div
        onClick={onClick}
        css={{
          cursor: 'pointer',
          padding: "8px",
          display: "flex",
          alignItems: "center",
          height: "48px"
        }}
      >
        <span css={{ paddingLeft: "8px" }}>Template Settings</span>
      </div>
      <div css={{ padding: "8px" }}>
        <SectionHeading>Props</SectionHeading>
        <TemplateProps />
      </div>
    </div>
  );
};

export default TemplateSettings;
