import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
// import * as serviceWorker from './serviceWorker';
import "@contentful/forma-36-react-components/dist/styles.css";
import "@contentful/forma-36-fcss/dist/styles.css";
import { Button } from "@contentful/forma-36-react-components";
import { init, locations } from "contentful-ui-extensions-sdk";

init(sdk => {
  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    ReactDOM.render(
      <React.StrictMode>
        <App sdk={sdk} />
      </React.StrictMode>,
      document.getElementById("root")
    );
    sdk.window.updateHeight();
  } else if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
    console.log('button', Button);
    ReactDOM.render(
      <button
        buttonType="primary"
        icon="edit"
        onClick={() => {
          sdk.dialogs.openCurrentApp({
            title: "Page Builder",
            width: "fullWidth",
            minHeight: "100vh",
            shouldCloseOnOverlayClick: true,
            parameters: { ids: sdk.ids }
          });
        }}
      >
        Open page builder
      </button>,
      document.getElementById("root")
    );
  }

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  // serviceWorker.unregister();
});
