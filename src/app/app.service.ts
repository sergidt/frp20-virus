import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable, of } from 'rxjs';
import { concatMap, delay, map, pairwise, pluck, startWith, switchMap } from 'rxjs/operators';
import citiesFromJSON from '../assets/cities.json';
import { CitiesInfo, City, Summary } from './definitions';
import { alterCities, byInfectedPeople, generateCity, randomValue } from './utils';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    readonly _cities$: BehaviorSubject<Array<City>>;
    readonly numCities: number;

    constructor() {
        this._cities$ = new BehaviorSubject(this.generateInitialInfo());
        this.numCities = this._cities$.getValue().length;

        this.startSimulation();
    }

    get counters$(): Observable<Summary> {
        return this._cities$
                   .pipe(map(getSummary));
    }

    get top10InfectedCities$(): Observable<Array<City>> {
        return this._cities$
                   .pipe(map(cities => cities.sort(byInfectedPeople).filter(_ => _.infected > 0).slice(0, 5)));
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
