// src/components/ArcCarousel.jsx
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative } from 'swiper/modules';
import { memo, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useInterceptorObserver';

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

const Carousel = memo(({isMobile}) => {
  // Use a single ref for both the observer and GSAP
  const [targetRef, isIntersecting] = useIntersectionObserver({
    options: {
      threshold: 0.1,
      rootMargin: '50px',
    },
  });

  const h2Ref = useRef(null)
  const flag = useRef(false)

  useEffect(() => {
    // Now use targetRef.current
    if (targetRef.current && isIntersecting && !flag.current) {

        targetRef.current.setAttribute("class",`${isMobile ? "mobile_cards":"container"} enter-in`)
        h2Ref.current.setAttribute("class","third_section_h2 enter-right")
        flag.current = true
    }
  }, [isIntersecting, targetRef]);

  return (
    <>
    <h2 ref={h2Ref} className='third_section_h2'>Our <span>Values</span></h2>
    <div className="content_third_section">
        {isMobile ? 
            <div ref={targetRef} className='mobile_cards' >
                <div className="mobile_card">
                    <p className='mobile_number_card'> 
                    1.0
                    </p>
                    <p className='mobile_text_card'>
                    Passionate Dedication
                    </p>
                </div>
                <div className="mobile_card">
                    <p className='mobile_number_card'> 
                    2.0
                    </p>
                    <p className='mobile_text_card'>
                    Uncompromising Integrity
                    </p>
                </div>
                <div className="mobile_card">
                    <p className='mobile_number_card'> 
                    3.0
                    </p>
                    <p className='mobile_text_card'>
                    Exemplary Service
                    </p>
                </div>
                <div className="mobile_card">
                    <p className='mobile_number_card'> 
                    4.0
                    </p>
                    <p className='mobile_text_card'>
                    Relentless Innovation
                    </p>
                </div>
            </div>
        :
            <div ref={targetRef} className="container">
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
        } 
    </div>

    </>

  );
});

export default Carousel;