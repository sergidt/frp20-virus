import { Component, OnDestroy, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { AppService } from '../app.service';
import { City } from '../definitions';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
    map: Leaflet.Map;
    cities: Map<string, Leaflet.Marker> = new Map<string, Leaflet.Marker>();

    constructor(public service: AppService) {

    }

    ngOnInit(): void {
        this.map = Leaflet.map('map').setView([40.416775, -3.703790], 2);

        Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

        this.service.affectedCity$
            .subscribe((city: City) => {
                const marker = Leaflet.marker([city.lat, city.lng], {
                    icon: Leaflet.divIcon({
                        className: 'css-icon',
                        html: '<div class="pulse_ring"></div>'
                        , iconSize: [22, 22]
                    })
                });
                try {
                    if (this.cities.has(city.city)) {
                        this.map.removeLayer(this.cities.get(city.city));
                        this.cities.delete(city.city);
                    } else {
                        this.map.addLayer(marker);
                        this.cities.set(city.city, marker);
                    }
                } catch (e) {
                }
            });
    }

    ngOnDestroy(): void {
        this.map.remove();
    }
}
