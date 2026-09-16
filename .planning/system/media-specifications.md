# Media Placement Specification & Current UI Media Contract

> **STATUS**: AUDIT COMPLETE & LOCKED  
> **PURPOSE**: Source of truth for future Admin Panel development and media upload validation.  
> **IMMUTABILITY NOTICE**: The current frontend media designs, card dimensions, aspect ratios, and responsive behaviors are **visually locked**. Future Admin uploads must conform to these placement rules; the frontend media frames will not be altered to accommodate arbitrary asset ratios.

---

## 1. Executive Summary & Audit Scope

This document details the exact technical and visual requirements for every photographic, illustrative, and video media placement across **The Indian Wings Company** web application. 

Every value documented below has been derived directly from the audited production source code (CSS variables, Tailwind utility classes, Next.js `<Image>` component properties, `<video>` element attributes, and responsive container constraints).

---

## 2. Global / Layout Media Placements

### 2.1 Navbar Brand Logo
- **Component**: [`src/components/navigation/Navbar.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/navigation/Navbar.tsx)
- **Route / Page**: Global (All pages)
- **Media Type**: PNG Image (Transparent vector/raster logo)
- **Container Dimensions**:
  - Unscrolled: `h-12 md:h-16 lg:h-18 xl:h-22`, container `w-[130px] sm:w-[150px] lg:w-[160px] xl:w-[210px] h-10 md:h-14`
  - Scrolled: `h-10 md:h-12 xl:h-14`
- **Next.js Image Props**: `width={500} height={293} priority className="object-contain w-auto origin-left"`
- **Aspect Ratio**: `500:293` (~1.7:1 / ~16:9.4)
- **Object Fit / Position**: `object-contain`, `object-left` / `origin-left`
- **Behavior**: Contained, no cropping. Scales down smoothly when navbar transitions into floating/scrolled mode.
- **Recommended Upload**: `1000 × 586 px` (Transparent PNG / WebP, 2x Retina density).

---

### 2.2 Footer Brand Logo
- **Component**: [`src/components/layout/Footer.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/layout/Footer.tsx)
- **Route / Page**: Global (All pages)
- **Media Type**: PNG Image (Transparent logo)
- **Container Dimensions**: `h-12 sm:h-14 w-auto`
- **Next.js Image Props**: `width={200} height={70} className="h-12 sm:h-14 w-auto object-contain drop-shadow-md origin-left"`
- **Aspect Ratio**: Intrinsic logo ratio (approx. 2.8:1)
- **Object Fit / Position**: `object-contain`, `object-left`
- **Recommended Upload**: `600 × 210 px` (Transparent PNG / WebP).

---

### 2.3 Hero Section Video / Background Slide
- **Component**: [`src/components/hero/HeroVideoBackground.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/hero/HeroVideoBackground.tsx) / [`HeroSection.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/hero/HeroSection.tsx)
- **Route / Page**: `/` (Home Landing Page)
- **Media Type**: MP4 Video with Fallback Poster Image
- **Container Dimensions**: Pinned fullscreen `absolute inset-0 w-full h-full min-h-[100dvh]`
- **Video Implementation**:
  ```tsx
  <video autoPlay muted loop playsInline poster={poster} className="absolute inset-0 w-full h-full object-cover">
    <source src={src} type="video/mp4" />
  </video>
  ```
- **Fallback Image**:
  `style={{ backgroundImage: "url('/assets/hero.png')" }}` or Next.js Image with `object-cover`
- **Aspect Ratio**: Full viewport responsive (Variable 9:16 mobile to 21:9 ultrawide)
- **Object Fit / Position**: `object-cover`, `center center`
- **Cropping Behavior**: Edge cropped to fill entire viewport at any screen width/height without letterboxing.
- **Recommended Upload**:
  - **Video**: `1920 × 1080 px` (16:9 Landscape), H.264 / MP4, 24–30 fps, bitrate < 3.5 Mbps, muted audio track.
  - **Poster Image**: `2560 × 1440 px` (16:9 Landscape), optimized WebP/JPEG (< 400 KB).

---

