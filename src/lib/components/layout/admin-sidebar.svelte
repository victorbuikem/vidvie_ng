<script lang="ts">
	import { page } from '$app/state';

	const navItems = [
		{
			href: '/admin',
			label: 'Dashboard',
			icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
			exact: true
		},
		{
			href: '/admin/products',
			label: 'Products',
			icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
		},
		{
			href: '/admin/categories',
			label: 'Categories',
			icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
		},
		{
			href: '/admin/orders',
			label: 'Orders',
			icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
		}
	];

	const isActive = (href: string, exact = false) => {
		if (exact) return page.url.pathname === href;
		return page.url.pathname.startsWith(href);
	};
</script>

<aside class="flex h-screen w-64 flex-col border-r border-surface-300 bg-surface-100">
	<!-- Logo -->
	<div class="flex h-16 items-center border-b border-surface-300 px-6">
		<a href="/admin" class="font-heading text-xl font-semibold tracking-wider text-brand-900">
			VIDVIE <span class="text-sm font-normal text-surface-400">Admin</span>
		</a>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 space-y-1 px-3 py-4">
		{#each navItems as item}
			<a
				href={item.href}
				class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors {isActive(item.href, item.exact)
					? 'bg-brand-300/30 text-brand-900'
					: 'text-surface-600 hover:bg-brand-300/15 hover:text-surface-900'}"
			>
				<svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
				</svg>
				{item.label}
			</a>
		{/each}
	</nav>

	<!-- Bottom -->
	<div class="border-t border-surface-200 p-4">
		<a
			href="/"
			class="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700"
		>
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
			Back to Store
		</a>
	</div>
</aside>
