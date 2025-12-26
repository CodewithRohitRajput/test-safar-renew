export default function robots() {
  // Get the API base URL and remove /api for frontend URLs
  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://safarwanderlust.com/api'
  const frontendBaseUrl = apiBaseUrl.replace('/api', '')
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/_next/', '/static/'],
    },
    sitemap: `${frontendBaseUrl}/sitemap.xml`,
  }
}