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
  getPropDisplayName(name, prop) {
    return this._components?.[name]?.props.find(p => p.name === prop)
      .displayName;
  }
  getPropDisplayType(name, prop) {
    return (
      this._components?.[name]?.props.find(p => p.name === prop).displayType ||
      "text"
    );
  }
  getComponents() {
    return this._registry.default.map(id => this._components[id]);
  }
}

export default Registery;
