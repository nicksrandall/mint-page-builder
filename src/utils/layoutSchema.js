import { array, string, object, lazy } from "yup"; // for only what you need

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

export default schema;
