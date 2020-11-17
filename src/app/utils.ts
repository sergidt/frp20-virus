import { City } from './definitions';

export const randomValue = (min: number, max: number, seed: number = 0.5) => Math.random() > seed ? Math.random() * (max - min) + min : 0;

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

export function alterCities(cities: Array<City>): Array<City> {
    const city: City = cities[Math.floor(randomValue(0, cities.length - 1))];
    const cure: boolean = Math.random() < PROBABILITY_OF_CURE;

    const vaccinated = Math.min(city.vaccinated + calculateVaccinated(city), city.population);
    const infected = city.infected + Math.min(calculateInfected(city, cure, vaccinated), city.population);
    const deaths = city.deaths + Math.min(calculateDeaths(city, cure), infected);

    return [
        ...cities.filter(_ => _.city !== city.city),
        {
            ...city,
            infected,
            deaths,
            vaccinated,
            population: city.population - deaths
        }
    ];
}

const calculateDeaths = (city: City, cure: boolean): number => cure
    ? city.deaths
    : Math.ceil((city.deaths || 1) * DEATHS_PERCENTAGE_INCREMENT);

const calculateInfected = (city: City, cure: boolean, vaccinated: number): number => {
    const vaccinatedPercent = (vaccinated / city.infected) || 0;

    return vaccinatedPercent > 0.70
        ? -Math.ceil(city.infected * VACCINATED_PERCENTAGE_INCREMENT)
        : Math.ceil((city.infected || 1) * INFECTED_PERCENTAGE_INCREMENT);
};

const calculateVaccinated = (city: City): number =>
    city.infected
        ? Math.ceil((city.vaccinated || 1) * VACCINATED_PERCENTAGE_INCREMENT)
        : 0;
