import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description, 
  url = 'https://aya.london', 
  image = 'https://aya.london/hero-interior.jpg',
  type = 'website',
  jsonLd 
}) {
  const siteTitle = 'AYA Restaurant — Mayfair, London';
  const fullTitle = title ? `${title} | AYA` : siteTitle;

  return (
    <Helmet>
      {/* Standard SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="AYA Restaurant" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
