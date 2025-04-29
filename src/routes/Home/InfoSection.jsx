import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Make sure the paths to your images are correct. 
// The paths should be relative to this current file's location.
import img1 from '../../assets/image/img1.png';
import img2 from '../../assets/image/img2.png';
import img3 from '../../assets/image/img3.png';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

const InfoSection = () => {
  return (
    <div className="container mx-auto mt-20 mb-20">
      <Slider {...settings}>
        <div className="flex justify-center">
          <img className="w-1/2 mx-auto" src={img1} alt="Image 1" />
        </div>
        <div className="flex justify-center">
          <img className="w-1/2 mx-auto" src={img2} alt="Image 2" />
        </div>
        <div className="flex justify-center">
          <img className="w-1/2 mx-auto" src={img3} alt="Image 3" />
        </div>
      </Slider>
    </div>
  );
};

export default InfoSection;