### 2.4 Why Travel With Us Panoramic Mountain Banner
- **Component**: [`src/components/trust/WhyTravelWithUsSection.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/trust/WhyTravelWithUsSection.tsx)
- **Route / Page**: `/` (Home Page)
- **Media Type**: PNG/WebP Panorama Illustration / Photograph
- **Container Dimensions**: `relative w-full h-[180px] sm:h-[220px] lg:h-[260px] overflow-hidden`
- **Next.js Image Props**: `fill sizes="100vw" className="object-cover object-top pointer-events-none" priority`
- **Aspect Ratio**: Ultra-wide banner (~6.2:1 to 8:1 depending on screen width)
- **Object Fit / Position**: `object-cover`, `object-top`
- **Cropping Behavior**: Fixed height banner across full viewport width; bottom excess cropped while retaining top mountain crests.
- **Recommended Upload**: `2560 × 420 px` (Landscape Panoramic Banner), WebP/PNG with alpha or transparent sky.

---

## 3. Trust, Reviews & Gallery Media Placements

### 3.1 Client Video Review Cards (Stories Carousel)
- **Component**: [`src/components/trust/ClientStories.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/trust/ClientStories.tsx)
- **Route / Page**: `/` (Home Page)
- **Media Type**: Video Poster Image
- **Container Dimensions**:
  - Desktop: Featured item `md:col-span-12 lg:col-span-5 h-[330px]`; standard items `md:col-span-6 lg:col-span-3.5 h-[330px]`
  - Tablet: `h-[310px]`
  - Mobile: `w-full h-[280px]`
- **Next.js Image Props**: `fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover"`
- **Aspect Ratio**: Responsive dynamic card (~16:10 on mobile, ~4:3 on desktop)
- **Object Fit / Position**: `object-cover`, `center center`
- **Border Radius**: `rounded-2xl` (16px)
- **Cropping Behavior**: Auto-crops to fixed card height; overlay gradient at bottom for text readability.
- **Recommended Upload**: `1200 × 900 px` (4:3 Landscape) or `1280 × 800 px` (16:10 Landscape), WebP/JPEG.

---

### 3.2 Client Video Player Lightbox Modal
- **Component**: [`src/components/trust/ClientStories.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/trust/ClientStories.tsx)
- **Route / Page**: `/` (Lightbox overlay)
- **Media Type**: Interactive HTML5 Video
- **Container Dimensions**: `relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[16/9] max-h-[80vh] bg-black rounded-2xl overflow-hidden`
- **Video Implementation**:
  ```tsx
  <video src={selectedVideo.videoUrl} controls autoPlay playsInline poster={selectedVideo.posterUrl} className="w-full h-full object-contain bg-black" />
  ```
- **Aspect Ratio**: `16:9` (Tablet/Desktop), `4:3` (Mobile)
- **Object Fit / Position**: `object-contain`, `center center` (letterboxes black bars if video differs from 16:9).
- **Recommended Upload**: `1920 × 1080 px` (16:9 Landscape MP4), H.264, stereo AAC audio, max 1080p, bitrate < 5 Mbps.

---

### 3.3 Client Avatars in Written Reviews
- **Component**: [`src/components/trust/ClientStories.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/trust/ClientStories.tsx) / [`ReviewCard.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/trust/ReviewCard.tsx)
- **Route / Page**: `/` (Home Page)
- **Media Type**: Portrait / Headshot Image
- **Container Dimensions**: `w-11 h-11` (44 × 44 px), circle `rounded-full overflow-hidden shrink-0`
- **Next.js Image Props**: `fill sizes="44px" className="object-cover"`
- **Aspect Ratio**: `1:1` (Exact Square)
- **Object Fit / Position**: `object-cover`, `center center`
- **Border Radius**: `rounded-full`
- **Recommended Upload**: `400 × 400 px` (1:1 Square), WebP/JPEG centered headshot.

---

### 3.4 Guest Photo Gallery Cards
- **Component**: [`src/components/gallery/GalleryCard.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/gallery/GalleryCard.tsx)
- **Route / Page**: `/` (Home Page `#guest-gallery`)
- **Media Type**: High-Resolution Travel Photograph
- **Container Dimensions**: `relative w-full aspect-[4/3] overflow-hidden bg-slate-100`
- **Next.js Image Props**: `fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"`
- **Aspect Ratio**: `4:3` (Exact 1.333:1)
- **Object Fit / Position**: `object-cover`, `center center`
- **Border Radius**: Card top `rounded-t-2xl`
- **Cropping Behavior**: Strictly cropped to `4:3` ratio; zoom micro-interaction on hover.
- **Recommended Upload**: `1600 × 1200 px` (4:3 Landscape), WebP/JPEG, quality 85.

---

