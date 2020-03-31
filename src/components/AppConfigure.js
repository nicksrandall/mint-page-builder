import React, { Component, Suspense } from "react";

const Editor = React.lazy(() => import("./JSONEditor"));

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
    try {
      console.log("value", this.state.value);
      const components = window.jsonlint.parse(this.state.value);
      if (!Array.isArray(components)) {
        this.props.sdk.notifier.error(
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
      this.props.sdk.notifier.error("Invalid JSON - fix it before installing.");
      return false;
    }
  }
  handleChange = (_editor, _data, value) => {
    this.setState({ value });
  };
  render() {
    return (
      <Suspense fallback={<div>loading...</div>}>
        <div css={{ height: "100vh", overflow: "auto" }}>
          <Editor value={this.state.value} onBeforeChange={this.handleChange} />
        </div>
      </Suspense>
    );
  }
}

export default AppConfigure;
