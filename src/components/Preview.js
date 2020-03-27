import React, { useMemo, useState, useCallback } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import debounce from "debounce-fn";
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
  const [isValid, setValid] = useState(true);
  const state = useDragState();
  const dispatch = useDragUpdater();
  const json = useMemo(() => {
    return JSON.stringify(format(state), null, "  ");
  }, [state]);
  const [value, setValue] = useState(json);

  const handleChange = useCallback(
    debounce(
      (e, d, value) => {
        // TODO: do more validation
        // like on the whole schema
        try {
          window.jsonlint.parse(value);
          setValid(true);
        } catch {
          setValid(false);
        }
      },
      { wait: 200 }
    ),
    []
  );

  return (
    <div
      css={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "stretch",
        flexDirection: "column"
      }}
    >
      <div
        css={{
          height: "100%",
          width: "100%",
          overflowY: "auto",
          flexShrink: 1
        }}
      >
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
          onChange={handleChange}
        />
      </div>
      <div
        css={{
          display: "flex",
          justifyContent: "flex-end",
          flexShrink: 0,
          flexGrow: 0
        }}
      >
        <div css={{ padding: "12px" }}>
          <Button buttonType="muted" onClick={onClose}>
            Close
          </Button>
        </div>
        <div css={{ padding: "12px" }}>
          <Button
            disabled={!isValid}
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
