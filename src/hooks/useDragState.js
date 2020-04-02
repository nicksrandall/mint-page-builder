import { useReducer } from "react";
import uuid from "@lukeed/uuid";
import produce from "immer";

import {useRegistry} from '../contexts/RegistryContext';

export const FORCE_UPDATE = "FORCE_UPDATE"
// Rows
export const CLONE_ROW = "CLONE_ROW";
export const ADD_ROW = "ADD_ROW";
export const DELETE_ROW = "DELETE_ROW";
export const REORDER_ROW = "REORDER_ROW";

// Columns
export const ADD_COLUMN = "ADD_COLUMN";
export const REORDER_COLUMN = "REORDER_COLUMN";
export const DELETE_COLUMN = "DELETE_COLUMN";
export const CLONE_COLUMN = "CLONE_COLUMN";

// Widgets (Components)
export const REORDER_WIDGET = "REORDER_WIDGET";
export const ADD_WIDGET = "ADD_WIDGET";
export const DELETE_WIDGET = "DELETE_WIDGET";
export const CLONE_WIDGET = "CLONE_WIDGET";

// Sub-widgets
export const REORDER_SUB_WIDGET = "REORDER_SUB_WIDGET";
export const ADD_SUB_WIDGET = "ADD_SUB_WIDGET";
export const DELETE_SUB_WIDGET = "DELETE_SUB_WIDGET";
export const CLONE_SUB_WIDGET = "CLONE_SUB_WIDGET";

// Props
export const UPDATE_PROP = "UPDATE_PROP";
export const UPDATE_SUB_PROP = "UPDATE_SUB_PROP";

// Theme
export const UPDATE_THEME = "UPDATE_THEME";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const makeData = initialValue => {
  if (initialValue) {
    return initialValue;
  }

  // rows
  const row1 = uuid();
  const row2 = uuid();
  // columns
  const col1 = uuid();
  const col2 = uuid();
  const col3 = uuid();

  //components
  const comp1 = uuid();
  const comp2 = uuid();
  const comp3 = uuid();

  return {
    rowMap: {
      [row1]: {
        id: row1,
        columns: [col1, col2],
        props: {
          backgroundImage: null,
          backgroundColor: "#0000ff",
          fluid: false
        }
      },
      [row2]: {
        id: row2,
        columns: [col3],
        props: {
          backgroundImage: "https://source.unsplash.com/random",
          backgroundColor: "#ff0000",
          fluid: true
        }
      }
    },
    columnMap: {
      [col1]: {
        id: col1,
        components: [comp1, comp2],
        props: {
          mobileSpan: 4,
          tabletSpan: 8,
          desktopSpan: 2,
          padding: { px: 12, py: 12 }
        }
      },
      [col2]: {
        id: col2,
        components: [],
        props: {
          mobileSpan: 4,
          tabletSpan: 8,
          desktopSpan: 2,
          padding: { px: 12, py: 12 }
        }
      },
      [col3]: {
        id: col3,
        components: [comp3],
        props: {
          mobileSpan: 4,
          tabletSpan: 8,
          desktopSpan: 12,
          padding: { px: 12, py: 12 }
        }
      }
    },
    componentMap: {
      [comp1]: {
        id: comp1,
        name: "Heading",
        props: {
          level: "h1",
          content: "Hello world"
        },
        children: [],
      },
      [comp2]: {
        id: comp2,
        name: "Image",
        props: {
          src: "https://source.unsplash.com/random",
          alt: "fake image"
        },
        children: [],
      },
      [comp3]: {
        id: comp3,
        name: "WYSIWYG",
        props: {
          content: `<h1>Hello world</h1>`
        },
        children: [],
      }
    },
    ordered: [row1, row2]
  };
};

