import { useMemo } from "react";
import uuid from "@lukeed/uuid";
import { useImmerReducer } from "use-immer";

import { useRegistry } from "../contexts/RegistryContext";

import {
  FORCE_UPDATE,
  CLONE_ROW,
  ADD_ROW,
  DELETE_ROW,
  REORDER_ROW,
  ADD_COLUMN,
  REORDER_COLUMN,
  DELETE_COLUMN,
  CLONE_COLUMN,
  REORDER_WIDGET,
  ADD_WIDGET,
  DELETE_WIDGET,
  CLONE_WIDGET,
  REORDER_SUB_WIDGET,
  ADD_SUB_WIDGET,
  DELETE_SUB_WIDGET,
  CLONE_SUB_WIDGET,
  UPDATE_PROP,
  UPDATE_SUB_PROP,
  UPDATE_THEME
} from "../utils/constants";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const makeReducer = registry => (draft, action) => {
  switch (action.type) {
    case FORCE_UPDATE: {
      return action.payload;
    }
    case ADD_ROW: {
      const rowID = uuid();
      const colID = uuid();
      draft.ordered.push(rowID);
      draft.rowMap[rowID] = {
        id: rowID,
        columns: [colID],
        props: {
          backgroundImage: "path/to/some/bg.png",
          backgroundColor: "#0000ff",
          fluid: false
        }
      };
      draft.columnMap[colID] = {
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
      const clone = draft.rowMap[payload.id];
      draft.ordered.splice(payload.index, 0, rowID);
      const columns = clone.columns.map(colID => {
        const newID = uuid();
        const cloned = draft.columnMap[colID];
        const components = cloned.components.map(componentID => {
          const cloned = draft.componentMap[componentID];
          const newID = uuid();
          draft.componentMap[newID] = {
            ...cloned,
            id: newID
          };
          return newID;
        });
        draft.columnMap[newID] = {
          ...cloned,
          components,
          id: newID
        };
        return newID;
      });
      draft.rowMap[rowID] = {
        ...clone,
        columns,
        id: rowID
      };
      return;
    }
    case DELETE_ROW: {
      const [removed] = draft.ordered.splice(action.payload.index, 1);
      delete draft.rowMap[removed.id];
      return;
    }
    case REORDER_ROW: {
      const result = action.payload;
      draft.ordered = reorder(
        draft.ordered,
        result.source.index,
        result.destination.index
      );
      return;
    }
    case REORDER_COLUMN: {
      const result = action.payload;
      if (result.source.droppableId === result.destination.droppableId) {
        const id = result.source.droppableId;
        draft.rowMap[id].columns = reorder(
          draft.rowMap[id].columns,
          result.source.index,
          result.destination.index
        );
      } else {
        // TODO: move
        const sourceID = result.source.droppableId;
        const destID = result.destination.droppableId;
        const sourceRow = draft.rowMap[sourceID];
        const destRow = draft.rowMap[destID];
        const sourceColumns = Array.from(sourceRow.columns);
        const destColumns = Array.from(destRow.columns);

        const [removed] = sourceColumns.splice(result.source.index, 1);
        destColumns.splice(result.destination.index, 0, removed);

        draft.rowMap[sourceID] = {
          ...sourceRow,
          columns: sourceColumns
        };
        draft.rowMap[destID] = { ...destRow, columns: destColumns };
      }

      return;
    }
    case REORDER_WIDGET: {
      const result = action.payload;
      if (result.source.droppableId === result.destination.droppableId) {
        const id = result.source.droppableId;
        draft.columnMap[id].components = reorder(
          draft.columnMap[id].components,
          result.source.index,
          result.destination.index
        );
      } else {
        // TODO: move
        const sourceID = result.source.droppableId;
        const destID = result.destination.droppableId;
        const sourceCol = draft.columnMap[sourceID];
        const destCol = draft.columnMap[destID];
        const sourceComponents = Array.from(sourceCol.components);
        const destComponents = Array.from(destCol.components);

        const [removed] = sourceComponents.splice(result.source.index, 1);
        destComponents.splice(result.destination.index, 0, removed);

        draft.columnMap[sourceID] = {
          ...sourceCol,
          components: sourceComponents
        };
        draft.columnMap[destID] = { ...destCol, components: destComponents };
      }

      return;
    }
    case UPDATE_PROP: {
      const payload = action.payload;
      draft[payload.mapKey][payload.id].props[payload.name] = payload.value;
      return;
    }
    case UPDATE_SUB_PROP: {
      const payload = action.payload;
      draft[payload.mapKey][payload.id].children[payload.index].props[
        payload.name
      ] = payload.value;
      return;
    }
    case ADD_COLUMN: {
      const payload = action.payload;
      const id = uuid();
      draft.columnMap[id] = {
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
      draft.rowMap[payload.id].columns.push(id);
      return;
    }
    case ADD_WIDGET: {
      const payload = action.payload;
      const id = payload.id || uuid();
      const component = {
        id: id,
        name: payload.name,
        props: registry.getDefaultProps(payload.name),
        children: []
      };
      draft.componentMap[id] = component;
      draft.columnMap[payload.columnID].components.push(id);
      return;
    }
    case CLONE_WIDGET: {
      const payload = action.payload;
      const clone = draft.componentMap[payload.id];
      const id = uuid();
      const component = {
        ...clone,
        id: id
      };
      draft.componentMap[id] = component;
      draft.columnMap[payload.columnID].components.splice(payload.index, 0, id);
      return;
    }
    case DELETE_WIDGET: {
      const payload = action.payload;
      delete draft.componentMap[payload.id];
      draft.columnMap[payload.columnID].components.splice(payload.index, 1);
      return;
    }
    case DELETE_COLUMN: {
      const payload = action.payload;
      delete draft.columnMap[payload.id];
      draft.rowMap[payload.rowID].columns.splice(payload.index, 1);
      return;
    }
    case ADD_SUB_WIDGET: {
      const payload = action.payload;
      const id = payload.id || uuid();
      const component = {
        id: id,
        name: payload.name,
        props: registry.getDefaultProps(payload.name)
      };
      draft.subComponentMap[id] = component;
      draft.componentMap[payload.componentID].children.push(id);
      return;
    }
    case REORDER_SUB_WIDGET: {
      const result = action.payload;
      const id = result.source.droppableId;
      draft.componentMap[id].children = reorder(
        draft.componentMap[id].children,
        result.source.index,
        result.destination.index
      );
      return;
    }
    case CLONE_SUB_WIDGET: {
      const payload = action.payload;
      const clone = draft.subComponentMap[payload.id];
      const id = uuid();
      const component = {
        ...clone,
        id: id
      };
      draft.subComponentMap[id] = component;
      draft.componentMap[payload.componentID].children.splice(
        payload.index,
        0,
        id
      );
      return;
    }
    case DELETE_SUB_WIDGET: {
      const payload = action.payload;
      delete draft.subComponentMap[payload.id];
      draft.componentMap[payload.componentID].children.splice(payload.index, 1);
      return;
    }
    case CLONE_COLUMN: {
      const payload = action.payload;
      const newID = uuid();
      const cloned = draft.columnMap[payload.id];
      const components = cloned.components.map(componentID => {
        const cloned = draft.componentMap[componentID];
        const newID = uuid();
        draft.componentMap[newID] = {
          ...cloned,
          id: newID
        };
        return newID;
      });
      draft.columnMap[newID] = {
        ...cloned,
        components,
        id: newID
      };
      draft.rowMap[payload.rowID].columns.splice(payload.index, 0, newID);
      return;
    }
    case UPDATE_THEME: {
      const payload = action.payload;
      draft.template.props[payload.name] = payload.value;
      return;
    }
    default:
      throw new Error(`unsupported action: ${action.type}`);
  }
};

const useDragState = (initialValue = {}) => {
  const registry = useRegistry();
  const reducer = useMemo(() => makeReducer(registry), [registry]);
  return useImmerReducer(reducer, initialValue);
};

export default useDragState;
