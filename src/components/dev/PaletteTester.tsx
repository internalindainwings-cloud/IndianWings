'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Palette, Check, X, Sparkles, Search, Zap } from 'lucide-react';

interface OneClickTheme {
  id: string;
  name: string;
  category: 'Signature Classics' | 'Heritage & Gold' | 'Alpine & Nature' | 'Dusk & Jewel' | 'Espresso & Hearth' | 'Modern Contrast';
  accentHex: string;
  accentName: string;
  navHex: string;
  navName: string;
  tagline: string;
}

interface DesignerPalette {
  id: string;
  name: string;
  hex: string;
  category: 'Saffron & Sun' | 'Imperial Gold' | 'Alpine Nature' | 'Flora & Dusk' | 'Neon Vibrant' | 'Deep Blue';
  tagline: string;
  meaning: string;
}

interface NavColorOption {
  id: string;
  name: string;
  hex: string;
  category: 'Navies' | 'Forest' | 'Jewel' | 'Espresso' | 'Teal' | 'Blacks';
  tagline: string;
}

// ── 60 CURATED 1-CLICK MASTER THEMES (Accent + Nav Combined) ──
const ONE_CLICK_THEMES: OneClickTheme[] = [
  // ── 1. SIGNATURE CLASSICS & SAFFRON (10) ──
  {
    id: 'theme-marigold-alpine-cyan',
    name: 'Mughal Marigold & High Alpine Cyan',
    category: 'Signature Classics',
    accentHex: '#F59E0B',
    accentName: 'Mughal Marigold',
    navHex: '#0F4C54',
    navName: 'High Alpine Cyan Shadow',
    tagline: 'Electric mineral spring water glowing at dawn & warm marigold',
  },
  {
    id: 'theme-mulberry-dal-midnight',
    name: 'Dal Lake Midnight & Mulberry Plum',
    category: 'Signature Classics',
    accentHex: '#9333EA',
    accentName: 'Himalayan Mulberry Plum',
    navHex: '#10355A',
    navName: 'Dal Lake Deep Midnight',
    tagline: 'Luminous starry water reflections over Dal Lake',
  },
  {
    id: 'theme-royal-saffron-midnight',
    name: 'Royal Saffron & Midnight Navy',
    category: 'Signature Classics',
    accentHex: '#F5A623',
    accentName: 'Pampore Kesar Gold',
    navHex: '#0B1F2A',
    navName: 'Signature Midnight Navy',
    tagline: 'The Indian Wings Official Brand Classic',
  },
  {
    id: 'theme-sunset-twilight',
    name: 'Himalayan Sunset & Deep Navy',
    category: 'Signature Classics',
    accentHex: '#F97316',
    accentName: 'Vivid Sunset Saffron',
    navHex: '#07141E',
    navName: 'Pir Panjal Deep Navy',
    tagline: 'High-Energy WanderKashmir Contrast',
  },
  {
    id: 'theme-chinar-amber-sapphire',
    name: 'Autumn Chinar & Royal Sapphire',
    category: 'Signature Classics',
    accentHex: '#EAB308',
    accentName: 'Autumn Chinar Amber',
    navHex: '#0A192F',
    navName: 'Royal Dal Sapphire',
    tagline: 'Golden Leaf Reflections over Deep Sapphire Water',
  },
  {
    id: 'theme-alpenglow-indigo',
    name: 'Alpenglow Apricot & Alpine Indigo',
    category: 'Signature Classics',
    accentHex: '#FB923C',
    accentName: 'Alpenglow Apricot',
    navHex: '#0C162C',
    navName: 'High Alpine Indigo',
    tagline: 'Dawn Sun Peak Glow & Starry Mountain Skies',
  },
  {
    id: 'theme-terracotta-prussian',
    name: 'Terracotta Sunburst & Prussian Twilight',
    category: 'Signature Classics',
    accentHex: '#FF6B35',
    accentName: 'Terracotta Sunburst',
    navHex: '#081926',
    navName: 'Prussian Twilight',
    tagline: 'Warm Mountain Mud Brick & Deep Oceanic Dusk',
  },
  {
    id: 'theme-marigold-celestial',
    name: 'Mughal Marigold & Celestial Night',
    category: 'Signature Classics',
    accentHex: '#F59E0B',
    accentName: 'Mughal Marigold',
    navHex: '#0D1B2A',
    navName: 'Celestial Twilight',
    tagline: 'Warm Kashmiri Hospitality & Clear Night',
  },
  {
    id: 'theme-raw-honey-harbor',
    name: 'Himalayan Honey & Shikara Harbor',
    category: 'Signature Classics',
    accentHex: '#D97706',
    accentName: 'Himalayan Raw Honey',
    navHex: '#0E2A38',
    navName: 'Shikara Harbor Blue',
    tagline: 'Wildflower Mountain Amber & Teal Harbor',
  },
  {
    id: 'theme-ladakh-apricot-arctic',
    name: 'Ladakh Apricot & Arctic Deep Sea',
    category: 'Signature Classics',
    accentHex: '#FDBA74',
    accentName: 'Ladakh Apricot Glow',
    navHex: '#0A2540',
    navName: 'Arctic Deep Sea',
    tagline: 'Pastel Orchard Sunlight & Nautical Marine',
  },
  {
    id: 'theme-golden-hour-cobalt',
    name: 'Golden Hour & Kashmiri Cobalt',
    category: 'Signature Classics',
    accentHex: '#F59E0B',
    accentName: 'Golden Hour Shikara',
    navHex: '#0F1E36',
    navName: 'Kashmiri Cobalt Night',
    tagline: 'Evening Sun Shimmer & Rich Royal Cobalt',
  },
  {
    id: 'theme-saffron-blaze-obsidian',
    name: 'Alpine Saffron Blaze & Pitch Obsidian',
    category: 'Signature Classics',
    accentHex: '#EA580C',
    accentName: 'Alpine Saffron Blaze',
    navHex: '#05080A',
    navName: 'Pitch Obsidian Black',
    tagline: 'High-Impact Burning Saffron & Pure Black',
  },

  // ── 2. HERITAGE & IMPERIAL GOLD (10) ──
  {
    id: 'theme-imperial-gold-onyx',
    name: 'Mughal Imperial Gold & Velvet Onyx',
    category: 'Heritage & Gold',
    accentHex: '#D4AF37',
    accentName: 'Mughal Imperial Gold',
    navHex: '#0A0A0C',
    navName: 'Pure Velvet Onyx',
    tagline: '5-Star Heritage Palace Royalty',
  },
  {
    id: 'theme-champagne-carbon',
    name: 'Champagne Silk & Space Carbon',
    category: 'Heritage & Gold',
    accentHex: '#E5C158',
    accentName: 'Champagne Pashmina Silk',
    navHex: '#121318',
    navName: 'Space Carbon Black',
    tagline: 'Understated Boutique Luxury & Handwoven Sheen',
  },
  {
    id: 'theme-samovar-walnut',
    name: 'Antique Copper & Houseboat Walnut',
    category: 'Heritage & Gold',
    accentHex: '#C27835',
    accentName: 'Antique Samovar Copper',
    navHex: '#1A120B',
    navName: 'Smoked Kashmiri Walnut',
    tagline: 'Carved Kehwa Samovar & Warm Cedar Wood',
  },
  {
    id: 'theme-walnut-cocoa',
    name: 'Walnut Bronze & Roasted Cocoa',
    category: 'Heritage & Gold',
    accentHex: '#A16207',
    accentName: 'Kashmiri Walnut Bronze',
    navHex: '#16100D',
    navName: 'Roasted Cocoa Noir',
    tagline: 'Hand-Carved Walnut Ceilings & Rich Earth',
  },
  {
    id: 'theme-rose-gold-graphite',
    name: 'Rose Gold Mirage & Dark Graphite',
    category: 'Heritage & Gold',
    accentHex: '#E07A5F',
    accentName: 'Rose Gold Mirage',
    navHex: '#181A20',
    navName: 'Dark Graphite Mineral',
    tagline: 'Contemporary Blush Metallic & Sleek Graphite',
  },
  {
    id: 'theme-royal-brass-titanium',
    name: 'Antique Royal Brass & Matte Titanium',
    category: 'Heritage & Gold',
    accentHex: '#CA8A04',
    accentName: 'Antique Royal Brass',
    navHex: '#14161B',
    navName: 'Matte Titanium Jet',
    tagline: 'Burnished Palace Lanterns & Architectural Dark',
  },
  {
    id: 'theme-tilla-volcanic',
    name: 'Handwoven Tilla & Volcanic Ash',
    category: 'Heritage & Gold',
    accentHex: '#E6C280',
    accentName: 'Handwoven Tilla Gold',
    navHex: '#111317',
    navName: 'Deep Volcanic Ash',
    tagline: 'Royal Zari Thread Embroidery & Matte Charcoal',
  },
  {
    id: 'theme-liquid-gold-mirror',
    name: 'Liquid Sun Gold & Obsidian Mirror',
    category: 'Heritage & Gold',
    accentHex: '#C59B27',
    accentName: 'Liquid Sun Gold',
    navHex: '#030507',
    navName: 'Obsidian Mirror',
    tagline: 'High-Society Gilded Luxury & Jet Black',
  },
  {
    id: 'theme-coppersmith-cedar',
    name: 'Zaina Kadal Copper & Antique Cedar',
    category: 'Heritage & Gold',
    accentHex: '#B45309',
    accentName: 'Zaina Kadal Coppersmith',
    navHex: '#22160E',
    navName: 'Antique Houseboat Cedar',
    tagline: 'Hammered Artisan Copper & Nagin Lake Houseboats',
  },
  {
    id: 'theme-dulcet-ebonite',
    name: 'Dulcet Champagne & Ebonite Midnight',
    category: 'Heritage & Gold',
    accentHex: '#F3DFA2',
    accentName: 'Dulcet Champagne Luster',
    navHex: '#08090C',
    navName: 'Ebonite Midnight',
    tagline: 'Whisper-Quiet Platinum & Deep Minimalist Base',
  },

  // ── 3. ALPINE VALLEYS & MOUNTAIN WATERS (12) ──
  {
    id: 'theme-alpine-emerald-forest',
    name: 'Alpine Emerald & Pine Forest',
    category: 'Alpine & Nature',
    accentHex: '#10B981',
    accentName: 'Himalayan Alpine Emerald',
    navHex: '#061C16',
    navName: 'Himalayan Forest Night',
    tagline: 'Betaab Valley Pine Mountain Sanctuary',
  },
  {
    id: 'theme-dal-sapphire-indigo',
    name: 'Dal Lake Azure & High Indigo',
    category: 'Alpine & Nature',
    accentHex: '#0284C7',
    accentName: 'Dal Lake Royal Azure',
    navHex: '#0C162C',
    navName: 'High Alpine Indigo',
    tagline: 'Crystal Dal Waters Under Clear Starry Night',
  },
  {
    id: 'theme-glacial-turquoise-atlantic',
    name: 'Thajiwas Turquoise & Glacial Abyss',
    category: 'Alpine & Nature',
    accentHex: '#06B6D4',
    accentName: 'Thajiwas Glacial Turquoise',
    navHex: '#051923',
    navName: 'Glacial Abyss Navy',
    tagline: 'Sonamarg Melting Glaciers & Pure Mountain Streams',
  },
  {
    id: 'theme-deodar-spruce',
    name: 'Deodar Jade & Mountain Spruce',
    category: 'Alpine & Nature',
    accentHex: '#0D9488',
    accentName: 'Deep Deodar Forest Jade',
    navHex: '#08241D',
    navName: 'Betaab Valley Spruce',
    tagline: 'Ancient Coniferous Valley Mist & Fresh Breeze',
  },
  {
    id: 'theme-indus-pine-needle',
    name: 'Indus Glacial Teal & Pine Needle',
    category: 'Alpine & Nature',
    accentHex: '#0891B2',
    accentName: 'Indus Glacial Teal',
    navHex: '#051A13',
    navName: 'Pine Needle Midnight',
    tagline: 'Rushing Himalayan River & Dense Pine Needles',
  },
  {
    id: 'theme-doodhpathri-mint-moss',
    name: 'Doodhpathri Mint & Deep Moss',
    category: 'Alpine & Nature',
    accentHex: '#14B8A6',
    accentName: 'Doodhpathri Spring Mint',
    navHex: '#0A261D',
    navName: 'Deep Moss Sanctum',
    tagline: 'Meadows of Milk Soft Grass & Shaded Sanctum',
  },
  {
    id: 'theme-naranag-nordic',
    name: 'Naranag Glacier Cyan & Nordic Evergreen',
    category: 'Alpine & Nature',
    accentHex: '#38BDF8',
    accentName: 'Naranag Glacier Cyan',
    navHex: '#0B2E24',
    navName: 'Nordic Evergreen Night',
    tagline: 'Cascading Mountain Spring Water & High Pines',
  },
  {
    id: 'theme-lidder-arctic',
    name: 'Lidder Valley Aqua & Arctic Deep Sea',
    category: 'Alpine & Nature',
    accentHex: '#00A896',
    accentName: 'Lidder Valley Aqua',
    navHex: '#0A2540',
    navName: 'Arctic Deep Sea',
    tagline: 'Pahalgam Rapids & Oceanic Marine Depth',
  },
  {
    id: 'theme-betaab-ancient-deodar',
    name: 'Betaab Meadow Grass & Ancient Deodar',
    category: 'Alpine & Nature',
    accentHex: '#22C55E',
    accentName: 'Betaab Meadow Grass',
    navHex: '#07221A',
    navName: 'Ancient Deodar Sanctuary',
    tagline: 'High-Altitude Green Pastures & Sacred Cedars',
  },
  {
    id: 'theme-gangabal-aegean',
    name: 'Gangabal Alpine Blue & Aegean Midnight',
    category: 'Alpine & Nature',
    accentHex: '#0EA5E9',
    accentName: 'Gangabal Alpine Blue',
    navHex: '#091D2E',
    navName: 'Aegean Midnight',
    tagline: 'Harmukh Mountain Tarn & Deep Mediterranean Sky',
  },
  {
    id: 'theme-sonamarg-emerald-noir',
    name: 'Sonamarg Meadow & Emerald Noir',
    category: 'Alpine & Nature',
    accentHex: '#00E676',
    accentName: 'Vivid Emerald Pulse',
    navHex: '#041C14',
    navName: 'Emerald Noir',
    tagline: 'Electric Green Meadow Pop & Deepest Jewel Dark',
  },
  {
    id: 'theme-glacier-shadow-teal',
    name: 'Glacial Turquoise & Shadow Teal',
    category: 'Alpine & Nature',
    accentHex: '#06B6D4',
    accentName: 'Thajiwas Glacial Turquoise',
    navHex: '#051F20',
    navName: 'Shadow Teal Night',
    tagline: 'Luminescent Ice Glow & Oceanic Mountain Shadow',
  },

  // ── 4. CHINAR AUTUMN, FLORA & JEWELS (12) ──
  {
    id: 'theme-chinar-scarlet-wine',
    name: 'Autumn Chinar Scarlet & Wine Dusk',
    category: 'Dusk & Jewel',
    accentHex: '#E11D48',
    accentName: 'Chinar Velvet Crimson',
    navHex: '#1F0A18',
    navName: 'Kashmiri Wine Dusk',
    tagline: 'Naseem Bagh Autumn Passion & Twilight',
  },
  {
    id: 'theme-gulmarg-iris-plum',
    name: 'Gulmarg Wild Iris & Velvet Plum',
    category: 'Dusk & Jewel',
    accentHex: '#8B5CF6',
    accentName: 'Gulmarg Wildflower Iris',
    navHex: '#1A0B1A',
    navName: 'Imperial Velvet Plum',
    tagline: 'Meadow Wildflowers & Royal Court Amethyst',
  },
  {
    id: 'theme-lavender-mulberry',
    name: 'Dal Lavender Dusk & Twilight Mulberry',
    category: 'Dusk & Jewel',
    accentHex: '#A855F7',
    accentName: 'Dal Lake Lavender Dusk',
    navHex: '#1B0C2E',
    navName: 'Twilight Mulberry',
    tagline: 'Houseboat Evening Reflections & Purple Sky',
  },
  {
    id: 'theme-ruby-rose-garnet',
    name: 'Mughal Ruby Rose & Royal Garnet',
    category: 'Dusk & Jewel',
    accentHex: '#F43F5E',
    accentName: 'Mughal Ruby Rose',
    navHex: '#280B18',
    navName: 'Royal Garnet Noir',
    tagline: 'Imperial Terraced Gardens & Romantic Roses',
  },
  {
    id: 'theme-mulberry-jamawar',
    name: 'Mulberry Berry & Shahi Jamawar',
    category: 'Dusk & Jewel',
    accentHex: '#9333EA',
    accentName: 'Himalayan Mulberry Plum',
    navHex: '#200C16',
    navName: 'Shahi Jamawar Maroon',
    tagline: 'Precious Wool Dye & Heirloom Craftsmanship',
  },
  {
    id: 'theme-shalimar-aubergine',
    name: 'Shalimar Orchid & Maharaja Aubergine',
    category: 'Dusk & Jewel',
    accentHex: '#D946EF',
    accentName: 'Shalimar Garden Orchid',
    navHex: '#240A1F',
    navName: 'Maharaja Aubergine',
    tagline: 'Royal Fountains Floral Bloom & Deep Aubergine',
  },
  {
    id: 'theme-pampore-blossom-nocturne',
    name: 'Kesar Blossom & Nocturne Violet',
    category: 'Dusk & Jewel',
    accentHex: '#7C3AED',
    accentName: 'Pampore Kesar Blossom',
    navHex: '#120826',
    navName: 'Nocturne Violet',
    tagline: 'Iconic Purple Saffron Petals & Cosmic Violet',
  },
  {
    id: 'theme-shopian-apple-black-cherry',
    name: 'Shopian Apple & Black Cherry Noir',
    category: 'Dusk & Jewel',
    accentHex: '#DC2626',
    accentName: 'Shopian Apple Scarlet',
    navHex: '#230814',
    navName: 'Black Cherry Night',
    tagline: 'Crisp Valley Apple Harvest & Decadent Dark Cherry',
  },
  {
    id: 'theme-pir-panjal-amethyst',
    name: 'Pir Panjal Mauve & Royal Amethyst',
    category: 'Dusk & Jewel',
    accentHex: '#C084FC',
    accentName: 'Pir Panjal Twilight Mauve',
    navHex: '#170D24',
    navName: 'Royal Amethyst Shadow',
    tagline: 'Ethereal Snowfields Twilight & Deep Amethyst',
  },
  {
    id: 'theme-sunset-hibiscus-damask',
    name: 'Sunset Hibiscus & Mughal Damask',
    category: 'Dusk & Jewel',
    accentHex: '#FB7185',
    accentName: 'Kashmiri Sunset Hibiscus',
    navHex: '#220A14',
    navName: 'Mughal Damask Maroon',
    tagline: 'Warm Honeymoon Rose & Embroidered Silk Maroon',
  },
  {
    id: 'theme-wild-blackberry-boysenberry',
    name: 'Wild Blackberry & Deep Boysenberry',
    category: 'Dusk & Jewel',
    accentHex: '#9333EA',
    accentName: 'Himalayan Mulberry Plum',
    navHex: '#1E0B22',
    navName: 'Deep Boysenberry Shadow',
    tagline: 'Mountain Forest Berries & Sweet Dark Wine',
  },
  {
    id: 'theme-saffron-magenta-chinar-dusk',
    name: 'Petal Magenta & Chinar Autumn Dusk',
    category: 'Dusk & Jewel',
    accentHex: '#E11D48',
    accentName: 'Chinar Velvet Crimson',
    navHex: '#2A0E18',
    navName: 'Chinar Autumn Dusk',
    tagline: 'Late Autumn Chinar Leaves & Mountain Shadows',
  },

  // ── 5. ESPRESSO, WALNUT & HEARTH (8) ──
  {
    id: 'theme-espresso-sepia',
    name: 'Dark Espresso & Vintage Sepia',
    category: 'Espresso & Hearth',
    accentHex: '#F59E0B',
    accentName: 'Mughal Marigold',
    navHex: '#150F0B',
    navName: 'Dark Roasted Espresso',
    tagline: 'Steaming Kehwa Warmth & Roasted Mountain Beans',
  },
  {
    id: 'theme-bronze-walnut',
    name: 'Antique Bronze & Smoked Walnut',
    category: 'Espresso & Hearth',
    accentHex: '#C27835',
    accentName: 'Antique Samovar Copper',
    navHex: '#1C140A',
    navName: 'Antique Bronze Night',
    tagline: 'Warm Gilded Metal & Hand-Carved Houseboat Wood',
  },
  {
    id: 'theme-teak-peat',
    name: 'Charred Teak & Smoked Peat',
    category: 'Espresso & Hearth',
    accentHex: '#EA580C',
    accentName: 'Alpine Saffron Blaze',
    navHex: '#18110D',
    navName: 'Charred Himalayan Teak',
    tagline: 'Winter Hearth Fireplace & Earthen Smoke',
  },
  {
    id: 'theme-leather-umber-molasses',
    name: 'Rich Leather Umber & Molasses Dusk',
    category: 'Espresso & Hearth',
    accentHex: '#FB923C',
    accentName: 'Alpenglow Apricot',
    navHex: '#21150F',
    navName: 'Rich Leather Umber',
    tagline: 'Handcrafted Saddle Leather & Warm Mountain Soil',
  },
  {
    id: 'theme-golden-hearth-burnt-chestnut',
    name: 'Golden Hearth & Burnt Chestnut',
    category: 'Espresso & Hearth',
    accentHex: '#F5A623',
    accentName: 'Pampore Kesar Gold',
    navHex: '#231709',
    navName: 'Golden Hearth Shadow',
    tagline: 'Glowing Fireplace Amber & Winter Roasted Nuts',
  },
  {
    id: 'theme-cocoa-sheesham',
    name: 'Roasted Cocoa & Old Sheesham',
    category: 'Espresso & Hearth',
    accentHex: '#D4AF37',
    accentName: 'Mughal Imperial Gold',
    navHex: '#17100A',
    navName: 'Old Sheesham Wood',
    tagline: 'Decadent Dark Chocolate & Polished Indian Timber',
  },
  {
    id: 'theme-kangri-embers',
    name: 'Kangri Charcoal Embers & Mud Hearth',
    category: 'Espresso & Hearth',
    accentHex: '#FF6B35',
    accentName: 'Terracotta Sunburst',
    navHex: '#1D120B',
    navName: 'Kangri Charcoal Embers',
    tagline: 'Wicker Kangri Earthen Glow & Cozy Winter Blanket',
  },
  {
    id: 'theme-cedar-peat-glow',
    name: 'Houseboat Cedar & Peat Hearth',
    category: 'Espresso & Hearth',
    accentHex: '#E5C158',
    accentName: 'Champagne Pashmina Silk',
    navHex: '#19120E',
    navName: 'Smoked Peat Hearth',
    tagline: 'Aged Houseboat Woodwork & Cozy Lakeside Cabin',
  },

  // ── 6. MODERN HIGH-CONTRAST & AIRLINE TECH (8) ──
  {
    id: 'theme-aerospace-ocean',
    name: 'Aerospace Flight & Slate Ocean',
    category: 'Modern Contrast',
    accentHex: '#2563EB',
    accentName: 'Aerospace Cobalt Blue',
    navHex: '#0F172A',
    navName: 'Slate Ocean Abyss',
    tagline: 'Modern Airline Wings & Boundless Travel',
  },
  {
    id: 'theme-cyber-saffron-obsidian',
    name: 'Cyber Neon Saffron & Obsidian Pitch',
    category: 'Modern Contrast',
    accentHex: '#FF9100',
    accentName: 'Cyber Neon Saffron',
    navHex: '#05080A',
    navName: 'Pitch Obsidian Black',
    tagline: 'Ultra High-Visibility Peak Conversion Tone',
  },
  {
    id: 'theme-electric-cyan-onyx',
    name: 'Electric Cyan & Velvet Onyx',
    category: 'Modern Contrast',
    accentHex: '#00E5FF',
    accentName: 'Electric Glacial Cyan',
    navHex: '#0A0A0C',
    navName: 'Pure Velvet Onyx',
    tagline: 'Futuristic Glacial Glow & Pitch Darkness',
  },
  {
    id: 'theme-mountain-coral-titanium',
    name: 'Mountain Coral & Matte Titanium',
    category: 'Modern Contrast',
    accentHex: '#FF5722',
    accentName: 'Mountain Coral Fire',
    navHex: '#14161B',
    navName: 'Matte Titanium Jet',
    tagline: 'Adventure Trekker & Athletic Luxury Contrast',
  },
  {
    id: 'theme-alpine-ultraviolet-carbon',
    name: 'Alpine Ultra Violet & Space Carbon',
    category: 'Modern Contrast',
    accentHex: '#6366F1',
    accentName: 'Alpine Ultra Violet',
    navHex: '#121318',
    navName: 'Space Carbon Black',
    tagline: 'Silicon-Valley Innovation Meets Himalayan Heights',
  },
  {
    id: 'theme-radiant-solar-carbon-nano',
    name: 'Radiant Solar Amber & Carbon Nano',
    category: 'Modern Contrast',
    accentHex: '#FFAB00',
    accentName: 'Radiant Solar Amber',
    navHex: '#07090E',
    navName: 'Carbon Nano Shadow',
    tagline: 'Razor-Sharp Sunburst Against Deep Stealth Carbon',
  },
  {
    id: 'theme-emerald-pulse-basalt',
    name: 'Vivid Emerald Pulse & Basalt Jet',
    category: 'Modern Contrast',
    accentHex: '#00E676',
    accentName: 'Vivid Emerald Pulse',
    navHex: '#0C0E12',
    navName: 'Basalt Jet Noir',
    tagline: 'Electric Green Neon Energy & Volcanic Stone',
  },
  {
    id: 'theme-aegean-deep-trench',
    name: 'Aegean High-Sky & Deep Trench',
    category: 'Modern Contrast',
    accentHex: '#1D4ED8',
    accentName: 'Aegean High-Sky',
    navHex: '#081420',
    navName: 'Deep Atlantic Trench',
    tagline: 'Pure Stratosphere Blue & Oceanic Abyss',
  },
];


