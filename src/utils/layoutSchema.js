import { array, string, object, lazy } from "yup";

const node = object()
  .shape({
    id: string().required(), // TODO: validate uuid
    name: string().required(),
    props: object().nullable(),
    children: lazy(value =>
      Array.isArray(value) ? schema : node.default(undefined)
    )
  })
  .noUnknown();

const schema = array()
  .of(node)
  .ensure();

export default schema;