### 3.5 Guest Photo Gallery Lightbox Modal
- **Component**: [`src/components/gallery/GalleryLightboxModal.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/gallery/GalleryLightboxModal.tsx)
- **Route / Page**: `/` (Modal Dialog)
- **Media Type**: High-Resolution Detail Image
- **Container Dimensions**:
  - Desktop: `relative w-full lg:w-3/5 bg-black/70 min-h-[540px]`
  - Tablet: `min-h-[380px]`
  - Mobile: `min-h-[260px]`
- **Next.js Image Props**: `fill sizes="(max-width: 1024px) 100vw, 60vw" priority className="object-cover lg:object-contain select-none pointer-events-none"`
- **Aspect Ratio**: Responsive variable container
- **Object Fit / Position**: `object-cover` on mobile; `object-contain` on desktop (`lg`) to preserve full original photo composition without cropping.
- **Recommended Upload**: `2048 × 1536 px` (4:3) or `2400 × 1600 px` (3:2), WebP/JPEG.

---

## 4. Tour Packages Media Placements

### 4.1 Package Cards (Featured, Seasonal, Off-Beat)
- **Component**: [`src/components/packages/PackageCard.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/packages/PackageCard.tsx)
- **Route / Page**: `/` and `/packages`
- **Media Type**: Landscape Tour Package Photography
- **Container Dimensions**: `relative w-full aspect-[16/10] overflow-hidden bg-slate-100`
- **Next.js Image Props**: `fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"`
- **Aspect Ratio**: `16:10` (Exact 1.6:1)
- **Object Fit / Position**: `object-cover`, `center center`
- **Border Radius**: Card top `rounded-t-2xl`
- **Cropping Behavior**: Strictly constrained to 16:10; scale-105 hover animation.
- **Recommended Upload**: `1600 × 1000 px` (16:10 Landscape), WebP/JPEG.

---

### 4.2 Packages Page Hero Background
- **Component**: [`src/components/packages/PackagesPageHero.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/packages/PackagesPageHero.tsx)
- **Route / Page**: `/packages`
- **Media Type**: Landscape Scenic Photography
- **Container Dimensions**: `relative w-full min-h-[480px] sm:min-h-[540px] lg:min-h-[580px]`
- **Next.js Image Props**: `fill priority sizes="100vw" className="object-cover object-center scale-105"`
- **Aspect Ratio**: Viewport-wide cover
- **Object Fit / Position**: `object-cover`, `object-center`
- **Recommended Upload**: `2560 × 1440 px` (16:9 Landscape), WebP/JPEG.

---

## 5. Destinations Media Placements

### 5.1 Destination Listing Card
- **Component**: [`src/components/destinations/DestinationCard.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/destinations/DestinationCard.tsx)
- **Route / Page**: `/` and `/destinations`
- **Media Type**: Landscape Scenic Photography
- **Container Dimensions**: `relative w-full aspect-[16/10] overflow-hidden bg-slate-100 block`
- **Next.js Image Props**: `fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"`
- **Aspect Ratio**: `16:10` (Exact 1.6:1)
- **Object Fit / Position**: `object-cover`, `center center`
- **Border Radius**: Card top `rounded-t-2xl`
- **Recommended Upload**: `1600 × 1000 px` (16:10 Landscape), WebP/JPEG.

---

### 5.2 Destination Detail Hero Background
- **Component**: [`src/components/destinations/DestinationDetailHero.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/destinations/DestinationDetailHero.tsx)
- **Route / Page**: `/destinations/[slug]` (e.g., Srinagar, Gulmarg, Pahalgam, Sonmarg)
- **Media Type**: High-Impact Destination Photography
- **Container Dimensions**: `relative w-full min-h-[480px] sm:min-h-[540px] lg:min-h-[580px]`
- **Next.js Image Props**: `fill priority sizes="100vw" className="object-cover object-center scale-105"`
- **Aspect Ratio**: Viewport-wide cover
- **Object Fit / Position**: `object-cover`, `object-center`
- **Recommended Upload**: `2560 × 1440 px` (16:9 Landscape), WebP/JPEG.

---

### 5.3 Destination Hero Slide Gallery (Main Slide Display)
- **Component**: [`src/components/destinations/DestinationHeroGallery.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/destinations/DestinationHeroGallery.tsx)
- **Route / Page**: `/destinations/[slug]`
- **Media Type**: Curated Destination Photo Slider
- **Container Dimensions**: `relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] overflow-hidden bg-midnight`
- **Next.js Image Props**: `fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 55vw" className="object-cover"`
- **Aspect Ratio**: `16:10` (Mobile/Desktop), `16:9` (Tablet)
- **Object Fit / Position**: `object-cover`, `center center`
- **Recommended Upload**: `1920 × 1200 px` (16:10 Landscape), WebP/JPEG.

---

