<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Separator from '$lib/components/ui/separator.svelte';

	let { data, form } = $props();

	const formatPrice = (kobo: number) => {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 0
		}).format(kobo / 100);
	};

	const nigerianStates = [
		'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
		'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
		'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
		'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
		'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
	];

	let submitting = $state(false);
</script>

<svelte:head>
	<title>Checkout — Vidvie</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
	<h1 class="font-heading text-3xl font-medium text-surface-900">Checkout</h1>

	{#if form?.message || form?.error}
		<div class="mt-4 rounded-lg border border-danger-500 bg-red-50 p-4 text-sm text-danger-600">
			{form.message ?? form.error}
		</div>
	{/if}

	<div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
		<!-- Shipping Form -->
		<div class="lg:col-span-2">
			<Card>
				<h2 class="text-lg font-semibold text-surface-900">Shipping Information</h2>
				<form
					method="POST"
					use:enhance={() => {
						submitting = true;
						return async ({ update }) => {
							submitting = false;
							await update();
						};
					}}
					class="mt-4 space-y-4"
				>
					<div>
						<label for="name" class="mb-1 block text-sm font-medium text-surface-700">Full Name</label>
						<Input id="name" name="name" required value={form?.shipping?.name ?? data.lastAddress?.name ?? data.user.name} />
						{#if form?.errors?.name}
							<p class="mt-1 text-sm text-danger-500">{form.errors.name[0]}</p>
						{/if}
					</div>

					<div>
						<label for="phone" class="mb-1 block text-sm font-medium text-surface-700">Phone Number</label>
						<Input id="phone" name="phone" type="tel" required placeholder="+234..." value={form?.shipping?.phone ?? data.lastAddress?.phone ?? ''} />
						{#if form?.errors?.phone}
							<p class="mt-1 text-sm text-danger-500">{form.errors.phone[0]}</p>
						{/if}
					</div>

					<div>
						<label for="address" class="mb-1 block text-sm font-medium text-surface-700">Address</label>
						<Input id="address" name="address" required placeholder="Street address" value={form?.shipping?.address ?? data.lastAddress?.address ?? ''} />
						{#if form?.errors?.address}
							<p class="mt-1 text-sm text-danger-500">{form.errors.address[0]}</p>
						{/if}
					</div>

					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label for="city" class="mb-1 block text-sm font-medium text-surface-700">City</label>
							<Input id="city" name="city" required value={form?.shipping?.city ?? data.lastAddress?.city ?? ''} />
							{#if form?.errors?.city}
								<p class="mt-1 text-sm text-danger-500">{form.errors.city[0]}</p>
							{/if}
						</div>

						<div>
							<label for="state" class="mb-1 block text-sm font-medium text-surface-700">State</label>
							<select
								id="state"
								name="state"
								required
								class="block w-full rounded-lg border border-surface-300 bg-surface-50 px-3 py-2 text-sm text-surface-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
							>
								<option value="">Select state...</option>
								{#each nigerianStates as state}
									<option value={state} selected={form?.shipping?.state === state || (!form?.shipping?.state && data.lastAddress?.state === state)}>{state}</option>
								{/each}
							</select>
							{#if form?.errors?.state}
								<p class="mt-1 text-sm text-danger-500">{form.errors.state[0]}</p>
							{/if}
						</div>
					</div>

					<Separator class="my-2" />

					<Button type="submit" size="lg" class="w-full" disabled={submitting}>
						{submitting ? 'Processing...' : `Pay ${formatPrice(data.total)}`}
					</Button>
				</form>
			</Card>
		</div>

		<!-- Order Summary -->
		<div>
			<Card>
				<h2 class="text-lg font-semibold text-surface-900">Order Summary</h2>
				<div class="mt-4 space-y-3">
					{#each data.cart?.items ?? [] as item}
						<div class="flex justify-between text-sm">
							<span class="text-surface-600">
								{item.product.name} x {item.quantity}
							</span>
							<span class="font-medium text-surface-900">
								{formatPrice((item.product.discountPrice ?? item.product.price) * item.quantity)}
							</span>
						</div>
					{/each}
				</div>
				<Separator class="my-4" />
				<div class="flex justify-between">
					<span class="font-semibold text-surface-900">Total</span>
					<span class="text-xl font-bold text-surface-900">{formatPrice(data.total)}</span>
				</div>
			</Card>
		</div>
	</div>
</div>
