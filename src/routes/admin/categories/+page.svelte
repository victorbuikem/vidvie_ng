<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Textarea from '$lib/components/ui/textarea.svelte';
	import Dialog from '$lib/components/ui/dialog.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import ImageUpload from '$lib/components/ui/image-upload.svelte';

	let { data } = $props();

	let createDialogOpen = $state(false);
	let editDialogOpen = $state(false);
	let editingCategory = $state<(typeof data.categories)[0] | null>(null);
	let creatingCategory = $state(false);
	let updatingCategory = $state(false);

	const openEdit = (category: (typeof data.categories)[0]) => {
		editingCategory = category;
		editDialogOpen = true;
	};
</script>

<svelte:head>
	<title>Categories — Admin — Vidvie</title>
</svelte:head>

<div>
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-surface-900">Categories</h1>
		<Button onclick={() => (createDialogOpen = true)}>Add Category</Button>
	</div>

	<Card class="mt-6" padding={false}>
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="border-b border-surface-200 bg-surface-50 text-left">
					<tr>
						<th class="px-4 py-3 font-medium text-surface-500">Name</th>
						<th class="px-4 py-3 font-medium text-surface-500">Slug</th>
						<th class="px-4 py-3 font-medium text-surface-500">Products</th>
						<th class="px-4 py-3 font-medium text-surface-500">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-surface-200">
					{#each data.categories as category}
						<tr class="hover:bg-surface-50">
							<td class="px-4 py-3 font-medium text-surface-900">{category.name}</td>
							<td class="px-4 py-3 text-surface-500">{category.slug}</td>
							<td class="px-4 py-3">
								<Badge>{category.products.length} products</Badge>
							</td>
							<td class="px-4 py-3">
								<div class="flex gap-2">
									<Button variant="ghost" size="sm" onclick={() => openEdit(category)}>Edit</Button>
									<form
										method="POST"
										action="?/delete"
										use:enhance={() => {
											return async ({ result, update }) => {
												if (result.type === 'success') {
													toast.success('Category deleted');
													await update();
												} else if (result.type === 'failure') {
													toast.error(String((result.data as Record<string, unknown>)?.error ?? 'Failed to delete'));
												}
											};
										}}
									>
										<input type="hidden" name="id" value={category.id} />
										<Button variant="ghost" size="sm" type="submit" class="text-danger-500">Delete</Button>
									</form>
								</div>
							</td>
						</tr>
					{/each}
					{#if data.categories.length === 0}
						<tr>
							<td colspan="4" class="px-4 py-8 text-center text-surface-400">No categories yet</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</Card>
</div>

<!-- Create Dialog -->
<Dialog bind:open={createDialogOpen} title="New Category">
	{#key createDialogOpen}
		<form
			method="POST"
			action="?/create"
			use:enhance={() => {
				creatingCategory = true;
				return async ({ result, update }) => {
					creatingCategory = false;
					if (result.type === 'success') {
						toast.success('Category created');
						createDialogOpen = false;
						await update();
					} else {
						toast.error('Failed to create category');
						await update();
					}
				};
			}}
			class="space-y-4"
		>
			<div>
				<label for="create-name" class="mb-1 block text-sm font-medium text-surface-700">Name</label>
				<Input id="create-name" name="name" required placeholder="e.g. Headphones" />
			</div>
			<div>
				<label for="create-desc" class="mb-1 block text-sm font-medium text-surface-700">Description</label>
				<Textarea id="create-desc" name="description" rows={2} placeholder="Brief description..." />
			</div>
			<div>
				<label class="mb-1 block text-sm font-medium text-surface-700">Category Image</label>
				<ImageUpload name="image" multiple={false} maxFiles={1} />
			</div>
			<div class="flex justify-end gap-2">
				<Button variant="outline" onclick={() => (createDialogOpen = false)}>Cancel</Button>
				<Button type="submit" disabled={creatingCategory}>{creatingCategory ? 'Creating...' : 'Create'}</Button>
			</div>
		</form>
	{/key}
</Dialog>

<!-- Edit Dialog -->
<Dialog bind:open={editDialogOpen} title="Edit Category">
	{#if editingCategory}
		{#key editingCategory.id}
			<form
				method="POST"
				action="?/update"
				use:enhance={() => {
					updatingCategory = true;
					return async ({ result, update }) => {
						updatingCategory = false;
						if (result.type === 'success') {
							toast.success('Category updated');
							editDialogOpen = false;
							await update();
						} else {
							toast.error('Failed to update category');
							await update();
						}
					};
				}}
				class="space-y-4"
			>
				<input type="hidden" name="id" value={editingCategory.id} />
				<div>
					<label for="edit-name" class="mb-1 block text-sm font-medium text-surface-700">Name</label>
					<Input id="edit-name" name="name" required value={editingCategory.name} />
				</div>
				<div>
					<label for="edit-desc" class="mb-1 block text-sm font-medium text-surface-700">Description</label>
					<Textarea id="edit-desc" name="description" rows={2} value={editingCategory.description ?? ''} />
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-surface-700">Category Image</label>
					<ImageUpload name="image" multiple={false} maxFiles={1} value={editingCategory.image ? [editingCategory.image] : []} />
				</div>
				<div class="flex justify-end gap-2">
					<Button variant="outline" onclick={() => (editDialogOpen = false)}>Cancel</Button>
					<Button type="submit" disabled={updatingCategory}>{updatingCategory ? 'Saving...' : 'Save'}</Button>
				</div>
			</form>
		{/key}
	{/if}
</Dialog>
