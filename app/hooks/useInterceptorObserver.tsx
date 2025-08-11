import { useState, useEffect, useRef, useCallback, MutableRefObject, RefObject } from "react"

interface IntersectionObserverOptions {
	root?: Element | Document | null;
	rootMargin?: string;
	threshold?: number | number[];
}

type OnIntersectFunction = () => void

interface Props{
	options: IntersectionObserverOptions;
	onIntersect?: OnIntersectFunction;
}

export const useIntersectionObserver = ({options, onIntersect}:Props): [ RefObject<null>, boolean] => {

	const [isIntersecting, setIntersecting] = useState(false); // State to store if the element is intersecting
	const elementRef = useRef(null); // Reference to the DOM element to be observed
	const hasIntersected = useRef(false); // Ref to track if the intersection has already occurred

	// Callback that executes when the intersection state changes
	const observerCallback = useCallback(([entry]: IntersectionObserverEntry[]) => {
		setIntersecting(entry.isIntersecting); // Update the state with the isIntersecting value

		// If the element is intersecting and the onIntersect function is provided,
		// and it hasn't intersected before (to run only once)
		if (entry.isIntersecting && onIntersect && !hasIntersected.current) {
			onIntersect(); // Call the provided animation function
			hasIntersected.current = true; // Mark as intersected
		}
    }, [onIntersect]); // Dependency for useCallback: onIntersect function


  useEffect(() => {
    const currentElement = elementRef.current; // Save the current element for cleanup

    // If there's no element to observe, exit
		if (!currentElement) {
			return;
		}

		// Create a new IntersectionObserver instance
		const observer = new IntersectionObserver(observerCallback, options);

		// Start observing the element
		observer.observe(currentElement);

		// Cleanup function for when the component unmounts or dependencies change
		return () => {
			if (currentElement) {
				observer.unobserve(currentElement); // Stop observing the element
			}
			observer.disconnect(); // Disconnect the observer completely
		};
	}, [options, observerCallback]); // Dependencies for useEffect: options and the callback function


	return [elementRef, isIntersecting]; // Return the reference and the intersection state
}
