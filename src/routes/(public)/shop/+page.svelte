<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import Pagination from '$lib/components/ui/pagination.svelte';
	import { proxyImageUrl } from '$lib/utils/image';

	let { data } = $props();

	let searchQuery = $state(data.filters.search ?? '');

	const formatPrice = (kobo: number) => {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 0
		}).format(kobo / 100);
	};

	const updateFilter = (key: string, value: string | null) => {
		const params = new URLSearchParams(page.url.searchParams);
		if (value) {
			params.set(key, value);
		} else {
			params.delete(key);
		}
		params.delete('page'); // reset page on filter change
		goto(`/shop?${params.toString()}`, { replaceState: true });
	};

	const handleSearch = (e: Event) => {
		e.preventDefault();
		updateFilter('search', searchQuery || null);
	};

	const handlePageChange = (p: number) => {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', String(p));
		goto(`/shop?${params.toString()}`);
	};
</script>

<svelte:head>
	<title>Shop — Vidvie</title>
	<meta name="description" content="Browse our full collection of headphones, power banks, cables and accessories." />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<h1 class="font-heading text-3xl font-medium text-surface-900">Catalog</h1>

	<div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
		<!-- Sidebar Filters -->
		<aside class="space-y-6">
			<!-- Search -->
			<div>
				<h3 class="text-sm font-semibold text-surface-900">Search</h3>
				<form class="mt-2 flex gap-2" onsubmit={handleSearch}>
					<Input bind:value={searchQuery} placeholder="Search products..." />
					<Button type="submit" size="sm">Go</Button>
				</form>
			</div>

			<!-- Categories -->
			<div>
				<h3 class="text-sm font-semibold text-surface-900">Categories</h3>
				<div class="mt-2 space-y-1">
					<button
						class="block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors {!data.filters.category ? 'bg-brand-300/30 text-brand-900 font-medium' : 'text-surface-600 hover:bg-surface-50'}"
						onclick={() => updateFilter('category', null)}
					>
						All Categories
					</button>
					{#each data.categories as category}
						<button
							class="block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors {data.filters.category === category.slug ? 'bg-brand-300/30 text-brand-900 font-medium' : 'text-surface-600 hover:bg-surface-50'}"
							onclick={() => updateFilter('category', category.slug)}
						>
							{category.name}
						</button>
					{/each}
				</div>
			</div>

			<!-- Sort -->
			<div>
				<h3 class="text-sm font-semibold text-surface-900">Sort By</h3>
				<div class="mt-2 space-y-1">
					{#each [
						{ value: 'newest', label: 'Newest' },
						{ value: 'price-asc', label: 'Price: Low to High' },
						{ value: 'price-desc', label: 'Price: High to Low' }
					] as option}
						<button
							class="block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors {data.filters.sort === option.value ? 'bg-brand-300/30 text-brand-900 font-medium' : 'text-surface-600 hover:bg-surface-50'}"
							onclick={() => updateFilter('sort', option.value)}
						>
							{option.label}
						</button>
					{/each}
				</div>
			</div>
		</aside>

		<!-- Product Grid -->
		<div class="lg:col-span-3">
			<div class="mb-4 flex items-center justify-between">
				<p class="text-sm text-surface-500">
					{data.totalProducts} product{data.totalProducts === 1 ? '' : 's'} found
				</p>
				{#if data.filters.search || data.filters.category}
					<Button variant="ghost" size="sm" onclick={() => goto('/shop')}>
						Clear Filters
					</Button>
				{/if}
			</div>

			{#if data.products.length === 0}
				<div class="py-16 text-center">
					<p class="text-lg text-surface-500">No products found</p>
					<p class="mt-1 text-sm text-surface-400">Try adjusting your filters or search terms.</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
					{#each data.products as product}
						<a href="/shop/{product.slug}" class="group">
							<Card padding={false}>
								<div class="relative aspect-square overflow-hidden rounded-t-[1.2rem] bg-surface-100">
									{#if product.images[0]}
										<img
											src={proxyImageUrl(product.images[0])}
											alt={product.name}
											class="h-full w-full object-cover transition-transform group-hover:scale-105"
										/>
									{/if}
									{#if product.discountPrice}
										<div class="absolute top-2 left-2">
											<Badge variant="danger">Sale</Badge>
										</div>
									{/if}
									{#if product.stock === 0}
										<div class="absolute inset-0 flex items-center justify-center bg-black/40">
											<span class="rounded-full bg-white px-3 py-1 text-sm font-medium text-surface-900">Out of Stock</span>
										</div>
									{/if}
								</div>
								<div class="p-4">
									<p class="text-xs text-surface-400">{product.category?.name}</p>
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

				{#if data.totalPages > 1}
					<div class="mt-8 flex justify-center">
						<Pagination
							currentPage={data.currentPage}
							totalPages={data.totalPages}
							onPageChange={handlePageChange}
						/>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>
