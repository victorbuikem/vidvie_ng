<script lang="ts">
	interface Props {
		orientation?: 'horizontal' | 'vertical';
		class?: string;
	}

	let { orientation = 'horizontal', class: className = '' }: Props = $props();
</script>

<div
	role="separator"
	aria-orientation={orientation}
	class="{orientation === 'horizontal'
		? 'h-px w-full'
		: 'h-full w-px'} bg-surface-200 {className}"
></div>
