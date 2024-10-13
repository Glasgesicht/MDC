/**
 *  TODO, selecting those shoudl also parse the coordinates into and DTC file created.
 * It'd be preferred, if the right BULLSEYE is selected via Combat Flite to guarantee that it's accurate
 *  */

import type { theatre } from "@/types/theatre";

export const bullseyes: {
  [K in theatre]: { name: string; location: string }[];
} = {
  Syria: [
    { name: "BASIN", location: "N 33°50.000’ // E 036°49.000’" },
    { name: "DRIFT", location: "N 37°24.000’ // E 033°09.000’" },
    { name: "CAPE", location: "N 34°34.000’ // E 033°02.000’" },
  ],
  Kola: [],
  Nevada: [],
  PG: [],
  Sinai: [],
  Caucasus: [],
  Marianas: [],
};
