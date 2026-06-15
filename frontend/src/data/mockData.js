const MOCK_CONTRACTS = {
  atlantico: [
    {
      id: "CO-ATL-2024-001",
      entidad: "Alcaldia de Barranquilla",
      contratista: "Consorcio Vias del Caribe S.A.S.",
      objetoOriginal: "Contrato de obra publica para el mejoramiento y rehabilitacion de la malla vial en los barrios del suroccidente del Distrito de Barranquilla",
      objetoSimplificado: "Arreglo de calles y vias en barrios del sur de Barranquilla",
      valor: 4850000000,
      fechaFirma: "2024-03-15",
      estado: "En ejecucion",
      urlSecop: "https://community.secop.gov.co/Public/Tendering/ContractNoticePhases/View?PPI=CO-ATL-2024-001",
    },
    {
      id: "CO-ATL-2024-002",
      entidad: "Gobernacion del Atlantico",
      contratista: "Ingenieros Asociados del Norte Ltda.",
      objetoOriginal: "Prestacion de servicios para la construccion de obras de mitigacion del riesgo por inundacion en el arroyo El Country",
      objetoSimplificado: "Obras para evitar inundaciones en el arroyo El Country",
      valor: 2300000000,
      fechaFirma: "2024-05-02",
      estado: "En ejecucion",
      urlSecop: "https://community.secop.gov.co/Public/Tendering/ContractNoticePhases/View?PPI=CO-ATL-2024-002",
    },
    {
      id: "CO-ATL-2024-003",
      entidad: "Alcaldia de Soledad",
      contratista: "Constructora Bolivar S.A.",
      objetoOriginal: "Adecuacion y mantenimiento de infraestructura educativa en instituciones oficiales del municipio de Soledad",
      objetoSimplificado: "Reparacion de colegios publicos en Soledad",
      valor: 980000000,
      fechaFirma: "2024-06-20",
      estado: "Celebrado",
      urlSecop: "https://community.secop.gov.co/Public/Tendering/ContractNoticePhases/View?PPI=CO-ATL-2024-003",
    },
  ],
  bolivar: [
    {
      id: "CO-BOL-2024-001",
      entidad: "Alcaldia de Cartagena",
      contratista: "Pavimentos del Caribe S.A.S.",
      objetoOriginal: "Construccion de obras de proteccion costera y recuperacion de playas en el sector turistico de Bocagrande",
      objetoSimplificado: "Proteccion de playas y costas en Bocagrande, Cartagena",
      valor: 7200000000,
      fechaFirma: "2024-02-10",
      estado: "En ejecucion",
      urlSecop: "https://community.secop.gov.co/Public/Tendering/ContractNoticePhases/View?PPI=CO-BOL-2024-001",
    },
    {
      id: "CO-BOL-2024-002",
      entidad: "Gobernacion de Bolivar",
      contratista: "Union Temporal Acueductos",
      objetoOriginal: "Optimizacion del sistema de acueducto y alcantarillado para comunidades rurales del sur de Bolivar",
      objetoSimplificado: "Mejoras al agua potable y alcantarillado en el sur de Bolivar",
      valor: 3400000000,
      fechaFirma: "2024-04-18",
      estado: "Celebrado",
      urlSecop: "https://community.secop.gov.co/Public/Tendering/ContractNoticePhases/View?PPI=CO-BOL-2024-002",
    },
  ],
  antioquia: [
    {
      id: "CO-ANT-2024-001",
      entidad: "Alcaldia de Medellin",
      contratista: "Metro de Medellin Ltda.",
      objetoOriginal: "Ampliacion y modernizacion de estaciones del sistema metro en el corredor multimodal del rio Medellin",
      objetoSimplificado: "Ampliacion de estaciones del Metro de Medellin",
      valor: 12500000000,
      fechaFirma: "2024-01-22",
      estado: "En ejecucion",
      urlSecop: "https://community.secop.gov.co/Public/Tendering/ContractNoticePhases/View?PPI=CO-ANT-2024-001",
    },
    {
      id: "CO-ANT-2024-002",
      entidad: "Gobernacion de Antioquia",
      contratista: "Consorcio Puentes de Uraba",
      objetoOriginal: "Construccion de puentes vehiculares en la subregion de Uraba para conectividad vial rural",
      objetoSimplificado: "Construccion de puentes para conectar zonas rurales de Uraba",
      valor: 5800000000,
      fechaFirma: "2024-03-08",
      estado: "En ejecucion",
      urlSecop: "https://community.secop.gov.co/Public/Tendering/ContractNoticePhases/View?PPI=CO-ANT-2024-002",
    },
  ],
  cundinamarca: [
    {
      id: "CO-CUN-2024-001",
      entidad: "Alcaldia Mayor de Bogota",
      contratista: "Consorcio TransMilenio 2024",
      objetoOriginal: "Construccion de la extension de la Primera Linea del Metro de Bogota, tramo estacion central a estacion Calle 72",
      objetoSimplificado: "Extension del Metro de Bogota hasta la Calle 72",
      valor: 28000000000,
      fechaFirma: "2024-01-05",
      estado: "En ejecucion",
      urlSecop: "https://community.secop.gov.co/Public/Tendering/ContractNoticePhases/View?PPI=CO-CUN-2024-001",
    },
  ],
  magdalena: [
    {
      id: "CO-MAG-2024-001",
      entidad: "Alcaldia de Santa Marta",
      contratista: "Consorcio Turismo Sierra",
      objetoOriginal: "Mejoramiento de la infraestructura turistica y vial en el corredor de acceso al Parque Nacional Natural Tayrona",
      objetoSimplificado: "Mejoras de vias y turismo para acceder al Parque Tayrona",
      valor: 3100000000,
      fechaFirma: "2024-04-12",
      estado: "Celebrado",
      urlSecop: "https://community.secop.gov.co/Public/Tendering/ContractNoticePhases/View?PPI=CO-MAG-2024-001",
    },
  ],
  cesar: [
    {
      id: "CO-CES-2024-001",
      entidad: "Gobernacion del Cesar",
      contratista: "Hidrocesar S.A.S.",
      objetoOriginal: "Construccion de distrito de riego para pequenos productores agropecuarios en la zona rural del municipio de Valledupar",
      objetoSimplificado: "Sistema de riego para agricultores en la zona rural de Valledupar",
      valor: 1850000000,
      fechaFirma: "2024-05-30",
      estado: "En ejecucion",
      urlSecop: "https://community.secop.gov.co/Public/Tendering/ContractNoticePhases/View?PPI=CO-CES-2024-001",
    },
  ],
  santander: [
    {
      id: "CO-SAN-2024-001",
      entidad: "Alcaldia de Bucaramanga",
      contratista: "Pavimentos Santandereanos S.A.",
      objetoOriginal: "Rehabilitacion integral de la malla vial del area metropolitana de Bucaramanga, sector Floridablanca - Girón",
      objetoSimplificado: "Arreglo de calles entre Floridablanca y Giron, area de Bucaramanga",
      valor: 6200000000,
      fechaFirma: "2024-02-28",
      estado: "En ejecucion",
      urlSecop: "https://community.secop.gov.co/Public/Tendering/ContractNoticePhases/View?PPI=CO-SAN-2024-001",
    },
  ],
  valle: [
    {
      id: "CO-VAL-2024-001",
      entidad: "Alcaldia de Cali",
      contratista: "EMCALI Constructores",
      objetoOriginal: "Expansion de la red de alcantarillado pluvial en comunas vulnerables del oriente de Santiago de Cali",
      objetoSimplificado: "Mas alcantarillado para barrios del oriente de Cali",
      valor: 4100000000,
      fechaFirma: "2024-03-25",
      estado: "En ejecucion",
      urlSecop: "https://community.secop.gov.co/Public/Tendering/ContractNoticePhases/View?PPI=CO-VAL-2024-001",
    },
  ],
};

