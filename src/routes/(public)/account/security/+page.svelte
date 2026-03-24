<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';

	let { form } = $props();
	let submitting = $state(false);
</script>

<svelte:head>
	<title>Security — Vidvie</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
	<div class="flex items-center gap-3">
		<a href="/account" class="text-surface-400 hover:text-surface-600">
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
		</a>
		<h1 class="font-heading text-3xl font-medium text-surface-900">Security</h1>
	</div>

	<Card class="mt-8">
		<h2 class="font-semibold text-surface-900">Change Password</h2>
		<form
			method="POST"
			use:enhance={() => {
				submitting = true;
				return async ({ result, update }) => {
					submitting = false;
					if (result.type === 'success') {
						toast.success('Password changed successfully');
						await update({ reset: true });
					} else {
						await update();
					}
				};
			}}
			class="mt-4 space-y-5"
		>
			{#if form?.error}
				<p class="text-sm text-danger-500">{form.error}</p>
			{/if}

			<div>
				<label for="currentPassword" class="mb-1 block text-sm font-medium text-surface-700">Current Password</label>
				<Input id="currentPassword" name="currentPassword" type="password" required placeholder="Enter current password" />
			</div>

			<div>
				<label for="newPassword" class="mb-1 block text-sm font-medium text-surface-700">New Password</label>
				<Input id="newPassword" name="newPassword" type="password" required placeholder="Enter new password" />
				<p class="mt-1 text-xs text-surface-400">Minimum 8 characters</p>
			</div>

			<div>
				<label for="confirmPassword" class="mb-1 block text-sm font-medium text-surface-700">Confirm New Password</label>
				<Input id="confirmPassword" name="confirmPassword" type="password" required placeholder="Confirm new password" />
			</div>

			<Button type="submit" disabled={submitting}>
				{submitting ? 'Changing...' : 'Change Password'}
			</Button>
		</form>
	</Card>
</div>
