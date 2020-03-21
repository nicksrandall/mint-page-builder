import React, { useState } from "react";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { css, ClassNames } from "@emotion/core";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const WYSIWYG = ({ html = "", handleClose, handleSave }) => {
  const [editorState, setEditorState] = useState(() => {
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      return EditorState.createWithContent(contentState);
    }
    return null;
  });
  return (
    <>
      <ClassNames>
        {({ css }) => (
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            editorClassName={css({
              padding: "0 12px"
            })}
          />
        )}
      </ClassNames>
      <hr css={{ marginTop: "20px", borderTop: "1px solid #f1f1f1" }} />
      <div css={{ textAlign: "right", padding: '12px' }}>
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
          onClick={() =>
            handleSave(
              draftToHtml(convertToRaw(editorState.getCurrentContent()))
            )
          }
        >
          Save
        </button>
      </div>
    </>
  );
};

export default WYSIWYG;
