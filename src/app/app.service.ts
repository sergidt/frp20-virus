import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, interval, Observable, of } from 'rxjs';
import { concatMap, delay, map, pairwise, pluck, switchMap, tap } from 'rxjs/operators';
import citiesFromJSON from '../assets/cities.json';
import { CitiesInfo, City, Summary } from './definitions';
import { alterCities, generateCity, randomValue } from './utils';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    readonly _cities$: BehaviorSubject<Array<City>>;

    constructor() {
        this._cities$ = new BehaviorSubject(this.generateInitialInfo());

        this.startSimulation();
    }

    get counters$(): Observable<Summary> {
        return this._cities$
                   .pipe(map(getSummary));
    }

    get citiesInfo$(): Observable<CitiesInfo> {
        return combineLatest([this.counters$, this._cities$])
            .pipe(
                map(([counters, cities]: [Summary, Array<City>]) => ({
                    affectedCities: counters.affectedCities,
                    citiesInvolvement: counters.affectedCities / cities.length,
                    totalCities: cities.length,
                    populationInvolvement: counters.infected / counters.population
                }))
            );
    }

    get propagation$(): Observable<number> {
        return this.counters$
                   .pipe(
                       pluck('infected'),
                       pairwise(),
                       map(([previous, current]: [number, number]) => current / previous),
                       tap(console.log)
                   );
    }

    private generateInitialInfo(): Array<City> {
        return citiesFromJSON.map(generateCity);
    }

    private startSimulation() {
        of(true)
            .pipe(
                delay(2000),
                switchMap(() =>
                    interval(500)
                        .pipe(
                            concatMap(_ => of(_).pipe(delay(randomValue(0, 1000, 0)))),
                            map(() => alterCities(this._cities$.getValue()))
                        )))
            .subscribe(this._cities$);
    }
}

function getSummary(cities: Array<City>): Summary {
    return cities
        .reduce((acc: Summary, city: City) => ({
            deaths: acc.deaths + city.deaths,
            infected: acc.infected + city.infected,
            vaccinated: acc.vaccinated + city.vaccinated,
            population: acc.population + city.population,
            affectedCities: acc.affectedCities + Number(!!city.infected)
        }), {
            deaths: 0,
            infected: 0,
            vaccinated: 0,
            population: 0,
            affectedCities: 0
        });
}
