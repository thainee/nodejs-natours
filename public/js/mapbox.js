/* eslint-disable */

const mapDocument = document.getElementById('map');
const locations = JSON.parse(mapDocument.dataset.locations);
const mapboxAccessToken = mapDocument.dataset.mapbox_key;

mapboxgl.accessToken = mapboxAccessToken;

const map = new mapboxgl.Map({
  container: 'map', // container ID
  // center: [-74.5, 40], // starting position [lng, lat]. Note that lat must be set between -90 and 90
  // zoom: 9, // starting zoom
  projection: 'mercator',
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
