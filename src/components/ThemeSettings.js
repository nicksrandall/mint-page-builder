import React from "react";

import { SectionHeading } from "./DrawerUtils";

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
        <p>Global settings could go here?</p>
      </div>
    </div>
  );
};

export default TemplateSettings;
