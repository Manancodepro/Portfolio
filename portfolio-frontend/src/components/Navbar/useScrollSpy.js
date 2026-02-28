import { useEffect, useState } from 'react'

/**
 * Returns the ID of the section currently most visible in the viewport.
 * @param {string[]} sectionIds - Array of section element IDs to observe.
 * @param {number} threshold - Intersection threshold (0-1). Defaults to 0.3.
 */
export default function useScrollSpy(sectionIds, threshold = 0.3) {
    const [activeId, setActiveId] = useState(null)

    useEffect(() => {
        // Track visibility ratio per section
        const visibilityMap = {}

        const observers = []

        sectionIds.forEach((id) => {
            const el = document.getElementById(id)
            if (!el) return

            visibilityMap[id] = 0

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        visibilityMap[entry.target.id] = entry.intersectionRatio
                    })

                    // Find the section with the highest visibility
                    let best = null
                    let bestRatio = 0
                    Object.keys(visibilityMap).forEach((key) => {
                        if (visibilityMap[key] > bestRatio) {
                            bestRatio = visibilityMap[key]
                            best = key
                        }
                    })

                    if (best) setActiveId(best)
                },
                {
                    threshold: [0, 0.1, 0.2, threshold, 0.5, 0.75, 1.0],
                    rootMargin: '-10% 0px -10% 0px',
                }
            )

            observer.observe(el)
            observers.push(observer)
        })

        return () => {
            observers.forEach((obs) => obs.disconnect())
        }
    }, [sectionIds, threshold])

    return activeId
}
