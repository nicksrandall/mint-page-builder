import React from "react";

import { SectionHeading } from "./DrawerUtils";
import Prop from "./Prop";

const rowSpec = {
  name: "Row",
  props: [
    {
      name: "backgroundImage",
      displayName: "Background Image",
      type: "media"
    },
    {
      name: "backgroundColor",
      displayName: "Background Color",
      type: "color"
    },
    {
      name: "fluid",
      displayName: "Fluid Content",
      type: "checkbox",
      label: "Yes"
    }
  ]
};

const handleSubmit = e => e.preventDefault();
const RowProps = ({ uuid }) => {
  return (
    <form action="" onSubmit={handleSubmit}>
      {rowSpec.props.map(prop => {
        return (
          <Prop definition={prop} mapKey="rowMap" uuid={uuid} key={prop.name} />
        );
      })}
    </form>
  );
};

const RowSettings = ({ row, onClick }) => {
  if (!row) return null;
  return (
    <div css={{ width: "100%" }}>
      <div css={{ width: "100%" }}>
        <div
          css={{
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            height: "48px"
          }}
          onClick={onClick}
        >
          <span css={{ paddingLeft: "8px" }}>Row Settings</span>
        </div>
      </div>
      <div css={{ padding: "8px" }}>
        <SectionHeading>Props</SectionHeading>
        <RowProps uuid={row.id} />
      </div>
    </div>
  );
};

export default RowSettings;