// ── 52 CURATED DESIGNER ACCENT PALETTES ──
const DESIGNER_PALETTES: DesignerPalette[] = [
  { id: 'pampore-kesar', name: 'Pampore Kesar Gold', hex: '#F5A623', category: 'Saffron & Sun', tagline: 'Asli Pampore Saffron & Golden Sun', meaning: 'Barf par sunehri dhoop aur Kashmiri Kesar warmth.' },
  { id: 'sunset-saffron', name: 'Vivid Sunset Saffron', hex: '#F97316', category: 'Saffron & Sun', tagline: 'High-Energy Himalayan Twilight', meaning: 'Modern, high-contrast travel aesthetic.' },
  { id: 'autumn-chinar-amber', name: 'Autumn Chinar Amber', hex: '#EAB308', category: 'Saffron & Sun', tagline: 'Golden Valley Foliage', meaning: 'Naseem Bagh chinar radiant autumn glow.' },
  { id: 'alpenglow-apricot', name: 'Alpenglow Apricot', hex: '#FB923C', category: 'Saffron & Sun', tagline: 'Rosy-Gold Snow Peak Glow', meaning: 'Subah ki pehli kiran jo chotiyon par gulaabi asar chhodti hai.' },
  { id: 'terracotta-sunburst', name: 'Terracotta Sunburst', hex: '#FF6B35', category: 'Saffron & Sun', tagline: 'Warm Mountain Clay & Fire', meaning: 'Rustic Himalayan mud houses & kangri embers.' },
  { id: 'mughal-marigold', name: 'Mughal Marigold', hex: '#F59E0B', category: 'Saffron & Sun', tagline: 'Ceremonial Welcoming Yellow', meaning: 'Traditional Kashmiri hospitality & royal garden blooms.' },
  { id: 'himalayan-honey', name: 'Himalayan Raw Honey', hex: '#D97706', category: 'Saffron & Sun', tagline: 'Deep Amber Forest Honey', meaning: 'Rich wildflower nectar & deep organic sweetness.' },
  { id: 'solar-apricot-glow', name: 'Ladakh Apricot Glow', hex: '#FDBA74', category: 'Saffron & Sun', tagline: 'Soft Pastel Sunlit Orchard', meaning: 'High-altitude apricot blossoms in crystal sunshine.' },
  { id: 'golden-hour-amber', name: 'Golden Hour Shikara', hex: '#F59E0B', category: 'Saffron & Sun', tagline: 'Dal Lake Sunset Reflections', meaning: 'Golden reflections dancing across Dal Lake waters.' },
  { id: 'saffron-blaze', name: 'Alpine Saffron Blaze', hex: '#EA580C', category: 'Saffron & Sun', tagline: 'High-Impact Burning Amber', meaning: 'High-octane energetic contrast for maximum conversion.' },

  { id: 'imperial-gold', name: 'Mughal Imperial Gold', hex: '#D4AF37', category: 'Imperial Gold', tagline: 'Palace Antique Liquid Gold', meaning: 'Timeless 5-star royalty & heritage craftsmanship.' },
  { id: 'champagne-silk', name: 'Champagne Pashmina Silk', hex: '#E5C158', category: 'Imperial Gold', tagline: 'Understated Boutique Luxury', meaning: 'Subtle high-end Aman-resort style quiet luxury.' },
  { id: 'samovar-copper', name: 'Antique Samovar Copper', hex: '#C27835', category: 'Imperial Gold', tagline: 'Carved Copper Kahwa Vessel', meaning: 'Centuries-old Kashmiri coppersmith art & kehwa rituals.' },
  { id: 'walnut-bronze', name: 'Kashmiri Walnut Bronze', hex: '#A16207', category: 'Imperial Gold', tagline: 'Hand-Carved Walnut Woodwork', meaning: 'Heritage houseboats & carved walnut ceilings.' },
  { id: 'rose-gold-mirage', name: 'Rose Gold Mirage', hex: '#E07A5F', category: 'Imperial Gold', tagline: 'Modern Chic Sunset Metallic', meaning: 'Contemporary luxury blend of warm copper & soft blush.' },
  { id: 'royal-brass', name: 'Antique Royal Brass', hex: '#CA8A04', category: 'Imperial Gold', tagline: 'Burnished Palace Hardware', meaning: 'Heirloom brass vessels & carved lanterns.' },
  { id: 'kashmiri-tilla', name: 'Handwoven Tilla Gold', hex: '#E6C280', category: 'Imperial Gold', tagline: 'Royal Zari Thread Work', meaning: 'Delicate metallic gold embroidery on luxury bridal pherans.' },
  { id: 'venetian-liquid-gold', name: 'Liquid Sun Gold', hex: '#C59B27', category: 'Imperial Gold', tagline: 'High-Society Gilded Luster', meaning: 'Gilded palace mirrors & grand chandeliers.' },
  { id: 'coppersmith-glaze', name: 'Zaina Kadal Coppersmith', hex: '#B45309', category: 'Imperial Gold', tagline: 'Hammered Copper Glaze', meaning: 'Old Srinagar artisans hand-hammered cooking copper.' },
  { id: 'dulcet-champagne', name: 'Dulcet Champagne Luster', hex: '#F3DFA2', category: 'Imperial Gold', tagline: 'Softest Platinum Champagne', meaning: 'Whisper-quiet luxury for subtle, refined aesthetics.' },

  { id: 'alpine-emerald', name: 'Himalayan Alpine Emerald', hex: '#10B981', category: 'Alpine Nature', tagline: 'Betaab Valley Pine Green', meaning: 'Lush evergreen pine slopes & fresh mountain breeze.' },
  { id: 'forest-jade', name: 'Deep Deodar Forest Jade', hex: '#0D9488', category: 'Alpine Nature', tagline: 'Ancient Deodar Sanctuary', meaning: 'Dense devdar jangalon ki mystical tranquility.' },
  { id: 'dal-azure', name: 'Dal Lake Royal Azure', hex: '#0284C7', category: 'Alpine Nature', tagline: 'Serene Shikara Lake Waters', meaning: 'Crystal-clear neela aakash aur shant paani.' },
  { id: 'glacial-turquoise', name: 'Thajiwas Glacial Turquoise', hex: '#06B6D4', category: 'Alpine Nature', tagline: 'Pure Sonamarg Melting Ice', meaning: 'Electric vibrant cyan glacial sparkle.' },
  { id: 'indus-teal', name: 'Indus Glacial Teal', hex: '#0891B2', category: 'Alpine Nature', tagline: 'Rushing Himalayan River', meaning: 'Mountain river energy, raw nature & freshness.' },
  { id: 'spring-mint', name: 'Doodhpathri Spring Mint', hex: '#14B8A6', category: 'Alpine Nature', tagline: 'Meadows of Milk Fresh Green', meaning: 'Doodhpathri ki narm hari ghaas & behti nadiya.' },
  { id: 'naranag-cyan', name: 'Naranag Glacier Cyan', hex: '#38BDF8', category: 'Alpine Nature', tagline: 'Crystal Mountain Stream', meaning: 'Pure spring water cascading down ancient temple ruins.' },
  { id: 'lidder-aqua', name: 'Lidder Valley Aqua', hex: '#00A896', category: 'Alpine Nature', tagline: 'Pahalgam River Rapids', meaning: 'Pahalgam trout streams & rushing snowmelt currents.' },
  { id: 'betaab-meadow', name: 'Betaab Meadow Grass', hex: '#22C55E', category: 'Alpine Nature', tagline: 'Fresh High-Altitude Pastures', meaning: 'Sunlit meadows surrounded by snow peaks.' },
  { id: 'gangabal-blue', name: 'Gangabal Alpine Blue', hex: '#0EA5E9', category: 'Alpine Nature', tagline: 'Sacred High-Altitude Tarn', meaning: 'Harmukh mountain base lake with piercing blue depths.' },

  { id: 'wildflower-iris', name: 'Gulmarg Wildflower Iris', hex: '#8B5CF6', category: 'Flora & Dusk', tagline: 'Alpine Bloom & Meadow Irises', meaning: 'Jungli violet phool & high-altitude charm.' },
  { id: 'lavender-twilight', name: 'Dal Lake Lavender Dusk', hex: '#A855F7', category: 'Flora & Dusk', tagline: 'Houseboat Evening Glow', meaning: 'Pir Panjal par bikharta hua romantic baingani shaam.' },
  { id: 'chinar-crimson', name: 'Chinar Velvet Crimson', hex: '#E11D48', category: 'Flora & Dusk', tagline: 'Shalimar Autumn Scarlet', meaning: 'October chinar drakht jab aag jaise laal ho jaate hain.' },
  { id: 'kashmiri-ruby-rose', name: 'Mughal Ruby Rose', hex: '#F43F5E', category: 'Flora & Dusk', tagline: 'Royal Garden Rose Bloom', meaning: 'Mughal baghoon ke taaza gulaab & carpet scarlet.' },
  { id: 'mulberry-plum', name: 'Himalayan Mulberry Plum', hex: '#9333EA', category: 'Flora & Dusk', tagline: 'Deep Imperial Berry Dye', meaning: 'Pashmina shawl embroidery shahi jamuni-plum rang.' },
  { id: 'shalimar-orchid', name: 'Shalimar Garden Orchid', hex: '#D946EF', category: 'Flora & Dusk', tagline: 'Terraced Garden Blooms', meaning: 'Fountain terraces framed by exotic floral blossoms.' },
  { id: 'saffron-blossom-purple', name: 'Pampore Kesar Blossom', hex: '#7C3AED', category: 'Flora & Dusk', tagline: 'Purple Crocus Flower Petals', meaning: 'Iconic purple petals shielding the golden saffron stigma.' },
  { id: 'shopian-apple-scarlet', name: 'Shopian Apple Scarlet', hex: '#DC2626', category: 'Flora & Dusk', tagline: 'Crisp Valley Harvest Apple', meaning: 'Ripe red Delicious apples harvested in orchards.' },
  { id: 'pir-panjal-mauve', name: 'Pir Panjal Twilight Mauve', hex: '#C084FC', category: 'Flora & Dusk', tagline: 'Ethereal Mountain Evening', meaning: 'Delicate twilight hues reflecting off snowfields.' },
  { id: 'sunset-hibiscus', name: 'Kashmiri Sunset Hibiscus', hex: '#FB7185', category: 'Flora & Dusk', tagline: 'Warm Romantic Evening Petal', meaning: 'Honeymoon couple aesthetics with welcoming soft warmth.' },

  { id: 'electric-cyan', name: 'Electric Glacial Cyan', hex: '#00E5FF', category: 'Neon Vibrant', tagline: 'High-Tech Modern Cyan Glow', meaning: 'Ultra-modern electric pop with razor contrast.' },
  { id: 'cyber-saffron', name: 'Cyber Neon Saffron', hex: '#FF9100', category: 'Neon Vibrant', tagline: 'Ultra High-Visibility Orange', meaning: 'Maximum click-through eye draw for conversion buttons.' },
  { id: 'radiant-solar-amber', name: 'Radiant Solar Amber', hex: '#FFAB00', category: 'Neon Vibrant', tagline: 'Piercing Mountain Sunlight', meaning: 'Crisp, razor-sharp yellow-amber brilliance.' },
  { id: 'mountain-coral-fire', name: 'Mountain Coral Fire', hex: '#FF5722', category: 'Neon Vibrant', tagline: 'Vibrant Sunset Volcano', meaning: 'Modern athletic adventure travel branding style.' },
  { id: 'ultraviolet-alpine', name: 'Alpine Ultra Violet', hex: '#6366F1', category: 'Neon Vibrant', tagline: 'Modern Digital Luxury', meaning: 'Contemporary Silicon-Valley aesthetic combined with Kashmir.' },
  { id: 'vivid-emerald-pulse', name: 'Vivid Emerald Pulse', hex: '#00E676', category: 'Neon Vibrant', tagline: 'Electric Pine Needle Green', meaning: 'High-contrast fresh nature pop for eco-tours & treks.' },

  { id: 'signature-midnight', name: 'Signature Midnight Navy', hex: '#0B1F2A', category: 'Deep Blue', tagline: 'The Indian Wings Official Brand Base', meaning: 'Himalayan night sky navy — authoritative corporate luxury.' },
  { id: 'kashmir-indigo', name: 'Royal Kashmir Indigo', hex: '#1E3A8A', category: 'Deep Blue', tagline: 'Starry Sky over Gulmarg', meaning: 'Deep indigo blue representing infinity & trust.' },
  { id: 'ocean-sapphire', name: 'Dal Ocean Sapphire', hex: '#163852', category: 'Deep Blue', tagline: 'Rich Navbar Accent Tone', meaning: 'Balanced aquatic blue giving subtle architectural elegance.' },
  { id: 'slate-mineral', name: 'Alpine Slate Blue', hex: '#3B82F6', category: 'Deep Blue', tagline: 'Vibrant Modern Tech-Luxury Blue', meaning: 'Clean, contemporary high-tech airline travel aesthetic.' },
  { id: 'cobalt-aerospace', name: 'Aerospace Cobalt Blue', hex: '#2563EB', category: 'Deep Blue', tagline: 'Flight & Wings Dynamic Blue', meaning: 'Aviation inspiration representing wings & boundless travel.' },
  { id: 'twilight-aegean', name: 'Aegean High-Sky', hex: '#1D4ED8', category: 'Deep Blue', tagline: 'Clear Mountain Horizon', meaning: 'Deep crystal blue sky visible above 10,000 feet elevation.' },
];

