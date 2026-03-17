<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	import Badge from '$lib/components/ui/badge.svelte';

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
			day: 'numeric'
		});
	};

	const statusBadge = (status: string) => {
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
</script>

<svelte:head>
	<title>Admin Dashboard — Vidvie</title>
</svelte:head>

<div>
	<h1 class="text-2xl font-bold text-surface-900">Dashboard</h1>

	<!-- Stats -->
	<div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<Card>
			<p class="text-sm text-surface-500">Total Orders</p>
			<p class="mt-1 text-3xl font-bold text-surface-900">{data.totalOrders}</p>
		</Card>
		<Card>
			<p class="text-sm text-surface-500">Total Revenue</p>
			<p class="mt-1 text-3xl font-bold text-success-600">{formatPrice(data.totalRevenue)}</p>
		</Card>
		<Card>
			<p class="text-sm text-surface-500">Low Stock Items</p>
			<p class="mt-1 text-3xl font-bold text-{data.lowStockProducts.length > 0 ? 'warning' : 'surface'}-600">
				{data.lowStockProducts.length}
			</p>
		</Card>
	</div>

	<!-- Low Stock Alert -->
	{#if data.lowStockProducts.length > 0}
		<div class="mt-8">
			<h2 class="text-lg font-semibold text-surface-900">Low Stock Alert</h2>
			<Card class="mt-3">
				<div class="divide-y divide-surface-200">
					{#each data.lowStockProducts as product}
						<div class="flex items-center justify-between py-3 first:pt-0 last:pb-0">
							<div>
								<a href="/admin/products/{product.id}" class="font-medium text-surface-900 hover:text-brand-600">
									{product.name}
								</a>
								<p class="text-sm text-surface-400">{product.category?.name}</p>
							</div>
							<Badge variant={product.stock === 0 ? 'danger' : 'warning'}>
								{product.stock} in stock
							</Badge>
						</div>
					{/each}
				</div>
			</Card>
		</div>
	{/if}

	<!-- Recent Orders -->
	<div class="mt-8">
		<h2 class="text-lg font-semibold text-surface-900">Recent Orders</h2>
		<Card class="mt-3" padding={false}>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="border-b border-surface-200 bg-surface-50 text-left">
						<tr>
							<th class="px-4 py-3 font-medium text-surface-500">Order ID</th>
							<th class="px-4 py-3 font-medium text-surface-500">Items</th>
							<th class="px-4 py-3 font-medium text-surface-500">Total</th>
							<th class="px-4 py-3 font-medium text-surface-500">Status</th>
							<th class="px-4 py-3 font-medium text-surface-500">Payment</th>
							<th class="px-4 py-3 font-medium text-surface-500">Date</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-surface-200">
						{#each data.recentOrders as order}
							<tr class="hover:bg-surface-50">
								<td class="px-4 py-3">
									<a href="/admin/orders/{order.id}" class="text-brand-600 hover:text-brand-700">
										{order.id.slice(0, 12)}...
									</a>
								</td>
								<td class="px-4 py-3 text-surface-600">{order.items.length} items</td>
								<td class="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
								<td class="px-4 py-3"><Badge variant={statusBadge(order.status)}>{order.status}</Badge></td>
								<td class="px-4 py-3"><Badge variant={statusBadge(order.paymentStatus)}>{order.paymentStatus}</Badge></td>
								<td class="px-4 py-3 text-surface-500">{formatDate(order.createdAt)}</td>
							</tr>
						{/each}
						{#if data.recentOrders.length === 0}
							<tr>
								<td colspan="6" class="px-4 py-8 text-center text-surface-400">No orders yet</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</Card>
	</div>
</div>
