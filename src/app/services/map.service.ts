import { Injectable } from '@angular/core';
import * as leaflet from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor() { }

  initMap(map, lgt, lat, label) {
    map = leaflet.map('map', {
      center: [ lgt, lat ],
      zoom: 12
    });
  
    const tiles = leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
  
    tiles.addTo(map);
  
    let marker = leaflet.marker([ lgt, lat ], {
      icon: leaflet.icon({
        iconUrl: 'www/images/marker-icon.png',
        shadowUrl: 'www/images/marker-shadow.png',
        iconSize: [24,36],
        iconAnchor: [12,36],
      }),
      title: label
    });

    marker.addTo(map);

    return map;
  }

  refreshMap(map, lgt, lat, label) {
    map.setView([ lgt, lat ], 12);

    let marker = leaflet.marker([ lgt, lat ], {
      icon: leaflet.icon({
        iconUrl: 'www/images/marker-icon.png',
        shadowUrl: 'www/images/marker-shadow.png',
        iconSize: [24,36],
        iconAnchor: [12,36]
      }),
      title: label
    });

    map.eachLayer((layer) => {
      if (layer.options.title) {
        map.removeLayer(layer);
      }
    });
    marker.addTo(map);

    return map;
  }
}
