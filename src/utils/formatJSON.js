export const format = state => {
  const layout = state.ordered.map(id => {
    const row = state.rowMap[id];
    const children = row.columns.map(id => {
      const column = state.columnMap[id];
      const children = column.components.map(id => {
        const component = state.componentMap[id];
        // TODO handle children in components
        return {
          id: component.id,
          name: component.name,
          props: component.props,
          children: component.hasChildren ? [] : []
        };
      });
      return {
        id: id,
        name: "column",
        props: column.props,
        children: children
      };
    });
    return {
      id: id,
      name: "row",
      props: row.props,
      children: children
    };
  });
  return layout;
};

export const unformat = (layout = []) => {
  const state = {
    rowMap: {},
    columnMap: {},
    componentMap: {}
  };
  state.ordered = layout.map(row => {
    state.rowMap[row.id] = {
      id: row.id,
      props: row.props,
      columns: row.children.map(column => {
        state.columnMap[column.id] = {
          id: column.id,
          props: column.props,
          components: column.children.map(component => {
            state.componentMap[component.id] = {
              id: component.id,
              name: component.name,
              props: component.props,
              hasChildren: false
            };
            return component.id;
          })
        };
        return column.id;
      })
    };
    return row.id;
  });
  return state;
};
