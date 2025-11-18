export default function TestimonialsSection({
  testimonials,
  isLoading,
  currentIndex,
  onDotClick,
  onShareClick,
  formatDate,
}) {
  return (
    <section className="section testimonials" id="testimonials">
      <div className="section-header">
        <h2>Témoignages</h2>
        <p>Des familles qui ont vécu une naissance paisible et entourée.</p>
      </div>

      {isLoading ? (
        <p className="muted" style={{ textAlign: 'center' }}>
          Chargement des témoignages...
        </p>
      ) : testimonials.length === 0 ? (
        <div className="testimonials-empty">
          <p className="muted">Aucun témoignage pour le moment.</p>
          <button className="btn" onClick={onShareClick}>
            Soyez le premier à partager votre expérience
          </button>
        </div>
      ) : (
        <div className="testimonials-carousel">
          <div className="carousel-container">
            {testimonials.map((testimonial, index) => (
              <article
                key={testimonial.id}
                className={`testimonial-slide ${index === currentIndex ? 'active' : ''}`}
              >
                <div className="testimonial-image">
                  {testimonial.imageUrl ? (
                    <img src={testimonial.imageUrl} alt={`Portrait partagé par ${testimonial.name}`} />
                  ) : (
                    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="60" cy="60" r="60" fill="#e2ebe7" />
                      <circle cx="60" cy="45" r="20" fill="#6e9c83" />
                      <path d="M30 95 Q30 70 60 70 Q90 70 90 95" fill="#6e9c83" />
                    </svg>
                  )}
                </div>
                <p className="testimonial-quote">« {testimonial.message} »</p>
                <div className="testimonial-author">
                  <span className="testimonial-name">{testimonial.name}</span>
                  <span className="testimonial-date">{formatDate(testimonial.created_at)}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="carousel-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => onDotClick(index)}
                aria-label={`Aller au témoignage ${index + 1}`}
              />
            ))}
          </div>
          <button className="btn carousel-cta" onClick={onShareClick}>
            Partager mon témoignage
          </button>
        </div>
      )}
    </section>
  )
}
