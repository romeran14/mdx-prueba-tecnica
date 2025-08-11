'use client'

import { useGSAP } from '@gsap/react'
import { useDebouncedValue, useDidUpdate, useViewportSize } from '@mantine/hooks'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ImageNext from "next/image";
import { useEffect, useRef, useState } from 'react'
import ScrollSmoother from "gsap/dist/ScrollSmoother";
import SwanModel from "./components/SwanModel";
import Carousel from "./components/Carousel";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP)


export default function Home() {

	const header = useRef<HTMLDivElement>(null)
	const canvas = useRef<HTMLCanvasElement>(null)
	const viewportSize = useViewportSize()
	const [debouncedViewportSize] = useDebouncedValue(viewportSize, 500)
	const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>()
	const progressBarRef = useRef<HTMLDivElement>(null)
	const isMobile = viewportSize.width < 768
  const isTablet = viewportSize.width < 1025
	const secondSectionRef = useRef<HTMLDivElement>(null)
	const currentDirection = useRef(-1)
	const smoother = useRef<ScrollSmoother | null>(null);

	// Referencias para el wrapper y el content de ScrollSmoother
	const smootherWrapper = useRef<HTMLDivElement>(null);
	const smootherContent = useRef<HTMLDivElement>(null);

 const loaderRef = useRef(null)

	useEffect(() => {
		if (!canvas.current) return
		if (viewportSize.width === 0 || viewportSize.height === 0) return
		if (!!loadedImages) return

		const intialSetup = async () => {
			const imageAspect = !isMobile ? 1920 / 1080 : 430 / 932
			const imageWidth = viewportSize.width
			const imageHeight = viewportSize.width / imageAspect
			canvas.current!.width = viewportSize.width
			canvas.current!.height = viewportSize.height

			const imageSrcs: string[] = Array.from(
				{ length: !isMobile ? 255 : 238 },
				(_, i) => `/assets/${!isMobile ? "new_desktop_sequence/new_desktop_sequence/swanson__00" : "new_mobile_sequence/new_mobile_sequence/swanson_V__00"}${i < 10 ? `00${i}` : i < 100 ? `0${i}` : i}.jpg`,
			)

			const images = await loadImagesAndDrawFirstFrame({
				canvas: canvas.current!,
				imageSrcs: imageSrcs,
				imageWidth: imageWidth,
				imageHeight: imageHeight,
			})

			setLoadedImages(images)

		}

		intialSetup()
	}, [viewportSize, loadedImages, isMobile])


	useGSAP(
		() => {
			// La inicialización de ScrollSmoother debe ir aquí
			if (!loadedImages) return;

			// Inicializa ScrollSmoother
			if (!isTablet) {
				smoother.current = ScrollSmoother.create({
				wrapper: smootherWrapper.current,
				content: smootherContent.current,
				smooth: 1.5, // Cuánto desplazamiento quieres
				effects: true,
			});
			}


			if (!canvas.current || !loadedImages) return
			const context = canvas.current.getContext('2d', { alpha: true })
			if (!context) return

			const textTimeline = gsap.timeline({
				defaults: { ease: 'none' }
			});

			textTimeline.to('.animated_space .first', { x: "100vw", opacity: 0 }, '0')
				.to('.animated_space .one', { opacity: 0 }, '0')
				.fromTo('.animated_space .second', { x: "-100vw", opacity: 0 }, { x: "0vw", opacity: 1 }, '+=25%')
				.fromTo('.animated_space .two', { opacity: 0 }, { opacity: 1 }, '<')
				.to('.page_one', { x: "215px", opacity: 0.6 }, '<')
				.to('.page_two', { x: "-175px", opacity: 1 }, '<')
				.to('.page_three', { x: "-35px" }, '<')
				.to('.animated_space .second', { x: "100vw", opacity: 0 }, '+=100%')
				.to('.animated_space .two', { opacity: 0 }, '<')
				.fromTo('.animated_space .third', { x: "-100vw", opacity: 0 }, { x: "0vw", opacity: 1 }, '+=50%')
				.fromTo('.animated_space .three', { opacity: 0 }, { opacity: 1 }, '<')
				.to('.page_two', { x: "30px", opacity: 0.6 }, '<')
				.to('.page_one', { x: "180px" }, '<')
				.to('.page_three', { x: "-215px", opacity: 1 }, '<')
				.to('.animated_space .third', { x: "-50vw", opacity: 0 }, '+=75%')
				.to('.animated_space .three', { opacity: 0 }, '<')
				.fromTo('.animated_space .last', { y: "100vh", opacity: 0 }, { y: !isMobile ? "60vh" : "75vh", opacity: 1 }, '-=25%')
				.to('.out', { y: "50vh", opacity: 0 }, '<')
	
			const durationInPixels = textTimeline.duration() * 500;

			ScrollTrigger.create({
				id: 'image-sequence',
				trigger: header.current,
				start: 0,
				end: `+=${durationInPixels}`,
				pin: '#content-wrapper',
				scrub: true,
				animation: textTimeline,
				onUpdate: ({ progress, direction }) => {
					const nextFrame = Math.floor(progress * loadedImages.length)
					const nextImage = loadedImages[nextFrame]
					if (!nextImage) return
					updateCanvasImage(context, canvas.current!, nextImage)

					if (progressBarRef.current) {
						gsap.to(progressBarRef.current, {
							width: `${progress * 100}%`,
							ease: "none",
							duration: 0.1
						});
					}

					if (currentDirection.current !== direction) {
						currentDirection.current = direction;
						if (direction === 1) {
							gsap.to(".down_direction", { opacity: 1, scale: 1.4, ease: 'elastic.inOut', duration: 0.1 });
							gsap.to(".up_direction", { opacity: 0.5, scale: 1, ease: 'elastic.inOut', duration: 0.1 });
						} else {
							gsap.to(".up_direction", { opacity: 1, scale: 1.4, ease: 'elastic.inOut', duration: 0.1 });
							gsap.to(".down_direction", { opacity: 0.5, scale: 1, ease: 'elastic.inOut', duration: 0.1 });
						}
					}
				},
			});

			if (!secondSectionRef.current) return;

			const firstScrollTrigger = ScrollTrigger.getById('image-sequence');

			if (!firstScrollTrigger) {
				console.warn("ScrollTrigger with id 'image-sequence' not found.");
				return;
			}
      // *** Animación para la segunda sección ***
      const secondSectionTimeline = gsap.timeline({
        defaults: { ease: 'power1.inOut' }
      });
      
      secondSectionTimeline
        /**INITIAL ENTRY */
        .fromTo(secondSectionRef.current.getElementsByClassName("swan_image")[0], 
          { y: "-40vh", opacity: 0 }, 
          { y: "0vh", opacity: 1 },  0)
        .fromTo(secondSectionRef.current.getElementsByClassName("card_left")[0], 
          { x: "-10%", y: "22.5%", opacity: 0, rotate:"12.25", transformOrigin:"top left" }, 
          { x: "0%",y: "0%", opacity: 1, rotate:"0deg" }, '<')
        .fromTo(secondSectionRef.current.getElementsByClassName("card_right")[0], 
          { x: "10%",  y: "22.5%", opacity: 0,  rotate:"-12.25", transformOrigin:"top right" }, 
          { x: "0%", y: "0%", opacity: 1,  rotate:"0deg" }, '<')
        /**FIRST CARDS OUT SECOND CARDS IN */
        .to(secondSectionRef.current.getElementsByClassName("card_left")[0], 
          { y: "-50%", opacity: 0, rotate:"12.25" }, '+=50%')
        .to(secondSectionRef.current.getElementsByClassName("card_right")[0], 
          { y: "-50%", opacity: 0, rotate:"-12.25" }, '<')
        .fromTo(secondSectionRef.current.getElementsByClassName("card_left")[1], 
          { x: "-10%",y: "22.5%", opacity: 0, rotate:"12.25", transformOrigin:"top left" }, 
          { x: "0%", y: "0%", opacity: 1, rotate:"0deg" }, '<')
        .fromTo(secondSectionRef.current.getElementsByClassName("card_right")[1], 
          { x: "10%",y: "22.5%", opacity: 0,  rotate:"-12.25", transformOrigin:"top right" }, 
          { x: "0%",y: "0%", opacity: 1,  rotate:"0deg" }, '<')
        /**SECONDS CARDS OUT */
        .to(secondSectionRef.current.getElementsByClassName("card_left")[1], 
          { y: "-50%", x: "-50%"  ,  opacity: 0,  }, '+=50%')
        .to(secondSectionRef.current.getElementsByClassName("card_right")[1], 
          { y: "-50%", x: "50%",  opacity: 0,  }, '<')
        .to(secondSectionRef.current.getElementsByClassName("swan_image")[0], 
          {opacity: 0 }, '<')

      // *** ScrollTrigger para la segunda sección, ahora con la animación vinculada ***
      ScrollTrigger.create({
        id:'secondsection',
        trigger: secondSectionRef.current,
        start: 'top top',
        end: `+=${secondSectionTimeline.duration() * 500}`, // Se ajusta la duración del pin a la de la animación
        pin: true,
        pinSpacing: true,
        scrub: true, // Esto es clave para que la animación siga el scroll
        animation: secondSectionTimeline,
      });

    /**Trigger hide loader */
   // if (ScrollTrigger.getAll().length === 2) {

        gsap.to(
            loaderRef.current,
            { opacity :1 , zIndex:-1, delay:0.5, duration:0.45}
          )
       
  
		},
		{
			dependencies: [loadedImages, isMobile],
			scope: header,
		},
	);


  


	useDidUpdate(() => {
		const handleViewportResize = () => {
			if (!debouncedViewportSize.width || !debouncedViewportSize.height || !loadedImages) return
			if (!canvas.current) return
			if (canvas.current.width === debouncedViewportSize.width) return
			canvas.current.width = debouncedViewportSize.width
			canvas.current.height = debouncedViewportSize.height
			const context = canvas.current.getContext('2d', { alpha: true })
			if (!context) return
			const progress = ScrollTrigger.getById('image-sequence')?.progress ?? 0
			const nextFrame = Math.floor(progress * loadedImages.length)
			const nextImage = loadedImages[nextFrame]
			if (!nextImage) return
			updateCanvasImage(context, canvas.current, nextImage)
		}
		handleViewportResize()
	}, [debouncedViewportSize])


	return (
		// Agrega los envoltorios de ScrollSmoother
    <>
       <div ref={loaderRef} className='loader'>
        <ImageNext className='pulse-element' src={"/assets/logo.png"} width={155} height={145} alt="loader swanson" />
       </div>
		<div id="smooth-wrapper" ref={smootherWrapper}>
			<div id="smooth-content" ref={smootherContent}>

				<main ref={header}>
					<section id="content-wrapper">
						<header className="header">
							<div className="logo_container">
								<ImageNext src={"/assets/logo.png"} width={65} height={55} alt="logo swanson" />
								<p className="logo_text">Swanson</p>
							</div>
							<div className="group_navbar">
								<nav className="navbar">
									<a className="nav-link" href="#info-section">about us</a>
									<a className="nav-link" href="#story-section">our story</a>
									<a className="nav-link" href="#team-section">team</a>
									<a className="nav-link" href="#governance-section" data-offset="100">governance</a>
									<a className="schedule" href="https://schedule.swansonreservecapital.com/" target="_blank">
										<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M6 0V4.5" stroke="black" />
											<path d="M6 6.75L6 12" stroke="black" />
											<path d="M0 6L4.5 6" stroke="black" />
											<path d="M6.75 6L12 6" stroke="black" />
										</svg>
										schedule
									</a>
								</nav>
								<button className="hamburguer_btn">
									<img src={"/assets/hamburguer.png"} width={74} height={11.5} alt="logo menu" />
								</button>
							</div>
						</header>

						<div className="animated_space">
							<p className="layer_over_seq one">Market Capitalization Company</p>
							<p className="layer_over_seq two">Swanson Reserve Capital Is</p>
							<p className="layer_over_seq three">Swanson Reserve Capital Is</p>
							<h2 className="text_over_seq first">Swanson<br />Reserve Capital</h2>
							<h2 className="text_over_seq second">Innovation<br />Invented</h2>
							<h2 className="text_over_seq third">Prosperity<br />Protected</h2>
							<h2 className="text_over_seq last"><span>We Are</span><br />Swanson Reserve {isMobile ? <> <br /><span>Capital</span></> : null}</h2>
						</div>

						<div className="progress_container out">
							<div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}>
								<ImageNext className="up_direction" src={"/assets/chevron.png"} width={16} height={9} alt="logo menu" />
								<ImageNext className="down_direction" src={"/assets/chevron.png"} width={16} height={9} alt="logo menu" />
							</div>

							<div className="progress_bar_container">
								<div ref={progressBarRef} className="progress_bar"></div>
							</div>
						</div>

						<div className="pages out">
							<span className="page page_one">01</span>
							<span className="page page_two">02</span>
							<span className="page page_three">03</span>
						</div>
						<canvas ref={canvas} className="canvas_image_sequence" />
					</section>
				</main>
				<section ref={secondSectionRef} id="second_section" className="second_section">

					<div className="swan_image">
						<SwanModel />
					</div>
          
          <div className="card card_left">
            <p>Swanson Reserve Capital is private investment fund with dual Share Classes, Structured Notes & Long Equity Quantitative investing.What we do: Our fund curates investment strategies for accredited investors, family offices, institutions, endowments and businesses to help:</p>
            <img className="card_img"  src={"/assets/couple.png"} alt="couple"/>
          </div>
          <div className="card card_left">
            <p>2. Achieve Long Term Growth: While still receiving quarterly distributions, our Growth Notes and Equity Allocations are designed to accumulate long term wealt</p>
            <img className="card_img"  src={"/assets/couple.png"} alt="couple"/>
          </div>
          <div className="card card_right">
            <img className="card_img"  src={"/assets/office.png"} alt="swanson's offices"/>
          <p>1. Create Quarterly Income: Pay ongoing expenses, kids tuition, mortgages, car payments, private jet, or fund charitable contributions.</p>
          </div>
          <div className="card card_right">
            
            <img className="card_img" src={"/assets/room.png"} alt="swanson's room"/>
            <p>3. Swanson Reserve Capital is private investment fund with dual Share Classes, Structured Notes & Long Equity Quantitative investing.What we do: Our fund curates investment strategies for accredited investors, family offices, institutions, endowments and businesses to help:</p>
          </div>

          <div className="ellipse_bg primera "></div>
          <div className="ellipse_bg segunda"></div>
				</section>
        <section className="third_section">
           <Carousel
            //@ts-expect-error ddddd
            isMobile={isMobile}
            />
          <p className='drag_text' >drag to slide</p>
          <div className="ellipse_bg tercera "></div>
        </section>

			</div>
		</div>
    </>
 
	);
}

