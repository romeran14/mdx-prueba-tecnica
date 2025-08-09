'use client'

import styles from "./page.module.css";
import { useGSAP } from '@gsap/react'
import { useDebouncedValue, useDidUpdate, useViewportSize } from '@mantine/hooks'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
//import Image from "next/image";
import { type FC, useEffect, useRef, useState } from 'react'


gsap.registerPlugin(ScrollTrigger, useGSAP)


export default function Home() {

	const header = useRef<HTMLDivElement> (null)
		const canvas = useRef<HTMLCanvasElement>(null)
		const viewportSize = useViewportSize()
		const [debouncedViewportSize] = useDebouncedValue(viewportSize, 500)
		const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>()

    const isMobile = viewportSize.width < 768

			useEffect(() => {
        if (!canvas.current) return
        if (viewportSize.width === 0 || viewportSize.height === 0) return // First render value is 0
        if (!!loadedImages) return

			const intialSetup = async () => {
				// Image Dimensions: 1920 / 1080
				const imageAspect = !isMobile ? 1920 / 1080 : 430/932
				const imageWidth = viewportSize.width
				const imageHeight = viewportSize.width / imageAspect
				canvas.current!.width = viewportSize.width
				canvas.current!.height = viewportSize.height

				const imageSrcs: string[] = Array.from(
					{ length: !isMobile ? 255 : 238 },
					(_, i) => `/assets/${!isMobile ? "new_desktop_sequence/new_desktop_sequence/swanson__00":"new_mobile_sequence/new_mobile_sequence/swanson_V__00" }${i < 10 ? `00${i}` : i < 100 ? `0${i}`: i}.jpg`,
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
				if (!canvas.current || !loadedImages) return
				const context = canvas.current.getContext('2d', { alpha: true })
				if (!context) return

				// ScrollTrigger for updating image sequence frames
				ScrollTrigger.create({
					id: 'image-sequence',
					trigger: header.current,
					start: 0,
					//end: 'bottom top', // End when the bottom of the header reaches the top of the viewport
          end: '+=3000',
					pin: '#content-wrapper', // Pin the content container so it doesn't scroll off the screen
        onUpdate: ({ progress }) => {
          const nextFrame = Math.floor(progress * loadedImages.length)
          const nextImage = loadedImages[nextFrame]
          if (!nextImage) return
          updateCanvasImage(context, canvas.current!, nextImage)
        },
      })

        // Timeline de animaciones vinculado al ScrollTrigger de la secuencia
        gsap.timeline({
          defaults: {
            ease: 'none',
          },
          // Usamos el mismo ScrollTrigger que la secuencia de imágenes
          scrollTrigger: {
            trigger: header.current,
            start: 0,
            end: '+=3000',
            scrub: true, // Esto hace que la animación se sincronice con el scroll
          },
        })
        // Animaciones para cada h2
        .to(
          '.animated_space .first',
          { x: "100vw", opacity: 0 },
          '0'
        ).to(
          '.animated_space .one',
          { opacity: 0 },
          '0'
        )
        .fromTo(
          '.animated_space .second',
          { x:"-100vw", opacity: 0},
          { x:"0vw", opacity: 1},
          '+=25%'
        ).fromTo(
          '.animated_space .two',
          {  opacity: 0},
          {  opacity: 1},
          '<'
        ).to(
          '.animated_space .second',
          { x:"100vw", opacity: 0},
          '+=100%'
        ).to(
          '.animated_space .two',
          {  opacity: 0},
          '<'
        )
        .fromTo(
          '.animated_space .third',
          { x:"-100vw", opacity: 0},
          { x:"0vw", opacity: 1},
          '+=50%'
        ).fromTo(
          '.animated_space .three',
          {  opacity: 0},
          {  opacity: 1},
          '<'
        ).to(
          '.animated_space .third',
          { x:"-50vw", opacity: 0},
          '+=75%'
        ).to(
          '.animated_space .three',
          {  opacity: 0},
          '<'
        ).fromTo(
          '.animated_space .last',
          { y:"100vh", opacity: 0},
          { y: !isMobile ?"65vh" : "75vh", opacity: 1},
          '-=25%'
        )
			},
			{
				dependencies: [loadedImages],
				scope: header,
			},
		)

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
			<div ref={header} className={styles.page}>
				<main className={styles.main}>
          <nav>

            <a className="nav-link" href="#info-section">about us</a>
            <a className="nav-link" href="#story-section">our story</a>
            <a className="nav-link" href="#team-section">team</a>
            <a className="nav-link" href="#governance-section" data-offset="100">governance</a>
            <a className="schedule" href="https://schedule.swansonreservecapital.com/" target="_blank">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 0V4.5" stroke="black"/>
                  <path d="M6 6.75L6 12" stroke="black"/>
                  <path d="M0 6L4.5 6" stroke="black"/>
                  <path d="M6.75 6L12 6" stroke="black"/>
                  </svg>
                schedule
            </a>
        </nav>
					<section id="content-wrapper">
          
            <div className="animated_space">

              <p className="layer_over_seq one">Market Capitalization Company</p>
              <p className="layer_over_seq two">Swanson Reserve Capital Is</p>
              <p className="layer_over_seq three">Swanson Reserve Capital Is</p>

              <h2 className="text_over_seq first">Swanson<br/>Reserve Capital</h2>
              <h2 className="text_over_seq second">Innovation<br/>Invented</h2>
              <h2 className="text_over_seq third">Prosperity<br/>Protected</h2>
              <h2 className="text_over_seq last"><span>We Are</span><br/>Swanson Reserve {isMobile? <> <br/><span>Capital</span></>:null}</h2>
            </div>

						<canvas ref={canvas} className="canvas_image_sequence" />

					</section>
					<section>
						<br></br>
						<br></br>
						<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati consectetur doloremque numquam distinctio a illum corporis dolores aspernatur laboriosam, vitae cupiditate similique porro mollitia. Enim eius sunt quam fugiat necessitatibus. Aliquam, dicta? Nobis quidem saepe sed mollitia doloribus eligendi molestias inventore excepturi alias cupiditate dolor aspernatur ipsum culpa quasi repellat veniam, fugit odio. Laudantium, impedit nobis facilis nesciunt voluptatem enim error perferendis magni accusamus culpa aperiam, aut deserunt laboriosam! Dolore cupiditate mollitia, blanditiis iste dolorem nulla quae, necessitatibus quasi molestiae nesciunt voluptate ratione? Deserunt veniam necessitatibus officiis, accusamus enim numquam possimus eveniet nihil soluta similique placeat provident, temporibus magni asperiores.</p>
						</section>
				</main>
				<footer className={styles.footer}>
				</footer>
			</div>
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
			// Draw the first frame ASAP
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
			// Try reloading this image a couple of times. If it fails then reject.
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
			// Math.min for contain, Math.max for cover
			const scale = Math.max(canvas!.width / imageWidth, canvas!.height / imageHeight)
			img.width = imageWidth * scale
			img.height = imageHeight * scale
			img.addEventListener('load', (e: any) => onImageLoad(i, img))
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
	// If you need to center the image in the canvas:
	const offsetX = canvas.width / 2 - image.width / 2
	const offsetY = canvas.height / 2 - image.height / 2
	renderingContext.clearRect(0, 0, canvas.width, canvas.height)
  console.log(image, offsetX, offsetY, image.width, image.height)
	renderingContext.drawImage(image, offsetX, offsetY, image.width, image.height)
}
