<template>
  <div style="height: 100%; width: 100%">
    <l-map
      ref="map"
      v-model:zoom="zoom"
      :center="centerPos"
      :use-global-leaflet="false"
      style="height: 100%; width: 100%"
      :options="{
        zoomControl: false,
        attributionControl: false,
      }"
    >
      <l-tile-layer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        layer-type="base"
        name="OpenFlightMaps"
      ></l-tile-layer>

      <l-tile-layer
        url="https://api.tiles.openaip.net/api/data/openaip/{z}/{x}/{y}.png?apiKey=e547009dfa08d8afd0834433030405c0"
        layer-type="overlay"
        name="OpenFlightMaps"
      ></l-tile-layer>

      <l-polyline
        :lat-lngs="navAreas"
        color="grey"
        :weight="2"
        dashArray="2 10 "
        name="navareas"
        fill
      ></l-polyline>
      <l-polyline
        :lat-lngs="steerpointPolyArray"
        color="black"
        :weight="2"
      ></l-polyline>
      
     
      <l-marker v-for="wp of getFlight.waypoints.filter((n) => !n.hideOnMDC)"
        :lat-lng="[wp.location.lat, wp.location.lon]"
        :icon="createCustomIcon(`${wp.name}`,'right')"
      ></l-marker>
      
    </l-map>
  </div>
</template>

<script setup lang="ts">
import { useFlightStore } from "@/stores/flightStore";
import { LMap, LTileLayer, LPolyline, LMarker } from "@vue-leaflet/vue-leaflet";
import L, { Icon, type IconOptions, type LatLngExpression, type LatLngTuple, type PointExpression, type PointTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { storeToRefs } from "pinia";
import { computed, ref, watch, type Ref } from "vue";

// Map zoom level
const zoom = computed(()=> 20/Math.abs(minMaxLatLon.value[0][1] - minMaxLatLon.value[0][0]) );

const { getFlight } = storeToRefs(useFlightStore());

const minMaxLatLon = computed(() =>
  getFlight.value?.waypoints 
    .reduce(
      ([[minLat, maxLat],[minLon, maxLon], ], curr, i) => {
        if (i == 0)
          return [
            [curr.location.lat, curr.location.lat],
            [curr.location.lon, curr.location.lon],
          ];

        return [
          [
            Math.min(minLat, curr.location.lat),
            Math.max(maxLat, curr.location.lat),
          ],
          [
            Math.min(minLon, curr.location.lon),
            Math.max(maxLon, curr.location.lon),
          ],
        ];
      },
      [
        [0, 0],
        [0, 0],
      ]
    )
);

console.log(minMaxLatLon.value)
const centerPos = computed(() => 
  minMaxLatLon.value.map((n) => (n[0] + n[1]) / 2) as PointTuple
)



const routeCoordinates = getFlight.value?.waypoints
  .filter((n) => n.hideOnMDC === false)
  .map((n) => {
    return [n.location.lat, n.location.lon];
  }) as LatLngExpression[];

const steerpointPolyArray = computed(() => {
  return new Array(26)
    .fill("")
    .map((_n, i) =>
      getFlight.value.waypoints
        .filter((n) => n?.hideOnMDC === false)
        .find((n) => n.waypointNr == i + 1)
    )

    .reduce((coll, curr) => {
      if (!curr?.waypointNr) coll.push(new Array());
      else coll[coll.length - 1].push([curr.location.lat, curr.location.lon]);
      return coll;
    }, new Array(new Array()))
    .filter((n) => n.length > 1) as LatLngExpression[];
});

function createCustomIcon(label: string, position: "top"|"left"|"right"|"bottom")  {
  // Style configurations based on the label position
  const positionStyles = {
    top: `
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
    `,
    right: `
      top: 50%;
      left: 20px;
      transform: translateY(-50%);
    `,
    bottom: `
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
    `,
    left: `
      top: 50%;
      left: -72px;
      transform: translateY(-50%);
    `,
  };

  // Default to "top" if an invalid position is given
  const labelPositionStyle = positionStyles[position] || positionStyles["top"];

  // Create the custom icon HTML
  const iconHtml = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="
        width: 18px; 
        height: 18px; 
        border: 2px solid black; 
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        ">
        <!-- Small Dot in the Center -->
        <div style="
          width: 4px; 
          height: 4px; 
          background-color: black; 
          border-radius: 50%;
        "></div>
      </div>
      <!-- Label with position offset -->
      <span style="
        position: absolute;
        color: red; 
        font-size: 14px; 
        font-weight: 600;
        white-space: nowrap;
        ${labelPositionStyle}
      ">${label}</span>
    </div>
  `;

  // Return the custom Leaflet div icon
  return L.divIcon({
    className: "custom-icon",
    html: iconHtml,
    iconSize: [20, 20], // Adjust as needed
    iconAnchor: [10, 10], // Center the icon
  })as Icon;
} 

const navAreas = computed(() =>
  getFlight.value?.waypoints
    .filter((n) => n.hideOnMDC === true)
    .map((n) => {
      return [n.location.lat, n.location.lon];
    }) as LatLngExpression[]
);

</script>

<style scoped>
/* Ensure the map container occupies the specified area */
html,
body {
  margin: 0;
  padding: 0;
}
</style>
