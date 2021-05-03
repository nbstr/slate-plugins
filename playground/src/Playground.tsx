// Import React dependencies.
import React, { useEffect, useMemo, useState, useCallback } from "react";
// Import the Slate editor factory.
import { createEditor } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";
import { Descendant } from "slate";
import { Editor, Transforms } from "slate";

// TypeScript Users only add this code
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

type CustomElement = {
  bold?: boolean;
  type: "paragraph" | "code" | "blockquote";
  children: CustomText[];
};
type CustomText = { text: string; bold?: string };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
// Define a React component renderer for our code blocks.
const CodeElement = (props: any) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>;
};

// Define a React component to render leaves with bold text.
const Leaf = (props: any) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
    >
      {props.children}
    </span>
  );
};

const App = () => {
  // Create a Slate editor object that won't change across renders.
  const editor = useMemo(() => withReact(createEditor()), []);

  // Keep track of state for the value of the editor.
  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }]
    }
  ]);

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  // Define a leaf rendering function that is memoized with `useCallback`.
  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />;
  }, []);

  return (
    // Add the editable component inside the context.
    <Slate
      editor={editor}
      value={value}
      onChange={newValue => setValue(newValue)}
    >
      <Editable
        // Pass in the `renderElement` function.
        renderElement={renderElement}
        // Pass in the `renderLeaf` function.
        renderLeaf={renderLeaf}
        // Define a new handler which prints the key that was pressed.
        onKeyDown={event => {
          if (!event.ctrlKey) {
            return;
          }

          switch (event.key) {
            // When "`" is pressed, keep our existing code block logic.
            case "Dead":
            case "`": {
              event.preventDefault();
              const [match] = Editor.nodes(editor, {
                match: (n: any) => n.type === "code"
              });
              Transforms.setNodes(
                editor,
                { type: match ? "paragraph" : "code" },
                { match: (n: any) => Editor.isBlock(editor, n) }
              );
              break;
            }

            // When "B" is pressed, bold the text in the selection.
            case "b": {
              event.preventDefault();
              Transforms.setNodes(
                editor,
                { bold: true },
                // Apply it to text nodes, and split the text node up if the
                // selection is overlapping only part of it.
                { match: (n: any) => Text.isText(n), split: true }
              );
              break;
            }
          }
        }}
      />
    </Slate>
  );
};

export default App;
