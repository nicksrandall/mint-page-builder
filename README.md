# Mint Page Builder (WIP)

## Summary
This is a prototype, CMS agnostic page building UI. This tool allows developers to "register"
components (and their configurable settings) and then this UI automaticaly generates a UI that allows
non-technical persons to compose those components in any way they like.

Once a layout has been created, it is saved as a JSX like JSON document that can be conumed by 
a number of different clients. 

One of the cool benefits of this approach is that the CMS is not aware of the implementation of the components at all.
So the same JSON structure *could* power a responsive view on a webpage as well as a native view within a mobile app.

## Sample `PageContent` compoent
This is an exampale component to show how easy it would be to write a React component to render the content
from the CMS (JSON).


```js
// PageContent.js
import {createElement, Fragment} from 'react';

// all the components we have made available.
// In production we'd probably lazy load these.
import Row from './Row';
import Column from './Column';
import Heading from './Heading';
import Image from './Image';

// a map from component name to implementation
const componentMap = new Map();
componentMap.set('row', Row);
componentMap.set('column', Column);
componentMap.set('Heading', Heading);
componentMap.set('Image', Image);

// recursive function to convert JSON to React elements
const render = (definition) => {
  // TODO handle case when no component exists with given name
  const element = map.get(definition.name);
  return createElement(element, definition.props, ...definition.children.map(render))
} 

// Layout here is the JSON that this page builder produces
// We wrap everything in a fragment to handle the top level array of rows.
const PageContent = ({ layout }) => {
  return createElement(Fragment, null, ...layout.map(render))
}

export default PageContent;
```

### Example JSON output from CMS

```json
{
  "template": {
    "template": "main",
    "logo": "./logo.png"
  },
  "layout": [
    {
      "id": "8af6704d-f369-4f42-b9dd-6252ff095143",
      "name": "row",
      "props": {
        "backgroundImage": "path/to/some/bg.png",
        "backgroundColor": "#0000ff",
        "fluid": false
      },
      "children": [
        {
          "id": "704df369-ef42-49dd-a252-ff0951430b2f",
          "name": "column",
          "props": {
            "mobileSpan": 4,
            "tabletSpan": 8,
            "desktopSpan": 6
          },
          "children": [
            {
              "id": "69ef42f9-dd62-42ff-8951-430b2f979a5a",
              "name": "Heading",
              "props": {
                "level": "h1",
                "content": "Hello world"
              },
              "hasChildren": false
            },
            {
              "id": "ef42f9dd-6252-4f09-9143-0b2f979a5ae4",
              "name": "Image",
              "props": {
                "src": "some/fake/path.jpg",
                "alt": "fake image"
              },
              "children": []
            }
          ]
        },
        {
          "id": "4df369ef-42f9-4d62-92ff-0951430b2f97",
          "name": "column",
          "props": {
            "mobileSpan": 4,
            "tabletSpan": 8,
            "desktopSpan": 6
          },
          "children": [
            {
              "id": "42f9dd62-52ff-4951-830b-2f979a5ae409",
              "name": "Image",
              "props": {
                "src": "fake/image.png",
                "alt": "Here is some alt text."
              },
              "children": []
            }
          ]
        }
      ]
    },
    {
      "id": "f6704df3-69ef-42f9-9d62-52ff0951430b",
      "name": "row",
      "props": {
        "backgroundImage": "path/to/some/other.png",
        "backgroundColor": "#ff0000",
        "fluid": true
      },
      "children": [
        {
          "id": "f369ef42-f9dd-4252-bf09-51430b2f979a",
          "name": "column",
          "props": {
            "mobileSpan": 4,
            "tabletSpan": 8,
            "desktopSpan": 12
          },
          "children": [
            {
              "id": "f9dd6252-ff09-4143-8b2f-979a5ae409c5",
              "name": "Heading",
              "props": {
                "level": "h3",
                "content": "I'm in row 2"
              },
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

## View Demo
- `$ yarn install`
- `$ yarn start`
- Navigate to `localhost:1234`
