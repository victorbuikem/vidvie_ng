<script lang="ts">
	import {
		Button,
		Input,
		Textarea,
		Select,
		Dialog,
		Badge,
		Card,
		Pagination,
		Separator
	} from '$lib/components/ui';

	let dialogOpen = $state(false);
	let selectValue = $state('');
	let currentPage = $state(1);

	const selectOptions = [
		{ value: 'headphones', label: 'Headphones' },
		{ value: 'powerbanks', label: 'Power Banks' },
		{ value: 'cables', label: 'Cables' },
		{ value: 'chargers', label: 'Chargers' }
	];
</script>

<svelte:head>
	<title>Component Showcase | Vidvie Dev</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-12">
	<h1 class="text-3xl font-bold text-surface-900">Component Showcase</h1>
	<p class="mt-2 text-surface-500">All custom UI components built on top of bits-ui.</p>

	<Separator class="my-8" />

	<!-- Buttons -->
	<section>
		<h2 class="text-xl font-semibold text-surface-900">Buttons</h2>
		<div class="mt-4 flex flex-wrap gap-3">
			<Button variant="primary">Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="danger">Danger</Button>
			<Button variant="primary" disabled>Disabled</Button>
		</div>
		<div class="mt-4 flex flex-wrap items-center gap-3">
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
		</div>
	</section>

	<Separator class="my-8" />

	<!-- Inputs -->
	<section>
		<h2 class="text-xl font-semibold text-surface-900">Inputs</h2>
		<div class="mt-4 max-w-sm space-y-4">
			<div>
				<label for="demo-input" class="mb-1 block text-sm font-medium text-surface-700">Text Input</label>
				<Input id="demo-input" placeholder="Enter your name..." />
			</div>
			<div>
				<label for="demo-textarea" class="mb-1 block text-sm font-medium text-surface-700">Textarea</label>
				<Textarea id="demo-textarea" placeholder="Write a message..." />
			</div>
		</div>
	</section>

	<Separator class="my-8" />

	<!-- Select -->
	<section>
		<h2 class="text-xl font-semibold text-surface-900">Select</h2>
		<div class="mt-4 max-w-sm">
			<Select options={selectOptions} bind:value={selectValue} placeholder="Choose a category..." />
			{#if selectValue}
				<p class="mt-2 text-sm text-surface-500">Selected: {selectValue}</p>
			{/if}
		</div>
	</section>

	<Separator class="my-8" />

	<!-- Badges -->
	<section>
		<h2 class="text-xl font-semibold text-surface-900">Badges</h2>
		<div class="mt-4 flex flex-wrap gap-2">
			<Badge>Default</Badge>
			<Badge variant="brand">Brand</Badge>
			<Badge variant="success">Success</Badge>
			<Badge variant="warning">Warning</Badge>
			<Badge variant="danger">Danger</Badge>
		</div>
	</section>

	<Separator class="my-8" />

	<!-- Cards -->
	<section>
		<h2 class="text-xl font-semibold text-surface-900">Cards</h2>
		<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Card>
				<h3 class="font-semibold text-surface-900">Card Title</h3>
				<p class="mt-1 text-sm text-surface-500">This is a basic card with default padding.</p>
			</Card>
			<Card padding={false}>
				<div class="h-32 bg-brand-100"></div>
				<div class="p-4">
					<h3 class="font-semibold text-surface-900">No Padding Card</h3>
					<p class="mt-1 text-sm text-surface-500">Card with padding disabled for custom content.</p>
				</div>
			</Card>
		</div>
	</section>

	<Separator class="my-8" />

	<!-- Dialog -->
	<section>
		<h2 class="text-xl font-semibold text-surface-900">Dialog</h2>
		<div class="mt-4">
			<Button onclick={() => (dialogOpen = true)}>Open Dialog</Button>
			<Dialog bind:open={dialogOpen} title="Example Dialog" description="This is a dialog component.">
				<p class="text-sm text-surface-600">Dialog content goes here. You can put forms, confirmations, or any other content.</p>
				<div class="mt-4 flex justify-end gap-2">
					<Button variant="outline" onclick={() => (dialogOpen = false)}>Cancel</Button>
					<Button onclick={() => (dialogOpen = false)}>Confirm</Button>
				</div>
			</Dialog>
		</div>
	</section>

	<Separator class="my-8" />

	<!-- Pagination -->
	<section>
		<h2 class="text-xl font-semibold text-surface-900">Pagination</h2>
		<div class="mt-4">
			<Pagination {currentPage} totalPages={10} onPageChange={(p) => (currentPage = p)} />
			<p class="mt-2 text-sm text-surface-500">Page {currentPage} of 10</p>
		</div>
	</section>
</div>
