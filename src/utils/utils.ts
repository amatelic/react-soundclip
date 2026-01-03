import * as React from "react";
import { AudioChildProps } from "../types";

export function traverseToLastChild(element: React.ReactNode) {
  if (!React.isValidElement(element)) {
    return [];
  }

  const traversalPath = [element];
  let currentElement = element as any;

  while (currentElement.props && currentElement.props.children) {
    const children = React.Children.toArray(currentElement.props.children);

    if (children.length === 0) {
      break; // No more children to traverse
    }

    // Get the last child
    const lastChild = children[children.length - 1];

    if (!React.isValidElement(lastChild)) {
      break; // Last child is not a React element
    }

    traversalPath.push(lastChild);
    currentElement = lastChild;
  }

  return traversalPath;
}
export function isValid(element: React.ReactElement<AudioChildProps>) {
  return (
    !React.isValidElement(element) ||
    typeof element === "string" ||
    !element.key
  );
}

export function cleanKey(key: string) {
  if (!key) return key;
  return key.replace(/^[\$.]+/, "");
}

export function normalizeValue(
  value: string | boolean | undefined,
): boolean | string {
  if (value === undefined) {
    return false;
  }
  return value;
}
