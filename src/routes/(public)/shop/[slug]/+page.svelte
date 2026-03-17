<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import Button from '$lib/components/ui/button.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import Card from '$lib/components/ui/card.svelte';

	let { data } = $props();
	let { product, relatedProducts } = $derived(data);

	let quantity = $state(1);
	let selectedImage = $state(0);

	const formatPrice = (kobo: number) => {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 0
		}).format(kobo / 100);
	};

	const displayPrice = $derived(product.discountPrice ?? product.price);
	const inStock = $derived(product.stock > 0);
</script>

<svelte:head>
	<title>{product.name} — Vidvie</title>
	<meta name="description" content={product.description.slice(0, 160)} />
	<meta property="og:title" content={product.name} />
	<meta property="og:description" content={product.description.slice(0, 160)} />
	{#if product.images[0]}
		<meta property="og:image" content={product.images[0]} />
	{/if}
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Breadcrumb -->
	<nav class="mb-6 text-sm text-surface-400">
		<a href="/shop" class="hover:text-surface-600">Shop</a>
		<span class="mx-2">/</span>
		{#if product.category}
			<a href="/shop?category={product.category.slug}" class="hover:text-surface-600">{product.category.name}</a>
			<span class="mx-2">/</span>
		{/if}
		<span class="text-surface-600">{product.name}</span>
	</nav>

	<div class="grid grid-cols-1 gap-10 lg:grid-cols-2">
		<!-- Images -->
		<div>
			<div class="aspect-square overflow-hidden rounded-xl bg-surface-100">
				{#if product.images[selectedImage]}
					<img
						src={product.images[selectedImage]}
						alt={product.name}
						class="h-full w-full object-cover"
					/>
				{:else}
					<div class="flex h-full items-center justify-center text-surface-300">
						<svg class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
					</div>
				{/if}
			</div>
			{#if product.images.length > 1}
				<div class="mt-4 flex gap-2">
					{#each product.images as image, i}
						<button
							class="h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors {i === selectedImage ? 'border-brand-600' : 'border-surface-200 hover:border-surface-300'}"
							onclick={() => (selectedImage = i)}
						>
							<img src={image} alt="{product.name} thumbnail {i + 1}" class="h-full w-full object-cover" />
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Product Info -->
		<div>
			{#if product.category}
				<p class="text-sm text-surface-400">{product.category.name}</p>
			{/if}
			<h1 class="mt-1 text-3xl font-bold text-surface-900">{product.name}</h1>

			<div class="mt-4 flex items-center gap-3">
				{#if product.discountPrice}
					<span class="text-3xl font-bold text-brand-600">{formatPrice(product.discountPrice)}</span>
					<span class="text-xl text-surface-400 line-through">{formatPrice(product.price)}</span>
					<Badge variant="danger">
						{Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
					</Badge>
				{:else}
					<span class="text-3xl font-bold text-surface-900">{formatPrice(product.price)}</span>
				{/if}
			</div>

			<!-- Stock Status -->
			<div class="mt-4">
				{#if inStock}
					<Badge variant="success">In Stock ({product.stock} available)</Badge>
				{:else}
					<Badge variant="danger">Out of Stock</Badge>
				{/if}
			</div>

			<!-- Add to Cart -->
			{#if inStock}
				<form
					method="POST"
					action="?/addToCart"
					use:enhance={() => {
						return async ({ result, update }) => {
							if (result.type === 'success') {
								toast.success('Added to cart');
								await update();
							} else if (result.type === 'failure') {
								toast.error(String((result.data as Record<string, unknown>)?.message ?? 'Failed to add to cart'));
							} else {
								toast.error('Failed to add to cart');
							}
						};
					}}
					class="mt-6"
				>
					<input type="hidden" name="productId" value={product.id} />
					<div class="flex items-center gap-4">
						<div class="flex items-center rounded-lg border border-surface-300">
							<button
								type="button"
								class="px-3 py-2 text-surface-600 hover:text-surface-900"
								onclick={() => (quantity = Math.max(1, quantity - 1))}
							>
								-
							</button>
							<input
								type="number"
								name="quantity"
								bind:value={quantity}
								min="1"
								max={product.stock}
								class="w-16 border-x border-surface-300 py-2 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
							/>
							<button
								type="button"
								class="px-3 py-2 text-surface-600 hover:text-surface-900"
								onclick={() => (quantity = Math.min(product.stock, quantity + 1))}
							>
								+
							</button>
						</div>
						<Button type="submit" size="lg" class="flex-1">Add to Cart</Button>
					</div>
				</form>
			{/if}

			<!-- Description -->
			<div class="prose prose-sm mt-8 text-surface-600">
				<h3 class="text-sm font-semibold text-surface-900">Description</h3>
				<p>{product.description}</p>
			</div>
		</div>
	</div>

	<!-- Related Products -->
	{#if relatedProducts.length > 0}
		<section class="mt-16">
			<h2 class="text-xl font-bold text-surface-900">Related Products</h2>
			<div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{#each relatedProducts as rp}
					<a href="/shop/{rp.slug}" class="group">
						<Card padding={false}>
							<div class="aspect-square overflow-hidden rounded-t-xl bg-surface-100">
								{#if rp.images[0]}
									<img src={rp.images[0]} alt={rp.name} class="h-full w-full object-cover transition-transform group-hover:scale-105" />
								{/if}
							</div>
							<div class="p-4">
								<h3 class="font-medium text-surface-900 group-hover:text-brand-600">{rp.name}</h3>
								<div class="mt-1">
									{#if rp.discountPrice}
										<span class="font-semibold text-brand-600">{formatPrice(rp.discountPrice)}</span>
										<span class="ml-1 text-sm text-surface-400 line-through">{formatPrice(rp.price)}</span>
									{:else}
										<span class="font-semibold text-surface-900">{formatPrice(rp.price)}</span>
									{/if}
								</div>
							</div>
						</Card>
					</a>
				{/each}
			</div>
		</section>
	{/if}
</div>
