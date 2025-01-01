/**
 * Callsigns are dependent on the Squadrons that use them
 * This compasable shall help to keep them in sync
 */

import type { aircraftType } from "@/types/aircraft";
import { computed, ref, type Ref, type WritableComputedRef } from "vue";

export const useSqaudronsCallsigns = () => {
    type callsign = { name: string, number: number, STN: string, L16?: string, PRI: number, SEC: number, TER?: number };

    const squadronsMeta: Ref<{ name: string, aircraft: aircraftType, STN: string, active: boolean, callsigns: Array<callsign> }[]> = ref(JSON.parse(localStorage.getItem("squadrons") || '[]'));
    const squadrons: WritableComputedRef<{ name: string, aircraft: aircraftType, STN: string, active: boolean, callsigns: Array<callsign> }[]> = computed({
        get() {
            return squadronsMeta.value
        }, set(value) {
            squadronsMeta.value = value;
            localStorage.setItem("squadrons", JSON.stringify(value))
        }
    })

    return { squadrons }
}