import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { SummaryByCountries } from '../../definitions';
import { filterNotNulls } from '../../utils';

@Component({
    selector: 'countries-summary',
    templateUrl: './countries-summary.component.html',
    styleUrls: ['../lists-components.scss', './countries-summary.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountriesSummaryComponent implements OnInit {
    summaryByCountries: Array<[string, Array<string>]>;
    updateTimestamp: number;

    constructor(public service: AppService, private cd: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.service.summaryByCountries$
            .pipe(filterNotNulls())
            .subscribe((_: SummaryByCountries) => {
                this.summaryByCountries = Object.entries(_)
                                                .filter((summary: [string, Array<string>]) => summary[0] !== 'updateTimestamp')
                                                .sort((a, b) => b[1].length - a[1].length);
                this.updateTimestamp = _.updateTimestamp;
                this.cd.markForCheck();
            });
    }

    trackByFunction = (index, country: [string, Array<string>]) => country[0];

}
