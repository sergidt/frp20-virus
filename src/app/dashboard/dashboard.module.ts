import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CitiesSummaryComponent } from './cities-summary/cities-summary.component';
import { CountersSummaryComponent } from './counters-summary/counters-summary.component';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    declarations: [
        DashboardComponent,
        CountersSummaryComponent,
        CitiesSummaryComponent,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        DashboardComponent,
        CountersSummaryComponent,
        CitiesSummaryComponent,
    ]
})
export class DashboardModule {
}
