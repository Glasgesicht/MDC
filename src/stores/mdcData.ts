import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useMCDStore = defineStore("data", () => {
  const missionNr = ref(12345);
  const callsign = ref("BEAST 7");
  const pkgnr = ref("CAS PKG");
  const homePlate = ref("Incirlik");
  const msnType = ref("CAS");
  const pkgTask = ref("some task, fill here");
  const flightTask = ref("stuff");
  const situation = ref(
    "This can be some longer text.\nCan also have line breaks"
  );
  const surfaceT = ref("SHORAD, AAA");
  const airT = ref("NONE");
  const roe = ref("Don't shoot at Civilians, thank you.");

  const gameplan = ref(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris feugiat rhoncus mollis. Aliquam erat volutpat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nam efficitur at sapien at posuere. Pellentesque tortor eros, ultrices eget vestibulum et, blandit in mauris. Etiam rhoncus mattis mattis. Maecenas tristique facilisis luctus. Vivamus nec sapien enim. Vestibulum pulvinar, nisi ut ultricies sollicitudin, leo tortor bibendum metus, eu porta arcu tortor in enim. Aliquam pulvinar quam vitae mauris pretium semper. Quisque finibus quis ante in sollicitudin. Sed consequat, lectus nec facilisis congue, quam nibh blandit tortor, hendrerit porta nibh massa id tortor. Donec vestibulum placerat ex ut faucibus. "
  );

  return {
    missionNr,
    callsign,
    pkgnr,
    homePlate,
    msnType,
    pkgTask,
    flightTask,
    situation,
    surfaceT,
    airT,
    gameplan,
    roe,
  };
});
