import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
// import * as serviceWorker from './serviceWorker';
import "@contentful/forma-36-react-components/dist/styles.css";
import "@contentful/forma-36-fcss/dist/styles.css";
import { Button, Note } from "@contentful/forma-36-react-components";
import { init, locations } from "contentful-ui-extensions-sdk";

init(sdk => {
  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    // const sdk = {};
    ReactDOM.render(
      <React.StrictMode>
        <App
          sdk={sdk}
          initialValue={sdk?.parameters?.invocation?.initialValue}
          onClose={data => {
            sdk.close(data);
          }}
        />
      </React.StrictMode>,
      document.getElementById("root")
    );
    sdk.window.updateHeight(960);
  } else if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    sdk.app.onConfigure(() => {
      console.log("on configure");
      return {
        parameters: { components: [] },
        targetState: {
          EditorInterface: {
            page: {
              controls: [{ fieldId: "layout" }]
            }
          }
        }
      };
    });
    console.log("rendering", sdk);
    ReactDOM.render(
      <React.StrictMode>
        <Note>Someday, component configuration will go here</Note>
      </React.StrictMode>,
      document.getElementById("root")
    );
    window.setTimeout(() => {
      console.log("set ready");
      sdk.app.setReady();
    }, 50);
    sdk.window.startAutoResizer();
  } else if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
    ReactDOM.render(
      <Button
        buttonType="primary"
        icon="Edit"
        size="large"
        onClick={() => {
          sdk.dialogs
            .openCurrentApp({
              title: "Page Builder",
              width: "fullWidth",
              minHeight: "960px",
              shouldCloseOnOverlayClick: true,
              parameters: { initialValue: sdk.field.getValue() }
            })
            .then(data => {
              console.log("set field", data);
              if (data) {
                return sdk.field.setValue(data);
              }
            });
        }}
      >
        Open page builder
      </Button>,
      document.getElementById("root")
    );
  }
});
