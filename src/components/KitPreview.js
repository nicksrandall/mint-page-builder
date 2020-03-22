import React, { createElement } from "react";
import "../styles/kit.scss";

// all the components we have made available.
// In production we'd probably lazy load these.
const Row = ({ backgroundImage, backgroundColor, fluid, children }) => {
  return (
    <div
      className="bbg-row"
      css={{
        backgroundColor: backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none"
      }}
    >
      <div className="bbg-row--content">{children}</div>
    </div>
  );
};

const Column = ({ desktopSpan, children }) => {
  return (
    <div className={`bbg-column bbg-column--width-${desktopSpan}`}>
      {children}
    </div>
  );
};

const Heading = ({ level, content }) => {
  const Comp = level;
  return <Comp>{content}</Comp>;
};

const Image = ({ src, alt }) => {
  return <img src={src} alt={alt} css={{ width: "100%" }} />;
};

const WYSIWYG = ({ content }) => {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

const Button = ({ href, bgColor, textColor, content }) => (
  <a
    href={href}
    css={{
      textAlign: "center",
      textTransform: "uppercase",
      display: "inline-block",
      padding: "12px 24px",
      backgroundColor: bgColor,
      color: textColor,
      textDecoration: "none"
    }}
  >
    {content}
  </a>
);

const Separator = () => <hr />;

// a map from component name to implementation
const componentMap = new Map();
componentMap.set("row", Row);
componentMap.set("column", Column);
componentMap.set("Heading", Heading);
componentMap.set("Image", Image);
componentMap.set("WYSIWYG", WYSIWYG);
componentMap.set("Button", Button);
componentMap.set("Separator", Separator);

// recursive function to convert JSON to React elements
const render = definition => {
  // TODO handle case when no component exists with given name
  console.log("name", definition.name);
  const element = componentMap.get(definition.name);
  console.log("element", element);
  return createElement(
    element,
    { ...definition.props, key: definition.id },
    ...definition.children.map(render)
  );
};

// Layout here is the JSON that this page builder produces
// We wrap everything in a fragment to handle the top level array of rows.
const PageContent = ({ layout }) => {
  return <>{layout.map(render)}</>;
};

export default PageContent;
