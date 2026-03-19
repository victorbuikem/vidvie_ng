<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Textarea from '$lib/components/ui/textarea.svelte';
	import ImageUpload from '$lib/components/ui/image-upload.svelte';

	let { data, form } = $props();
	let submitting = $state(false);
</script>

<svelte:head>
	<title>New Product — Admin — Vidvie</title>
</svelte:head>

<div class="mx-auto max-w-2xl">
	<div class="flex items-center gap-3">
		<a href="/admin/products" class="text-surface-400 hover:text-surface-600">
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
		</a>
		<h1 class="text-2xl font-bold text-surface-900">New Product</h1>
	</div>

	<Card class="mt-6">
		<form method="POST" use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				submitting = false;
				await update();
			};
		}} class="space-y-4">
			<div>
				<label for="name" class="mb-1 block text-sm font-medium text-surface-700">Name</label>
				<Input id="name" name="name" required value={form?.data?.name ?? ''} />
				{#if form?.errors?.name}<p class="mt-1 text-sm text-danger-500">
						{form.errors.name[0]}
					</p>{/if}
			</div>

			<div>
				<label for="description" class="mb-1 block text-sm font-medium text-surface-700"
					>Description</label
				>
				<Textarea
					id="description"
					name="description"
					required
					rows={4}
					value={form?.data?.description ?? ''}
				/>
				{#if form?.errors?.description}<p class="mt-1 text-sm text-danger-500">
						{form.errors.description[0]}
					</p>{/if}
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="price" class="mb-1 block text-sm font-medium text-surface-700"
						>Price (NGN)</label
					>
					<Input id="price" name="price" type="number" required placeholder="0" />
					{#if form?.errors?.price}<p class="mt-1 text-sm text-danger-500">
							{form.errors.price[0]}
						</p>{/if}
				</div>
				<div>
					<label for="discountPrice" class="mb-1 block text-sm font-medium text-surface-700"
						>Discount Price (NGN, optional)</label
					>
					<Input
						id="discountPrice"
						name="discountPrice"
						type="number"
						placeholder="Leave empty for no discount"
					/>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="categoryId" class="mb-1 block text-sm font-medium text-surface-700"
						>Category</label
					>
					<select
						id="categoryId"
						name="categoryId"
						required
						class="block w-full rounded-lg border border-surface-300 bg-surface-50 px-3 py-2 text-sm text-surface-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
					>
						<option value="">Select category...</option>
						{#each data.categories as category}
							<option value={category.id}>{category.name}</option>
						{/each}
					</select>
					{#if form?.errors?.categoryId}<p class="mt-1 text-sm text-danger-500">
							{form.errors.categoryId[0]}
						</p>{/if}
				</div>
				<div>
					<label for="stock" class="mb-1 block text-sm font-medium text-surface-700">Stock</label>
					<Input id="stock" name="stock" type="number" value="0" />
				</div>
			</div>

			<div>
				<label class="mb-1 block text-sm font-medium text-surface-700">Product Images</label>
				<ImageUpload name="images" multiple={true} maxFiles={15} />
				<p class="mt-1 text-xs text-surface-400">
					Upload up to 15 images. First image will be the primary image.
				</p>
			</div>

			<div>
				<label class="flex items-center gap-2">
					<input
						type="checkbox"
						name="featuredOnLanding"
						class="rounded border-surface-300 text-brand-600 focus:ring-brand-500"
					/>
					<span class="text-sm font-medium text-surface-700">Featured on landing page</span>
				</label>
			</div>

			<div class="flex justify-end gap-2 pt-4">
				<a href="/admin/products"><Button variant="outline">Cancel</Button></a>
				<Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Product'}</Button>
			</div>
		</form>
	</Card>
</div>
