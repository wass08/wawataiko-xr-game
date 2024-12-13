import { animated, useSpring } from "@react-spring/three";
import { memo, useEffect, useRef } from "react";
import { useSong } from "../hooks/useSong";
export const BouncingItem = memo(({ children, noteValue, ...props }) => {
  const ref = useRef();
  const [springs, api] = useSpring(() => ({
    scale: 1,
  }));

  const registerOnNotePlayed = useSong((state) => state.registerOnNotePlayed);
  const unregisterOnNotePlayed = useSong(
    (state) => state.unregisterOnNotePlayed
  );
  useEffect(() => {
    let timeout = null;
    const onNotePlayed = async (note) => {
      if (note !== noteValue) {
        return;
      }
      clearTimeout(timeout);
      await api.start({ scale: 1.5 });
      timeout = setTimeout(() => {
        api.start({ scale: 1 });
      }, 50);
    };
    registerOnNotePlayed(onNotePlayed);
    return () => unregisterOnNotePlayed(onNotePlayed);
  }, []);
  console.log("rerendered");
  return (
    <animated.group {...springs} {...props} ref={ref}>
      {children}
    </animated.group>
  );
});
