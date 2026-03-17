<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import type { Snippet } from 'svelte';

	interface MenuItem {
		label: string;
		onclick: () => void;
		destructive?: boolean;
	}

	interface Props {
		items: MenuItem[];
		trigger: Snippet;
	}

	let { items, trigger }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{@render trigger()}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content
		class="z-50 min-w-[160px] rounded-lg border border-surface-200 bg-white py-1 shadow-lg"
		sideOffset={4}
	>
		{#each items as item}
			<DropdownMenu.Item
				class="cursor-pointer px-3 py-2 text-sm transition-colors data-[highlighted]:bg-surface-100 {item.destructive ? 'text-danger-600 data-[highlighted]:text-danger-700' : 'text-surface-700'}"
				onSelect={item.onclick}
			>
				{item.label}
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
