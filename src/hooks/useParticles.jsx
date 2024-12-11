import { randInt } from "three/src/math/MathUtils.js";
import { create } from "zustand";

export const useParticles = create((set, get) => {
  return {
    explosions: [],
    addExplosion: (explosion) => {
      set((state) => {
        return {
          explosions: [
            ...state.explosions,
            {
              ...explosion,
              time: Date.now(),
              lifetime: 1000,
              uid: Date.now() + randInt(0, 9999),
            },
          ],
        };
      });
    },
    removeExplosions: (explosions) => {
      set((state) => {
        return {
          explosions: state.explosions.filter((explosion) => {
            return !explosions.includes(explosion);
          }),
        };
      });
    },
  };
});