// ── 72 CURATED DESIGNER NAVBAR & BASE SHADES (RICH, VIBRANT & DISTINCT) ──
const NAV_BASE_OPTIONS: NavColorOption[] = [
  // ── 1. ROYAL NAVIES & MOUNTAIN BLUES (12) ──
  { id: 'nav-01', name: 'Signature Royal Navy', hex: '#0E2A47', category: 'Navies', tagline: 'Rich Himalayan royal blue — authoritative prestige' },
  { id: 'nav-02', name: 'Dal Lake Deep Midnight', hex: '#10355A', category: 'Navies', tagline: 'Luminous starry water reflections over Dal Lake' },
  { id: 'nav-03', name: 'Pir Panjal Alpine Cobalt', hex: '#123D6B', category: 'Navies', tagline: 'High altitude mountain ridge crisp blue' },
  { id: 'nav-04', name: 'Kashmiri Lapis Lazuli', hex: '#162E4A', category: 'Navies', tagline: 'Traditional semi-precious stone deep blue' },
  { id: 'nav-05', name: 'Starry Gulmarg Indigo', hex: '#1B2A4A', category: 'Navies', tagline: 'Clear sub-zero night skies over Gulmarg slopes' },
  { id: 'nav-06', name: 'Arctic Fjord Ocean', hex: '#14385C', category: 'Navies', tagline: 'Vibrant glacial nautical blue with luxury clarity' },
  { id: 'nav-07', name: 'Pahalgam River Deep', hex: '#153250', category: 'Navies', tagline: 'Deep rushing alpine water shadow' },
  { id: 'nav-08', name: 'Celestial Twilight Horizon', hex: '#182C48', category: 'Navies', tagline: 'Twilight transition where mountain meets galaxy' },
  { id: 'nav-09', name: 'Modern Aerospace Slate', hex: '#1E293B', category: 'Navies', tagline: 'Contemporary Tailwind slate-800 luxury' },
  { id: 'nav-10', name: 'Shikara Harbor Twilight', hex: '#122D42', category: 'Navies', tagline: 'Refined twilight blue beside wooden shikaras' },
  { id: 'nav-11', name: 'Prussian Alpine Blue', hex: '#0C2340', category: 'Navies', tagline: 'Timeless heritage architectural prestige' },
  { id: 'nav-12', name: 'Himalayan High Horizon', hex: '#1A3254', category: 'Navies', tagline: 'Crystal stratosphere blue above 12,000 ft' },

  // ── 2. EMERALD & MOUNTAIN FOREST GREENS (12) ──
  { id: 'nav-13', name: 'Betaab Valley Spruce', hex: '#0A3622', category: 'Forest', tagline: 'Rich mountain spruce with vibrant evergreen luster' },
  { id: 'nav-14', name: 'Mughal Pine Needle', hex: '#0E422B', category: 'Forest', tagline: 'Fragrant cedar-pine needles under morning dew' },
  { id: 'nav-15', name: 'Deep Emerald Sanctum', hex: '#064E3B', category: 'Forest', tagline: 'Precious gemstone green with breathtaking depth' },
  { id: 'nav-16', name: 'Sonamarg Meadow Green', hex: '#14532D', category: 'Forest', tagline: 'Lush golden-meadow summer alpine grass' },
  { id: 'nav-17', name: 'High Alpine Juniper', hex: '#0F3D2E', category: 'Forest', tagline: 'Crisp herbal botanical mountain foliage' },
  { id: 'nav-18', name: 'Ancient Deodar Forest', hex: '#0D3A27', category: 'Forest', tagline: 'Historic century-old temple cedars of Kashmir' },
  { id: 'nav-19', name: 'Highland Moss Glade', hex: '#16432A', category: 'Forest', tagline: 'Velvety shaded forest floor along Lidder river' },
  { id: 'nav-20', name: 'Malachite Mineral Green', hex: '#083B2C', category: 'Forest', tagline: 'Precious royal mineral gemstone green' },
  { id: 'nav-21', name: 'Nordic Alpine Fir', hex: '#1A3D2F', category: 'Forest', tagline: 'High-end architectural dark botanic green' },
  { id: 'nav-22', name: 'Gulmarg Pine Shadows', hex: '#133826', category: 'Forest', tagline: 'Crisp winter snow shadows on evergreen boughs' },
  { id: 'nav-23', name: 'Dachigam Reserve Deep', hex: '#0B3828', category: 'Forest', tagline: 'Untouched highland nature reserve shade' },
  { id: 'nav-24', name: 'Shaded Mountain Laurel', hex: '#1A4232', category: 'Forest', tagline: 'Sophisticated botanical luxury garden tone' },

  // ── 3. MUGHAL WINE, MULBERRY & ROYAL VIOLET (12) ──
  { id: 'nav-25', name: 'Chinar Autumn Crimson', hex: '#381026', category: 'Jewel', tagline: 'Vibrant autumn Chinar foliage in glowing crimson wine' },
  { id: 'nav-26', name: 'Kashmiri Silk Plum', hex: '#2E0E2E', category: 'Jewel', tagline: 'Rich handwoven silk carpet deep royal plum' },
  { id: 'nav-27', name: 'Imperial Jamawar Velvet', hex: '#3A1234', category: 'Jewel', tagline: 'Royal Mughal court ceremonial velvet purple' },
  { id: 'nav-28', name: 'Royal Damson Burgundy', hex: '#4A0E2E', category: 'Jewel', tagline: 'Sophisticated 5-star hospitality burgundy wine' },
  { id: 'nav-29', name: 'Mughal Ruby Noir', hex: '#450A20', category: 'Jewel', tagline: 'Deep blood-ruby red with intense passion' },
  { id: 'nav-30', name: 'Nocturne Mountain Amethyst', hex: '#2B1238', category: 'Jewel', tagline: 'Boutique jewel-box amethyst violet night' },
  { id: 'nav-31', name: 'Twilight Lavender Dusk', hex: '#33143A', category: 'Jewel', tagline: 'Atmospheric twilight purple over Srinagar valley' },
  { id: 'nav-32', name: 'Black Cherry Merlot', hex: '#3D1528', category: 'Jewel', tagline: 'Gourmet decadent dark berry wine luxury' },
  { id: 'nav-33', name: 'Shahi Court Aubergine', hex: '#281133', category: 'Jewel', tagline: 'Regal aristocrat eggplant violet heritage' },
  { id: 'nav-34', name: 'Saffron Flower Blossom', hex: '#3A1430', category: 'Jewel', tagline: 'Purple petals of the delicate Pampore saffron flower' },
  { id: 'nav-35', name: 'Wild Himalayan Mulberry', hex: '#350F28', category: 'Jewel', tagline: 'Ripe highland berry nectar with rich character' },
  { id: 'nav-36', name: 'Celestial Violet Horizon', hex: '#2A1636', category: 'Jewel', tagline: 'Cosmic deep ultraviolet night sky over peaks' },

  // ── 4. WALNUT, ROASTED COFFEE & HEARTH (12) ──
  { id: 'nav-37', name: 'Antique Kashmiri Walnut', hex: '#2E1C12', category: 'Espresso', tagline: 'Hand-carved houseboat walnut wood, warm & rich' },
  { id: 'nav-38', name: 'Roasted Arabica Espresso', hex: '#362014', category: 'Espresso', tagline: 'Deep roasted aromatic coffee bean warmth' },
  { id: 'nav-39', name: 'Hearth Charcoal Embers', hex: '#2C1A0E', category: 'Espresso', tagline: 'Glowing mud stove & crackling pine wood embers' },
  { id: 'nav-40', name: 'Aged Houseboat Cedar', hex: '#3B2215', category: 'Espresso', tagline: 'Polished cedar timber floating on Nigeen Lake' },
  { id: 'nav-41', name: 'Decadent Dark Cocoa', hex: '#321B0F', category: 'Espresso', tagline: 'Warm chocolate undertone with velvety texture' },
  { id: 'nav-42', name: 'Saddle Leather Umber', hex: '#3A2312', category: 'Espresso', tagline: 'Handcrafted equestrian saddle leather warmth' },
  { id: 'nav-43', name: 'Old Sheesham Grain', hex: '#2A1810', category: 'Espresso', tagline: 'Heirloom dark reddish timber with antique patina' },
  { id: 'nav-44', name: 'Burnt Chestnut Hearth', hex: '#381E10', category: 'Espresso', tagline: 'Cozy winter evening roasted chestnut aroma' },
  { id: 'nav-45', name: 'Kashmiri Spice Bark', hex: '#3E2415', category: 'Espresso', tagline: 'Rich cinnamon & star anise aromatic brown' },
  { id: 'nav-46', name: 'Smoked Peat Mountain Cabin', hex: '#2F1E14', category: 'Espresso', tagline: 'Warm peat smoke & wool blankets in snow' },
  { id: 'nav-47', name: 'Terracotta Mud Hearth', hex: '#371F11', category: 'Espresso', tagline: 'Rustic Himalayan mud house earthen texture' },
  { id: 'nav-48', name: 'Vintage Sepia Timber', hex: '#291910', category: 'Espresso', tagline: 'Aged photography sepia tone with historical charm' },

  // ── 5. TEAL, PEACOCK & GLACIAL WATERS (12) ──
  { id: 'nav-49', name: 'Dal Lake Peacock Teal', hex: '#0C383D', category: 'Teal', tagline: 'Striking jewel teal with vibrant aquatic shimmer' },
  { id: 'nav-50', name: 'Glacial Turquoise Deep', hex: '#0E4348', category: 'Teal', tagline: 'Crystal clear melted snow stream turquoise' },
  { id: 'nav-51', name: 'Wular Lake Marine', hex: '#09343B', category: 'Teal', tagline: 'Expansive freshwater lake deep cyan blue' },
  { id: 'nav-52', name: 'High Alpine Cyan Shadow', hex: '#0F4C54', category: 'Teal', tagline: 'Electric mineral spring water glowing at dawn' },
  { id: 'nav-53', name: 'Emerald Sea Lagoon', hex: '#0A3A40', category: 'Teal', tagline: 'Tropical-tinted mountain lake reflection' },
  { id: 'nav-54', name: 'Lidder River Rapids', hex: '#123F44', category: 'Teal', tagline: 'Frothing white-water mountain torrent cyan' },
  { id: 'nav-55', name: 'Deep Malachite Waters', hex: '#0B353A', category: 'Teal', tagline: 'Jeweled tranquil waters reflecting lush banks' },
  { id: 'nav-56', name: 'Himalayan Glacial Jade', hex: '#0D4045', category: 'Teal', tagline: 'Mineral-rich jade water flowing from glaciers' },
  { id: 'nav-57', name: 'Shikara Reflections Teal', hex: '#14454B', category: 'Teal', tagline: 'Shimmering aquatic teal under lantern glow' },
  { id: 'nav-58', name: 'Oceanic Fjord Abyss', hex: '#0A3035', category: 'Teal', tagline: 'Deep underwater oceanic mystery with green hue' },
  { id: 'nav-59', name: 'Alpine Aquamarine Noir', hex: '#103B40', category: 'Teal', tagline: 'Refined architectural cyan with premium depth' },
  { id: 'nav-60', name: 'Kashmir Willow Waters', hex: '#0E3D42', category: 'Teal', tagline: 'Shaded stream lined with drooping green willows' },

  // ── 6. CARBON, SLATE & PURE BLACKS (12) ──
  { id: 'nav-61', name: 'Absolute Jet Black', hex: '#000000', category: 'Blacks', tagline: '100% pure OLED pitch black with infinite contrast' },
  { id: 'nav-62', name: 'Pitch Obsidian Noir', hex: '#090A0D', category: 'Blacks', tagline: 'Cinematic cold black with razor-sharp definition' },
  { id: 'nav-63', name: 'Velvet Onyx Luxury', hex: '#0F1115', category: 'Blacks', tagline: 'Deep neutral velvet black for modern minimalist UI' },
  { id: 'nav-64', name: 'Matte Space Carbon', hex: '#14171D', category: 'Blacks', tagline: 'Ultra-modern carbon weave with tech luxury' },
  { id: 'nav-65', name: 'Gunmetal Titanium', hex: '#1A1D24', category: 'Blacks', tagline: 'Brushed aerospace metal dark with industrial cool' },
  { id: 'nav-66', name: 'Charcoal Basalt Stone', hex: '#181A20', category: 'Blacks', tagline: 'Himalayan volcanic stone with timeless strength' },
  { id: 'nav-67', name: 'Cyber Stealth Dark', hex: '#15181F', category: 'Blacks', tagline: 'Modern high-tech dark mode engineered for focus' },
  { id: 'nav-68', name: 'Volcanic Smoked Ash', hex: '#111317', category: 'Blacks', tagline: 'Subtle warm charcoal ash with natural texture' },
  { id: 'nav-69', name: 'Minimalist Zinc Slate', hex: '#1C1F26', category: 'Blacks', tagline: 'Clean balanced designer neutral slate' },
  { id: 'nav-70', name: 'Midnight Ebonite', hex: '#0C0D10', category: 'Blacks', tagline: 'Precision instruments mirror finish deep dark' },
  { id: 'nav-71', name: 'Deep Industrial Graphite', hex: '#161920', category: 'Blacks', tagline: 'Architectural graphite with corporate authority' },
  { id: 'nav-72', name: 'Phantom Shadow Noir', hex: '#0D0E12', category: 'Blacks', tagline: 'Crisp high-contrast pitch dark with subtle aura' },
];

