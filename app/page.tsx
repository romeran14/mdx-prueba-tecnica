'use client'

import styles from "./page.module.css";
import { useGSAP } from '@gsap/react'
import { useDebouncedValue, useDidUpdate, useViewportSize } from '@mantine/hooks'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import  { type FC, useEffect, useRef, useState } from 'react'

gsap.registerPlugin(ScrollTrigger, useGSAP)


export default function Home() {

 const header = useRef<HTMLDivElement> (null)
    const canvas = useRef<HTMLCanvasElement>(null)
  const viewportSize = useViewportSize()
  const [debouncedViewportSize] = useDebouncedValue(viewportSize, 500)
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>()

    useEffect(() => {
    if (!canvas.current) return
    if (viewportSize.width === 0 || viewportSize.height === 0) return // First render value is 0
    if (!!loadedImages) return

    const intialSetup = async () => {
      // Image Dimensions: 1920 / 1080
      const imageAspect = 1920 / 1080
      const imageWidth = viewportSize.width
      const imageHeight = viewportSize.width / imageAspect
      canvas.current!.width = viewportSize.width
      canvas.current!.height = viewportSize.height

      const imageSrcs: string[] = Array.from(
        { length: 255 },
        (_, i) => `/assets/new_desktop_sequence/new_desktop_sequence/swanson__00${i + 1 < 10 ? `00${i + 1}` : i + 1 < 100 ? `0${i + 1}`: i + 1}.jpg`,
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
  }, [viewportSize, loadedImages])
  
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
        end: 'bottom top', // End when the bottom of the header reaches the top of the viewport
        pin: '#content-wrapper', // Pin the content container so it doesn't scroll off the screen
        onUpdate: ({ progress }) => {
          const nextFrame = Math.floor(progress * loadedImages.length)
          const nextImage = loadedImages[nextFrame]
          if (!nextImage) return
          updateCanvasImage(context, canvas.current!, nextImage)
        },
      })

      // Animations
      // Animate content in
      gsap
        .timeline({
          delay: 0.2,
        })
        .to(canvas.current, { opacity: 1, duration: 0.8 })
        .to(canvas.current, { scale: 1, duration: 0.9, ease: 'power2.inOut' })
        .fromTo(
          '#heading',
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.inOut' },
          '-=0.7',
        )
      // Scroll controlled animations for headings
      gsap
        .timeline({
          defaults: {
            ease: 'none',
          },
          scrollTrigger: { trigger: header.current, start: 0, end: 'bottom top', scrub: true },
        })
        .to('#heading', {
          keyframes: [{ scale: 1.1 }, { scale: 1.15, opacity: 0 }],
          duration: 0.5,
        })
        .to(
          'h2',
          {
            keyframes: [
              { scale: 0.9, opacity: 1, duration: 0.2 },
              { scale: 1, opacity: 0, duration: 0.1 },
            ],
          },
          '+=0.05',
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
       <section id="content-wrapper">
        <canvas ref={canvas} className="canvas_image_sequence" />
       </section>
       <section>
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
  renderingContext.drawImage(image, offsetX, offsetY, image.width, image.height)
}
