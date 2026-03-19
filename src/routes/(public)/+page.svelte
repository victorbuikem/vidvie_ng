<script lang="ts">
	import Badge from '$lib/components/ui/badge.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';

	let { data } = $props();

	const formatPrice = (kobo: number) => {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 0
		}).format(kobo / 100);
	};

	// Hero carousel
	const slides = [
		{
			heading: 'Smart. Stylish. Organized.',
			subheading: 'VIDVIE Bag for Every Journey',
			cta: 'Shop',
			href: '/shop'
		},
		{
			heading: 'Brand New Keyboard',
			subheading: 'Wireless and Convenient',
			cta: 'Shop',
			href: '/shop'
		},
		{
			heading: 'GaN Chargers',
			subheading: 'Fast and efficient power',
			cta: 'Check It Out',
			href: '/shop'
		},
		{
			heading: 'Endless Options',
			subheading: 'To choose from',
			cta: 'Shop',
			href: '/shop'
		}
	];

	let currentSlide = $state(0);

	$effect(() => {
		const interval = setInterval(() => {
			currentSlide = (currentSlide + 1) % slides.length;
		}, 5000);
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>VIDVIE — Premium Electronics & Accessories for Everyday Life</title>
	<meta name="description" content="Shop headphones, power banks, cables and more from VIDVIE. Premium electronics delivered across Nigeria." />
</svelte:head>

<!-- Hero Carousel -->
<section class="relative overflow-hidden bg-brand-300/40">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="relative flex min-h-[50vh] items-center justify-center py-20 text-center sm:min-h-[60vh]">
			{#each slides as slide, i}
				<div
					class="absolute inset-0 flex flex-col items-center justify-center px-4 transition-opacity duration-700
						{i === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}"
				>
					<h1 class="font-heading text-4xl font-medium tracking-wide text-brand-900 sm:text-5xl lg:text-6xl">
						{slide.heading}
					</h1>
					<p class="mt-3 text-lg text-surface-700 sm:text-xl">
						{slide.subheading}
					</p>
					<div class="mt-8">
						<a href={slide.href}>
							<Button size="lg">{slide.cta}</Button>
						</a>
					</div>
				</div>
			{/each}

			<!-- Dots -->
			<div class="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
				{#each slides as _, i}
					<button
						class="h-2.5 w-2.5 rounded-full transition-colors {i === currentSlide ? 'bg-brand-900' : 'bg-brand-900/30'}"
						onclick={() => (currentSlide = i)}
						aria-label="Go to slide {i + 1}"
					></button>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- Discounted Products -->
{#if data.discountedProducts.length > 0}
	<section class="py-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex items-center gap-3">
				<h2 class="font-heading text-2xl font-medium text-surface-900">Hot Deals</h2>
				<Badge variant="danger">Sale</Badge>
			</div>
			<div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{#each data.discountedProducts as product}
					<a href="/shop/{product.slug}" class="group">
						<Card padding={false}>
							<div class="relative aspect-square overflow-hidden rounded-t-[1.2rem] bg-brand-100">
								{#if product.images[0]}
									<img
										src={product.images[0]}
										alt={product.name}
										class="h-full w-full object-cover transition-transform group-hover:scale-105"
									/>
								{/if}
								<div class="absolute top-2 left-2">
									<Badge variant="danger">
										{Math.round(((product.price - (product.discountPrice ?? product.price)) / product.price) * 100)}% OFF
									</Badge>
								</div>
							</div>
							<div class="p-4">
								<p class="text-xs text-surface-500">{product.category?.name}</p>
								<h3 class="mt-1 font-medium text-surface-900 group-hover:text-brand-400">{product.name}</h3>
								<div class="mt-2 flex items-center gap-2">
									<span class="font-semibold text-brand-400">{formatPrice(product.discountPrice!)}</span>
									<span class="text-sm text-surface-400 line-through">{formatPrice(product.price)}</span>
								</div>
							</div>
						</Card>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- Categories -->
{#if data.categories.length > 0}
	<section class="bg-brand-300/20 py-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<h2 class="font-heading text-2xl font-medium text-surface-900">Shop by Category</h2>
			<div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
				{#each data.categories as category}
					<a
						href="/shop?category={category.slug}"
						class="group relative overflow-hidden rounded-[1rem] bg-surface-100 p-6 shadow-[0_0.4rem_0.5rem_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_0.4rem_0.8rem_rgba(0,0,0,0.12)]"
					>
						{#if category.image}
							<img
								src={category.image}
								alt={category.name}
								class="absolute inset-0 h-full w-full object-cover opacity-20"
							/>
						{/if}
						<div class="relative">
							<h3 class="font-heading font-medium text-surface-900 group-hover:text-brand-700">{category.name}</h3>
							{#if category.description}
								<p class="mt-1 text-sm text-surface-500">{category.description}</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- Featured Products -->
{#if data.featuredProducts.length > 0}
	<section class="py-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between">
				<h2 class="font-heading text-2xl font-medium text-surface-900">Featured Products</h2>
				<a href="/shop" class="text-sm font-medium text-brand-400 hover:text-brand-500">
					View All &rarr;
				</a>
			</div>
			<div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{#each data.featuredProducts as product}
					<a href="/shop/{product.slug}" class="group">
						<Card padding={false}>
							<div class="aspect-square overflow-hidden rounded-t-[1.2rem] bg-brand-100">
								{#if product.images[0]}
									<img
										src={product.images[0]}
										alt={product.name}
										class="h-full w-full object-cover transition-transform group-hover:scale-105"
									/>
								{/if}
							</div>
							<div class="p-4">
								<p class="text-xs text-surface-500">{product.category?.name}</p>
								<h3 class="mt-1 font-medium text-surface-900 group-hover:text-brand-400">{product.name}</h3>
								<div class="mt-2">
									{#if product.discountPrice}
										<span class="font-semibold text-brand-400">{formatPrice(product.discountPrice)}</span>
										<span class="ml-1 text-sm text-surface-400 line-through">{formatPrice(product.price)}</span>
									{:else}
										<span class="font-semibold text-surface-900">{formatPrice(product.price)}</span>
									{/if}
								</div>
							</div>
						</Card>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- CTA -->
<section class="bg-brand-300/30 py-16">
	<div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
		<h2 class="font-heading text-2xl font-medium text-surface-900">Ready to upgrade your tech?</h2>
		<p class="mt-2 text-surface-600">Browse our full catalog and find the perfect accessories for you.</p>
		<div class="mt-6">
			<a href="/shop">
				<Button size="lg">Browse All Products</Button>
			</a>
		</div>
	</div>
</section>
