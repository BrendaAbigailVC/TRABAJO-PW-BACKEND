import React from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const GameCarousel: React.FC = () => {
  return (
    <Carousel fade>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/GOD-OF-WAR.webp"
          alt="God of War"
          style={{ height: '500px', objectFit: 'cover' }}
        />
        <Carousel.Caption>
          <h3>God of War</h3>
          <p>Embark on an epic Norse adventure</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/ELDEN-RING.avif"
          alt="Elden Ring"
          style={{ height: '500px', objectFit: 'cover' }}
        />
        <Carousel.Caption>
          <h3>Elden Ring</h3>
          <p>Enter the Lands Between</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/CYBERPUNK.jpeg"
          alt="Cyberpunk 2077"
          style={{ height: '500px', objectFit: 'cover' }}
        />
        <Carousel.Caption>
          <h3>Cyberpunk 2077</h3>
          <p>Welcome to Night City</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/RDR2.jpeg"
          alt="Red Dead Redemption 2"
          style={{ height: '500px', objectFit: 'cover' }}
        />
        <Carousel.Caption>
          <h3>Red Dead Redemption 2</h3>
          <p>Experience the Wild West</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default GameCarousel; 