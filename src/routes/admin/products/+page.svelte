<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import Pagination from '$lib/components/ui/pagination.svelte';

	let { data } = $props();

	let searchQuery = $state(data.search ?? '');

	const formatPrice = (kobo: number) => {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 0
		}).format(kobo / 100);
	};

	const handleSearch = (e: Event) => {
		e.preventDefault();
		const params = new URLSearchParams();
		if (searchQuery) params.set('search', searchQuery);
		goto(`/admin/products?${params.toString()}`);
	};
</script>

<svelte:head>
	<title>Products — Admin — Vidvie</title>
</svelte:head>

<div>
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-surface-900">Products</h1>
		<a href="/admin/products/new"><Button>Add Product</Button></a>
	</div>

	<!-- Search -->
	<form class="mt-4 flex gap-2" onsubmit={handleSearch}>
		<Input bind:value={searchQuery} placeholder="Search products..." class="max-w-sm" />
		<Button type="submit" variant="secondary">Search</Button>
	</form>

	<p class="mt-2 text-sm text-surface-500">{data.totalProducts} products total</p>

	<Card class="mt-4" padding={false}>
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="border-b border-surface-200 bg-surface-50 text-left">
					<tr>
						<th class="px-4 py-3 font-medium text-surface-500">Product</th>
						<th class="px-4 py-3 font-medium text-surface-500">Category</th>
						<th class="px-4 py-3 font-medium text-surface-500">Price</th>
						<th class="px-4 py-3 font-medium text-surface-500">Stock</th>
						<th class="px-4 py-3 font-medium text-surface-500">Featured</th>
						<th class="px-4 py-3 font-medium text-surface-500">Active</th>
						<th class="px-4 py-3 font-medium text-surface-500">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-surface-200">
					{#each data.products as product}
						<tr class="hover:bg-surface-50">
							<td class="px-4 py-3">
								<div class="flex items-center gap-3">
									{#if product.images[0]}
										<img src={product.images[0]} alt="" class="h-10 w-10 rounded-lg object-cover" />
									{:else}
										<div class="h-10 w-10 rounded-lg bg-surface-100"></div>
									{/if}
									<span class="font-medium text-surface-900">{product.name}</span>
								</div>
							</td>
							<td class="px-4 py-3 text-surface-500">{product.category?.name ?? '-'}</td>
							<td class="px-4 py-3">
								{#if product.discountPrice}
									<span class="font-medium text-brand-600">{formatPrice(product.discountPrice)}</span>
									<span class="ml-1 text-xs text-surface-400 line-through">{formatPrice(product.price)}</span>
								{:else}
									<span class="font-medium">{formatPrice(product.price)}</span>
								{/if}
							</td>
							<td class="px-4 py-3">
								<Badge variant={product.stock === 0 ? 'danger' : product.stock < 5 ? 'warning' : 'default'}>
									{product.stock}
								</Badge>
							</td>
							<td class="px-4 py-3">
								<form method="POST" action="?/toggleFeatured" use:enhance>
									<input type="hidden" name="id" value={product.id} />
									<input type="hidden" name="featured" value={!product.featuredOnLanding} />
									<button
										type="submit"
										class="h-5 w-9 rounded-full transition-colors {product.featuredOnLanding ? 'bg-brand-600' : 'bg-surface-300'}"
									>
										<span class="block h-4 w-4 translate-x-0.5 rounded-full bg-white transition-transform {product.featuredOnLanding ? 'translate-x-4.5' : ''}"></span>
									</button>
								</form>
							</td>
							<td class="px-4 py-3">
								<form method="POST" action="?/toggleActive" use:enhance>
									<input type="hidden" name="id" value={product.id} />
									<input type="hidden" name="active" value={!product.active} />
									<button
										type="submit"
										class="h-5 w-9 rounded-full transition-colors {product.active ? 'bg-success-500' : 'bg-surface-300'}"
									>
										<span class="block h-4 w-4 translate-x-0.5 rounded-full bg-white transition-transform {product.active ? 'translate-x-4.5' : ''}"></span>
									</button>
								</form>
							</td>
							<td class="px-4 py-3">
								<div class="flex gap-2">
									<a href="/admin/products/{product.id}">
										<Button variant="ghost" size="sm">Edit</Button>
									</a>
									<form
										method="POST"
										action="?/delete"
										use:enhance={() => {
											return async ({ result, update }) => {
												if (result.type === 'success') {
													toast.success('Product deleted');
													await update();
												}
											};
										}}
									>
										<input type="hidden" name="id" value={product.id} />
										<Button variant="ghost" size="sm" type="submit" class="text-danger-500">Delete</Button>
									</form>
								</div>
							</td>
						</tr>
					{/each}
					{#if data.products.length === 0}
						<tr>
							<td colspan="7" class="px-4 py-8 text-center text-surface-400">No products found</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</Card>

	{#if data.totalPages > 1}
		<div class="mt-4 flex justify-center">
			<Pagination
				currentPage={data.currentPage}
				totalPages={data.totalPages}
				onPageChange={(p) => {
					const params = new URLSearchParams();
					if (data.search) params.set('search', data.search);
					params.set('page', String(p));
					goto(`/admin/products?${params.toString()}`);
				}}
			/>
		</div>
	{/if}
</div>
