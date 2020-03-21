// TODO should we use something like this to also register fonts and colors?

class Registery {
  constructor() {
    this._categories = ["default"];
    this._components = {
      Heading: {
        name: "Heading",
        icon: "title",
        props: [
          {
            name: "level",
            displayName: "Heading Level",
            type: "select",
            defaultValue: "h1",
            values: [
              { label: "h1", value: "h1" },
              { label: "h2", value: "h2" },
              { label: "h3", value: "h3" },
              { label: "h4", value: "h4" },
              { label: "h5", value: "h5" },
              { label: "h6", value: "h6" }
            ]
          },
          {
            name: "content",
            displayName: "Content",
            defaultValue: "",
            type: "text",
            section: "props"
          }
        ]
        // inherits?
      },
      Image: {
        name: "Image",
        icon: "insert_photo",
        props: [
          {
            name: "src",
            displayName: "Source URL",
            defaultValue: "",
            type: "media"
          },
          {
            name: "alt",
            displayName: "Alt Text",
            defaultValue: "",
            type: "text"
          }
        ]
      },
      WYSIWYG: {
        name: "WYSIWYG",
        icon: "text_format",
        props: [
          {
            name: "content",
            displayName: "Content",
            defaultValue: "",
            type: "WYSIWYG",
            section: "props"
          }
        ]
      }
    };

    this._registry = {
      default: ["Heading", "Image", "WYSIWYG"]
    };
  }
  register(definition = {}) {
    // TODO validate definition
    const category = definition.category || "default";
    const name = definition.name;
    this._components[name] = definition;
    if (category in this._registry) {
      this._registry[category].push(name);
    } else {
      this._categories.push(category);
      this._registry[category] = [name];
    }
  }
  getDefinition(name) {
    return this._components[name];
  }
  getDefaultProps(name) {
    return this._components[name].props.reduce((memo, prop) => {
      memo[prop.name] = prop.defaultValue;
      return memo;
    }, {});
  }
  getComponents() {
    return this._registry.default.map(id => this._components[id]);
  }
}

export default new Registery();
