<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Separator from '$lib/components/ui/separator.svelte';

	let { data } = $props();

	const formatPrice = (kobo: number) => {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 0
		}).format(kobo / 100);
	};

	const items = $derived(data.cart?.items ?? []);
	const cartTotal = $derived(
		items.reduce((sum, item) => {
			const price = item.product.discountPrice ?? item.product.price;
			return sum + price * item.quantity;
		}, 0)
	);
</script>

<svelte:head>
	<title>Cart — Vidvie</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
	<h1 class="text-3xl font-bold text-surface-900">Shopping Cart</h1>

	{#if items.length === 0}
		<div class="mt-12 text-center">
			<svg class="mx-auto h-16 w-16 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
			</svg>
			<p class="mt-4 text-lg text-surface-500">Your cart is empty</p>
			<div class="mt-6">
				<a href="/shop"><Button>Continue Shopping</Button></a>
			</div>
		</div>
	{:else}
		<div class="mt-8 space-y-4">
			{#each items as item}
				<Card>
					<div class="flex gap-4">
						<!-- Image -->
						<div class="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-100">
							{#if item.product.images[0]}
								<img src={item.product.images[0]} alt={item.product.name} class="h-full w-full object-cover" />
							{/if}
						</div>

						<!-- Details -->
						<div class="flex flex-1 flex-col justify-between">
							<div class="flex justify-between">
								<div>
									<a href="/shop/{item.product.slug}" class="font-medium text-surface-900 hover:text-brand-600">
										{item.product.name}
									</a>
									<p class="text-sm text-surface-400">{item.product.category?.name}</p>
								</div>
								<div class="text-right">
									<p class="font-semibold text-surface-900">
										{formatPrice((item.product.discountPrice ?? item.product.price) * item.quantity)}
									</p>
									<p class="text-sm text-surface-400">
										{formatPrice(item.product.discountPrice ?? item.product.price)} each
									</p>
								</div>
							</div>

							<div class="flex items-center justify-between">
								<!-- Quantity -->
								<form method="POST" action="?/updateQuantity" use:enhance class="flex items-center gap-2">
									<input type="hidden" name="itemId" value={item.id} />
									<div class="flex items-center rounded-lg border border-surface-300">
										<button
											type="submit"
											name="quantity"
											value={Math.max(0, item.quantity - 1)}
											class="px-2 py-1 text-sm text-surface-600 hover:text-surface-900"
										>
											-
										</button>
										<span class="w-8 text-center text-sm">{item.quantity}</span>
										<button
											type="submit"
											name="quantity"
											value={item.quantity + 1}
											class="px-2 py-1 text-sm text-surface-600 hover:text-surface-900"
										>
											+
										</button>
									</div>
								</form>

								<!-- Remove -->
								<form method="POST" action="?/removeItem" use:enhance>
									<input type="hidden" name="itemId" value={item.id} />
									<button type="submit" class="text-sm text-danger-500 hover:text-danger-600">
										Remove
									</button>
								</form>
							</div>
						</div>
					</div>
				</Card>
			{/each}
		</div>

		<Separator class="my-6" />

		<!-- Cart Summary -->
		<div class="flex items-center justify-between">
			<span class="text-lg font-semibold text-surface-900">Total</span>
			<span class="text-2xl font-bold text-surface-900">{formatPrice(cartTotal)}</span>
		</div>

		<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
			<a href="/shop"><Button variant="outline">Continue Shopping</Button></a>
			<a href="/checkout"><Button size="lg">Proceed to Checkout</Button></a>
		</div>
	{/if}
</div>
