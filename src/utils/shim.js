// this should only be used for local development
import { locations } from "contentful-ui-extensions-sdk";

const noop = () => {};

class Location {
  constructor(loc) {
    this.loc = loc;
  }
  is(value) {
    return this.loc === value;
  }
}

export const location = new Location(locations.LOCATION_DIALOG);

const components = [
  {
    icon: "title",
    name: "Heading",
    props: [
      {
        name: "level",
        type: "select",
        options: [
          {
            label: "h1",
            value: "h1"
          },
          {
            label: "h2",
            value: "h2"
          },
          {
            label: "h3",
            value: "h3"
          },
          {
            label: "h4",
            value: "h4"
          },
          {
            label: "h5",
            value: "h5"
          },
          {
            label: "h6",
            value: "h6"
          }
        ],
        displayName: "Heading Level",
        displayType: "text",
        defaultValue: "h1"
      },
      {
        name: "typography",
        type: "typography",
        displayName: "Typography",
        displayType: "json",
        defaultValue: {
          fontSize: 24,
          fontFamily: "body",
          fontWeight: "heading",
          lineHeight: "heading"
        }
      },
      {
        name: "content",
        type: "text",
        section: "props",
        displayName: "Content",
        displayType: "text",
        defaultValue: ""
      }
    ]
  },
  {
    icon: "insert_photo",
    name: "Image",
    props: [
      {
        name: "src",
        type: "media",
        displayName: "Source URL",
        displayType: "image",
        defaultValue: ""
      },
      {
        name: "alt",
        type: "text",
        displayName: "Alt Text",
        displayType: "text",
        defaultValue: ""
      }
    ]
  },
  {
    icon: "text_format",
    name: "WYSIWYG",
    props: [
      {
        name: "content",
        type: "WYSIWYG",
        section: "props",
        displayName: "Content",
        displayType: "text",
        defaultValue: ""
      }
    ]
  },
  {
    icon: "link",
    name: "Button",
    props: [
      {
        name: "href",
        type: "url",
        section: "props",
        displayName: "Link URL",
        displayType: "text",
        defaultValue: ""
      },
      {
        name: "content",
        type: "text",
        section: "props",
        displayName: "Content",
        displayType: "text",
        defaultValue: ""
      },
      {
        name: "bgColor",
        type: "color",
        section: "props",
        displayName: "Background Color",
        displayType: "color",
        defaultValue: "#66beb2"
      },
      {
        name: "textColor",
        type: "color",
        section: "props",
        displayName: "Text Color",
        displayType: "color",
        defaultValue: "#fff"
      }
    ]
  },
  {
    icon: "horizontal_split",
    name: "Separator",
    props: []
  },
  {
    icon: "list_alt",
    name: "Form",
    props: [
      {
        name: "form",
        type: "entry",
        options: ["forms"],
        displayName: "Form",
        displayType: "text",
        defaultValue: ""
      }
    ]
  },
  {
    icon: "slideshow",
    name: "Carousel",
    props: [
      {
        name: "autoplay",
        type: "checkbox",
        displayName: "Autoplay",
        displayType: "boolean",
        defaultValue: true
      }
    ],
    children: ['Slide']
  },
  {
    icon: "slideshow",
    name: "Slide",
    hidden: true,
    props: [
      {
        name: "image",
        type: "url",
        displayName: "Image",
        displayType: "text",
        defaultValue: ""
      }
    ],
  }
];

export const shim = {
  app: {
    onConfigure: noop,
    setReady: noop,
    getParameters: () =>
      Promise.resolve({
        components
      })
  },
  location,
  close: noop,
  notifier: { error: noop },
  window: { updateHeight: noop, startAutoResizer: noop },
  parameters: {
    invocation: { initialValue: [] },
    installation: { components }
  }
};
