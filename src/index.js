import React from "react";
import ReactDOM from "react-dom";
// import * as serviceWorker from './serviceWorker';
import "@contentful/forma-36-react-components/dist/styles.css";
import "@contentful/forma-36-fcss/dist/styles.css";
import { Button } from "@contentful/forma-36-react-components";
import { init, locations } from "contentful-ui-extensions-sdk";

import "./index.css";
import App from "./App";
import AppConfigure from "./components/AppConfigure";

const bootstrap = sdk => {
  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    console.log("bootstraping dialog");
    ReactDOM.render(
      <React.StrictMode>
        <App sdk={sdk} />
      </React.StrictMode>,
      document.getElementById("root")
    );
    sdk.window.updateHeight(960);
  } else if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    sdk.app.onConfigure(() => {
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
    ReactDOM.render(
      <React.StrictMode>
        <AppConfigure sdk={sdk} />
      </React.StrictMode>,
      document.getElementById("root")
    );
    sdk.window.startAutoResizer();
  } else if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
    ReactDOM.render(
      <>
        <p>
          Click the button below to use the page building tool to configure this
          page's layout and components. This experience is completely custom and
          can be adapted to be whatever we want.
        </p>
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
        </Button>
      </>,
      document.getElementById("root")
    );
  }
};

if (process.env.NODE_ENV === "production") {
  console.log("bootstrap from production");
  init(bootstrap);
} else {
  // fake sdk for local devlopement
  console.log("bootstrap with sample data");
  const noop = () => {};
  class Location {
    constructor(loc) {
      this.loc = loc;
    }
    is(value) {
      return this.loc === value;
    }
  }
  const location = new Location(locations.LOCATION_APP_CONFIG);
  bootstrap({
    app: {
      onConfigure: noop,
      setReady: noop,
      getParameters: () =>
        Promise.resolve({
          components: []
        })
    },
    location,
    close: noop,
    window: { updateHeight: noop, startAutoResizer: noop },
    parameters: { invocation: { initialValue: [] } }
  });
}
