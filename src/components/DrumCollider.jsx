import { useCallback, useRef } from "react";

export const DrumCollider = ({ radius = 0.3, height = 1, onHit, ...props }) => {
  const isInside = useRef(false);

  const onPointerEnter = useCallback(
    (e) => {
      e.stopPropagation();
      // if (!isInside.current) {
      onHit();
      isInside.current = true;
      // }
    },
    [onHit]
  );

  const onPointerLeave = useCallback(() => {
    isInside.current = false;
  }, []);

  return (
    <group {...props}>
      <mesh
        visible={false}
        position-y={-height / 2 - 0.001}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <cylinderGeometry args={[radius, radius, height, 32]} />
        <meshStandardMaterial color="pink" />
      </mesh>
    </group>
  );
};