### 5.4 Destination Gallery Thumbnail Track
- **Component**: [`src/components/destinations/DestinationHeroGallery.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/destinations/DestinationHeroGallery.tsx)
- **Route / Page**: `/destinations/[slug]`
- **Media Type**: Gallery Thumbnails
- **Container Dimensions**: `relative w-16 h-12 sm:w-20 sm:h-14 shrink-0 rounded-lg overflow-hidden`
- **Next.js Image Props**: `fill sizes="80px" className="object-cover"`
- **Aspect Ratio**: `4:3` (~1.33:1 to 1.42:1)
- **Object Fit / Position**: `object-cover`, `center center`
- **Border Radius**: `rounded-lg` (8px)
- **Recommended Upload**: Auto-generated from main slide asset (or `320 × 240 px` 4:3).

---

### 5.5 Destination Things to See & Do Attraction Cards
- **Component**: [`src/components/destinations/DestinationAttractionCard.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/destinations/DestinationAttractionCard.tsx)
- **Route / Page**: `/destinations/[slug]`
- **Media Type**: Point-of-Interest Photography
- **Container Dimensions**: `relative w-full aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/10] overflow-hidden bg-midnight`
- **Next.js Image Props**: `fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 30vw" className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"`
- **Aspect Ratio**: `16:10` (Mobile/Desktop), `4:3` (Tablet)
- **Object Fit / Position**: `object-cover`, `center center`
- **Border Radius**: Top `rounded-t-xl`
- **Recommended Upload**: `1200 × 750 px` (16:10 Landscape), WebP/JPEG.

---

## 6. Transport & Fleet Media Placements

### 6.1 Transport Hero Background
- **Component**: [`src/components/transport/TransportHero.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/transport/TransportHero.tsx)
- **Route / Page**: `/transport`
- **Media Type**: Mountain Highway Scenery
- **Container Dimensions**: `relative w-full min-h-[480px] sm:min-h-[540px] lg:min-h-[580px]`
- **Next.js Image Props**: `fill priority sizes="100vw" className="object-cover object-center scale-105"`
- **Aspect Ratio**: Viewport cover
- **Object Fit / Position**: `object-cover`, `object-center`
- **Recommended Upload**: `2560 × 1440 px` (16:9 Landscape), WebP/JPEG.

---

### 6.2 Vehicle Fleet Grid Cards
- **Component**: [`src/components/transport/VehicleFleetGrid.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/transport/VehicleFleetGrid.tsx)
- **Route / Page**: `/transport`
- **Media Type**: Commercial Vehicle Photography
- **Container Dimensions**: `relative w-full aspect-[16/10] overflow-hidden bg-midnight`
- **Next.js Image Props**: `fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105 brightness-90"`
- **Aspect Ratio**: `16:10` (Exact 1.6:1)
- **Object Fit / Position**: `object-cover`, `center center`
- **Border Radius**: Top `rounded-t-xl`
- **Cropping Behavior**: Fixed 16:10 frame; vehicles must be framed with comfortable margins to avoid bumper cutoff.
- **Recommended Upload**: `1600 × 1000 px` (16:10 Landscape) or `1500 × 1000 px` (3:2 Landscape), WebP/JPEG.

---

## 7. Adventure Activities Media Placements

### 7.1 Activities Hero Background
- **Component**: [`src/components/activities/ActivitiesHero.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/activities/ActivitiesHero.tsx)
- **Route / Page**: `/activities`
- **Media Type**: Alpine Adventure Photography
- **Container Dimensions**: `relative w-full min-h-[480px] sm:min-h-[540px] lg:min-h-[580px]`
- **Next.js Image Props**: `fill priority sizes="100vw" className="object-cover object-center scale-105"`
- **Aspect Ratio**: Viewport cover
- **Object Fit / Position**: `object-cover`, `object-center`
- **Recommended Upload**: `2560 × 1440 px` (16:9 Landscape), WebP/JPEG.

---

### 7.2 Adventure Activity Cards
- **Component**: [`src/components/activities/ActivityCardsGrid.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/activities/ActivityCardsGrid.tsx)
- **Route / Page**: `/activities`
- **Media Type**: Adventure Action Photography (Gondola, Rafting, Trekking, Skiing)
- **Container Dimensions**: `relative w-full aspect-[16/10] overflow-hidden bg-midnight`
- **Next.js Image Props**: `fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105 brightness-90"`
- **Aspect Ratio**: `16:10` (Exact 1.6:1)
- **Object Fit / Position**: `object-cover`, `center center`
- **Border Radius**: Top `rounded-t-xl`
- **Recommended Upload**: `1600 × 1000 px` (16:10 Landscape), WebP/JPEG.

---

## 8. Kashmir Bucket List Media Placements

