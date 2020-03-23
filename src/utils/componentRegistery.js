// TODO should we use something like this to also register fonts and colors?

class Registery {
  constructor() {
    this._categories = ["default"];
    this._components = {};
    this._registry = {
      default: []
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

const registry = new Registery();

registry.register({
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
      name: "typography",
      displayName: "Typography",
      type: "typography",
      defaultValue: { px: 12, py: 12 },
    },
    {
      name: "content",
      displayName: "Content",
      defaultValue: "",
      type: "text",
      section: "props"
    }
  ]
});

registry.register({
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
});

registry.register({
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
});

registry.register({
  name: "Button",
  icon: "link",
  props: [
    {
      name: "href",
      displayName: "Link URL",
      defaultValue: "",
      type: "url",
      section: "props"
    },
    {
      name: "content",
      displayName: "Content",
      defaultValue: "",
      type: "text",
      section: "props"
    },
    {
      name: "bgColor",
      displayName: "Background Color",
      defaultValue: "#66beb2",
      type: "color",
      section: "props"
    },
    {
      name: "textColor",
      displayName: "Text Color",
      defaultValue: "#fff",
      type: "color",
      section: "props"
    }
  ]
});

registry.register({
  name: "Separator",
  icon: "horizontal_split",
  props: []
});

export default registry;
