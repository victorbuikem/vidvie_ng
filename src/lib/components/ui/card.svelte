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
	class="rounded-[1.2rem] bg-surface-100 {padding ? 'p-6' : ''} {className}"
>
	{@render children()}
</div>
