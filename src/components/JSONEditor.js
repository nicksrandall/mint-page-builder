import React from "react";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

window.jsonlint = require("jsonlint-mod");
require("codemirror/mode/javascript/javascript");
require("codemirror/addon/lint/lint.css");
require("codemirror/addon/lint/lint");
require("codemirror/addon/lint/json-lint");

const Editor = ({ options, ...props }) => {
  return (
    <CodeMirror
      options={{
        mode: { name: "javascript", json: true },
        theme: "material",
        lineNumbers: true,
        smartIndent: true, // javascript mode does bad things with jsx indents
        tabSize: 2,
        gutters: ["CodeMirror-lint-markers"],
        lint: true,
        ...options
      }}
      {...props}
    />
  );
};

export default Editor;
