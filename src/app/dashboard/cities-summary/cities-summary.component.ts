import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { CitiesInfo } from '../../definitions';

@Component({
    selector: 'cities-summary',
    templateUrl: './cities-summary.component.html',
    styleUrls: ['./cities-summary.component.scss']
})
export class CitiesSummaryComponent implements OnInit {
    citiesInfo: CitiesInfo;

    constructor(public service: AppService, private cd: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.service.citiesInfo$
            .subscribe(_ => {
                this.citiesInfo = _;
                this.cd.markForCheck();
            });
    }
}
