export interface Dictionary {
    [key: string]: Array<string>;
}

export interface City {
    city: string;
    lat: number;
    lng: number;
    country: string;
    population: number;
    infected: number;
    vaccinated: number;
    deaths: number;
}

export type CityMarker = Pick<City, 'city' | 'lat' | 'lng'> & { id: string };

export type CityCounters = Pick<City, 'vaccinated' | 'infected' | 'deaths' | 'population'>;

export interface Summary extends CityCounters {
    affectedCities: number;
}

export interface CitiesInfo {
    affectedCities: number;
    citiesInvolvement: number;
    totalCities: number;
    populationInvolvement: number;
    deaths: number;
    population: number;
}

export interface CitiesChange {
    cities: Array<City>;
    change?: City;
}

export type SummaryByCountries = Dictionary & {
    updateTimestamp: number;
};
