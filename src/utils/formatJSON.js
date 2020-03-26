const format = state => {
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

export default format;
