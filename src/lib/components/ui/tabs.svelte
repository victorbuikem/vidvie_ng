<script lang="ts">
	import { Tabs } from 'bits-ui';
	import type { Snippet } from 'svelte';

	interface Tab {
		value: string;
		label: string;
		content: Snippet;
	}

	interface Props {
		tabs: Tab[];
		value?: string;
		class?: string;
	}

	let { tabs, value = $bindable(tabs[0]?.value ?? ''), class: className = '' }: Props = $props();
</script>

<Tabs.Root bind:value class={className}>
	<Tabs.List class="flex border-b border-surface-200">
		{#each tabs as tab (tab.value)}
			<Tabs.Trigger
				value={tab.value}
				class="border-b-2 px-4 py-2.5 text-sm font-medium transition-colors border-transparent text-surface-500 hover:text-surface-700 data-[state=active]:border-brand-600 data-[state=active]:text-brand-600"
			>
				{tab.label}
			</Tabs.Trigger>
		{/each}
	</Tabs.List>
	{#each tabs as tab (tab.value)}
		<Tabs.Content value={tab.value} class="pt-4">
			{@render tab.content()}
		</Tabs.Content>
	{/each}
</Tabs.Root>
