import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        MapComponent,
    ],
    imports: [
        BrowserModule,
        DashboardModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
