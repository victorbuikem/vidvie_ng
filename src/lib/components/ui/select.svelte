<script lang="ts">
	import { Select } from 'bits-ui';
	import type { Snippet } from 'svelte';

	interface SelectOption {
		value: string;
		label: string;
	}

	interface Props {
		options: SelectOption[];
		value?: string;
		placeholder?: string;
		name?: string;
		disabled?: boolean;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		options,
		value = $bindable(''),
		placeholder = 'Select...',
		name,
		disabled = false,
		class: className = '',
		onchange
	}: Props = $props();

	let selected = $state<SelectOption | undefined>(
		options.find((o) => o.value === value)
	);
</script>

<Select.Root
	type="single"
	{disabled}
	onValueChange={(v) => {
		value = v;
		selected = options.find((o) => o.value === v);
		onchange?.(v);
	}}
>
	{#if name}
		<input type="hidden" {name} {value} />
	{/if}
	<Select.Trigger
		class="inline-flex w-full items-center justify-between rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 {className}"
	>
		<span class={!selected ? 'text-surface-400' : ''}>
			{selected?.label ?? placeholder}
		</span>
		<svg class="h-4 w-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</Select.Trigger>
	<Select.Content
		class="z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-surface-200 bg-white py-1 shadow-lg"
		sideOffset={4}
	>
		{#each options as option (option.value)}
			<Select.Item
				value={option.value}
				label={option.label}
				class="cursor-pointer px-3 py-2 text-sm text-surface-700 hover:bg-brand-50 hover:text-brand-700 data-[highlighted]:bg-brand-50 data-[highlighted]:text-brand-700"
			>
				{#snippet children({ selected: isSelected })}
					<span class="flex items-center gap-2">
						{#if isSelected}
							<svg class="h-4 w-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
						{:else}
							<span class="h-4 w-4"></span>
						{/if}
						{option.label}
					</span>
				{/snippet}
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
