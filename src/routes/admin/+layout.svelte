<script lang="ts">
	import AdminSidebar from '$lib/components/layout/admin-sidebar.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex h-screen overflow-hidden">
	<AdminSidebar />
	<main class="flex-1 overflow-auto bg-surface-50 p-6">
		{@render children()}
	</main>
</div>
