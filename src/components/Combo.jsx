import { animated, useSpring } from "@react-spring/three";
import { Float, Text3D } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { useSong } from "../hooks/useSong";
import { Avatar } from "./Avatar";
export const Combo = () => {
  const combo = useSong((state) => state.combo);
  const songEnded = useSong((state) => state.songEnded);
  const currentSong = useSong((state) => state.currentSong);

  const dance = songEnded
    ? "Victory"
    : combo > 100
      ? "Swing"
      : combo > 50
        ? "House"
        : combo > 10
          ? "HipHop"
          : "HappyIdle";
  const springs = useSpring({
    scale: (combo > 0 || songEnded) && currentSong ? 1 : 0,
  });
  return (
    <>
      <Float
        rotation-y={degToRad(25)}
        position-y={1.32}
        position-z={-1.2}
        position-x={-1.1}
        speed={5}
        floatIntensity={0.5}
      >
        <animated.group {...springs}>
          <Text3D
            scale={0.5}
            size={0.5}
            bevelEnabled
            bevelThickness={0.02}
            font={"fonts/Inter_Bold.json"}
          >
            x{combo}
            <meshStandardMaterial
              color="white"
              emissive={"mediumpurple"}
              emissiveIntensity={0.5}
            />
          </Text3D>
        </animated.group>
      </Float>

      <group
        position-z={-8}
        position-y={0}
        rotation-y={degToRad(45)}
        position-x={-8}
      >
        <animated.group {...springs}>
          <Avatar avatar={"avatar_1733298114125"} animation={dance} />
        </animated.group>
      </group>
      <group
        position-z={-8}
        position-y={0}
        rotation-y={degToRad(-45)}
        position-x={8}
      >
        <animated.group {...springs}>
          <Avatar avatar={"avatar_1733298250949"} animation={dance} />
        </animated.group>
      </group>
    </>
  );
};
