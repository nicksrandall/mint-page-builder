import React from "react";

import { SectionHeading } from "./DrawerUtils";
import Prop from "./Prop";

const columnSpec = {
  name: "Column",
  props: [
    { name: "mobileSpan",
      displayName: "Mobile Span",
      type: "select",
      options: [
        { label: "1 Column", value: 1 },
        { label: "2 Column", value: 2 },
        { label: "3 Column", value: 3 },
        { label: "4 Column", value: 4 }
      ]
    },
    {
      name: "tabletSpan",
      displayName: "Tablet Span",
      type: "select",
      options: [
        { label: "1 Column", value: 1 },
        { label: "2 Column", value: 2 },
        { label: "3 Column", value: 3 },
        { label: "4 Column", value: 4 },
        { label: "5 Column", value: 5 },
        { label: "6 Column", value: 6 },
        { label: "7 Column", value: 7 },
        { label: "8 Column", value: 8 }
      ]
    },
    {
      name: "desktopSpan",
      displayName: "Desktop Span",
      type: "select",
      options: [
        { label: "1 Column", value: 1 },
        { label: "2 Column", value: 2 },
        { label: "3 Column", value: 3 },
        { label: "4 Column", value: 4 },
        { label: "5 Column", value: 5 },
        { label: "6 Column", value: 6 },
        { label: "7 Column", value: 7 },
        { label: "8 Column", value: 8 },
        { label: "9 Column", value: 9 },
        { label: "10 Column", value: 10 },
        { label: "11 Column", value: 11 },
        { label: "12 Column", value: 12 }
      ]
    },
    {
      name: "padding",
      displayName: "Padding",
      type: "box-model"
    }
  ]
};

const handleSubmit = e => e.preventDefault();
const ColumnProps = ({ uuid }) => {
  return (
    <form action="" onSubmit={handleSubmit}>
      {columnSpec.props.map(prop => {
        return (
          <Prop
            definition={prop}
            uuid={uuid}
            mapKey="columnMap"
            key={prop.name}
          />
        );
      })}
    </form>
  );
};

const ColumnSettings = ({ column, onClick }) => {
  if (!column) return null;
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
          <span css={{ paddingLeft: "8px" }}>Column Settings</span>
        </div>
      </div>
      <div css={{ padding: "8px" }}>
        <SectionHeading>Props</SectionHeading>
        <ColumnProps uuid={column.id} />
      </div>
    </div>
  );
};

export default ColumnSettings;
