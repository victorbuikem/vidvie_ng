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
</script>

<svelte:head>
	<title>Vidvie — Quality Electronics & Accessories</title>
	<meta name="description" content="Shop headphones, power banks, cables and more from Vidvie. Quality electronics delivered across Nigeria." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-brand-600 to-brand-800 text-white">
	<div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
		<div class="max-w-2xl">
			<h1 class="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
				Quality Electronics, Delivered to You
			</h1>
			<p class="mt-4 text-lg text-brand-100">
				Headphones, power banks, cables, and more — premium accessories at the best prices across Nigeria.
			</p>
			<div class="mt-8 flex gap-4">
				<a href="/shop">
					<Button size="lg" variant="secondary">Shop Now</Button>
				</a>
				<a href="/about">
					<Button size="lg" variant="ghost" class="text-white hover:bg-white/10">
						Learn More
					</Button>
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Discounted Products -->
{#if data.discountedProducts.length > 0}
	<section class="bg-surface-50 py-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex items-center gap-3">
				<h2 class="text-2xl font-bold text-surface-900">Hot Deals</h2>
				<Badge variant="danger">Sale</Badge>
			</div>
			<div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{#each data.discountedProducts as product}
					<a href="/shop/{product.slug}" class="group">
						<Card padding={false}>
							<div class="relative aspect-square overflow-hidden rounded-t-xl bg-surface-100">
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
								<p class="text-xs text-surface-400">{product.category?.name}</p>
								<h3 class="mt-1 font-medium text-surface-900 group-hover:text-brand-600">{product.name}</h3>
								<div class="mt-2 flex items-center gap-2">
									<span class="font-semibold text-brand-600">{formatPrice(product.discountPrice!)}</span>
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
	<section class="py-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<h2 class="text-2xl font-bold text-surface-900">Shop by Category</h2>
			<div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
				{#each data.categories as category}
					<a
						href="/shop?category={category.slug}"
						class="group relative overflow-hidden rounded-xl bg-surface-100 p-6 transition-colors hover:bg-brand-50"
					>
						{#if category.image}
							<img
								src={category.image}
								alt={category.name}
								class="absolute inset-0 h-full w-full object-cover opacity-20"
							/>
						{/if}
						<div class="relative">
							<h3 class="font-semibold text-surface-900 group-hover:text-brand-700">{category.name}</h3>
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
	<section class="bg-surface-50 py-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between">
				<h2 class="text-2xl font-bold text-surface-900">Featured Products</h2>
				<a href="/shop" class="text-sm font-medium text-brand-600 hover:text-brand-700">
					View All &rarr;
				</a>
			</div>
			<div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{#each data.featuredProducts as product}
					<a href="/shop/{product.slug}" class="group">
						<Card padding={false}>
							<div class="aspect-square overflow-hidden rounded-t-xl bg-surface-100">
								{#if product.images[0]}
									<img
										src={product.images[0]}
										alt={product.name}
										class="h-full w-full object-cover transition-transform group-hover:scale-105"
									/>
								{/if}
							</div>
							<div class="p-4">
								<p class="text-xs text-surface-400">{product.category?.name}</p>
								<h3 class="mt-1 font-medium text-surface-900 group-hover:text-brand-600">{product.name}</h3>
								<div class="mt-2">
									{#if product.discountPrice}
										<span class="font-semibold text-brand-600">{formatPrice(product.discountPrice)}</span>
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
<section class="py-16">
	<div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
		<h2 class="text-2xl font-bold text-surface-900">Ready to upgrade your tech?</h2>
		<p class="mt-2 text-surface-500">Browse our full catalog and find the perfect accessories for you.</p>
		<div class="mt-6">
			<a href="/shop">
				<Button size="lg">Browse All Products</Button>
			</a>
		</div>
	</div>
</section>
