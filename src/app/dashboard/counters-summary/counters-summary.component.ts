import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Summary } from '../../definitions';

@Component({
    selector: 'counters-summary',
    templateUrl: './counters-summary.component.html',
    styleUrls: ['./counters-summary.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountersSummaryComponent implements OnInit {
    summary: Summary;
    propagation: number;

    constructor(public service: AppService, private cd: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.service.counters$
            .subscribe(_ => {
                this.summary = _;
                this.cd.markForCheck();
            });

        this.service.propagation$
            .subscribe(_ => {
                this.propagation = _;
                this.cd.markForCheck();
            });
    }
}
