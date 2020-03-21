import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { css } from "@emotion/core";

/*
This is slightly more than the regular configuration,
and is here to allow a sneak peek on what's configurable.
*/
var modules = {
  toolbar: [
    [{ font: [] }, { size: [] }],
    [{ align: [] }, "direction"],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "super" }, { script: "sub" }],
    ["blockquote", "code-block"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" }
    ],
    ["link", "image", "video"],
    ["clean"]
  ]
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image"
];

const WYSIWYG = ({ initialValue, handleClose, handleSave }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <>
      <ReactQuill
        value={value}
        onChange={setValue}
        theme="snow"
        modules={modules}
        formats={formats}
      />
      <hr css={{ marginTop: "20px" }} />
      <div css={{ textAlign: "right" }}>
        <button
          css={css`
            clear: both;
            padding: 8px 16px;
            color: #000;
            background: #fff;
            text-transform: uppercase;
            border: none;
            outline: none;
          `}
          onClick={handleClose}
        >
          Close
        </button>
        <button
          css={css`
            clear: both;
            padding: 8px 16px;
            color: #fff;
            background: #66beb2;
            text-transform: uppercase;
            border: none;
            outline: none;
          `}
          onClick={() => handleSave(value)}
        >
          Save
        </button>
      </div>
    </>
  );
};

export default WYSIWYG;
