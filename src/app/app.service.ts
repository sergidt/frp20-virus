import { Injectable } from '@angular/core';
import { BehaviorSubject, from, interval, Observable, of, timer } from 'rxjs';
import {
    concatMap, delay, map, mergeMap, pairwise, pluck, repeatWhen, scan, shareReplay, startWith, switchMap, throttleTime
} from 'rxjs/operators';
import citiesFromJSON from '../assets/cities.json';
import { CitiesChange, CitiesInfo, City, CityMarker, Summary, SummaryByCountries } from './definitions';
import { alterCity, byInfectedPeople, filterNotNulls, generateCity, randomValue } from './utils';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    readonly numCities: number;
    private readonly _citiesChange$: BehaviorSubject<CitiesChange>;
    private _cityMarkers: BehaviorSubject<Array<CityMarker>> = new BehaviorSubject<Array<CityMarker>>([]);

    constructor() {
        this._citiesChange$ = new BehaviorSubject({ cities: this.generateInitialInfo() });
        this.numCities = this._citiesChange$.getValue().cities.length;
        this.startSimulation();
    }

    get cities$(): Observable<Array<City>> {
        return this._citiesChange$
                   .pipe(pluck('cities'),
                       shareReplay({ refCount: true }));
    }

    get summaryByCountries$(): Observable<SummaryByCountries> {
        return this.cities$
                   .pipe(
                       mergeMap(cities => from(cities.filter(_ => !!_.infected))),
                       scan((acc, cur: City) => ({
                           ...acc,
                           [cur.country]: [...new Set([...(acc[cur.country] || []), cur.city])]
                       }), {}),
                       map(_ => ({ ..._, updateTimestamp: new Date().getTime() } as SummaryByCountries)),
                       throttleTime(5000)
                   );
    }

    get counters$(): Observable<Summary> {
        return this.cities$
                   .pipe(map(getSummary));
    }

    get top10InfectedCities$(): Observable<Array<City>> {
        return this.cities$
                   .pipe(map(cities => cities.sort(byInfectedPeople).filter(_ => _.infected > 0).slice(0, 10)));
    }

    get citiesInfo$(): Observable<CitiesInfo> {
        return this.counters$
                   .pipe(
                       map((counters: Summary) => ({
                           affectedCities: counters.affectedCities,
                           citiesInvolvement: counters.affectedCities / this.numCities,
                           totalCities: this.numCities,
                           populationInvolvement: counters.infected / counters.population,
                           population: counters.population,
                           deaths: counters.deaths
                       }))
                   );
    }

    get propagation$(): Observable<number> {
        return this.counters$
                   .pipe(
                       pluck('infected'),
                       pairwise(),
                       map(([previous, current]: [number, number]) => current / previous),
                       startWith(0)
                   );
    }

    get affectedCity$(): Observable<City> {
        return this._citiesChange$
                   .pipe(
                       pluck('change'),
                       filterNotNulls(),
                       mergeMap(_ => of(_).pipe(repeatWhen(() => timer(2000))))
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
                            map(() => alterCity(this._citiesChange$.getValue().cities)),
                        )))
            .subscribe(this._citiesChange$);
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
