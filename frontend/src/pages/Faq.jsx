import ComingSoonPage from "../components/ComingSoonPage";

function Faq() {
  return (
    <ComingSoonPage
      eyebrow="Próximamente"
      title="Preguntas"
      highlight="Frecuentes"
      description="Información sobre el uso de la plataforma, fuentes de datos, metodología y cómo participar en el monitoreo ciudadano."
      cards={[
        {
          title: "Fuentes de datos",
          body: "Explicación clara sobre SECOP II, datos.gov.co y las fuentes ambientales usadas por la plataforma.",
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
              <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
            </svg>
          ),
        },
        {
          title: "Metodología",
          body: "Criterios para transformar datos técnicos en lecturas útiles para ciudadanía y equipos públicos.",
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          ),
        },
        {
          title: "Uso ciudadano",
          body: "Guías futuras para consultar departamentos, leer contratos y entender alertas de riesgo climático.",
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 1 1 5.83 1c0 2-3 2-3 4" />
              <path d="M12 17h.01" />
            </svg>
          ),
        },
      ]}
    />
  );
}

export default Faq;
