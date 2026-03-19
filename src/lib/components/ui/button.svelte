<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		variant?: Variant;
		size?: Size;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		children: Snippet;
		onclick?: (e: MouseEvent) => void;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		type = 'button',
		class: className = '',
		children,
		onclick,
		...restProps
	}: Props = $props();

	const variantClasses: Record<Variant, string> = {
		primary:
			'bg-brand-900 text-surface-100 hover:bg-surface-800 focus-visible:ring-brand-400',
		secondary:
			'bg-brand-200 text-brand-900 hover:bg-brand-300 focus-visible:ring-brand-400',
		outline:
			'border border-brand-900 text-brand-900 hover:bg-brand-200 focus-visible:ring-brand-400',
		ghost:
			'text-brand-900 hover:bg-brand-200 focus-visible:ring-brand-400',
		danger:
			'bg-danger-500 text-white hover:bg-danger-600 focus-visible:ring-danger-500'
	};

	const sizeClasses: Record<Size, string> = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};
</script>

<ButtonPrimitive.Root
	{disabled}
	{type}
	{onclick}
	class="inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 {variantClasses[variant]} {sizeClasses[size]} {className}"
	{...restProps}
>
	{@render children()}
</ButtonPrimitive.Root>