### 8.1 Travel Information Hero Background
- **Component**: [`src/components/travel-info/TravelInfoHero.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/travel-info/TravelInfoHero.tsx)
- **Route / Page**: `/bucket-list/travel-information`
- **Media Type**: Scenic Photography
- **Container Dimensions**: `relative w-full min-h-[480px] sm:min-h-[540px] lg:min-h-[580px]`
- **Next.js Image Props**: `fill priority sizes="100vw" className="object-cover object-center scale-105"`
- **Aspect Ratio**: Viewport cover
- **Object Fit / Position**: `object-cover`, `object-center`
- **Recommended Upload**: `2560 × 1440 px` (16:9 Landscape), WebP/JPEG.

---

### 8.2 Shopping Guide Hero Background
- **Component**: [`src/app/bucket-list/shopping/page.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/app/bucket-list/shopping/page.tsx)
- **Route / Page**: `/bucket-list/shopping`
- **Media Type**: Kashmiri Houseboat & Artisan Market Scene
- **Container Dimensions**: `relative w-full min-h-[460px] sm:min-h-[500px]`
- **Next.js Image Props**: `fill priority sizes="100vw" className="object-cover object-center scale-105"`
- **Aspect Ratio**: Viewport cover
- **Object Fit / Position**: `object-cover`, `object-center`
- **Recommended Upload**: `2560 × 1440 px` (16:9 Landscape), WebP/JPEG.

---

### 8.3 Things to Do Hero Background
- **Component**: [`src/app/bucket-list/things-to-do/page.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/app/bucket-list/things-to-do/page.tsx)
- **Route / Page**: `/bucket-list/things-to-do`
- **Media Type**: Snow Peaks / Cable Car Scenery
- **Container Dimensions**: `relative w-full min-h-[460px] sm:min-h-[500px]`
- **Next.js Image Props**: `fill priority sizes="100vw" className="object-cover object-center scale-105"`
- **Aspect Ratio**: Viewport cover
- **Object Fit / Position**: `object-cover`, `object-center`
- **Recommended Upload**: `2560 × 1440 px` (16:9 Landscape), WebP/JPEG.

---

### 8.4 Things to Do Experience Cards
- **Component**: [`src/app/bucket-list/things-to-do/page.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/app/bucket-list/things-to-do/page.tsx)
- **Route / Page**: `/bucket-list/things-to-do`
- **Media Type**: Curated Activity Photography
- **Container Dimensions**: `relative w-full h-52 overflow-hidden` (208 px height)
- **Next.js Image Props**: `fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500"`
- **Aspect Ratio**: Responsive variable (~16:9 on mobile, ~16:10 on 3-col desktop)
- **Object Fit / Position**: `object-cover`, `center center`
- **Border Radius**: Top `rounded-t-2xl`
- **Recommended Upload**: `1600 × 1000 px` (16:10 Landscape), WebP/JPEG.

---

## 9. Comprehensive Media Specification Matrix

