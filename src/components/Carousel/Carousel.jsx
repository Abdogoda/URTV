import React from 'react';
import MovieCard from '../MovieCard/MovieCard';
import './Carousel.css';

const Carousel = ({ items, title, type = 'movie' }) => {
  const scrollLeft = () => {
    const container = document.querySelector('.carousel-scroll');
    container.scrollBy({ left: -400, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const container = document.querySelector('.carousel-scroll');
    container.scrollBy({ left: 400, behavior: 'smooth' });
  };

  return (
    <section className="carousel-section">
      <div className="carousel-header">
        <h2 className="section-title">{title}</h2>
        <div className="carousel-controls">
          <button className="carousel-btn carousel-btn-prev" onClick={scrollLeft}>
            ◀
          </button>
          <button className="carousel-btn carousel-btn-next" onClick={scrollRight}>
            ▶
          </button>
        </div>
      </div>

      <div className="carousel-wrapper">
        <div className="carousel-scroll">
          {items.map((item) => (
            <div key={item.id} className="carousel-item">
              <MovieCard item={item} type={type} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
