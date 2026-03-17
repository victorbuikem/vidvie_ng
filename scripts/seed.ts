import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { ulid } from 'ulid';
import { sql } from 'drizzle-orm';
import {
	categories,
	products,
	cartItems,
	carts,
	orderItems,
	orders
} from '../src/lib/server/db/schema';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(DATABASE_URL);
const db = drizzle(client);

const createId = (prefix: string) => `${prefix}_${ulid()}`;

// ── Categories (15) ─────────────────────────────────────────────────

const categoryData = [
	{
		id: createId('cat'),
		name: 'Wired Earphones',
		slug: 'wired-earphones',
		description: 'High-fidelity wired earphones with deep bass, noise isolation, and durable cables.',
		image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800&q=80'
	},
	{
		id: createId('cat'),
		name: 'Wireless Headphones',
		slug: 'wireless-headphones',
		description: 'Over-ear and on-ear Bluetooth headphones with premium sound quality.',
		image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
	},
	{
		id: createId('cat'),
		name: 'TWS Earbuds',
		slug: 'tws-earbuds',
		description: 'True wireless stereo earbuds with charging cases for music, calls, and gaming.',
		image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80'
	},
	{
		id: createId('cat'),
		name: 'Power Banks',
		slug: 'power-banks',
		description: 'Portable power banks from 5,000mAh to 30,000mAh to keep your devices charged.',
		image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80'
	},
	{
		id: createId('cat'),
		name: 'Wall Chargers',
		slug: 'wall-chargers',
		description: 'Fast wall chargers with USB-C PD and Quick Charge support.',
		image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80'
	},
	{
		id: createId('cat'),
		name: 'Charging Cables',
		slug: 'charging-cables',
		description: 'Durable USB-C, Lightning, and micro USB cables for charging and data transfer.',
		image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80'
	},
	{
		id: createId('cat'),
		name: 'Bluetooth Speakers',
		slug: 'bluetooth-speakers',
		description: 'Portable Bluetooth speakers with powerful sound for indoor and outdoor use.',
		image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80'
	},
	{
		id: createId('cat'),
		name: 'Car Chargers',
		slug: 'car-chargers',
		description: 'Fast-charging car chargers compatible with all vehicles.',
		image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80'
	},
	{
		id: createId('cat'),
		name: 'Car Mounts & Holders',
		slug: 'car-mounts-holders',
		description: 'Phone mounts and holders for safe navigation while driving.',
		image: 'https://images.unsplash.com/photo-1519575706483-221027bfbb31?w=800&q=80'
	},
	{
		id: createId('cat'),
		name: 'Wireless Chargers',
		slug: 'wireless-chargers',
		description: 'Qi wireless charging pads and stands for effortless charging.',
		image: 'https://images.unsplash.com/photo-1622957469100-6dac1b019516?w=800&q=80'
	},
	{
		id: createId('cat'),
		name: 'Screen Protectors',
		slug: 'screen-protectors',
		description: 'Tempered glass and film screen protectors for phones and tablets.',
		image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80'
	},
	{
		id: createId('cat'),
		name: 'Phone Cases',
		slug: 'phone-cases',
		description: 'Protective and stylish phone cases for iPhone and Android devices.',
		image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80'
	},
	{
		id: createId('cat'),
		name: 'Phone Holders & Stands',
		slug: 'phone-holders-stands',
		description: 'Desktop stands, ring holders, and tripods for phones and tablets.',
		image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80'
	},
	{
		id: createId('cat'),
		name: 'Adapters & Hubs',
		slug: 'adapters-hubs',
		description: 'USB hubs, OTG adapters, and audio adapters for expanded connectivity.',
		image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=800&q=80'
	},
	{
		id: createId('cat'),
		name: 'Gaming Accessories',
		slug: 'gaming-accessories',
		description: 'Game controllers, cooling fans, and trigger buttons for mobile gaming.',
		image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80'
	}
];

// ── Products (50) ───────────────────────────────────────────────────

