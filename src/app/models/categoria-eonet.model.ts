export interface CategoriaEonet {
    nombre: string;
    nombreApi: string;
    color: string;
  }
  
  export const CATEGORIAS_EONET: { [key: string]: CategoriaEonet } = {
    incendios: {
      nombre: 'Incendios',
      nombreApi: 'Wildfires',
      color: '#ff5722'
    },
  
    tormentas: {
      nombre: 'Tormentas',
      nombreApi: 'Severe Storms',
      color: '#a78bfa'
    },
  
    volcanes: {
      nombre: 'Volcanes',
      nombreApi: 'Volcanoes',
      color: '#ff1744'
    },
  
    terremotos: {
      nombre: 'Terremotos',
      nombreApi: 'Earthquakes',
      color: '#ffb300'
    },
  
    inundaciones: {
      nombre: 'Inundaciones',
      nombreApi: 'Floods',
      color: '#29b6f6'
    },
  
    deslizamientos: {
      nombre: 'Deslizamientos',
      nombreApi: 'Landslides',
      color: '#a1887f'
    },
  
    sequias: {
      nombre: 'Sequías',
      nombreApi: 'Drought',
      color: '#d4e157'
    },
  
    polvo: {
      nombre: 'Polvo y bruma',
      nombreApi: 'Dust and Haze',
      color: '#d7b899'
    },
  
    temperaturas: {
      nombre: 'Temperaturas extremas',
      nombreApi: 'Temperature Extremes',
      color: '#f06292'
    },
  
    nieve: {
      nombre: 'Nieve',
      nombreApi: 'Snow',
      color: '#e0f7fa'
    },
  
    hielo: {
      nombre: 'Hielo',
      nombreApi: 'Sea and Lake Ice',
      color: '#80deea'
    }
    
  };