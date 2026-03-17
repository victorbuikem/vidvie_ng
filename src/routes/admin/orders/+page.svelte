<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
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
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
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

	const setFilter = (key: string, value: string | null) => {
		const params = new URLSearchParams();
		const current = { ...data.filters, [key]: value };
		for (const [k, v] of Object.entries(current)) {
			if (v) params.set(k, v);
		}
		goto(`/admin/orders?${params.toString()}`);
	};
</script>

<svelte:head>
	<title>Orders — Admin — Vidvie</title>
</svelte:head>

<div>
	<h1 class="text-2xl font-bold text-surface-900">Orders</h1>

	<!-- Filters -->
	<div class="mt-4 flex flex-wrap gap-2">
		<Button
			variant={!data.filters.status ? 'primary' : 'outline'}
			size="sm"
			onclick={() => setFilter('status', null)}
		>
			All
		</Button>
		{#each ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as status}
			<Button
				variant={data.filters.status === status ? 'primary' : 'outline'}
				size="sm"
				onclick={() => setFilter('status', status)}
			>
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</Button>
		{/each}
	</div>

	<p class="mt-4 text-sm text-surface-500">{data.totalOrders} orders</p>

	<Card class="mt-4" padding={false}>
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="border-b border-surface-200 bg-surface-50 text-left">
					<tr>
						<th class="px-4 py-3 font-medium text-surface-500">Order ID</th>
						<th class="px-4 py-3 font-medium text-surface-500">Customer</th>
						<th class="px-4 py-3 font-medium text-surface-500">Items</th>
						<th class="px-4 py-3 font-medium text-surface-500">Total</th>
						<th class="px-4 py-3 font-medium text-surface-500">Status</th>
						<th class="px-4 py-3 font-medium text-surface-500">Payment</th>
						<th class="px-4 py-3 font-medium text-surface-500">Date</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-surface-200">
					{#each data.orders as order}
						<tr class="hover:bg-surface-50">
							<td class="px-4 py-3">
								<a href="/admin/orders/{order.id}" class="text-brand-600 hover:text-brand-700">
									{order.id.slice(0, 15)}...
								</a>
							</td>
							<td class="px-4 py-3">
								<div>
									<p class="font-medium text-surface-900">{order.user.name}</p>
									<p class="text-xs text-surface-400">{order.user.email}</p>
								</div>
							</td>
							<td class="px-4 py-3 text-surface-600">{order.items.length}</td>
							<td class="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
							<td class="px-4 py-3"><Badge variant={statusBadge(order.status)}>{order.status}</Badge></td>
							<td class="px-4 py-3"><Badge variant={statusBadge(order.paymentStatus)}>{order.paymentStatus}</Badge></td>
							<td class="px-4 py-3 text-surface-500">{formatDate(order.createdAt)}</td>
						</tr>
					{/each}
					{#if data.orders.length === 0}
						<tr>
							<td colspan="7" class="px-4 py-8 text-center text-surface-400">No orders found</td>
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
					if (data.filters.status) params.set('status', data.filters.status);
					if (data.filters.paymentStatus) params.set('paymentStatus', data.filters.paymentStatus);
					params.set('page', String(p));
					goto(`/admin/orders?${params.toString()}`);
				}}
			/>
		</div>
	{/if}
</div>
