import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";

import Icon from "./Icon";

import KitPreview from './KitPreview';
import {useDragState} from '../contexts/DragContext'

const Control = styled.button`
  background: ${({ active }) => (active ? "#66beb2" : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  border: 1px solid rgba(0, 0, 0, 0.14);
  outline: none;
  padding: 8px 12px;
  cursor: pointer;
  &:hover {
    color: ${({ active }) => (active ? "#fff" : "#66beb2")};
  }
`;

const Preview = () => {
  const state = useDragState();
  const tree = useMemo(() => {
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
    return {
      name: "Sample Page Name",
      slug: "some-slug",
      template: state.template.props,
      layout
    };
  }, [state]);

  const [width, setWidth] = useState(960);
  return (
    <div css={{ width: "100%", height: "100%" }}>
      <div css={{ margin: "auto", textAlign: "center", padding: "12px" }}>
        <Control active={width === 1280} onClick={() => setWidth(1280)}>
          <Icon icon="desktop_mac" />
        </Control>
        <Control active={width === 960} onClick={() => setWidth(960)}>
          <Icon icon="tablet_mac" />
        </Control>
        <Control active={width === 600} onClick={() => setWidth(600)}>
          <Icon icon="phone_iphone" />
        </Control>
        <Control active={width === 601} onClick={() => setWidth(601)}>
          <Icon icon="code" />
        </Control>
      </div>
      <div css={{ overflow: "auto", width: "100%" }}>
        <div
          css={{
            margin: "auto",
            padding: "0 16px 32px",
            transition: "width 200ms ease-in",
            border: "1px solid #000",
            width: `${width}px`
          }}
        >
          {width === 601 ? (
            <div
              css={{
                width: "100%",
                padding: "16px",
                overflow: "auto"
              }}
            >
              <code css={{ padding: "12px" }}>
                <pre>{JSON.stringify(tree, null, "  ")}</pre>
              </code>
            </div>
          ) : (
            <KitPreview layout={tree.layout} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
