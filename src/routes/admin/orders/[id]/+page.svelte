<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import Separator from '$lib/components/ui/separator.svelte';

	let { data } = $props();
	let { order } = $derived(data);

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

	const shipping = order.shippingAddress as { name: string; phone: string; address: string; city: string; state: string };
</script>

<svelte:head>
	<title>Order {order.id.slice(0, 12)} — Admin — Vidvie</title>
</svelte:head>

<div class="mx-auto max-w-3xl">
	<div class="flex items-center gap-3">
		<a href="/admin/orders" class="text-surface-400 hover:text-surface-600">
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
		</a>
		<h1 class="text-2xl font-bold text-surface-900">Order Details</h1>
	</div>

	<div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Order Info -->
		<Card>
			<h2 class="font-semibold text-surface-900">Order Info</h2>
			<dl class="mt-3 space-y-2 text-sm">
				<div class="flex justify-between">
					<dt class="text-surface-500">Order ID</dt>
					<dd class="font-mono text-surface-900">{order.id}</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-surface-500">Date</dt>
					<dd class="text-surface-900">{formatDate(order.createdAt)}</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-surface-500">Status</dt>
					<dd><Badge variant={statusBadge(order.status)}>{order.status}</Badge></dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-surface-500">Payment</dt>
					<dd><Badge variant={statusBadge(order.paymentStatus)}>{order.paymentStatus}</Badge></dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-surface-500">Payment Ref</dt>
					<dd class="font-mono text-xs text-surface-900">{order.paymentReference ?? '-'}</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-surface-500">Total</dt>
					<dd class="text-lg font-bold text-surface-900">{formatPrice(order.total)}</dd>
				</div>
			</dl>
		</Card>

		<!-- Customer & Shipping -->
		<Card>
			<h2 class="font-semibold text-surface-900">Customer</h2>
			<dl class="mt-3 space-y-2 text-sm">
				<div class="flex justify-between">
					<dt class="text-surface-500">Name</dt>
					<dd class="text-surface-900">{order.user.name}</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-surface-500">Email</dt>
					<dd class="text-surface-900">{order.user.email}</dd>
				</div>
			</dl>
			<Separator class="my-4" />
			<h2 class="font-semibold text-surface-900">Shipping Address</h2>
			<div class="mt-2 text-sm text-surface-600">
				<p>{shipping.name}</p>
				<p>{shipping.phone}</p>
				<p>{shipping.address}</p>
				<p>{shipping.city}, {shipping.state}</p>
			</div>
		</Card>
	</div>

	<!-- Order Items -->
	<Card class="mt-6" padding={false}>
		<div class="px-6 pt-6">
			<h2 class="font-semibold text-surface-900">Items</h2>
		</div>
		<div class="mt-3 overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="border-b border-surface-200 bg-surface-50 text-left">
					<tr>
						<th class="px-6 py-3 font-medium text-surface-500">Product</th>
						<th class="px-6 py-3 font-medium text-surface-500">Qty</th>
						<th class="px-6 py-3 font-medium text-surface-500">Price</th>
						<th class="px-6 py-3 font-medium text-surface-500">Subtotal</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-surface-200">
					{#each order.items as item}
						<tr>
							<td class="px-6 py-3">
								<div class="flex items-center gap-3">
									{#if item.product.images[0]}
										<img src={item.product.images[0]} alt="" class="h-10 w-10 rounded-lg object-cover" />
									{/if}
									<span class="font-medium text-surface-900">{item.product.name}</span>
								</div>
							</td>
							<td class="px-6 py-3">{item.quantity}</td>
							<td class="px-6 py-3">{formatPrice(item.priceAtPurchase)}</td>
							<td class="px-6 py-3 font-medium">{formatPrice(item.priceAtPurchase * item.quantity)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Card>

	<!-- Update Status -->
	<Card class="mt-6">
		<h2 class="font-semibold text-surface-900">Update Status</h2>
		<form
			method="POST"
			action="?/updateStatus"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						toast.success('Order status updated');
						await update();
					}
				};
			}}
			class="mt-3 flex gap-2"
		>
			<select
				name="status"
				class="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
			>
				{#each ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as status}
					<option value={status} selected={order.status === status}>
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</option>
				{/each}
			</select>
			<Button type="submit" size="sm">Update</Button>
		</form>
	</Card>
</div>
