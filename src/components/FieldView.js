import React from "react";
import { Button } from "@contentful/forma-36-react-components";
import schema from "../utils/layoutSchema";

const FieldView = ({ sdk }) => {
  return (
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
              parameters: {
                initialValue: sdk.field.getValue(),
                locale: sdk.field.locale
              }
            })
            .then(data => {
              console.log("set field", data);
              if (data) {
                return schema
                  .validate(data)
                  .then(validData => {
                    sdk.field.setValue(validData);
                  })
                  .catch(err => {
                    sdk.notifier.error(
                      `Invalid JSON: ${err.errors.join(", ")}`
                    );
                  });
              }
            });
        }}
      >
        Open page builder
      </Button>
    </>
  );
};

export default FieldView;
