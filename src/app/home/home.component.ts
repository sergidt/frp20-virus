import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Summary } from '../definitions';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
    summary: Summary;

    constructor(public service: AppService, private cd: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.service.counters$
            .subscribe(_ => {
                this.summary = _;
                this.cd.markForCheck();
            });
    }
}
