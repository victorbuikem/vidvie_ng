<script lang="ts">
	interface Props {
		currentPage: number;
		totalPages: number;
		class?: string;
		onPageChange: (page: number) => void;
	}

	let { currentPage, totalPages, class: className = '', onPageChange }: Props = $props();

	const getVisiblePages = () => {
		const pages: (number | '...')[] = [];
		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			pages.push(1);
			if (currentPage > 3) pages.push('...');
			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);
			for (let i = start; i <= end; i++) pages.push(i);
			if (currentPage < totalPages - 2) pages.push('...');
			pages.push(totalPages);
		}
		return pages;
	};

	let visiblePages = $derived(getVisiblePages());
</script>

<nav class="flex items-center gap-1 {className}" aria-label="Pagination">
	<button
		class="rounded-lg px-3 py-2 text-sm text-surface-500 hover:bg-surface-100 disabled:opacity-50 disabled:pointer-events-none"
		disabled={currentPage <= 1}
		onclick={() => onPageChange(currentPage - 1)}
	>
		Previous
	</button>

	{#each visiblePages as page}
		{#if page === '...'}
			<span class="px-2 text-surface-400">...</span>
		{:else}
			<button
				class="rounded-lg px-3 py-2 text-sm font-medium transition-colors {page === currentPage
					? 'bg-brand-600 text-white'
					: 'text-surface-700 hover:bg-surface-100'}"
				onclick={() => onPageChange(page)}
			>
				{page}
			</button>
		{/if}
	{/each}

	<button
		class="rounded-lg px-3 py-2 text-sm text-surface-500 hover:bg-surface-100 disabled:opacity-50 disabled:pointer-events-none"
		disabled={currentPage >= totalPages}
		onclick={() => onPageChange(currentPage + 1)}
	>
		Next
	</button>
</nav>