export const PaletteTester: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'themes' | 'accent' | 'nav'>('themes');
  const [selectedAccent, setSelectedAccent] = useState('#F59E0B');
  const [selectedNav, setSelectedNav] = useState('#0F4C54');
  const [activeThemeId, setActiveThemeId] = useState<string>('theme-marigold-alpine-cyan');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Category Filters
  const [themeCategory, setThemeCategory] = useState<string>('All (60)');
  const [accentCategory, setAccentCategory] = useState<string>('All (52)');
  const [navCategory, setNavCategory] = useState<string>('All (72)');

  useEffect(() => {
    // Client-chosen original default: Mughal Marigold (#F59E0B) & High Alpine Cyan Shadow (#0F4C54)
    const lockedAccent = '#F59E0B';
    const lockedNav = '#0F4C54';
    const lockedTheme = 'theme-marigold-alpine-cyan';
    
    const savedAccent = localStorage.getItem('tiw_accent_color') || lockedAccent;
    const savedNav = localStorage.getItem('tiw_nav_color') || lockedNav;
    const savedTheme = localStorage.getItem('tiw_theme_id') || lockedTheme;

    setSelectedAccent(savedAccent);
    setSelectedNav(savedNav);
    setActiveThemeId(savedTheme);
    
    try {
      document.documentElement.style.setProperty('--color-saffron', savedAccent);
      document.documentElement.style.setProperty('--color-midnight', savedNav);
    } catch {
      // ignore
    }
  }, []);

  const applyAccentColor = (hex: string) => {
    setSelectedAccent(hex);
    try {
      localStorage.setItem('tiw_accent_color', hex);
      document.documentElement.style.setProperty('--color-saffron', hex);
    } catch {
      // ignore
    }
  };

  const applyNavColor = (hex: string) => {
    setSelectedNav(hex);
    try {
      localStorage.setItem('tiw_nav_color', hex);
      document.documentElement.style.setProperty('--color-midnight', hex);
    } catch {
      // ignore
    }
  };

  // 1-Click Master Theme Switcher
  const applyFullTheme = (theme: OneClickTheme) => {
    setActiveThemeId(theme.id);
    try {
      localStorage.setItem('tiw_theme_id', theme.id);
    } catch {
      // ignore
    }
    applyAccentColor(theme.accentHex);
    applyNavColor(theme.navHex);
  };

  const themeCategories = ['All (60)', 'Signature Classics', 'Heritage & Gold', 'Alpine & Nature', 'Dusk & Jewel', 'Espresso & Hearth', 'Modern Contrast'];
  const accentCategories = ['All (52)', 'Saffron & Sun', 'Imperial Gold', 'Alpine Nature', 'Flora & Dusk', 'Neon Vibrant', 'Deep Blue'];
  const navCategories = ['All (72)', 'Navies', 'Forest', 'Jewel', 'Espresso', 'Teal', 'Blacks'];

  const filteredThemes = useMemo(() => {
    return ONE_CLICK_THEMES.filter((t) => {
      const matchCat = themeCategory === 'All (60)' || t.category === themeCategory;
      const matchSearch = searchQuery.trim() === '' || 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.accentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.navName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [themeCategory, searchQuery]);

  const filteredAccents = useMemo(() => {
    return DESIGNER_PALETTES.filter((p) => {
      const matchCat = accentCategory === 'All (52)' || p.category === accentCategory;
      const matchSearch = searchQuery.trim() === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.hex.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [accentCategory, searchQuery]);

  const filteredNavs = useMemo(() => {
    return NAV_BASE_OPTIONS.filter((p) => {
      const matchCat = navCategory === 'All (72)' || p.category === navCategory;
      const matchSearch = searchQuery.trim() === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.hex.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [navCategory, searchQuery]);

  const activeAccentOpt = DESIGNER_PALETTES.find((p) => p.hex.toLowerCase() === selectedAccent.toLowerCase()) || DESIGNER_PALETTES[0];
  const activeNavOpt = NAV_BASE_OPTIONS.find((p) => p.hex.toLowerCase() === selectedNav.toLowerCase()) || NAV_BASE_OPTIONS[0];

  return (
    <div className="hidden lg:block fixed bottom-6 right-3 sm:right-6 z-[60] select-none pointer-events-auto">
      {/* 1. Closed Floating Pill Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full backdrop-blur-xl text-warm-white border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.8)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          style={{ backgroundColor: 'color-mix(in srgb, var(--color-midnight) 92%, black)' }}
          aria-label="Open 1-click theme studio"
        >
          <div className="flex items-center -space-x-1.5 shrink-0">
            <div
              className="w-4 h-4 rounded-full border border-white/60 shadow-sm"
              style={{ backgroundColor: selectedNav }}
              title="Current Navbar Tone"
            />
            <div
              className="w-4 h-4 rounded-full border border-white/80 shadow-sm"
              style={{ backgroundColor: selectedAccent }}
              title="Current Accent Color"
            />
          </div>
          <span className="font-manrope text-[11px] sm:text-xs font-bold tracking-wide flex items-center gap-1.5">
            <Palette size={13} style={{ color: selectedAccent }} />
            <span>Studio <span className="text-[10px] px-1 py-0.2 rounded bg-white/15 ml-0.5">60 Themes</span></span>
          </span>
        </button>
      )}

      {/* 2. Expanded Studio Drawer / Modal */}
      {isOpen && (
        <div 
          className="w-[calc(100vw-16px)] sm:w-[490px] max-w-[500px] rounded-2xl backdrop-blur-2xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-3 sm:p-4 text-warm-white flex flex-col gap-2.5 animate-in fade-in zoom-in-95 duration-200 max-h-[76vh] sm:max-h-[85vh]"
          style={{ backgroundColor: 'color-mix(in srgb, var(--color-midnight) 96%, black)' }}
        >
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles size={16} style={{ color: selectedAccent }} />
              <div>
                <h3 className="font-manrope text-xs sm:text-sm font-extrabold uppercase tracking-wider text-warm-white leading-none">
                  Theme & Palette Studio
                </h3>
                <span className="text-[9.5px] sm:text-[10.5px] text-warm-white/65 font-medium">
                  {activeView === 'themes' ? '60 Complete Themes (Accent + Base)' : activeView === 'accent' ? '52 Accent Palettes' : '72 Navbar Base Shades'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-warm-white/60 hover:text-warm-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Top 3-Way Switcher: 1-Click Themes (60) vs Accents (52) vs Navbar Base (72) */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-[10.5px] font-manrope font-bold shrink-0">
            <button
              type="button"
              onClick={() => { setActiveView('themes'); setSearchQuery(''); }}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeView === 'themes'
                  ? 'bg-white/25 text-warm-white shadow-xs'
                  : 'text-warm-white/60 hover:text-warm-white'
              }`}
            >
              <Zap size={12} style={{ color: selectedAccent, fill: selectedAccent }} />
              <span>Themes (60)</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveView('accent'); setSearchQuery(''); }}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeView === 'accent'
                  ? 'bg-white/25 text-warm-white shadow-xs'
                  : 'text-warm-white/60 hover:text-warm-white'
              }`}
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: selectedAccent }} />
              <span>Accents (52)</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveView('nav'); setSearchQuery(''); }}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeView === 'nav'
                  ? 'bg-white/25 text-warm-white shadow-xs'
                  : 'text-warm-white/60 hover:text-warm-white'
              }`}
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: selectedNav }} />
              <span>Bases (72)</span>
            </button>
          </div>

          {/* Search Box (For Themes, Accents, Bases) */}
          <div className="relative shrink-0">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-warm-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeView === 'themes' 
                    ? "Search 60 themes (e.g. Saffron, Gold, Emerald, Wine)..." 
                    : activeView === 'accent' 
                    ? "Search 52 accents (e.g. Kesar, Bronze, Turquoise)..." 
                    : "Search 72 bases (e.g. Navy, Obsidian, Forest)..."
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-7 py-1.5 text-xs text-warm-white placeholder-warm-white/40 focus:outline-none focus:border-white/30 font-manrope"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-warm-white/40 hover:text-warm-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>

          {/* VIEW 0: 1-CLICK MASTER THEMES (24 combinations) */}
          {activeView === 'themes' && (
            <>
              {/* Category Filter Chips */}
              <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5 shrink-0 text-[10px] font-semibold font-manrope">
                {themeCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setThemeCategory(cat)}
                    className={`px-2 py-0.8 rounded-full whitespace-nowrap transition-all cursor-pointer border ${
                      themeCategory === cat
                        ? 'bg-white/25 text-warm-white font-bold border-white/40 shadow-xs'
                        : 'bg-white/5 text-warm-white/60 border-white/10 hover:text-warm-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Scrollable Theme Combinations List */}
              <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 max-h-[260px] sm:max-h-[320px] [scrollbar-width:thin]">
                {filteredThemes.length === 0 ? (
                  <div className="py-6 text-center text-xs text-warm-white/50">No matching themes found</div>
                ) : (
                  filteredThemes.map((thm) => {
                    const isSelected = 
                      thm.accentHex.toLowerCase() === selectedAccent.toLowerCase() &&
                      thm.navHex.toLowerCase() === selectedNav.toLowerCase();

                    return (
                      <button
                        key={thm.id}
                        type="button"
                        onClick={() => applyFullTheme(thm)}
                        className={`flex items-center justify-between p-2.5 rounded-xl transition-all text-left border cursor-pointer ${
                          isSelected
                            ? 'bg-white/20 border-white/60 shadow-md ring-1 ring-white/30'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 active:scale-[0.99]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Visual Duo-Tone Pill */}
                          <div className="relative w-9 h-8 rounded-lg overflow-hidden border border-white/30 shadow-xs shrink-0 flex">
                            <div className="w-1/2 h-full" style={{ backgroundColor: thm.navHex }} />
                            <div className="w-1/2 h-full flex items-center justify-center text-white" style={{ backgroundColor: thm.accentHex }}>
                              {isSelected && <Check size={14} className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]" strokeWidth={3.2} />}
                            </div>
                          </div>

                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-manrope text-xs font-bold text-warm-white truncate">
                                {thm.name}
                              </span>
                              <span className="text-[8px] px-1 py-0.2 rounded bg-white/10 text-warm-white/70 font-mono">
                                {thm.category}
                              </span>
                            </div>
                            <span className="font-manrope text-[10px] text-warm-white/65 truncate">
                              {thm.tagline}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0 ml-2">
                          <span className="font-mono text-[9.5px] font-bold" style={{ color: thm.accentHex }}>
                            {thm.accentHex}
                          </span>
                          <span className="font-mono text-[9px] text-warm-white/60">
                            {thm.navHex}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* VIEW 1: ACCENT PALETTES (52 choices) */}
          {activeView === 'accent' && (
            <>
              {/* Category Filter Chips */}
              <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5 shrink-0 text-[10px] font-semibold font-manrope">
                {accentCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setAccentCategory(cat)}
                    className={`px-2 py-0.8 rounded-full whitespace-nowrap transition-all cursor-pointer border ${
                      accentCategory === cat
                        ? 'bg-white/25 text-warm-white font-bold border-white/40 shadow-xs'
                        : 'bg-white/5 text-warm-white/60 border-white/10 hover:text-warm-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Scrollable Palette List */}
              <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 max-h-[260px] sm:max-h-[320px] [scrollbar-width:thin]">
                {filteredAccents.length === 0 ? (
                  <div className="py-6 text-center text-xs text-warm-white/50">No matching palettes found</div>
                ) : (
                  filteredAccents.map((opt) => {
                    const isSelected = opt.hex.toLowerCase() === selectedAccent.toLowerCase();
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => applyAccentColor(opt.hex)}
                        className={`flex items-center justify-between p-2 rounded-xl transition-all text-left border cursor-pointer ${
                          isSelected
                            ? 'bg-white/20 border-white/60 shadow-md ring-1 ring-white/30'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 active:scale-[0.99]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-white/30 shadow-sm shrink-0 flex items-center justify-center text-white"
                            style={{ backgroundColor: opt.hex }}
                          >
                            {isSelected && <Check size={16} className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" strokeWidth={3} />}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-manrope text-xs font-bold text-warm-white truncate">
                                {opt.name}
                              </span>
                              <span className="text-[8px] px-1 py-0.2 rounded bg-white/10 text-warm-white/70 font-mono">
                                {opt.category}
                              </span>
                            </div>
                            <span className="font-manrope text-[10px] text-warm-white/65 truncate">
                              {opt.tagline}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono text-[10px] sm:text-[10.5px] font-semibold text-warm-white/85 shrink-0 ml-2">
                          {opt.hex}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* VIEW 2: NAVBAR BASE SHADES (72 choices) */}
          {activeView === 'nav' && (
            <>
              {/* Category Filter Chips */}
              <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5 shrink-0 text-[10px] font-semibold font-manrope">
                {navCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNavCategory(cat)}
                    className={`px-2 py-0.8 rounded-full whitespace-nowrap transition-all cursor-pointer border ${
                      navCategory === cat
                        ? 'bg-white/25 text-warm-white font-bold border-white/40 shadow-xs'
                        : 'bg-white/5 text-warm-white/60 border-white/10 hover:text-warm-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Scrollable Nav Shades List */}
              <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 max-h-[260px] sm:max-h-[320px] [scrollbar-width:thin]">
                {filteredNavs.length === 0 ? (
                  <div className="py-6 text-center text-xs text-warm-white/50">No matching base shades found</div>
                ) : (
                  filteredNavs.map((navOpt) => {
                    const isSelected = navOpt.hex.toLowerCase() === selectedNav.toLowerCase();
                    return (
                      <button
                        key={navOpt.id}
                        type="button"
                        onClick={() => applyNavColor(navOpt.hex)}
                        className={`flex items-center justify-between p-2 rounded-xl transition-all text-left border cursor-pointer ${
                          isSelected
                            ? 'bg-white/20 border-white/60 shadow-md ring-1 ring-white/30'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 active:scale-[0.99]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-white/30 shadow-sm shrink-0 flex items-center justify-center text-white"
                            style={{ backgroundColor: navOpt.hex }}
                          >
                            {isSelected && <Check size={16} className="text-saffron" strokeWidth={3} />}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-manrope text-xs font-bold text-warm-white truncate">
                                {navOpt.name}
                              </span>
                              <span className="text-[8px] px-1 py-0.2 rounded bg-white/10 text-warm-white/70 font-mono">
                                {navOpt.category}
                              </span>
                            </div>
                            <span className="font-manrope text-[10px] text-warm-white/65 truncate">
                              {navOpt.tagline}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono text-[10px] sm:text-[10.5px] font-semibold text-warm-white/80 shrink-0 ml-2">
                          {navOpt.hex}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* Footer Active Selection Bar */}
          <div className="rounded-xl bg-white/10 border border-white/15 p-2 flex items-center justify-between text-[10.5px] font-bold shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-warm-white/60 text-[9px] uppercase tracking-wider">Accent:</span>
              <span className="truncate" style={{ color: selectedAccent }}>{activeAccentOpt.name}</span>
              <span className="font-mono text-[9px] opacity-75">({selectedAccent})</span>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <span className="text-warm-white/60 text-[9px] uppercase tracking-wider">Nav:</span>
              <span className="font-mono text-warm-white text-[10px]">{selectedNav}</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
