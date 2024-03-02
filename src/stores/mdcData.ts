import { ref, computed, type WritableComputedRef, type Ref } from "vue";
import { defineStore, type SubscriptionCallbackMutation } from "pinia";
import type { Flight, Package } from "@/types/mdcDataTypes";

export const useMCDStore = defineStore("data", () => {
  const packages: Ref<Package[]> = ref(new Array());
  const selectedPKG: Ref<Package> = ref({} as Package);

  const selctedFlight: Ref<Flight> = ref({} as Flight);

  const allFlightsFromPackage: WritableComputedRef<Flight[]> = computed({
    set(value: Flight[]) {
      const index = packages.value.findIndex(
        (flight) => flight.name === selectedPKG.value.name
      );
      if (index === -1) return;
      packages.value[index].flights = value;
    },
    get() {
      const index = packages.value.findIndex(
        (flight) => flight.name === selectedPKG.value.name
      );
      if (index === -1) return [];
      return packages.value[index].flights;
    },
  });

  const missionNr = computed({
    get() {
      return "";
    },
    set(v: string) {},
  });

  //const missionNr = ref(12345);
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
    packages,
    selectedPKG,
    allFlightsFromPackage,
    selctedFlight,

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