const makeReducer = (registry) => produce((state, action) => {
  switch (action.type) {
    case  FORCE_UPDATE: {
      return action.payload;
    }
    case ADD_ROW: {
      const rowID = uuid();
      const colID = uuid();
      state.ordered.push(rowID);
      state.rowMap[rowID] = {
        id: rowID,
        columns: [colID],
        props: {
          backgroundImage: "path/to/some/bg.png",
          backgroundColor: "#0000ff",
          fluid: false
        }
      };
      state.columnMap[colID] = {
        id: colID,
        components: [],
        props: {
          mobileSpan: 4,
          tabletSpan: 8,
          desktopSpan: 12,
          mobileOffset: 0,
          tabletOffset: 0,
          desktopOffset: 0,
          padding: { px: 12, py: 12 }
        }
      };
      return;
    }
    case CLONE_ROW: {
      const payload = action.payload;
      const rowID = uuid();
      const clone = state.rowMap[payload.id];
      state.ordered.splice(payload.index, 0, rowID);
      const columns = clone.columns.map(colID => {
        const newID = uuid();
        const cloned = state.columnMap[colID];
        const components = cloned.components.map(componentID => {
          const cloned = state.componentMap[componentID];
          const newID = uuid();
          state.componentMap[newID] = {
            ...cloned,
            id: newID
          };
          return newID;
        });
        state.columnMap[newID] = {
          ...cloned,
          components,
          id: newID
        };
        return newID;
      });
      state.rowMap[rowID] = {
        ...clone,
        columns,
        id: rowID
      };
      return;
    }
    case DELETE_ROW: {
      const [removed] = state.ordered.splice(action.payload.index, 1);
      delete state.rowMap[removed.id];
      return;
    }
    case REORDER_ROW: {
      const result = action.payload;
      state.ordered = reorder(
        state.ordered,
        result.source.index,
        result.destination.index
      );
      return;
    }
    case REORDER_COLUMN: {
      const result = action.payload;
      if (result.source.droppableId === result.destination.droppableId) {
        const id = result.source.droppableId;
        state.rowMap[id].columns = reorder(
          state.rowMap[id].columns,
          result.source.index,
          result.destination.index
        );
      } else {
        // TODO: move
        const sourceID = result.source.droppableId;
        const destID = result.destination.droppableId;
        const sourceRow = state.rowMap[sourceID];
        const destRow = state.rowMap[destID];
        const sourceColumns = Array.from(sourceRow.columns);
        const destColumns = Array.from(destRow.columns);

        const [removed] = sourceColumns.splice(result.source.index, 1);
        destColumns.splice(result.destination.index, 0, removed);

        state.rowMap[sourceID] = {
          ...sourceRow,
          columns: sourceColumns
        };
        state.rowMap[destID] = { ...destRow, columns: destColumns };
      }

      return;
    }
    case REORDER_WIDGET: {
      const result = action.payload;
      if (result.source.droppableId === result.destination.droppableId) {
        const id = result.source.droppableId;
        state.columnMap[id].components = reorder(
          state.columnMap[id].components,
          result.source.index,
          result.destination.index
        );
      } else {
        // TODO: move
        const sourceID = result.source.droppableId;
        const destID = result.destination.droppableId;
        const sourceCol = state.columnMap[sourceID];
        const destCol = state.columnMap[destID];
        const sourceComponents = Array.from(sourceCol.components);
        const destComponents = Array.from(destCol.components);

        const [removed] = sourceComponents.splice(result.source.index, 1);
        destComponents.splice(result.destination.index, 0, removed);

        state.columnMap[sourceID] = {
          ...sourceCol,
          components: sourceComponents
        };
        state.columnMap[destID] = { ...destCol, components: destComponents };
      }

      return;
    }
    case UPDATE_PROP: {
      const payload = action.payload;
      state[payload.mapKey][payload.id].props[payload.name] = payload.value;
      return;
    }
    case UPDATE_SUB_PROP: {
      const payload = action.payload;
      state[payload.mapKey][payload.id].children[payload.index].props[payload.name] = payload.value;
      return;
    }
    case ADD_COLUMN: {
      const payload = action.payload;
      const id = uuid();
      state.columnMap[id] = {
        id: id,
        components: [],
        props: {
          mobileSpan: 4,
          tabletSpan: 8,
          desktopSpan: 12,
          mobileOffset: 0,
          tabletOffset: 0,
          desktopOffset: 0,
          padding: { px: 12, py: 12 }
        }
      };
      state.rowMap[payload.id].columns.push(id);
      return;
    }
    case ADD_WIDGET: {
      const payload = action.payload;
      const id = payload.id || uuid();
      const component = {
        id: id,
        name: payload.name,
        props: registry.getDefaultProps(payload.name),
        children: [],
      };
      state.componentMap[id] = component;
      state.columnMap[payload.columnID].components.push(id);
      return;
    }
    case CLONE_WIDGET: {
      const payload = action.payload;
      const clone = state.componentMap[payload.id];
      const id = uuid();
      const component = {
        ...clone,
        id: id
      };
      state.componentMap[id] = component;
      state.columnMap[payload.columnID].components.splice(payload.index, 0, id);
      return;
    }
    case DELETE_WIDGET: {
      const payload = action.payload;
      delete state.componentMap[payload.id];
      state.columnMap[payload.columnID].components.splice(payload.index, 1);
      return;
    }
    case DELETE_COLUMN: {
      const payload = action.payload;
      delete state.columnMap[payload.id];
      state.rowMap[payload.rowID].columns.splice(payload.index, 1);
      return;
    }
    case ADD_SUB_WIDGET: {
      const payload = action.payload;
      const id = payload.id || uuid();
      const component = {
        id: id,
        name: payload.name,
        props: registry.getDefaultProps(payload.name),
      };
      state.subComponentMap[id] = component;
      state.componentMap[payload.componentID].children.push(id);
      return;
    }
    case REORDER_SUB_WIDGET: {
      const result = action.payload;
      const id = result.source.droppableId;
      state.componentMap[id].children = reorder(
        state.componentMap[id].children,
        result.source.index,
        result.destination.index
      );
      return;
    }
    case CLONE_SUB_WIDGET: {
      const payload = action.payload;
      const clone = state.subComponentMap[payload.id];
      const id = uuid();
      const component = {
        ...clone,
        id: id
      };
      state.subComponentMap[id] = component;
      state.componentMap[payload.componentID].children.splice(payload.index, 0, id);
      return 
    }
    case DELETE_SUB_WIDGET: {
      const payload = action.payload;
      delete state.subComponentMap[payload.id];
      state.componentMap[payload.componentID].children.splice(payload.index, 1)
      return
    }
    case CLONE_COLUMN: {
      const payload = action.payload;
      const newID = uuid();
      const cloned = state.columnMap[payload.id];
      const components = cloned.components.map(componentID => {
        const cloned = state.componentMap[componentID];
        const newID = uuid();
        state.componentMap[newID] = {
          ...cloned,
          id: newID
        };
        return newID;
      });
      state.columnMap[newID] = {
        ...cloned,
        components,
        id: newID
      };
      state.rowMap[payload.rowID].columns.splice(payload.index, 0, newID);
      return;
    }
    case UPDATE_THEME: {
      const payload = action.payload;
      state.template.props[payload.name] = payload.value;
      return;
    }
    default:
      throw new Error(`unsupported action: ${action.type}`);
  }
});

const useDragState = initialValue => {
  const registry = useRegistry();
  return useReducer(makeReducer(registry), initialValue, makeData);
};

export default useDragState;
