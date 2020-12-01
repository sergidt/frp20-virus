import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { City } from '../../definitions';

@Component({
    selector: 'top-affected-cities',
    templateUrl: './top-affected-cities.component.html',
    styleUrls: ['../lists-components.scss', './top-affected-cities.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopAffectedCitiesComponent implements OnInit {
    top10InfectedCities: Array<City>;

    constructor(public service: AppService, private cd: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.service.top10InfectedCities$
            .subscribe(_ => {
                this.top10InfectedCities = _;
                this.cd.markForCheck();
            });
    }

    trackByCityName = (index, city: City) => city.city;

}
