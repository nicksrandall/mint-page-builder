import React, { useMemo } from "react";
import styled from "@emotion/styled";
import { Droppable } from "react-beautiful-dnd";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import "@reach/menu-button/styles.css";

import { Widget, WidgetView } from "./Widget";
import { useDragUpdater, useDragState } from "../contexts/DragContext";
import { useDrawerUpdater } from "../contexts/DrawerContext";
import {
  ADD_SUB_WIDGET,
  DELETE_SUB_WIDGET,
  CLONE_SUB_WIDGET
} from "../hooks/useDragState";
import Icon from "./Icon";
import { useRegistry } from "../contexts/RegistryContext";
import { SectionHeading } from "./DrawerUtils";
import Prop from "./Prop";

const Button = styled(MenuButton)`
  padding: 8px 12px;
  border: none;
  outline: none;
  text-transform: uppercase;
  background: #66beb2;
  color: #fff;
`;

const handleSubmit = e => e.preventDefault();
const ComponentProps = ({ name, uuid, subComponent }) => {
  const registry = useRegistry();
  const spec = useMemo(() => registry.getDefinition(name), [name, registry]);
  return (
    <form action="" onSubmit={handleSubmit}>
      {spec.props.map(prop => {
        return (
          <Prop
            definition={prop}
            uuid={uuid}
            key={prop.name}
            mapKey={subComponent ? "subComponentMap" : "componentMap"}
          />
        );
      })}
    </form>
  );
};

const AddComponent = ({ childrenNames = [], componentID }) => {
  const dispatch = useDragUpdater();
  return (
    <Menu>
      <Button>Add Component</Button>
      <MenuList>
        {childrenNames.map(name => {
          return (
            <MenuItem
              css={{
                display: "flex",
                alignItems: "center",
                background: "#fff",
                "&[data-selected]": {
                  background: "#66beb2"
                }
              }}
              onSelect={() => {
                dispatch({
                  type: ADD_SUB_WIDGET,
                  payload: { name: name, componentID: componentID }
                });
              }}
              key={name}
            >
              <Icon icon="slideshow" size="16px" />
              <span>{name}</span>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

const SubWidget = React.memo(({ componentID, id, index }) => {
  const state = useDragState();
  const dispatch = useDragUpdater();
  const setDrawerState = useDrawerUpdater();
  return (
    <Widget
      widget={state.subComponentMap[id]}
      index={index}
      onDelete={() =>
        dispatch({
          type: DELETE_SUB_WIDGET,
          payload: { componentID, id: id, index: index }
        })
      }
      onClone={() =>
        dispatch({
          type: CLONE_SUB_WIDGET,
          payload: { componentID, id: id, index: index }
        })
      }
      onSettings={() =>
        setDrawerState(prev => ({
          ...prev,
          open: true,
          subComponent: id
        }))
      }
    />
  );
});

const Settings = ({ component, subComponent }) => {
  const state = useDragState();
  const registry = useRegistry();
  const definition = useMemo(() => {
    if (component) {
      return registry.getDefinition(component.name);
    }
    return null;
  }, [component, registry]);
  const setDrawerState = useDrawerUpdater();
  if (!component) return null;
  return (
    <div css={{ width: "100%" }}>
      <div css={{ width: "100%" }}>
        <div
          css={{
            padding: "8px",
            display: "flex",
            alignItems: "center",
            height: "48px",
            cursor: "pointer"
          }}
          onClick={() =>
            setDrawerState(state =>
              subComponent
                ? {
                    ...state,
                    subComponent: component.id
                  }
                : { ...state, component: component.id, subComponent: null }
            )
          }
        >
          <span css={{ paddingLeft: "8px" }}>{component.name} Settings</span>
        </div>
      </div>
      <div css={{ padding: "8px" }}>
        <SectionHeading>Props</SectionHeading>
        <ComponentProps
          name={component.name}
          uuid={component.id}
          subComponent={subComponent}
        />
      </div>
      {definition &&
      Array.isArray(definition.children) &&
      definition.children.length ? (
        <div css={{ padding: "8px" }}>
          <SectionHeading>Children</SectionHeading>
          <div
            css={{
              padding: "8px",
              minHeight: "300px",
              background: "#f2f2f2",
              marginBottom: "8px"
            }}
          >
            {component.children && component.children.length ? (
              <Droppable
                droppableId={component.id}
                type="SUB_WIDGET"
                direction="vertical"
                renderClone={(provided, snapshot, rubric) => {
                  const widget = state.subComponentMap[rubric.draggableId];
                  return (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <WidgetView
                        provided={provided}
                        snapshot={snapshot}
                        widget={widget}
                        componentID={component.id}
                      />
                    </div>
                  );
                }}
              >
                {(dropProvided, dropSnapshot) => (
                  <div
                    ref={dropProvided.innerRef}
                    {...dropProvided.droppableProps}
                  >
                    {component.children.map((id, index) => (
                      <SubWidget
                        key={id}
                        id={id}
                        componentID={component.id}
                        index={index}
                      />
                    ))}
                    {dropProvided.placeholder}
                  </div>
                )}
              </Droppable>
            ) : null}
          </div>
          <AddComponent
            childrenNames={definition.children}
            componentID={component.id}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Settings;
