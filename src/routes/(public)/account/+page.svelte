<script lang="ts">
	import { enhance } from '$app/forms';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';

	let { data } = $props();

	const formatDate = (date: Date | string) => {
		return new Date(date).toLocaleDateString('en-NG', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const formatPrice = (kobo: number) => {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 0
		}).format(kobo / 100);
	};
</script>

<svelte:head>
	<title>My Account — Vidvie</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<div>
		<h1 class="font-heading text-3xl font-medium text-surface-900">My Account</h1>
		<p class="mt-1 text-surface-500">
			Welcome, {data.user.name}. Member since {formatDate(data.user.createdAt)}.
		</p>
	</div>

	<div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		<!-- Your Orders -->
		<a href="/account/orders" class="group">
			<Card class="h-full transition-shadow hover:shadow-[0_0.4rem_0.8rem_rgba(0,0,0,0.12)]">
				<div class="flex items-start gap-4">
					<div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-200">
						<svg class="size-5 text-brand-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
						</svg>
					</div>
					<div>
						<h2 class="font-heading text-lg font-medium text-surface-900">Your Orders</h2>
						<p class="mt-1 text-sm text-surface-500">Track, view, and manage your orders</p>
						{#if data.orderCount > 0}
							<p class="mt-2 text-sm text-surface-600">
								{data.orderCount} order{data.orderCount !== 1 ? 's' : ''}
								{#if data.recentOrder}
									&middot; Last: {formatDate(data.recentOrder.createdAt)}
								{/if}
							</p>
						{:else}
							<p class="mt-2 text-sm text-surface-400">No orders yet</p>
						{/if}
					</div>
				</div>
			</Card>
		</a>

		<!-- Profile -->
		<a href="/account/profile" class="group">
			<Card class="h-full transition-shadow hover:shadow-[0_0.4rem_0.8rem_rgba(0,0,0,0.12)]">
				<div class="flex items-start gap-4">
					<div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-200">
						<svg class="size-5 text-brand-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
						</svg>
					</div>
					<div>
						<h2 class="font-heading text-lg font-medium text-surface-900">Profile</h2>
						<p class="mt-1 text-sm text-surface-500">Edit your name and personal details</p>
						<p class="mt-2 text-sm text-surface-600">{data.user.email}</p>
					</div>
				</div>
			</Card>
		</a>

		<!-- Security -->
		<a href="/account/security" class="group">
			<Card class="h-full transition-shadow hover:shadow-[0_0.4rem_0.8rem_rgba(0,0,0,0.12)]">
				<div class="flex items-start gap-4">
					<div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-200">
						<svg class="size-5 text-brand-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
						</svg>
					</div>
					<div>
						<h2 class="font-heading text-lg font-medium text-surface-900">Security</h2>
						<p class="mt-1 text-sm text-surface-500">Change your password</p>
						<p class="mt-2 text-sm text-surface-400">Keep your account secure</p>
					</div>
				</div>
			</Card>
		</a>

		<!-- Addresses (Coming Soon) -->
		<div class="cursor-default opacity-60">
			<Card class="h-full">
				<div class="flex items-start gap-4">
					<div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-200">
						<svg class="size-5 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
						</svg>
					</div>
					<div>
						<h2 class="font-heading text-lg font-medium text-surface-500">Addresses</h2>
						<p class="mt-1 text-sm text-surface-400">Manage your shipping addresses</p>
						<p class="mt-2 text-xs font-medium text-surface-400">Coming soon</p>
					</div>
				</div>
			</Card>
		</div>
	</div>

	<!-- Sign Out -->
	<div class="mt-10">
		<form method="POST" action="?/signout" use:enhance>
			<Button variant="outline" type="submit">Sign Out</Button>
		</form>
	</div>
</div>