const MOCK_CLIMATE = {
  atlantico: {
    temperatura: 34.2,
    humedadRelativa: 78.5,
    indiceCalor: 42.1,
    alertaIncendio: false,
    nivelRio: 2.8,
    estacion: "Ernesto Cortissoz - Soledad",
  },
  bolivar: {
    temperatura: 33.8,
    humedadRelativa: 82.0,
    indiceCalor: 41.5,
    alertaIncendio: false,
    nivelRio: 3.2,
    estacion: "Rafael Nunez - Cartagena",
  },
  antioquia: {
    temperatura: 28.5,
    humedadRelativa: 72.0,
    indiceCalor: 32.8,
    alertaIncendio: false,
    nivelRio: 4.5,
    estacion: "Olaya Herrera - Medellin",
  },
  cundinamarca: {
    temperatura: 19.2,
    humedadRelativa: 68.0,
    indiceCalor: 20.1,
    alertaIncendio: true,
    nivelRio: 1.9,
    estacion: "El Dorado - Bogota",
  },
  magdalena: {
    temperatura: 35.1,
    humedadRelativa: 75.0,
    indiceCalor: 43.2,
    alertaIncendio: true,
    nivelRio: 1.5,
    estacion: "Simon Bolivar - Santa Marta",
  },
  cesar: {
    temperatura: 36.5,
    humedadRelativa: 65.0,
    indiceCalor: 44.8,
    alertaIncendio: true,
    nivelRio: 1.2,
    estacion: "Alfonso Lopez - Valledupar",
  },
  santander: {
    temperatura: 30.2,
    humedadRelativa: 70.0,
    indiceCalor: 35.6,
    alertaIncendio: false,
    nivelRio: 3.8,
    estacion: "Palonegro - Bucaramanga",
  },
  valle: {
    temperatura: 31.0,
    humedadRelativa: 74.0,
    indiceCalor: 37.2,
    alertaIncendio: false,
    nivelRio: 5.1,
    estacion: "Alfonso B. Aragon - Cali",
  },
};

const GLOBAL_KPIS = {
  totalContratado: 80280000000,
  contratosActivos: 14,
  indiceCalorPromedio: 37.2,
};

function formatCurrency(value) {
  if (value >= 1e12) {
    return "$" + (value / 1e12).toFixed(1) + "B";
  }
  if (value >= 1e9) {
    return "$" + (value / 1e9).toFixed(1) + " MM";
  }
  if (value >= 1e6) {
    return "$" + (value / 1e6).toFixed(1) + "M";
  }
  return "$" + value.toLocaleString("es-CO");
}

export { MOCK_CONTRACTS, MOCK_CLIMATE, GLOBAL_KPIS, formatCurrency };
