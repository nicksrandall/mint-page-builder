import React, { Component, Suspense } from "react";
import { Note } from "@contentful/forma-36-react-components";

import { array, string, object, mixed, boolean } from "yup"; // for only what you need

const Editor = React.lazy(() => import("./JSONEditor"));

const schema = array().of(
  object().shape({
    name: string().required(),
    icon: string().required(),
    hidden: boolean().default(false),
    props: array().of(
      object().shape({
        name: string().required(),
        type: string()
          .oneOf([
            "text",
            "url",
            "number",
            "color",
            "select",
            "media",
            "entry",
            "range",
            "box-model",
            "checkbox",
            "WYSIWYG",
            "typography"
          ])
          .required(),
        displayName: string().required(),
        displayType: string()
          .oneOf(["boolean", "text", "json", "image", "color"])
          .required(),
        defaultValue: mixed()
          .nullable(),
        options: mixed().nullable()
      })
    )
  }).noUnknown()
);

class AppConfigure extends Component {
  constructor(props) {
    super(props);
    this.state = { value: [] };
    this.props.sdk.app.onConfigure(() => this.onConfigure());
  }
  componentDidMount() {
    // Get current parameters of the app.
    this.props.sdk.app.getParameters().then(params => {
      this.setState(
        { value: JSON.stringify(params.components || [], null, "  ") },
        () => {
          this.props.sdk.app.setReady();
        }
      );
    });
  }
  onConfigure() {
    // TODO: do more validation
    // like on the whole schema
    try {
      console.log("value", this.state.value);
      let components = window.jsonlint.parse(this.state.value);
      try {
        components = schema.validateSync(components);
      } catch (err) {
        this.props.sdk.notifier.error(`Invalid JSON: ${err.errors.join(", ")}`);
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
      this.props.sdk.notifier.error("Invalid JSON - fix it before installing.");
      return false;
    }
  }
  handleChange = (_editor, _data, value) => {
    this.setState({ value });
  };
  render() {
    return (
      <div
        css={{
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div
          css={{
            flexShrink: 0,
            flexGrow: 0
          }}
        >
          <Note>
            This is the global registry of the components that we make available
            to our page builder. Right now it's represented as JSON but we could
            slap a UI on this if that would be better.
          </Note>
        </div>
        <div
          css={{
            height: "100%",
            width: "100%",
            overflow: "auto",
            flexShrink: 1
          }}
        >
          <Suspense fallback={<div>loading...</div>}>
            <Editor
              value={this.state.value}
              onBeforeChange={this.handleChange}
            />
          </Suspense>
        </div>
      </div>
    );
  }
}

export default AppConfigure;
