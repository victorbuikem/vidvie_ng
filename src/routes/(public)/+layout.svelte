<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import Footer from '$lib/components/layout/footer.svelte';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: { user: any; cartCount: number }; children: Snippet } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<Header user={data.user} cartCount={data.cartCount} />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
