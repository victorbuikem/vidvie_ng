<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button.svelte';
</script>

<div class="flex min-h-screen items-center justify-center px-4">
	<div class="text-center">
		<p class="text-6xl font-bold text-brand-600">{page.status}</p>
		<h1 class="mt-4 text-2xl font-bold text-surface-900">
			{#if page.status === 404}
				Page not found
			{:else}
				Something went wrong
			{/if}
		</h1>
		<p class="mt-2 text-surface-500">{page.error?.message ?? 'An unexpected error occurred.'}</p>
		<div class="mt-6 flex justify-center gap-3">
			<a href="/"><Button>Go Home</Button></a>
			<a href="/shop"><Button variant="outline">Browse Shop</Button></a>
		</div>
	</div>
</div>
