export type CoordenadasEonet = number | CoordenadasEonet[];

export interface EventoEonet {
  id: string;
  title: string;
  description?: string;
  link?: string;
  categories: {
    title: string;
  }[];

  geometry: {
    date: string;
    type: string;
    coordinates: CoordenadasEonet;
  }[];
}

export interface RespuestaEonet {
  events: EventoEonet[];
}
