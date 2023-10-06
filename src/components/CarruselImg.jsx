import React, { useState } from 'react';

import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';

function CarruselImg() {
  const slides = [
    {
      url: 'https://marketplace.canva.com/iufzQ/MAEPZfiufzQ/1/s2/canva-sin-t%C3%ADtulo-MAEPZfiufzQ.jpg',
      text:"Lorem Ipsum is simply dummy text of the printing and typesetting ",
      nav:"/"
    },

    {
      url: 'https://marketplace.canva.com/uxeZo/MAEcwVuxeZo/1/s2/canva-diabetes-medicine-flatlay-MAEcwVuxeZo.jpg',
      text:"Lorem Ipsum is simply dummy text of the printing and typesetting"
    },
    {
      url: 'https://marketplace.canva.com/IIjSU/MAEE4mIIjSU/1/s/canva-sin-t%C3%ADtulo-MAEE4mIIjSU.jpg',
      text:"Lorem Ipsum is simply dummy text of the printing and typesetting"
    },

    {
      url: 'https://marketplace.canva.com/VCnus/MAEc74VCnus/1/s2/canva-a-healthcare-worker-measuring-a-patient%27s-blood-pressure-using-a-sphygmomanometer-MAEc74VCnus.jpg',
      text:"Lorem Ipsum is simply dummy text of the printing and typesetting"
    },
    {
      url: 'https://marketplace.canva.com/tjcso/MAETxMtjcso/1/s2/canva-woman-showing-apple-and-bitten-doughnut-MAETxMtjcso.jpg',
      text:"Lorem Ipsum is simply dummy text of the printing and typesetting"
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className='max-w-[800px] h-[420px]  mb-10 relative group '>
      
      
      <a href={ `${slides[currentIndex].nav}`}> <div
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
        className='w-full h-full rounded-2xl bg-center bg-cover duration-500'
      ></div>
      
      </a>
     
   
     
      {/* Left Arrow */}
      <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactLeft onClick={prevSlide} size={30} />
      </div>
      {/* Right Arrow */}
      <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactRight onClick={nextSlide} size={30} />
      </div>
      <div className='flex top-4 justify-center py-2'>
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className='text-xl cursor-pointer'
          >
            <RxDotFilled />
          </div>
        ))}

      </div>
      <div className=' bg-gray-700 xl:py-5 lg:py-2  lg:rounded-lg sm:py-2 text-center text-white lg:text-xl sm:text-sm text-bold carruBox font-nunito  '>
      {  `${slides[currentIndex].text}`}
   
 
      
      </div>
    </div>
  );
}

export default CarruselImg;