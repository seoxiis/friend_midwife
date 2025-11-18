export default function ServicesSection({ services, assets, onSelectService }) {
  return (
    <section className="section services" id="services">
      <div className="section-header">
        <h2>Services</h2>
        <p>Des prestations pensées pour prendre soin de vous et de votre bébé.</p>
      </div>
      <div className="cards">
        {services.map((service) => (
          <article className="card" key={service.id}>
            <div className="card-media">
              <img src={assets[service.imageKey]} alt={service.imageAlt} />
            </div>
            <div className="card-body">
              <span className="card-badge">{service.badge}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul className="card-list">
                {service.bulletPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="card-actions">
                <button
                  type="button"
                  className="card-link"
                  onClick={() => onSelectService(service)}
                  aria-label={`Ouvrir le détail de ${service.title}`}
                >
                  En savoir plus
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
