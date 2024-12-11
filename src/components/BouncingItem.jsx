import { animated, useSpring } from "@react-spring/three";
import { useEffect, useRef } from "react";
import { useSong } from "../hooks/useSong";
export const BouncingItem = ({ children, noteValue, ...props }) => {
  const ref = useRef();
  const [springs, api] = useSpring(() => ({
    scale: 1,
  }));

  const registerOnNotePlayed = useSong((state) => state.registerOnNotePlayed);
  const unregisterOnNotePlayed = useSong(
    (state) => state.unregisterOnNotePlayed
  );
  useEffect(() => {
    const onNotePlayed = async (note) => {
      if (note !== noteValue) {
        return;
      }
      api.start({ scale: 1.5 });
      setTimeout(() => {
        api.start({ scale: 1 });
      }, 50);
    };
    registerOnNotePlayed(onNotePlayed);
    return () => unregisterOnNotePlayed(onNotePlayed);
  }, []);
  return (
    <animated.group {...springs} {...props} ref={ref}>
      {children}
    </animated.group>
  );
};
