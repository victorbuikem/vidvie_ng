<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import Pagination from '$lib/components/ui/pagination.svelte';

	let { data } = $props();

	const formatPrice = (kobo: number) => {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 0
		}).format(kobo / 100);
	};

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString('en-NG', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const statusBadge = (status: string): 'success' | 'warning' | 'danger' | 'default' | 'brand' => {
		const map: Record<string, 'success' | 'warning' | 'danger' | 'default' | 'brand'> = {
			confirmed: 'success',
			shipped: 'brand',
			delivered: 'success',
			pending: 'warning',
			cancelled: 'danger',
			success: 'success',
			failed: 'danger'
		};
		return map[status] ?? 'default';
	};

	const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

	const setFilter = (status: string | null) => {
		const params = new URLSearchParams(page.url.searchParams);
		if (status) {
			params.set('status', status);
		} else {
			params.delete('status');
		}
		params.delete('page');
		goto(`?${params.toString()}`);
	};

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', String(newPage));
		goto(`?${params.toString()}`);
	};
</script>

<svelte:head>
	<title>Your Orders — Vidvie</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
	<div class="flex items-center gap-3">
		<a href="/account" class="text-surface-400 hover:text-surface-600">
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
		</a>
		<h1 class="font-heading text-3xl font-medium text-surface-900">Your Orders</h1>
	</div>

	<!-- Status Filters -->
	<div class="mt-6 flex flex-wrap gap-2">
		<Button
			variant={!data.statusFilter ? 'primary' : 'outline'}
			size="sm"
			onclick={() => setFilter(null)}
		>
			All
		</Button>
		{#each statuses as status}
			<Button
				variant={data.statusFilter === status ? 'primary' : 'outline'}
				size="sm"
				onclick={() => setFilter(status)}
			>
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</Button>
		{/each}
	</div>

	<!-- Order List -->
	{#if data.orders.length === 0}
		<div class="mt-12 text-center">
			<svg class="mx-auto h-12 w-12 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
			</svg>
			<p class="mt-4 text-surface-500">
				{data.statusFilter ? `No ${data.statusFilter} orders` : "You haven't placed any orders yet."}
			</p>
			<a href="/shop" class="mt-4 inline-block">
				<Button variant="primary">Start Shopping</Button>
			</a>
		</div>
	{:else}
		<div class="mt-6 space-y-4">
			{#each data.orders as order}
				<a href="/account/orders/{order.id}" class="block">
					<Card class="transition-shadow hover:shadow-[0_0.4rem_0.8rem_rgba(0,0,0,0.12)]">
						<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div class="space-y-1">
								<div class="flex flex-wrap items-center gap-2">
									<span class="font-mono text-sm text-surface-600">{order.id.slice(0, 16)}...</span>
									<Badge variant={statusBadge(order.status)}>{order.status}</Badge>
									<Badge variant={statusBadge(order.paymentStatus)}>{order.paymentStatus}</Badge>
								</div>
								<p class="text-sm text-surface-500">
									{formatDate(order.createdAt)} &middot; {order.items.length} item{order.items.length !== 1 ? 's' : ''}
								</p>
							</div>
							<div class="text-right">
								<p class="text-lg font-semibold text-surface-900">{formatPrice(order.total)}</p>
								<p class="text-sm text-brand-400">View Details &rarr;</p>
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
