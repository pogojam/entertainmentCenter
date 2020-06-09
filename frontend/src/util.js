import React, { useEffect, useCallback, useRef, useState } from "react";

export const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const changeTo = (com, type) => {
  com.target = type;
  return com;
};

export const withProps = (Component, { children, ...props }) => (
  <Component {...props}>{children}</Component>
);

export const buildThresholdList = (numSteps) => {
  let thresholds = [];

  for (let i = 1.0; i <= numSteps; i++) {
    let ratio = i / numSteps;
    thresholds.push(ratio);
  }

  thresholds.push(0);
  return thresholds;
};

export const locateTo = (location) => {
  window.location.href = location;
};

export const wrapComponent = (C1, C2) => {
  return ({ children, ...props }) => (
    <C2>
      <C1 {...props}>{children}</C1>
    </C2>
  );
};
export const useWindowSize = ({ resize = true }) => {
  const isClient = typeof window === "object";

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    resize && window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
};
export const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState((state) => !state), []);

  return [state, toggle];
};
export function useSize(ref) {
  const obs = useRef();
  const [ignored, setIgnored] = useState(0);
  const [size, setSize] = useState({ width: null, height: null });

  useEffect(() => {
    function observe(entries) {
      const { width, height } = entries[0].contentRect;
      setSize((s) =>
        s.width !== width || s.height !== height ? { width, height } : s
      );
    }
    const RObserver =
      window.ResizeObserver || require("resize-observer-polyfill").default;
    obs.current = new RObserver(observe);
    return () => obs.current.disconnect();
  }, []);

  useEffect(() => {
    const forceUpdate = () => setIgnored((c) => c + 1);
    const item = ref.current;
    if (item) {
      obs.current.observe(item);
      window.setTimeout(forceUpdate, 0);
    }
    return () => item && obs.current.unobserve(item);
  }, [obs, ref]);

  return size;
}

export const useObserver = ({ root = null, rootMargin, threshold = 0 }) => {
  const [entry, updateEntry] = useState({});
  const [node, setNode] = useState(null);
  const isWindow = typeof window !== `undefined`;

  const observer = useRef(
    isWindow
      ? new window.IntersectionObserver(([entry]) => updateEntry(entry), {
          root,
          rootMargin,
          threshold,
        })
      : null
  );

  useEffect(() => {
    const { current: currentObserver } = observer;
    currentObserver.disconnect();

    if (node) currentObserver.observe(node);

    return () => currentObserver.disconnect();
  }, [node]);

  return [setNode, entry];
};

export const useGroup = (name, group) => {
  let output;
  if (group) {
    output = `${group.groupName}[${group.index}]` + `[${name}]`;
  } else {
    output = name;
  }
  return [output];
};
