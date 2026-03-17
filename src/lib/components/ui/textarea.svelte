<script lang="ts">
	interface Props {
		value?: string;
		placeholder?: string;
		name?: string;
		id?: string;
		rows?: number;
		required?: boolean;
		disabled?: boolean;
		class?: string;
	}

	let {
		value = $bindable(''),
		placeholder = '',
		name,
		id,
		rows = 4,
		required = false,
		disabled = false,
		class: className = '',
		...restProps
	}: Props = $props();
</script>

<textarea
	bind:value
	{placeholder}
	{name}
	{id}
	{rows}
	{required}
	{disabled}
	class="block w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 {className}"
	{...restProps}
></textarea>
