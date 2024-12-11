import { Instance, Instances, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { memo, useMemo, useRef } from "react";
import { Color, MathUtils } from "three";
import { randFloat } from "three/src/math/MathUtils.js";
import { useParticles } from "../hooks/useParticles";

export const ExplosionParticles = () => {
  const alphaMap = useTexture("/textures/note.png");
  return (
    <Instances frustumCulled={false} limit={2000} range={2000}>
      <planeGeometry args={[0.1, 0.1]} />
      <meshStandardMaterial alphaMap={alphaMap} transparent depthTest={false} />
      <Explosions />
    </Instances>
  );
};

const Explosions = () => {
  const explosions = useParticles((state) => state.explosions);
  const removeExplosions = useParticles((state) => state.removeExplosions);

  useFrame(() => {
    const explosionsToRemove = [];
    for (const explosion of explosions) {
      if (explosion.time + explosion.lifetime < Date.now()) {
        explosionsToRemove.push(explosion);
      }
    }
    if (explosionsToRemove.length) {
      removeExplosions(explosionsToRemove);
    }
  });

  return explosions.map((explosion) => (
    <Explosion key={explosion.uid} explosion={explosion} />
  ));
};

const Explosion = memo(({ explosion, nbParticles = 100, lifetime = 1000 }) => {
  const { position, color } = explosion;
  const particles = useMemo(
    () =>
      new Array(nbParticles).fill().map(() => {
        const speed = Math.random() * 0.5 + 0.5;
        const angle = Math.random() * Math.PI * 2;
        const size = randFloat(0.1, 1);
        const randLifetime = randFloat(lifetime - 250, lifetime + 250);
        const adjustedColor = new Color(color).multiplyScalar(
          randFloat(0.5, 3)
        );
        return {
          speed,
          angle,
          size,
          lifetime: randLifetime,
          color: adjustedColor,
        };
      }),
    [nbParticles]
  );

  return (
    <group position={position}>
      {particles.map((particle, index) => (
        <Particle key={index} {...particle} />
      ))}
    </group>
  );
});

const Particle = ({ speed, angle, size, lifetime, color, ...props }) => {
  const ref = useRef();
  const startTime = useRef(Date.now());
  useFrame((_, delta) => {
    if (ref.current) {
      const elapsed = Date.now() - startTime.current;
      ref.current.position.x += Math.cos(angle) * speed * delta;
      ref.current.position.z += Math.sin(angle) * speed * delta;
      ref.current.position.y =
        Math.sin(Math.min(1, elapsed / lifetime) * Math.PI) * 0.5;

      const lerpedSize = MathUtils.lerp(
        size,
        0,
        Math.min(1, elapsed / lifetime)
      );
      ref.current.scale.set(lerpedSize, lerpedSize, lerpedSize);
    }
  });

  return <Instance ref={ref} scale={size} color={color} />;
};