| Placement | Component | Media Type | Current Design Frame | Frame Ratio | object-fit | object-position | Mobile Behavior | Recommended Upload | Orientation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Navbar Logo** | `Navbar.tsx` | Raster PNG | 500 × 293 (max h-14/h-22) | 1.71:1 | `contain` | `left` | Responsive height | 1000 × 586 px | Landscape |
| **Footer Logo** | `Footer.tsx` | Raster PNG | 200 × 70 (h-12 to h-14) | 2.85:1 | `contain` | `left` | Fixed height | 600 × 210 px | Landscape |
| **Hero Background** | `HeroVideoBackground` | MP4 / JPG | Fullscreen `100dvh` | Responsive | `cover` | `center` | Vertical cover | 2560 × 1440 px (Video: 1080p) | Landscape |
| **Mountain Banner** | `WhyTravelWithUsSection` | PNG | Full `h-[180px-260px]` | ~7:1 | `cover` | `top` | Fixed height | 2560 × 420 px | Panorama |
| **Video Review Card** | `ClientStories.tsx` | Poster Image | `h-[280px-330px]` | ~4:3 to 16:10 | `cover` | `center` | Full width stack | 1200 × 900 px | Landscape |
| **Video Modal Player**| `ClientStories.tsx` | MP4 Video | `aspect-[16/9]` max 80vh | 16:9 | `contain` | `center` | 4:3 fallback | 1920 × 1080 px | Landscape |
| **Reviewer Avatar** | `ClientStories.tsx` | Headshot | 44 × 44 px | 1:1 | `cover` | `center` | 44 × 44 px | 400 × 400 px | Square |
| **Gallery Card** | `GalleryCard.tsx` | Photo | `aspect-[4/3]` | 4:3 | `cover` | `center` | 100vw width | 1600 × 1200 px | Landscape |
| **Gallery Lightbox** | `GalleryLightboxModal` | High-Res Photo | min-h-[260px-540px] | Responsive | `contain` (lg) | `center` | `cover` | 2048 × 1536 px | Landscape |
| **Package Card** | `PackageCard.tsx` | Tour Photo | `aspect-[16/10]` | 16:10 | `cover` | `center` | 100vw width | 1600 × 1000 px | Landscape |
| **Destination Card**| `DestinationCard.tsx` | Scenic Photo | `aspect-[16/10]` | 16:10 | `cover` | `center` | 100vw width | 1600 × 1000 px | Landscape |
| **Dest Hero Gallery** | `DestinationHeroGallery`| Scenic Photo | `aspect-[16/10]` | 16:10 / 16:9 | `cover` | `center` | 16:10 aspect | 1920 × 1200 px | Landscape |
| **Dest Thumbnails** | `DestinationHeroGallery`| Thumbnail Photo| 80 × 56 px / 64 × 48 px| ~4:3 | `cover` | `center` | Horizontal track | 320 × 240 px | Landscape |
| **Attraction Card** | `DestinationAttractionCard`| Attraction Photo | `aspect-[16/10]` / `4/3` | 16:10 | `cover` | `center` | 16:10 aspect | 1200 × 750 px | Landscape |
| **Vehicle Fleet Card**| `VehicleFleetGrid.tsx` | Vehicle Photo | `aspect-[16/10]` | 16:10 | `cover` | `center` | 100vw width | 1600 × 1000 px | Landscape |
| **Activity Card** | `ActivityCardsGrid.tsx`| Action Photo | `aspect-[16/10]` | 16:10 | `cover` | `center` | 100vw width | 1600 × 1000 px | Landscape |
| **Subpage Heroes** | `*Hero.tsx` | Scenic Banner | min-h-[480px-580px] | Responsive | `cover` | `center` | Fixed min-height | 2560 × 1440 px | Landscape |
| **Experience Card** | `things-to-do/page.tsx`| Activity Photo | `h-52` (208 px) | ~16:10 | `cover` | `center` | Full width stack | 1600 × 1000 px | Landscape |

---

## 10. Source Asset Audit Catalog

Below is the verified inventory of all existing local media files in the repository:

| File Path | Format | Dimensions | File Size | Primary Placement / Usage |
| :--- | :--- | :--- | :--- | :--- |
| `public/assets/client_logo.png` | PNG | 500 × 293 | 106 KB | Header Navbar & Footer Logo |
| `public/assets/hero.png` | PNG | 1672 × 941 | 2.30 MB | Hero Slide Background Poster |
| `public/assets/Logo_v2.png` | PNG | 1254 × 1254 | 651 KB | High-Res Square App Icon Asset |
| `public/assets/Logo_v3.png` | PNG | 1536 × 1024 | 1.28 MB | High-Res Landscape Brand Mark |
| `public/images/fleet/swift-dzire.jpg` | JPEG | 1264 × 848 | 959 KB | Vehicle Fleet Grid — Swift / Dzire |
| `public/images/fleet/innova-crysta.jpg` | JPEG | 1264 × 848 | 876 KB | Vehicle Fleet Grid — Innova Crysta |
| `public/images/fleet/fortuner.jpg` | JPEG | 1264 × 848 | 1.01 MB | Vehicle Fleet Grid — Fortuner 4x4 |
| `public/images/fleet/urbania.jpg` | JPEG | 1264 × 848 | 883 KB | Vehicle Fleet Grid — Force Urbania |
| `public/images/fleet/tempo-traveller.jpg`| JPEG | 1264 × 848 | 966 KB | Vehicle Fleet Grid — Tempo Traveller |
| `public/images/fleet/thar.jpg` | JPEG | 1264 × 848 | 941 KB | Vehicle Fleet Grid — Mahindra Thar 4x4 |
| `public/images/gallery/gulmarg-snow.jpg` | JPEG | 1200 × 896 | 1.01 MB | Gallery / Activities / Things to Do |
| `public/images/gallery/houseboat-kashmir.jpg`| JPEG | 1200 × 896 | 934 KB | Gallery / Shopping Hero / Houseboats |
| `public/images/gallery/pahalgam-valley.jpg` | JPEG | 1200 × 896 | 1.18 MB | Gallery / Transport Hero / Packages |
| `public/images/gallery/shikara-dal-lake.jpg` | JPEG | 1200 × 896 | 850 KB | Gallery / Travel Info Hero / Shikara |
| `public/images/gallery/sonmarg-glacier.jpg` | JPEG | 1200 × 896 | 1.18 MB | Gallery / Destinations Hero / Sonmarg |
| `public/images/gallery/kashmir-summit-view.png` | PNG | 1346 × 1168 | 2.22 MB | High-altitude panoramic showcase |
| `public/images/reviews/avatar_aditya.jpg`| JPEG | 1024 × 1024 | 626 KB | Client Written Review Avatar (Square) |
| `public/images/reviews/avatar_karan.jpg` | JPEG | 1024 × 1024 | 600 KB | Client Written Review Avatar (Square) |
| `public/images/reviews/avatar_neha.jpg` | JPEG | 1024 × 1024 | 631 KB | Client Written Review Avatar (Square) |
| `public/images/reviews/avatar_priya.jpg` | JPEG | 1024 × 1024 | 632 KB | Client Written Review Avatar (Square) |
| `public/images/reviews/poster_ayesha.jpg`| JPEG | 1376 × 768 | 849 KB | Video Review Poster (16:9) |
| `public/images/reviews/poster_rohit.jpg` | JPEG | 1200 × 896 | 910 KB | Video Review Poster (4:3) |
| `public/images/reviews/poster_sneha.jpg` | JPEG | 1200 × 896 | 937 KB | Video Review Poster (4:3) |
| `public/images/reviews/Review footer.png`| PNG | 2160 × 348 | 943 KB | Why Travel With Us Panoramic Mountains |
| `public/videos/review_demo.mp4` | MP4 | Video stream | 1.13 MB | Client Video Review Playback Modal |

