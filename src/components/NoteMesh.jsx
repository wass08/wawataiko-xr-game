import { useGLTF } from "@react-three/drei";

export const NoteMesh = ({ color }) => {
  const { nodes, materials } = useGLTF("/models/Note.glb");
  return (
    <mesh
      scale={0.2}
      castShadow
      receiveShadow
      geometry={nodes.Cylinder.geometry}
    >
      <meshStandardMaterial color={color} transparent opacity={0.8} />
    </mesh>
  );
};
