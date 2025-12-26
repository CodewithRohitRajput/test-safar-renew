import React, { useRef, useEffect, useState } from 'react'

const LazyLoadComponent = ({ Component }) => {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    if (!elementRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (observer) observer.unobserve(entry.target)
          //observer.disconnect() // Stop observing after loading
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.1 // Adjust as needed to load earlier or later
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      // if (observer && observer.unobserve) {
      if (observer && elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [])

  return (
    <div ref={elementRef} style={{ minHeight: '100px' }}>
      {isVisible && <Component />}
    </div>
  )
}

export default LazyLoadComponent
