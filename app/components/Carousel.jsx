// src/components/ArcCarousel.jsx
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Pagination, Navigation } from 'swiper/modules';

// Importa los estilos de Swiper
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';



const data = [
  { id: 1, text: 'Dedication', number:"1.0" },
  { id: 2, text: 'Service', number:"2.0" },
  { id: 3, text: 'Integration', number:"3.0" },
  { id: 4, text: 'Innovation', number:"4.0" },
  { id: 5, text: 'Dedication' , number:"1.0"},
  { id: 6, text: 'Service' , number:"2.0"},
  { id: 7, text: 'Integration', number:"3.0" },
  { id: 8, text: 'Innovation', number:"4.0" },

];

const Carousel = () => {
  return (
    <div className="container">
          <img src={"/assets/drag_sticker.png"} className="drag_sticker" alt='drag_sticker'></img>
      <Swiper
        effect={'creative'}
        grabCursor={true}
        centeredSlides={true}
        
        loop={true}
        slidesPerView={3} // Mostramos 5 slides
        //spaceBetween={30} // Espacio entre slides (puede que no sea suficiente con coverflow)

        creativeEffect= {
            { 
            //perspective: true, // Habilita transformaciones 3D
            limitProgress: 3,
           
            prev: {
                translate: ['-100%', '1%', -50],
                rotate: [0, 0, -7.5],
                origin: "bottom right",
            },
            next: {
                translate: ['100%', '1%', -50],
                rotate: [0, 0, 7.5],
                origin:"bottom left"
            }}
        }
        modules={[ EffectCreative ]}
        className="swiper_container"
      >
        {data.map(item => (
          <SwiperSlide key={item.id} className="swiper-slide">
            <div className="slide-content">
                <svg width="94" height="94" viewBox="0 0 94 94" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M57.9237 63.6692L63.6695 36.6371M63.6695 36.6371L36.6373 30.8912M63.6695 36.6371L30.8915 57.9234" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <p className='number_card'>  {item.number }</p>
                <img className='swan_card' src="/assets/logo.png" alt="swan logo" />
                <p>{item.text}</p>
              
            </div>
          </SwiperSlide>
        ))}


      </Swiper>
    </div>
  );
};

export default Carousel;