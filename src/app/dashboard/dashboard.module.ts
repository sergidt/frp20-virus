import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CitiesSummaryComponent } from './cities-summary/cities-summary.component';
import { CountersSummaryComponent } from './counters-summary/counters-summary.component';
import { CountriesSummaryComponent } from './countries-summary/countries-summary.component';
import { DashboardComponent } from './dashboard.component';
import { TopAffectedCitiesComponent } from './top-cities/top-affected-cities.component';

@NgModule({
    declarations: [
        DashboardComponent,
        CountersSummaryComponent,
        CitiesSummaryComponent,
        TopAffectedCitiesComponent,
        CountriesSummaryComponent
    ],
    imports: [
        CommonModule,
        ScrollingModule
    ],
    exports: [
        DashboardComponent,
        CountersSummaryComponent,
        CitiesSummaryComponent,
    ]
})
export class DashboardModule {
}
