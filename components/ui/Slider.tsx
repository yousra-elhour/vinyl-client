import React, { useState, useEffect } from "react";

interface SliderProps {
  images: string[]; // Array of image URLs
}

const Slider: React.FC<SliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // Auto-advance the slider every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider">
      <div className="slider-image previous" onClick={prevSlide}>
        <img
          src={
            images[currentIndex === 0 ? images.length - 1 : currentIndex - 1]
          }
          alt="Previous"
        />
      </div>
      <div className="slider-image current">
        <img src={images[currentIndex]} alt="Current" />
      </div>
      <div className="slider-image next" onClick={nextSlide}>
        <img
          src={
            images[currentIndex === images.length - 1 ? 0 : currentIndex + 1]
          }
          alt="Next"
        />
      </div>
    </div>
  );
};

export default Slider;
