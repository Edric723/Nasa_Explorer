/** Datos de un acercamiento a la Tierra. */
export interface AproximacionCercana {
    close_approach_date: string;
    close_approach_date_full?: string;
    epoch_date_close_approach: number;
    relative_velocity: {
        kilometers_per_hour: string;
    };
    miss_distance: {
        kilometers: string;
        lunar: string;
    };
}

/** Un objeto cercano a la Tierra (asteroide). */
export interface ObjetoCercano {
    id: string;
    name: string;
    nasa_jpl_url: string;
    is_potentially_hazardous_asteroid: boolean;
    estimated_diameter: {
        meters: {
            estimated_diameter_min: number;
            estimated_diameter_max: number;
        };
    };
    close_approach_data: AproximacionCercana[];
}

/** Respuesta completa del endpoint /feed: los objetos vienen agrupados por fecha. */
export interface RespuestaNeo {
    element_count: number;
    near_earth_objects: { [fecha: string]: ObjetoCercano[] };
}