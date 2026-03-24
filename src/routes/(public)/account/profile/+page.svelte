<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';

	let { data, form } = $props();
	let submitting = $state(false);

	const formatDate = (date: Date | string) => {
		return new Date(date).toLocaleDateString('en-NG', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};
</script>

<svelte:head>
	<title>Profile — Vidvie</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
	<div class="flex items-center gap-3">
		<a href="/account" class="text-surface-400 hover:text-surface-600">
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
		</a>
		<h1 class="font-heading text-3xl font-medium text-surface-900">Profile</h1>
	</div>

	<Card class="mt-8">
		<form
			method="POST"
			use:enhance={() => {
				submitting = true;
				return async ({ result, update }) => {
					submitting = false;
					if (result.type === 'success') {
						toast.success('Profile updated successfully');
						await update();
					} else {
						await update();
					}
				};
			}}
			class="space-y-5"
		>
			<div>
				<label for="name" class="mb-1 block text-sm font-medium text-surface-700">Name</label>
				<Input id="name" name="name" required value={form?.name ?? data.user.name} placeholder="Your name" />
				{#if form?.error}
					<p class="mt-1 text-sm text-danger-500">{form.error}</p>
				{/if}
			</div>

			<div>
				<label for="email" class="mb-1 block text-sm font-medium text-surface-700">Email</label>
				<Input id="email" name="email" type="email" disabled value={data.user.email} />
				<p class="mt-1 text-xs text-surface-400">Contact support to update your email address.</p>
			</div>

			<div>
				<p class="text-sm text-surface-500">Member since {formatDate(data.user.createdAt)}</p>
			</div>

			<Button type="submit" disabled={submitting}>
				{submitting ? 'Saving...' : 'Save Changes'}
			</Button>
		</form>
	</Card>
</div>
