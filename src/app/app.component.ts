import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    menuEntry: 'HOME' | 'DASHBOARD' | 'MAP' = 'DASHBOARD';

    constructor(public service: AppService, private cd: ChangeDetectorRef) {

    }

    selectMenuEntry(entry) {
        this.menuEntry = entry;
        this.cd.markForCheck();
    }
}