---

## 11. Admin Panel Quality Warning Rules

The future Admin Panel media upload pipeline must evaluate all incoming media against the audited placement specifications using three distinct validation levels:

```
                  ┌────────────────────────┐
                  │ Admin Media File Input │
                  └───────────┬────────────┘
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
        [Passes Criteria]           [Fails Criteria]
               │                             │
       ┌───────┴────────┐            ┌───────┴────────┐
       ▼                ▼            ▼                ▼
     GOOD            WARNING      WARNING          CRITICAL
(Exact Match)   (Minor Crop)   (Low Resolution)  (Unusable / Tiny)
       │                │            │                │
       └────────────────┴──────┬─────┴────────────────┘
                               ▼
               ┌───────────────────────────────┐
               │    Preserve Frontend Frame    │
               │  (Card Dimensions Unchanged)  │
               └───────────────────────────────┘
```

### 1. `GOOD` (Green Status)
- **Criteria**:
  - Image/video orientation matches target placement.
  - Aspect ratio within ±3% of target ratio.
  - Resolution meets or exceeds recommended minimum resolution.
  - Accepted format: `.webp`, `.jpg`, `.jpeg`, `.png`, or `.mp4`.
- **Admin UI Message**:  
  `✓ Recommended for this placement. Perfect dimensions and aspect ratio.`

### 2. `WARNING` (Amber Status)
- **Criteria**:
  - Aspect ratio differs (e.g., admin uploads a 1:1 square or 16:9 photo for a 16:10 package card), which will result in edge cropping.
  - Resolution is lower than recommended but higher than 50% of target width.
- **Admin UI Message**:  
  `⚠ Crop Notice: Uploaded aspect ratio differs from target [16:10]. Outer edges will be cropped to preserve the layout frame.`  
  *Recommendation: Upload [Recommended Width] × [Recommended Height] [Landscape/Portrait/Square] for optimal presentation.*

### 3. `CRITICAL` (Red Status)
- **Criteria**:
  - Resolution is less than 50% of target container width (e.g., uploading a 200px thumbnail for a hero banner).
  - Severe pixelation or blur is guaranteed.
  - Unsupported container format.
- **Admin UI Message**:  
  `⚠ Low Quality Warning: This image is too small ([Width] × [Height] px) and will appear blurry or distorted. Minimum recommended: [Recommended Width] × [Recommended Height] px.`

---

## 12. Auto-Crop & Card Frame Invariance Principle

A non-negotiable architectural rule for the future Admin Panel:

> **THE FRONTEND CARD DIMENSIONS CONTROL THE MEDIA; MEDIA NEVER CONTROLS THE CARD.**

1. If an admin uploads a portrait photo (9:16) for a 16:10 package card:
   - The card **MUST NOT** grow vertically.
   - The card **MUST NOT** break the grid alignment of neighboring cards.
   - The system applies smart focal-point cropping or center-cropping within the **exact, unyielding 16:10 container**.
2. If an admin uploads an image with transparent padding or incorrect margins:
   - The `object-cover` container property remains active.
   - Surrounding card padding, typography, pricing rows, and CTA buttons remain pixel-locked.

---

## 13. Conceptual Future Media Placement Schema

*(Note: This schema is documented for the future Admin Panel backend/CMS integration. No current frontend code has been modified).*

