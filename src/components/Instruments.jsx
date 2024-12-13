import { memo, useCallback, useMemo } from "react";
import { NOTES_COLORS, NOTES_POSITIONS, useSong } from "../hooks/useSong";
import { BouncingItem } from "./BouncingItem";
import { Cymbal } from "./Cymbal";
import { Drum } from "./Drum";
import { DrumCollider } from "./DrumCollider";
import { NoteMesh } from "./NoteMesh";

export const Instruments = memo(() => {
  const playNote = useSong((state) => state.playNote);
  const onHitMiddle = useCallback(() => {
    playNote("Middle");
  }, []);

  const onHitSide = useCallback(() => {
    playNote("Side");
  }, []);

  const onHitCrash = useCallback(() => {
    playNote("Crash");
  }, []);

  const instruments = useMemo(
    () => ({
      cymbal: <Cymbal scale={1.6} />,
      middle: <Drum color={NOTES_COLORS["Middle"]} scale={0.06} />,
      side: <Drum color={NOTES_COLORS["Side"]} scale={0.04} />,
    }),
    []
  );

  return (
    <>
      <group
        position-x={NOTES_POSITIONS["Crash"].x}
        position-y={NOTES_POSITIONS["Crash"].y}
      >
        <NoteMesh color={NOTES_COLORS["Crash"]} />
        <DrumCollider radius={0.3} height={0.52} onHit={onHitCrash} />

        <BouncingItem noteValue={"Crash"}>{instruments.cymbal}</BouncingItem>
      </group>

      <group
        position-x={NOTES_POSITIONS["Middle"].x}
        position-y={NOTES_POSITIONS["Middle"].y}
      >
        <NoteMesh color={NOTES_COLORS["Middle"]} />
        <DrumCollider radius={0.31} height={0.52} onHit={onHitMiddle} />
        <BouncingItem noteValue={"Middle"} position-y={-0.42}>
          {instruments.middle}
        </BouncingItem>
      </group>
      <group
        position-x={NOTES_POSITIONS["Side"].x}
        position-y={NOTES_POSITIONS["Side"].y}
      >
        <NoteMesh color={NOTES_COLORS["Side"]} />
        <DrumCollider radius={0.21} height={0.52} onHit={onHitSide} />
        <BouncingItem noteValue={"Side"} position-y={-0.28}>
          {instruments.side}
        </BouncingItem>
      </group>
    </>
  );
});
