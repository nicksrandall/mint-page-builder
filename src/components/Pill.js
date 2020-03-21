import React from "react";

const Pill = ({ name }) => {
  return (
    <div css={{ padding: "8px", border: "1px dashed rgba(0,0,0,0.14)" }}>
      {name}
    </div>
  );
};

export default Pill;
