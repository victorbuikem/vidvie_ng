<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button.svelte';

	interface Props {
		user?: { name: string; email: string } | null;
		cartCount?: number;
	}

	let { user = null, cartCount = 0 }: Props = $props();
	let mobileMenuOpen = $state(false);

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/shop', label: 'Catalog' },
		{ href: '/contact', label: 'Contact' }
	];

	const isActive = (href: string) => {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	};
</script>

<header class="sticky top-0 z-40 border-b border-surface-300/50 bg-brand-200/95 backdrop-blur-sm">
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
		<!-- Logo -->
		<a href="/" class="font-heading text-xl font-semibold tracking-wider text-brand-900">
			VIDVIE<sup class="text-[0.5em]">&reg;</sup>
		</a>

		<!-- Desktop Nav -->
		<nav class="hidden items-center gap-1 md:flex">
			{#each navLinks as link}
				<a
					href={link.href}
					class="rounded-full px-4 py-2 text-sm font-medium transition-colors {isActive(link.href)
						? 'text-brand-900 bg-brand-300/40'
						: 'text-surface-700 hover:text-brand-900 hover:bg-brand-300/20'}"
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<!-- Right side -->
		<div class="flex items-center gap-2">
			<!-- Search -->
			<a
				href="/shop"
				class="rounded-full p-2 text-surface-700 transition-colors hover:bg-brand-300/20 hover:text-brand-900"
				aria-label="Search"
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
				</svg>
			</a>

			<!-- Cart -->
			<a
				href="/cart"
				class="relative rounded-full p-2 text-surface-700 transition-colors hover:bg-brand-300/20 hover:text-brand-900"
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
				</svg>
				{#if cartCount > 0}
					<span class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-400 text-xs font-medium text-brand-900">
						{cartCount > 99 ? '99+' : cartCount}
					</span>
				{/if}
			</a>

			<!-- Auth -->
			{#if user}
				<a href="/account" class="hidden rounded-full px-3 py-1.5 text-sm text-surface-700 hover:text-brand-900 md:block">
					{user.name}
				</a>
			{:else}
				<div class="hidden md:block">
					<a href="/login">
						<Button variant="outline" size="sm">Sign In</Button>
					</a>
				</div>
			{/if}

			<!-- Mobile menu button -->
			<button
				class="rounded-full p-2 text-surface-700 hover:bg-brand-300/20 md:hidden"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			>
				{#if mobileMenuOpen}
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{:else}
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if mobileMenuOpen}
		<div class="border-t border-surface-300/50 bg-brand-200 md:hidden">
			<div class="space-y-1 px-4 py-3">
				{#each navLinks as link}
					<a
						href={link.href}
						class="block rounded-full px-4 py-2 text-sm font-medium {isActive(link.href)
							? 'text-brand-900 bg-brand-300/40'
							: 'text-surface-700 hover:bg-brand-300/20'}"
						onclick={() => (mobileMenuOpen = false)}
					>
						{link.label}
					</a>
				{/each}
				{#if !user}
					<a
						href="/login"
						class="block rounded-full px-4 py-2 text-sm font-medium text-brand-900"
						onclick={() => (mobileMenuOpen = false)}
					>
						Sign In
					</a>
				{:else}
					<a
						href="/account"
						class="block rounded-full px-4 py-2 text-sm font-medium text-surface-700"
						onclick={() => (mobileMenuOpen = false)}
					>
						My Account
					</a>
				{/if}
			</div>
		</div>
	{/if}
</header>
