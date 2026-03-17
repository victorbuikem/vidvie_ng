<script lang="ts">
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
	<title>Payment {data.status === 'success' ? 'Successful' : 'Failed'} — Vidvie</title>
</svelte:head>

<div class="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
	{#if data.status === 'success'}
		<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
			<svg class="h-8 w-8 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
			</svg>
		</div>
		<h1 class="mt-4 text-2xl font-bold text-surface-900">Payment Successful!</h1>
		<p class="mt-2 text-surface-500">Thank you for your order. We'll notify you once it ships.</p>

		{#if data.order}
			<Card class="mt-8 text-left">
				<h2 class="font-semibold text-surface-900">Order Details</h2>
				<p class="mt-1 text-sm text-surface-400">Order ID: {data.order.id}</p>
				<div class="mt-4 space-y-2">
					{#each data.order.items as item}
						<div class="flex justify-between text-sm">
							<span class="text-surface-600">{item.product.name} x {item.quantity}</span>
							<span class="font-medium">{formatPrice(item.priceAtPurchase * item.quantity)}</span>
						</div>
					{/each}
				</div>
				<div class="mt-4 border-t border-surface-200 pt-4 flex justify-between font-semibold">
					<span>Total</span>
					<span>{formatPrice(data.order.total)}</span>
				</div>
			</Card>
		{/if}
	{:else}
		<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
			<svg class="h-8 w-8 text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</div>
		<h1 class="mt-4 text-2xl font-bold text-surface-900">Payment {data.status === 'failed' ? 'Failed' : 'Error'}</h1>
		<p class="mt-2 text-surface-500">{data.message}</p>
	{/if}

	<div class="mt-8 flex justify-center gap-3">
		<a href="/shop"><Button variant="outline">Continue Shopping</Button></a>
		<a href="/"><Button>Go Home</Button></a>
	</div>
</div>
