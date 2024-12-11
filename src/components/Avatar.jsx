import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { randInt } from "three/src/math/MathUtils.js";

export const Avatar = ({ avatar, animation = "HipHop", ...props }) => {
  const { scene } = useGLTF(`models/${avatar}.glb`);
  const ref = useRef();

  const { animations } = useGLTF("models/animations.glb");
  const { actions } = useAnimations(animations, ref);

  useEffect(() => {
    if (actions[animation]) {
      actions[animation].reset().startAt(randInt(0, 0.2)).fadeIn(0.5).play();
    }
    return () => {
      if (actions[animation]) {
        actions[animation].fadeOut(0.5);
      }
    };
  }, [animation]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });
  }, [scene]);

  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  );
};
