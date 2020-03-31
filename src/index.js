import React from "react";
import ReactDOM from "react-dom";
// import * as serviceWorker from './serviceWorker';
import "@contentful/forma-36-react-components/dist/styles.css";
import "@contentful/forma-36-fcss/dist/styles.css";
import { init, locations } from "contentful-ui-extensions-sdk";

import "./index.css";
import App from "./App";
import AppConfigure from "./components/AppConfigure";
import FieldView from "./components/FieldView";
import Registery from "./utils/componentRegistery";

const bootstrap = sdk => {
  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    console.log("bootstraping dialog");
    const registry = new Registery();
    sdk.parameters.installation.components.forEach(definition =>
      registry.register(definition)
    );
    ReactDOM.render(
      <React.StrictMode>
        <App sdk={sdk} registry={registry} />
      </React.StrictMode>,
      document.getElementById("root")
    );
    sdk.window.updateHeight(960);
  } else if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    ReactDOM.render(
      <React.StrictMode>
        <AppConfigure sdk={sdk} />
      </React.StrictMode>,
      document.getElementById("root")
    );
    sdk.window.startAutoResizer();
  } else if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
    ReactDOM.render(
      <React.StrictMode>
        <FieldView sdk={sdk} />
      </React.StrictMode>,
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
  const location = new Location(locations.LOCATION_DIALOG);
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
    notifier: { error: noop },
    window: { updateHeight: noop, startAutoResizer: noop },
    parameters: { invocation: { initialValue: [] }, installation: { components: [] } }
  });
}