const loadImagesAndDrawFirstFrame = async ({
	canvas,
	imageSrcs,
	imageWidth,
	imageHeight,
}: {
	canvas: HTMLCanvasElement
	imageSrcs: string[]
	imageWidth: number
	imageHeight: number
}): Promise<HTMLImageElement[]> => {
	const images: HTMLImageElement[] = []
	let loadedCount = 0

	return new Promise<HTMLImageElement[]>(async (resolve, reject) => {
		const onImageLoad = (index: number, img: HTMLImageElement) => {
			if (index === 0) {
				const context = canvas.getContext('2d', { alpha: true })
				if (!context) return
				updateCanvasImage(context, canvas, img)
			}
			loadedCount++
			const hasLoadedAll = loadedCount === imageSrcs.length - 1
			if (hasLoadedAll) resolve(images)
		}

		const retries: { [imgIndex: number]: number } = {}
		const maxRetries = 3

		const onImageError = (i: number, img: HTMLImageElement) => {
			if (retries[i] < maxRetries) {
				console.warn(`Image ${i} failed to load. Retrying... ${retries[i]}`)
				img.src = `${imageSrcs[i]}?r=${retries[i]}`
				retries[i]++
			} else {
				reject()
			}
		}

		for (let i = 0; i < imageSrcs.length - 1; i++) {
			const img = new Image()
			img.src = imageSrcs[i]
			const scale = Math.max(canvas!.width / imageWidth, canvas!.height / imageHeight)
			img.width = imageWidth * scale
			img.height = imageHeight * scale

			img.addEventListener('load', (e) => onImageLoad(i, img))
			img.addEventListener('error', (e) => onImageError(i, img))
			images.push(img)
		}
	})
}

const updateCanvasImage = (
	renderingContext: CanvasRenderingContext2D,
	canvas: HTMLCanvasElement,
	image: HTMLImageElement,
) => {
	if (!renderingContext || !canvas || !image) throw new Error('Unable to update canvas')
	const offsetX = canvas.width / 2 - image.width / 2
	const offsetY = canvas.height / 2 - image.height / 2
	renderingContext.clearRect(0, 0, canvas.width, canvas.height)
	renderingContext.drawImage(image, offsetX, offsetY, image.width, image.height)
}
