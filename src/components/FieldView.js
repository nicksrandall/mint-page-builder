import React from "react";
import { array, string, object, lazy } from "yup"; // for only what you need
import { Button } from "@contentful/forma-36-react-components";

const node = object()
  .shape({
    id: string().required(), // TODO: validate uuid
    name: string().required(),
    props: object().nullable(),
    children: lazy(value =>
      value && Array.isArray(value) ? array.of(node) : node.default(undefined)
    )
  })
  .noUnknown();

const schema = array().of(node);

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
              parameters: { initialValue: sdk.field.getValue() }
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
