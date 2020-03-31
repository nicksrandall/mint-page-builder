import React, { Suspense, useEffect, useState } from "react";

const Editor = React.lazy(() => import("./JSONEditor"));

const AppConfigure = ({ sdk }) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    sdk.app.getParameters().then(params => {
      setValue(JSON.stringify(params.components, null, "  "));
      sdk.app.setReady();
    });
  }, [sdk.app]);

  useEffect(() => {
    sdk.app.onConfigure(() => {
      try {
        const components = window.jsonlint.parse(value);
        if (!Array.isArray(components)) {
          sdk.notifier.error(
            "JSON must be an array - fix it before installing."
          );
          return false;
        }
        return {
          parameters: { components },
          targetState: {
            EditorInterface: {
              page: {
                controls: [{ fieldId: "layout" }]
              }
            }
          }
        };
      } catch {
        sdk.notifier.error("Invalid JSON - fix it before installing.");
        return false;
      }
    });
  }, [sdk, value]);

  return (
    <Suspense fallback={<div>loading...</div>}>
      <div css={{ height: "100vh", overflow: 'auto' }}>
        <Editor
          value={value}
          onBeforeChange={(editor, data, value) => {
            setValue(value);
          }}
        />
      </div>
    </Suspense>
  );
};

export default AppConfigure;
