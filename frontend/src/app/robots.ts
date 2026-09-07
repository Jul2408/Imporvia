import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/parametres/'],
    },
    sitemap: 'https://imporvia.com/sitemap.xml',
  }
}
