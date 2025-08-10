import { useGSAP } from "@gsap/react"
import { useViewportSize } from "@mantine/hooks"
import { useRef } from "react"
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import gsap from 'gsap'

const SecondSection = () => {

        const viewportSize = useViewportSize()

        const secondSectionRef = useRef<HTMLDivElement>(null)
        const isMobile = viewportSize.width < 768

        useGSAP(
        () => {
    
            // ScrollTrigger for updating image sequence frames
            // ScrollTrigger.create({
            //     id: 'second-section-trigger',
            //     trigger: secondSectionRef.current,
            //     start: '40% top',
            //     end: 'bottom top', // End when the bottom of the header reaches the top of the viewport
            //     //end: '+=3000',
            //     pin: '#second-section', // Pin the content container so it doesn't scroll off the screen
            //     onUpdate: ({ progress, direction }) => {},
            // })
            
        
            // Timeline de animaciones vinculado al ScrollTrigger de la secuencia
            gsap.timeline({
              defaults: {
                ease: 'none',
              },
              // Usamos el mismo ScrollTrigger que la secuencia de imágenes
              scrollTrigger: {
                trigger: secondSectionRef.current,
                start:  '40% top',
                end: 'bottom top',
                scrub: true, // Esto hace que la animación se sincronice con el scroll
              },
            })
            // Animaciones para cada h2
            .fromTo(
              '.swan',
              { y: "0", opacity: 0 },
              { y: "20vw", opacity: 1 , duration:10, backgroundColor:'blue'},
              '0'
            )
    //         .to(
    //           '.animated_space .one',
    //           { opacity: 0 },
    //           '0'
    //         )
    //         .fromTo(
    //           '.animated_space .second',
    //           { x:"-100vw", opacity: 0},
    //           { x:"0vw", opacity: 1},
    //           '+=25%'
    //         )
                },
                {
                    dependencies: [],
                    scope:secondSectionRef,
                },
            )
  return (
    	<section ref={secondSectionRef} id="second-section_wrapper" >

            <div id="second-section">
                
                <br></br>
                <br></br>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati consectetur doloremque numquam distinctio a illum corporis dolores aspernatur laboriosam, vitae cupiditate similique porro mollitia. Enim eius sunt quam fugiat necessitatibus. Aliquam, dicta? Nobis quidem saepe sed mollitia doloribus eligendi molestias inventore excepturi alias cupiditate dolor aspernatur ipsum culpa quasi repellat veniam, fugit odio. Laudantium, impedit nobis facilis nesciunt voluptatem enim error perferendis magni accusamus culpa aperiam, aut deserunt laboriosam! Dolore cupiditate mollitia, blanditiis iste dolorem nulla quae, necessitatibus quasi molestiae nesciunt voluptate ratione? Deserunt veniam necessitatibus officiis, accusamus enim numquam possimus eveniet nihil soluta similique placeat provident, temporibus magni asperiores.</p>
            </div>
 
            
            <div className="ellipse_bg primera"></div>
            <div className="ellipse_bg segunda"></div>
		</section>
  )
}

export default SecondSection