import { useRef } from "react";

export const useDynamicRefs = () => {
  const refs = useRef({});

  const getRef = (name) => {
    if (!refs.current[name]) {
      refs.current[name] = { current: null };
    }
    return refs.current[name];
  }

  return { getRef };
}