```typescript
export interface MediaPlacementSpec {
  id: string;
  name: string;
  mediaType: 'image' | 'video';
  targetAspectRatio: string; // e.g. '16:10', '4:3', '1:1', 'responsive'
  orientation: 'landscape' | 'portrait' | 'square' | 'panoramic' | 'responsive';
  minWidth: number;
  minHeight: number;
  recommendedWidth: number;
  recommendedHeight: number;
  acceptedFormats: string[];
  objectFit: 'cover' | 'contain';
  objectPosition: string;
}

export const MEDIA_PLACEMENT_REGISTRY: Record<string, MediaPlacementSpec> = {
  packageCard: {
    id: 'packageCard',
    name: 'Tour Package Card',
    mediaType: 'image',
    targetAspectRatio: '16:10',
    orientation: 'landscape',
    minWidth: 800,
    minHeight: 500,
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    acceptedFormats: ['image/jpeg', 'image/webp', 'image/png'],
    objectFit: 'cover',
    objectPosition: 'center',
  },
  destinationCard: {
    id: 'destinationCard',
    name: 'Destination Overview Card',
    mediaType: 'image',
    targetAspectRatio: '16:10',
    orientation: 'landscape',
    minWidth: 800,
    minHeight: 500,
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    acceptedFormats: ['image/jpeg', 'image/webp', 'image/png'],
    objectFit: 'cover',
    objectPosition: 'center',
  },
  galleryCard: {
    id: 'galleryCard',
    name: 'Guest Story Gallery Photo',
    mediaType: 'image',
    targetAspectRatio: '4:3',
    orientation: 'landscape',
    minWidth: 800,
    minHeight: 600,
    recommendedWidth: 1600,
    recommendedHeight: 1200,
    acceptedFormats: ['image/jpeg', 'image/webp', 'image/png'],
    objectFit: 'cover',
    objectPosition: 'center',
  },
  vehicleFleetCard: {
    id: 'vehicleFleetCard',
    name: 'Transport Vehicle Fleet Card',
    mediaType: 'image',
    targetAspectRatio: '16:10',
    orientation: 'landscape',
    minWidth: 800,
    minHeight: 500,
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    acceptedFormats: ['image/jpeg', 'image/webp', 'image/png'],
    objectFit: 'cover',
    objectPosition: 'center',
  },
  reviewVideoModal: {
    id: 'reviewVideoModal',
    name: 'Client Review Video Playback',
    mediaType: 'video',
    targetAspectRatio: '16:9',
    orientation: 'landscape',
    minWidth: 1280,
    minHeight: 720,
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    acceptedFormats: ['video/mp4'],
    objectFit: 'contain',
    objectPosition: 'center',
  },
  reviewerAvatar: {
    id: 'reviewerAvatar',
    name: 'Reviewer Profile Headshot',
    mediaType: 'image',
    targetAspectRatio: '1:1',
    orientation: 'square',
    minWidth: 88,
    minHeight: 88,
    recommendedWidth: 400,
    recommendedHeight: 400,
    acceptedFormats: ['image/jpeg', 'image/webp', 'image/png'],
    objectFit: 'cover',
    objectPosition: 'center',
  },
  pageHeroBanner: {
    id: 'pageHeroBanner',
    name: 'Subpage Hero Scenic Banner',
    mediaType: 'image',
    targetAspectRatio: '16:9',
    orientation: 'landscape',
    minWidth: 1920,
    minHeight: 1080,
    recommendedWidth: 2560,
    recommendedHeight: 1440,
    acceptedFormats: ['image/jpeg', 'image/webp'],
    objectFit: 'cover',
    objectPosition: 'center',
  },
};
```

---

## 14. CURRENT UI MEDIA CONTRACT

> ### 🔒 THE CURRENT FRONTEND MEDIA FRAMES ARE LOCKED
> 
> 1. **No Design Alterations**: The dimensions, aspect ratios, CSS classes, responsive breakpoints, and cropping rules documented in this specification represent the canonical state of **The Indian Wings Company** website.
> 2. **Contractual Compliance for Future Admin Panel**:
>    - The future Admin Panel media upload system must validate all user assets against this exact contract.
>    - The Admin Panel will warn users if uploaded assets do not match recommended ratios or resolutions.
>    - The Admin Panel may auto-crop or auto-fit assets upon admin confirmation, but the **frontend card frames will never change their layout, aspect ratio, or height to fit non-compliant media**.
> 3. **Preservation of Visual Hierarchy**: By adhering to this media contract, new destinations, packages, fleet vehicles, and gallery reviews can be uploaded dynamically through the future CMS without risking layout shifts, misaligned grids, or compromised aesthetics.
