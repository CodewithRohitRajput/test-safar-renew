export default async function sitemap() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://safarwanderlust.com/api'
  const frontendBaseUrl = apiBaseUrl.replace('/api', '')
  
  // Helper function to encode URLs properly
  const encodeUrl = (url) => {
    return url
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }
  
  // Static routes
  const staticRoutes = [
    {
      url: frontendBaseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${frontendBaseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${frontendBaseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${frontendBaseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${frontendBaseUrl}/itinerary`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${frontendBaseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${frontendBaseUrl}/term_and_conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${frontendBaseUrl}/instalink`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${frontendBaseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${frontendBaseUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // Dynamic routes
  let dynamicRoutes = []
  
  try {
    // Fetch categories for explore pages
    const categoriesResponse = await fetch(`${apiBaseUrl}/common/categories?limit=100`, {
      next: { revalidate: 3600 }
    })
    
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json()
      
      // Add explore pages for each category
      if (categoriesData.data?.categories && Array.isArray(categoriesData.data.categories)) {
        const exploreRoutes = categoriesData.data.categories.map((category) => {
          const categorySlug = category.name?.toLowerCase().replace(/\s+/g, '-') || category.slug || category.id
          return {
            url: encodeUrl(`${frontendBaseUrl}/explore/${categorySlug}`),
            lastModified: new Date(category.updatedAt || category.createdAt || new Date()),
            changeFrequency: 'weekly',
            priority: 0.7,
          }
        })
        dynamicRoutes = [...dynamicRoutes, ...exploreRoutes]
      }
    }

    // Fetch itineraries for individual pages
    const itinerariesResponse = await fetch(`${apiBaseUrl}/common/itineraries?limit=1000`, {
      next: { revalidate: 3600 }
    })
    
    if (itinerariesResponse.ok) {
      const itinerariesData = await itinerariesResponse.json()
      
      // Add individual itinerary pages
      if (itinerariesData.data?.itineraries && Array.isArray(itinerariesData.data.itineraries)) {
        const itineraryRoutes = itinerariesData.data.itineraries.map((itinerary) => {
          const itinerarySlug = itinerary.route_map || itinerary.slug || itinerary.id
          return {
            url: encodeUrl(`${frontendBaseUrl}/itinerary/${itinerarySlug}`),
            lastModified: new Date(itinerary.updatedAt || itinerary.createdAt || new Date()),
            changeFrequency: 'weekly',
            priority: 0.6,
          }
        })
        dynamicRoutes = [...dynamicRoutes, ...itineraryRoutes]
      }

      // Add trending pages for each itinerary
      if (itinerariesData.data?.itineraries && Array.isArray(itinerariesData.data.itineraries)) {
        const trendingRoutes = itinerariesData.data.itineraries.map((itinerary) => {
          const itinerarySlug = itinerary.route_map || itinerary.slug || itinerary.id
          return {
            url: encodeUrl(`${frontendBaseUrl}/trending/${itinerarySlug}`),
            lastModified: new Date(itinerary.updatedAt || itinerary.createdAt || new Date()),
            changeFrequency: 'weekly',
            priority: 0.6,
          }
        })
        dynamicRoutes = [...dynamicRoutes, ...trendingRoutes]
      }
    }
  } catch (error) {
    console.error('Error fetching dynamic routes for sitemap:', error)
  }

  return [...staticRoutes, ...dynamicRoutes]
}