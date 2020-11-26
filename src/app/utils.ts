import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CitiesChange, City } from './definitions';

export const randomValue = (min: number, max: number, seed: number = 0.5) => Math.random() > seed ? Math.random() * (max - min) + min : 0;

const generateUID = (): string => {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};

const INITIAL_INFECTED_PERCENTAGE = 0.3;
const INITIAL_DEATHS_PERCENTAGE = 0.01;
const INITIAL_VACCINATED_PERCENTAGE = 0.05;

const INFECTED_PERCENTAGE_INCREMENT = 2;
const DEATHS_PERCENTAGE_INCREMENT = 1.01;
const VACCINATED_PERCENTAGE_INCREMENT = 1.05;

const PROBABILITY_OF_CURE = 0.3;

export function generateCity(city: Partial<City>): City {
    const infected: number = Math.floor(randomValue(0, city.population * INITIAL_INFECTED_PERCENTAGE));
    const deaths: number = Math.floor(infected > 0 ? city.population * INITIAL_DEATHS_PERCENTAGE : 0);
    const vaccinated: number = Math.floor(randomValue(0, city.population * INITIAL_VACCINATED_PERCENTAGE, infected > 0 ? 0.5 : 1));
    return {
        ...city,
        deaths,
        infected,
        vaccinated
    } as City;
}

export function alterCity(cities: Array<City>): CitiesChange {
    let change: City = { ...cities[Math.floor(randomValue(0, cities.length - 1, 0))] };
    const cure: boolean = Math.random() < PROBABILITY_OF_CURE;

    const vaccinated = Math.min(change.vaccinated + calculateVaccinated(change), change.population);
    const infected = Math.min(calculateInfected(change, cure, vaccinated), change.population);
    const deaths = change.deaths + Math.min(calculateDeaths(change, cure), infected);

    change = {
        ...change,
        infected,
        deaths,
        vaccinated,
        population: change.population - deaths
    };

    return {
        cities: [...cities.filter(_ => _.city !== change.city), change],
        change
    };
}

const calculateDeaths = (city: City, cure: boolean): number => cure
    ? city.deaths
    : Math.ceil((city.deaths || 1) * DEATHS_PERCENTAGE_INCREMENT);

const calculateInfected = (city: City, cure: boolean, vaccinated: number): number => {
    const vaccinatedPercent = (vaccinated / city.infected) || 0;

    return vaccinatedPercent > 0.60
        ? Math.max(0, city.infected - Math.floor(city.infected * VACCINATED_PERCENTAGE_INCREMENT))
        : city.infected + Math.ceil((city.infected || 1) * INFECTED_PERCENTAGE_INCREMENT);
};

const calculateVaccinated = (city: City): number =>
    city.infected
        ? Math.ceil((city.vaccinated || 1) * VACCINATED_PERCENTAGE_INCREMENT)
        : 0;

export const byInfectedPeople = (a: City, b: City) => b.infected - a.infected;

// OPERATORS

export const filterNotNulls = () => (source$: Observable<any>) => source$
    .pipe(filter(_ => !!_));