// All prices in kobo (100 kobo = ₦1)
const productData = [
	// ── Wired Earphones (4) ──
	{
		name: 'Vidvie HS632 Bass Earphones',
		slug: 'vidvie-hs632-bass-earphones',
		description: 'High-fidelity wired earphones with extra bass driver and noise isolation. Durable braided cable, in-line mic for hands-free calls, and three sizes of silicone ear tips. 3.5mm universal compatibility.',
		price: 350000, discountPrice: 250000, stock: 150,
		images: ['https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800&q=80', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'],
		featuredOnLanding: true, categorySlug: 'wired-earphones'
	},
	{
		name: 'Vidvie HS646 Stereo Earphones',
		slug: 'vidvie-hs646-stereo-earphones',
		description: 'Balanced stereo earphones with 10mm dynamic drivers for clear mids and highs. Flat tangle-free cable, lightweight design at just 12g, and ergonomic angled ear tips for all-day comfort.',
		price: 280000, stock: 200,
		images: ['https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'wired-earphones'
	},
	{
		name: 'Vidvie HS655 In-Ear Monitor',
		slug: 'vidvie-hs655-in-ear-monitor',
		description: 'Professional-grade in-ear monitors with dual-driver design — dedicated bass and treble drivers for studio-quality sound. Detachable MMCX cable, memory foam tips, and carrying case included.',
		price: 650000, discountPrice: 500000, stock: 80,
		images: ['https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800&q=80', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'wired-earphones'
	},
	{
		name: 'Vidvie HS620 Type-C Earphones',
		slug: 'vidvie-hs620-type-c-earphones',
		description: 'USB Type-C wired earphones for phones without a headphone jack. Built-in DAC for superior audio quality, hi-res audio certified, with in-line remote and mic. Compatible with Samsung, Pixel, and iPad Pro.',
		price: 450000, stock: 120,
		images: ['https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'wired-earphones'
	},

	// ── Wireless Headphones (3) ──
	{
		name: 'Vidvie BT826 ANC Headphones',
		slug: 'vidvie-bt826-anc-headphones',
		description: 'Over-ear wireless Bluetooth headphones with active noise cancellation. 30-hour battery, cushioned ear cups for all-day comfort, foldable design, and built-in mic for crystal-clear calls.',
		price: 1500000, discountPrice: 1200000, stock: 75,
		images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80', 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&q=80'],
		featuredOnLanding: true, categorySlug: 'wireless-headphones'
	},
	{
		name: 'Vidvie BT850 Studio Headphones',
		slug: 'vidvie-bt850-studio-headphones',
		description: 'Premium wireless headphones with 40mm beryllium drivers for audiophile-grade sound. Hybrid ANC with transparency mode, 40-hour battery, multipoint connection to 2 devices, and premium leather ear cushions.',
		price: 2200000, discountPrice: 1800000, stock: 40,
		images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
		featuredOnLanding: true, categorySlug: 'wireless-headphones'
	},
	{
		name: 'Vidvie BT815 Sport Headband',
		slug: 'vidvie-bt815-sport-headband',
		description: 'On-ear wireless headphones built for workouts. Sweat-resistant IPX4 design, secure fit headband, 15-hour battery, and quick charge — 10 minutes gives 2 hours of playback. Bold colors for an active lifestyle.',
		price: 800000, stock: 100,
		images: ['https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'wireless-headphones'
	},

	// ── TWS Earbuds (4) ──
	{
		name: 'Vidvie TWS Pro Earbuds',
		slug: 'vidvie-tws-pro-earbuds',
		description: 'True wireless stereo earbuds with touch controls, Bluetooth 5.3, low latency gaming mode, and 24-hour total battery with compact charging case. Perfect for music, calls, and gaming.',
		price: 1200000, discountPrice: 950000, stock: 60,
		images: ['https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80', 'https://images.unsplash.com/photo-1631867675167-90a456a90863?w=800&q=80'],
		featuredOnLanding: true, categorySlug: 'tws-earbuds'
	},
	{
		name: 'Vidvie TWS Lite Earbuds',
		slug: 'vidvie-tws-lite-earbuds',
		description: 'Affordable true wireless earbuds with surprisingly rich sound. 6-hour playback per charge, 18 hours with case, IPX4 splash resistance, and stable Bluetooth 5.1 connection. Ultra-lightweight at 4g per earbud.',
		price: 550000, discountPrice: 420000, stock: 200,
		images: ['https://images.unsplash.com/photo-1631867675167-90a456a90863?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'tws-earbuds'
	},
	{
		name: 'Vidvie TWS Sport Earbuds',
		slug: 'vidvie-tws-sport-earbuds',
		description: 'Sport-focused TWS earbuds with secure ear-hook design. IPX6 waterproof for intense workouts, 8-hour battery, ambient sound mode for outdoor safety, and LED charging case with battery display.',
		price: 900000, stock: 90,
		images: ['https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=80', 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'tws-earbuds'
	},
	{
		name: 'Vidvie TWS ANC Earbuds',
		slug: 'vidvie-tws-anc-earbuds',
		description: 'Premium TWS earbuds with hybrid active noise cancellation. 3 ANC levels, transparency mode, 30-hour total battery, wireless charging case, and customizable EQ via the Vidvie app. Hi-res audio certified.',
		price: 1800000, discountPrice: 1500000, stock: 50,
		images: ['https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80', 'https://images.unsplash.com/photo-1631867675167-90a456a90863?w=800&q=80'],
		featuredOnLanding: true, categorySlug: 'tws-earbuds'
	},

	// ── Power Banks (5) ──
	{
		name: 'Vidvie PB760 5,000mAh Mini',
		slug: 'vidvie-pb760-5000mah-mini',
		description: 'Ultra-compact 5,000mAh power bank that fits in your pocket. Built-in USB-C cable, 20W PD fast charging, and weighs just 110g. Perfect emergency backup for your phone.',
		price: 450000, stock: 200,
		images: ['https://images.unsplash.com/photo-1618577740482-12babe516828?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'power-banks'
	},
	{
		name: 'Vidvie PB744 10,000mAh Slim',
		slug: 'vidvie-pb744-10000mah-slim',
		description: 'Slim 10,000mAh power bank with dual USB output, 18W fast charging, LED battery indicator, and airline-approved design. Charge two devices simultaneously.',
		price: 800000, discountPrice: 650000, stock: 120,
		images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80', 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80'],
		featuredOnLanding: true, categorySlug: 'power-banks'
	},
	{
		name: 'Vidvie PB758 20,000mAh Pro',
		slug: 'vidvie-pb758-20000mah-pro',
		description: 'High-capacity 20,000mAh power bank with 22.5W super fast charging. Three output ports, digital LED display showing exact battery percentage, and premium aluminum alloy casing.',
		price: 1500000, discountPrice: 1250000, stock: 80,
		images: ['https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80'],
		featuredOnLanding: true, categorySlug: 'power-banks'
	},
	{
		name: 'Vidvie PB770 30,000mAh Ultra',
		slug: 'vidvie-pb770-30000mah-ultra',
		description: 'Massive 30,000mAh power bank for extended trips. 65W PD output can charge laptops, four output ports, built-in LED flashlight, and rugged design. Charge a phone 7+ times on a single charge.',
		price: 2500000, discountPrice: 2100000, stock: 35,
		images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'power-banks'
	},
	{
		name: 'Vidvie PB750 10,000mAh Solar',
		slug: 'vidvie-pb750-10000mah-solar',
		description: 'Solar-powered 10,000mAh power bank with built-in solar panel for emergency charging. Dual USB output, IPX4 splash-proof, carabiner clip, and LED flashlight. Ideal for camping and outdoor adventures.',
		price: 1000000, discountPrice: 800000, stock: 60,
		images: ['https://images.unsplash.com/photo-1618577740482-12babe516828?w=800&q=80', 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'power-banks'
	},

	// ── Wall Chargers (4) ──
	{
		name: 'Vidvie PLM106 33W USB-C Charger',
		slug: 'vidvie-plm106-33w-usb-c-charger',
		description: '33W USB-C GaN fast charger with compact foldable plug. Supports PD 3.0 and QC 4.0, up to 3x faster than standard chargers. Compatible with iPhone, Samsung, and all USB-C devices.',
		price: 500000, discountPrice: 400000, stock: 200,
		images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80', 'https://images.unsplash.com/photo-1628815113969-0487917e8b76?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'wall-chargers'
	},
	{
		name: 'Vidvie PLM120 45W Dual Port Charger',
		slug: 'vidvie-plm120-45w-dual-port-charger',
		description: 'Dual-port wall charger with USB-A and USB-C delivering 45W combined. Smart power distribution, built-in surge protection and overcharge safety. Charge phone and tablet simultaneously.',
		price: 700000, discountPrice: 550000, stock: 150,
		images: ['https://images.unsplash.com/photo-1628815113969-0487917e8b76?w=800&q=80', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'wall-chargers'
	},
	{
		name: 'Vidvie PLM135 65W GaN Charger',
		slug: 'vidvie-plm135-65w-gan-charger',
		description: 'Ultra-compact 65W GaN charger that can power laptops. Dual USB-C + USB-A ports, foldable plug, and intelligent power sharing. Replace your laptop charger with something half the size.',
		price: 1200000, discountPrice: 980000, stock: 70,
		images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80'],
		featuredOnLanding: true, categorySlug: 'wall-chargers'
	},
	{
		name: 'Vidvie PLM100 12W Basic Charger',
		slug: 'vidvie-plm100-12w-basic-charger',
		description: 'Reliable 12W USB-A wall charger for everyday charging. Universal voltage input (100-240V), compact design, and built-in safety protections. Affordable and dependable.',
		price: 180000, stock: 400,
		images: ['https://images.unsplash.com/photo-1628815113969-0487917e8b76?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'wall-chargers'
	},

	// ── Charging Cables (4) ──
	{
		name: 'Vidvie CB412 USB-C to USB-C 2m',
		slug: 'vidvie-cb412-usb-c-to-usb-c-2m',
		description: 'Premium 2-meter USB-C to USB-C cable with 60W PD support. Nylon braided, rated for 10,000+ bends, supports fast charging and 480Mbps data transfer.',
		price: 250000, stock: 300,
		images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'charging-cables'
	},
	{
		name: 'Vidvie CB430 3-in-1 Cable',
		slug: 'vidvie-cb430-3-in-1-cable',
		description: 'Versatile 3-in-1 cable with Lightning, USB-C, and Micro USB connectors. 1.2m nylon braided, supports 3A fast charging. One cable for all your devices.',
		price: 350000, discountPrice: 280000, stock: 250,
		images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80'],
		featuredOnLanding: true, categorySlug: 'charging-cables'
	},
	{
		name: 'Vidvie CB450 Lightning Cable 1.5m',
		slug: 'vidvie-cb450-lightning-cable-1-5m',
		description: 'MFi-certified Lightning cable with reinforced stress points. 1.5m length, supports 20W PD fast charging with compatible charger, aluminum alloy connectors for durability.',
		price: 300000, stock: 280,
		images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'charging-cables'
	},
	{
		name: 'Vidvie CB460 100W USB-C Cable',
		slug: 'vidvie-cb460-100w-usb-c-cable',
		description: '100W USB-C to USB-C cable for laptops and power-hungry devices. E-marker chip for safe high-power delivery, 2m length, USB 3.1 Gen 2 with 10Gbps data transfer, and braided jacket.',
		price: 500000, discountPrice: 400000, stock: 100,
		images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'charging-cables'
	},

	// ── Bluetooth Speakers (4) ──
	{
		name: 'Vidvie SP910 Waterproof Speaker',
		slug: 'vidvie-sp910-waterproof-speaker',
		description: 'Compact Bluetooth speaker with 360° surround sound and IPX6 waterproof rating. 12-hour battery, built-in mic for speakerphone, and RGB LED light effects. Perfect for pool and beach.',
		price: 1200000, discountPrice: 950000, stock: 90,
		images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80', 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&q=80'],
		featuredOnLanding: true, categorySlug: 'bluetooth-speakers'
	},
	{
		name: 'Vidvie SP915 Party Speaker',
		slug: 'vidvie-sp915-party-speaker',
		description: 'Powerful 40W party speaker with deep bass boost and TWS pairing for stereo. Dynamic RGB lighting, karaoke mic input, FM radio, USB/TF card playback, and 6,000mAh battery for 8 hours of play.',
		price: 2500000, stock: 40,
		images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'bluetooth-speakers'
	},
	{
		name: 'Vidvie SP908 Mini Clip Speaker',
		slug: 'vidvie-sp908-mini-clip-speaker',
		description: 'Ultra-portable mini Bluetooth speaker that clips onto bags or belt loops. 5W output, IPX5 splash-proof, 6-hour battery, and built-in lanyard. Available in multiple colors.',
		price: 500000, discountPrice: 380000, stock: 180,
		images: ['https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'bluetooth-speakers'
	},
	{
		name: 'Vidvie SP920 Soundbar Speaker',
		slug: 'vidvie-sp920-soundbar-speaker',
		description: 'Desktop soundbar-style Bluetooth speaker with dual 10W drivers and passive radiator for room-filling sound. USB-C charging, 3.5mm aux input, and sleek aluminum body. Great for desk or bedside.',
		price: 1500000, discountPrice: 1250000, stock: 55,
		images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'bluetooth-speakers'
	},

	// ── Car Chargers (3) ──
	{
		name: 'Vidvie CC511 36W Dual Car Charger',
		slug: 'vidvie-cc511-36w-dual-car-charger',
		description: 'Dual USB car charger with 36W total output (USB-C PD 20W + USB-A QC 3.0 18W). Compact aluminum body with blue LED indicator. Compatible with all 12V-24V vehicles.',
		price: 350000, discountPrice: 280000, stock: 200,
		images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'car-chargers'
	},
	{
		name: 'Vidvie CC520 60W Car Charger',
		slug: 'vidvie-cc520-60w-car-charger',
		description: 'High-power 60W dual USB-C car charger. Charge two devices at 30W each simultaneously. Built-in temperature sensor, voltage display, and compact low-profile design that sits flush in your car.',
		price: 600000, discountPrice: 480000, stock: 100,
		images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'car-chargers'
	},
	{
		name: 'Vidvie CC505 Mini Car Charger',
		slug: 'vidvie-cc505-mini-car-charger',
		description: 'Ultra-small single USB-A car charger with QC 3.0 18W fast charging. Nearly invisible when plugged in, blue LED ring indicator, and universal compatibility.',
		price: 200000, stock: 300,
		images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'car-chargers'
	},

	// ── Car Mounts & Holders (3) ──
	{
		name: 'Vidvie Suction Cup Car Mount',
		slug: 'vidvie-suction-cup-car-mount',
		description: 'Universal car phone mount with strong suction cup for dashboard or windshield. One-hand operation, quick-release button, 360° rotation, telescopic arm, fits phones 4.7" to 7".',
		price: 400000, stock: 160,
		images: ['https://images.unsplash.com/photo-1519575706483-221027bfbb31?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'car-mounts-holders'
	},
	{
		name: 'Vidvie Magnetic Air Vent Mount',
		slug: 'vidvie-magnetic-air-vent-mount',
		description: 'Slim magnetic car mount that clips onto air vents. N52 neodymium magnets hold phones securely, one-hand attach/detach, and 360° adjustable ball joint. Includes 2 metal plates.',
		price: 250000, discountPrice: 190000, stock: 250,
		images: ['https://images.unsplash.com/photo-1519575706483-221027bfbb31?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'car-mounts-holders'
	},
	{
		name: 'Vidvie Wireless Charging Car Mount',
		slug: 'vidvie-wireless-charging-car-mount',
		description: '15W Qi wireless charging car mount with auto-clamping arms. Sensor-activated grip, air vent clip and suction cup included, compatible with all Qi phones. Navigate and charge simultaneously.',
		price: 800000, discountPrice: 650000, stock: 70,
		images: ['https://images.unsplash.com/photo-1519575706483-221027bfbb31?w=800&q=80'],
		featuredOnLanding: true, categorySlug: 'car-mounts-holders'
	},

	// ── Wireless Chargers (3) ──
	{
		name: 'Vidvie 15W Wireless Charging Pad',
		slug: 'vidvie-15w-wireless-charging-pad',
		description: 'Slim 15W Qi wireless charging pad with temperature control. LED indicator, anti-slip silicone surface, foreign object detection, and works through cases up to 5mm thick.',
		price: 600000, discountPrice: 450000, stock: 130,
		images: ['https://images.unsplash.com/photo-1622957469100-6dac1b019516?w=800&q=80'],
		featuredOnLanding: true, categorySlug: 'wireless-chargers'
	},
	{
		name: 'Vidvie 3-in-1 Wireless Charging Station',
		slug: 'vidvie-3-in-1-wireless-charging-station',
		description: 'Charge phone, earbuds, and smartwatch simultaneously. 15W phone pad, 5W earbuds pad, and Apple Watch charger in one elegant stand. Foldable for travel, non-slip base.',
		price: 1500000, discountPrice: 1200000, stock: 45,
		images: ['https://images.unsplash.com/photo-1622957469100-6dac1b019516?w=800&q=80'],
		featuredOnLanding: true, categorySlug: 'wireless-chargers'
	},
	{
		name: 'Vidvie Wireless Charging Stand',
		slug: 'vidvie-wireless-charging-stand',
		description: '10W wireless charging stand that holds your phone upright — perfect for video calls and viewing notifications while charging. Dual coil design charges in portrait or landscape orientation.',
		price: 500000, stock: 100,
		images: ['https://images.unsplash.com/photo-1622957469100-6dac1b019516?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'wireless-chargers'
	},

	// ── Screen Protectors (3) ──
	{
		name: 'Vidvie 9H Tempered Glass iPhone',
		slug: 'vidvie-9h-tempered-glass-iphone',
		description: '9H hardness tempered glass for iPhone 14/15/16 series. Oleophobic coating resists fingerprints, 99.9% transparency, bubble-free installation with alignment frame. Pack of 2.',
		price: 150000, stock: 500,
		images: ['https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'screen-protectors'
	},
	{
		name: 'Vidvie 9H Tempered Glass Samsung',
		slug: 'vidvie-9h-tempered-glass-samsung',
		description: '9H tempered glass screen protector for Samsung Galaxy S24/S25 series. UV-cured full adhesive for edge-to-edge protection, fingerprint sensor compatible, and crystal-clear transparency. Pack of 2.',
		price: 200000, discountPrice: 150000, stock: 350,
		images: ['https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'screen-protectors'
	},
	{
		name: 'Vidvie Privacy Screen Protector',
		slug: 'vidvie-privacy-screen-protector',
		description: 'Privacy tempered glass that blocks viewing from side angles beyond 30°. Keep your screen private in public. 9H hardness, anti-glare coating, and full touch sensitivity maintained.',
		price: 300000, discountPrice: 240000, stock: 200,
		images: ['https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'screen-protectors'
	},

	// ── Phone Cases (3) ──
	{
		name: 'Vidvie Clear Slim Case',
		slug: 'vidvie-clear-slim-case',
		description: 'Crystal-clear TPU case that shows off your phone design. Anti-yellowing formula, raised bezels protect camera and screen, shock-absorbing corners, and slim 1.2mm profile.',
		price: 200000, stock: 400,
		images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'phone-cases'
	},
	{
		name: 'Vidvie Rugged Armor Case',
		slug: 'vidvie-rugged-armor-case',
		description: 'Military-grade drop protection with dual-layer TPU + PC design. Tested to survive 2m drops, built-in kickstand, textured grip sides, and raised camera guard. Available for iPhone and Samsung.',
		price: 450000, discountPrice: 350000, stock: 180,
		images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'phone-cases'
	},
	{
		name: 'Vidvie Leather Wallet Case',
		slug: 'vidvie-leather-wallet-case',
		description: 'Premium PU leather folio case with 3 card slots and cash pocket. Magnetic closure, converts to viewing stand, RFID-blocking lining, and soft microfiber interior.',
		price: 600000, discountPrice: 480000, stock: 100,
		images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'phone-cases'
	},

	// ── Phone Holders & Stands (3) ──
	{
		name: 'Vidvie Magnetic Ring Holder',
		slug: 'vidvie-magnetic-ring-holder',
		description: '360° rotating magnetic phone ring holder and kickstand. MagSafe compatible, ultra-thin zinc alloy, doubles as car mount attachment. Supports phones up to 250g.',
		price: 200000, discountPrice: 150000, stock: 300,
		images: ['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'phone-holders-stands'
	},
	{
		name: 'Vidvie Adjustable Desktop Stand',
		slug: 'vidvie-adjustable-desktop-stand',
		description: 'Aluminum alloy desktop phone/tablet stand with adjustable viewing angle. Foldable and portable, anti-slip silicone pads, supports devices 4" to 13". Perfect for video calls and desk setups.',
		price: 350000, stock: 150,
		images: ['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'phone-holders-stands'
	},
	{
		name: 'Vidvie Flexible Tripod Stand',
		slug: 'vidvie-flexible-tripod-stand',
		description: 'Bendable tripod with phone clamp for content creation. Wraps around poles, fences, and furniture. Bluetooth remote shutter included, supports phones and small cameras up to 500g.',
		price: 450000, discountPrice: 350000, stock: 120,
		images: ['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'phone-holders-stands'
	},

	// ── Adapters & Hubs (3) ──
	{
		name: 'Vidvie USB-C to 3.5mm Adapter',
		slug: 'vidvie-usb-c-to-3-5mm-adapter',
		description: 'Hi-res audio DAC adapter from USB-C to 3.5mm headphone jack. 32-bit/384kHz support, aluminum alloy body, works with Samsung, Pixel, iPad Pro, and all USB-C devices.',
		price: 150000, stock: 350,
		images: ['https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'adapters-hubs'
	},
	{
		name: 'Vidvie 5-in-1 USB-C Hub',
		slug: 'vidvie-5-in-1-usb-c-hub',
		description: '5-in-1 USB-C hub with HDMI 4K@60Hz, 2x USB-A 3.0, SD/TF card reader. Compact aluminum body, plug-and-play, 100W PD pass-through charging. Expand your laptop or tablet.',
		price: 800000, discountPrice: 650000, stock: 80,
		images: ['https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'adapters-hubs'
	},
	{
		name: 'Vidvie OTG Adapter USB-C',
		slug: 'vidvie-otg-adapter-usb-c',
		description: 'USB-C to USB-A OTG adapter for connecting USB drives, keyboards, and mice to your phone or tablet. USB 3.0 speeds up to 5Gbps, keychain-friendly compact design.',
		price: 100000, stock: 400,
		images: ['https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'adapters-hubs'
	},

	// ── Gaming Accessories (3) ──
	{
		name: 'Vidvie Mobile Game Controller',
		slug: 'vidvie-mobile-game-controller',
		description: 'Bluetooth mobile game controller with telescopic phone grip. Hall effect joysticks for zero drift, 6-axis gyroscope, turbo function, and 20-hour battery. Supports iOS and Android.',
		price: 1200000, discountPrice: 950000, stock: 60,
		images: ['https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80'],
		featuredOnLanding: true, categorySlug: 'gaming-accessories'
	},
	{
		name: 'Vidvie Phone Cooling Fan',
		slug: 'vidvie-phone-cooling-fan',
		description: 'Semiconductor cooling fan that drops phone temperature by up to 20°C during gaming. Magnetic attachment, RGB lighting, near-silent operation, and USB-C powered. Stop thermal throttling.',
		price: 500000, discountPrice: 400000, stock: 100,
		images: ['https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'gaming-accessories'
	},
	{
		name: 'Vidvie Gaming Trigger Buttons',
		slug: 'vidvie-gaming-trigger-buttons',
		description: 'Pair of ultra-responsive gaming trigger buttons for mobile shooters. Conductive silver fiber tips, 6-finger operation support, universal clip-on design fits all phones, and zero latency.',
		price: 200000, stock: 250,
		images: ['https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80'],
		featuredOnLanding: false, categorySlug: 'gaming-accessories'
	}
];

// ── Seed Function ───────────────────────────────────────────────────

async function seed() {
	console.log('🌱 Seeding database...\n');

	// Clear existing data (order matters for foreign keys)
	console.log('🗑️  Clearing existing data...');
	await db.delete(cartItems);
	await db.delete(carts);
	await db.delete(orderItems);
	await db.delete(orders);
	await db.delete(products);
	await db.delete(categories);
	console.log('   ✓ Cleared\n');

	// Insert categories
	console.log('📁 Inserting categories...');
	await db.insert(categories).values(categoryData);
	console.log(`   ✓ ${categoryData.length} categories\n`);

	// Build category slug → id map
	const catMap = new Map(categoryData.map((c) => [c.slug, c.id]));

	// Insert products
	console.log('📦 Inserting products...');
	const productRows = productData.map(({ categorySlug, ...p }) => ({
		id: createId('prod'),
		...p,
		categoryId: catMap.get(categorySlug)!,
		discountPrice: p.discountPrice ?? null
	}));

	await db.insert(products).values(productRows);
	console.log(`   ✓ ${productRows.length} products\n`);

	console.log('✅ Seed complete!');
	console.log(`\n   Categories: ${categoryData.length}`);
	console.log(`   Products:   ${productRows.length}`);
	console.log(`   Featured:   ${productRows.filter((p) => p.featuredOnLanding).length}`);
	console.log(`   On sale:    ${productRows.filter((p) => p.discountPrice).length}`);

	process.exit(0);
}

seed().catch((err) => {
	console.error('❌ Seed failed:', err);
	process.exit(1);
});
