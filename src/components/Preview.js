import React, { useMemo, useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
// import jsonlint from "jsonlint";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

import { FORCE_UPDATE } from "../hooks/useDragState";
import { useDragState, useDragUpdater } from "../contexts/DragContext";
import { format, unformat } from "../utils/formatJSON";
import { Button } from "@contentful/forma-36-react-components";

window.jsonlint = require("jsonlint-mod");
require("codemirror/mode/javascript/javascript");
require("codemirror/addon/lint/lint.css");
require("codemirror/addon/lint/lint");
require("codemirror/addon/lint/json-lint");

const Preview = ({ onClose }) => {
  const state = useDragState();
  const dispatch = useDragUpdater();
  const json = useMemo(() => {
    return JSON.stringify(format(state), null, "  ");
  }, [state]);
  const [value, setValue] = useState(json);

  return (
    <div css={{ width: "100%", height: "100%" }}>
      <CodeMirror
        value={value}
        options={{
          mode: { name: "javascript", json: true },
          theme: "material",
          lineNumbers: true,
          smartIndent: true, // javascript mode does bad things with jsx indents
          tabSize: 2,
          gutters: ["CodeMirror-lint-markers"],
          lint: true
        }}
        onBeforeChange={(editor, data, value) => {
          setValue(value);
        }}
      />
      <div css={{ display: "flex", justifyContent: "flex-end" }}>
        <div css={{ padding: "12px" }}>
          <Button buttonType="muted" onClick={onClose}>
            Close
          </Button>
        </div>
        <div css={{ padding: "12px" }}>
          <Button
            buttonType="positive"
            onClick={() => {
              try {
                const obj = window.jsonlint.parse(value);
                dispatch({ type: FORCE_UPDATE, payload: unformat(obj) });
                onClose();
              } catch (e) {
                onClose();
              }
            }}
          >
            Save and Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Preview;
