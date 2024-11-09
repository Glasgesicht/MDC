<template>
  <div style="height: 100%; width: 100%">
    <l-map
      ref="mapRef"
      :center="centerPos"
      :zoom="zoomLvl"
      
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
        :url="`https://api.tiles.openaip.net/api/data/openaip/{z}/{x}/{y}.png?apiKey=${apiKey}`"
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
import { LMap, LTileLayer, LPolyline, LMarker, Utilities,  } from "@vue-leaflet/vue-leaflet";
import L, { Icon, latLngBounds, type IconOptions, type LatLngExpression, type LatLngTuple, type PointExpression, type PointTuple, Map, LatLngBounds, Bounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch, type Ref,toRaw } from "vue";


const { getFlight } = storeToRefs(useFlightStore());

const  apiKey = computed(()=>import.meta.env.VITE_APP_MAP_API_KEY)


const minMaxLatLon = computed(() =>
  getFlight.value?.waypoints 
    .reduce<[[number,number],[number,number]]>(
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


const leafletBounds = computed(()=>new L.LatLngBounds(
      [minMaxLatLon.value[0][0], minMaxLatLon.value[1][0]], // [minLat, minLon]
      [minMaxLatLon.value[0][1], minMaxLatLon.value[1][1]]  // [maxLat, maxLon]
    ))

    console.log(leafletBounds.value)
//@ts-ignore
const zoomLvl = computed(() => (calculateBoundsZoom(leafletBounds.value)))
// Map zoom level
// const zoomLevel = computed(()=>map.value.getBoundsZoom(leafletBounds.value))


//1199.63/956.2
function calculateBoundsZoom(bounds:typeof leafletBounds.value, containerWidth=1200, containerHeight=950) {
  // Calculate the latitude/longitude bounds width and height
  const boundsWidth = bounds.getEast() - bounds.getWest();
  const boundsHeight = bounds.getNorth() - bounds.getSouth();

  // Get the current map's maximum zoom level (this should be based on your map configuration)
  const maxZoom = 18; // Replace with your actual max zoom if different

  // Calculate the aspect ratios for both bounds and container
  const boundsAspectRatio = boundsWidth / boundsHeight;
  const containerAspectRatio = containerWidth / containerHeight;

  // Calculate the zoom factor based on the width and height
  let zoomLevel;

  if (boundsAspectRatio > containerAspectRatio) {
    zoomLevel = Math.log(containerWidth / boundsWidth) / Math.LN2;
  } else {
    zoomLevel = Math.log(containerHeight / boundsHeight) / Math.LN2;
  }

  // Limit the zoom level to max zoom levels
  zoomLevel = Math.min(maxZoom, zoomLevel);


  return Math.floor(zoomLevel);
}

const centerPos = computed(() => 
  minMaxLatLon.value.map((n) => (n[0] + n[1]) / 2) as PointTuple
)

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
