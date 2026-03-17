<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		padding?: boolean;
		children: Snippet;
	}

	let { class: className = '', padding = true, children }: Props = $props();
</script>

<div
	class="rounded-xl border border-surface-200 bg-white shadow-sm {padding ? 'p-6' : ''} {className}"
>
	{@render children()}
</div>
