<script lang="ts">
	interface Props {
		type?: string;
		value?: string;
		placeholder?: string;
		name?: string;
		id?: string;
		required?: boolean;
		disabled?: boolean;
		class?: string;
		oninput?: (e: Event) => void;
	}

	let {
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		name,
		id,
		required = false,
		disabled = false,
		class: className = '',
		oninput,
		...restProps
	}: Props = $props();
</script>

<input
	{type}
	bind:value
	{placeholder}
	{name}
	{id}
	{required}
	{disabled}
	{oninput}
	class="block w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 {className}"
	{...restProps}
/>
