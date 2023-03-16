import {isVerifiedUser} from './util.js';
import {getMapBaloon} from './users-contactors.js';

const MAP_COORDINATES = {
  lat: 59.92749,
  lng: 30.31127,
};
const MAP_ZOOM = 10;
const markersGroup = L.layerGroup();
const titleLayer = L.tileLayer (
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
);

const standartMarkerIcon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [36, 46],
  icorAnchor: [18, 46],
});

const verifiedMarkerIcon = L.icon({
  iconUrl: './img/pin-verified.svg',
  iconSize: [36, 46],
  icorAnchor: [18, 46],
});

let map;

const getMap = () => {
  if (!map) {
    map = L.map('contractor-map').setView(MAP_COORDINATES, MAP_ZOOM);
  }
  return map;
};

const setContractorMarker = (contractor, user) => {
  const {coords: {lat, lng}} = contractor;
  const getMarkerIcon = () =>{
    if (!isVerifiedUser(contractor)) {
      return verifiedMarkerIcon;
    }
    return standartMarkerIcon;
  };
  const contractorMarker = L.marker({
    lat,
    lng,
  },
  {icon: getMarkerIcon(),
  });
  contractorMarker.addTo(markersGroup).bindPopup(() => getMapBaloon(contractor, user));
};

const resetMarkers = (contractors, user) => {
  markersGroup.closePopup();
  markersGroup.clearLayers();
  contractors.forEach((contractor) => setContractorMarker(contractor, user));
};

const initMap = (contractors, user) => {
  getMap();
  resetMarkers(contractors, user);
  //getMap().setView(MAP_COORDINATES, MAP_ZOOM);
  //contractors.forEach((contractor) => setContractorMarker(contractor, user));
  titleLayer.addTo(map);
  markersGroup.addTo(map);
};

export {initMap, setContractorMarker, resetMarkers};
