import React, { useMemo, useState, useCallback } from "react";
import debounce from "debounce-fn";
import { Button } from "@contentful/forma-36-react-components";

import Editor from "./JSONEditor";
import { FORCE_UPDATE } from "../utils/constants";
import { useDragState, useDragUpdater } from "../contexts/DragContext";
import { format, unformat } from "../utils/formatJSON";
import schema from "../utils/layoutSchema";
import { useSDK } from "../contexts/ContentfulSDK";

const Preview = ({ onClose }) => {
  const [isValid, setValid] = useState(true);
  const state = useDragState();
  const dispatch = useDragUpdater();
  const json = useMemo(() => {
    return JSON.stringify(format(state), null, "  ");
  }, [state]);
  const [value, setValue] = useState(json);
  const sdk = useSDK();

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
          overflow: "auto",
          flexShrink: 1
        }}
      >
        <Editor
          value={value}
          onBeforeChange={(_editor, _data, value) => {
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
            Exit
          </Button>
        </div>
        <div css={{ padding: "12px" }}>
          <Button
            disabled={!isValid}
            buttonType="positive"
            onClick={() => {
              try {
                const obj = JSON.parse(value);
                schema
                  .validate(obj)
                  .then(validData => {
                    dispatch({
                      type: FORCE_UPDATE,
                      payload: unformat(validData)
                    });
                    onClose();
                  })
                  .catch(err => {
                    console.log("catch err", err);
                    sdk.notifier.error(
                      `Invalid JSON: ${err.errors.join(", ")}`
                    );
                  });
              } catch (err) {
                console.log("parse err", err);
                sdk.notifier.error("Invalid JSON - fix it before saving.");
              }
            }}
          >
            Save and Exit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Preview;
