
export interface EventoEonet {
    id: string;
    title: string;
    categories: {
        title: string;
    }[];
    geometry: {
        date: string;
    }[];
}

export interface RespuestaEonet {
    events: EventoEonet[];
}