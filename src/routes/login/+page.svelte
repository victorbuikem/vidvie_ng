<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Card from '$lib/components/ui/card.svelte';

	let { data, form } = $props();

	let mode = $state<'signin' | 'signup'>(form?.mode ?? 'signin');
	let submitting = $state(false);
</script>

<svelte:head>
	<title>{mode === 'signin' ? 'Sign In' : 'Create Account'} — Vidvie</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-brand-200 px-4">
	<div class="w-full max-w-sm">
		<div class="text-center">
			<a href="/" class="font-heading text-2xl font-semibold tracking-wider text-brand-900">VIDVIE<sup class="text-[0.5em]">&reg;</sup></a>
			<h1 class="mt-4 font-heading text-xl font-medium text-surface-900">
				{mode === 'signin' ? 'Welcome back' : 'Create your account'}
			</h1>
		</div>

		<Card class="mt-6">
			{#if form?.error}
				<div class="mb-4 rounded-lg border border-danger-500 bg-red-50 p-3 text-sm text-danger-600">
					{form.error}
				</div>
			{/if}

			{#if mode === 'signin'}
				<form method="POST" action="?/signin" use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					submitting = false;
					await update();
				};
			}} class="space-y-4">
					<input type="hidden" name="redirect" value={data.redirectTo} />
					<div>
						<label for="email" class="mb-1 block text-sm font-medium text-surface-700">Email</label>
						<Input id="email" name="email" type="email" required value={form?.email ?? ''} placeholder="you@example.com" />
					</div>
					<div>
						<label for="password" class="mb-1 block text-sm font-medium text-surface-700">Password</label>
						<Input id="password" name="password" type="password" required placeholder="Your password" />
					</div>
					<Button type="submit" class="w-full" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign In'}</Button>
				</form>
			{:else}
				<form method="POST" action="?/signup" use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					submitting = false;
					await update();
				};
			}} class="space-y-4">
					<input type="hidden" name="redirect" value={data.redirectTo} />
					<div>
						<label for="name" class="mb-1 block text-sm font-medium text-surface-700">Name</label>
						<Input id="name" name="name" required placeholder="Your name" />
					</div>
					<div>
						<label for="email" class="mb-1 block text-sm font-medium text-surface-700">Email</label>
						<Input id="email" name="email" type="email" required value={form?.email ?? ''} placeholder="you@example.com" />
					</div>
					<div>
						<label for="password" class="mb-1 block text-sm font-medium text-surface-700">Password</label>
						<Input id="password" name="password" type="password" required placeholder="At least 8 characters" />
					</div>
					<Button type="submit" class="w-full" disabled={submitting}>{submitting ? 'Creating account...' : 'Create Account'}</Button>
				</form>
			{/if}

			<div class="mt-4 text-center text-sm text-surface-500">
				{#if mode === 'signin'}
					Don't have an account?
					<button class="font-medium text-brand-400 hover:text-brand-500" onclick={() => (mode = 'signup')}>
						Sign up
					</button>
				{:else}
					Already have an account?
					<button class="font-medium text-brand-400 hover:text-brand-500" onclick={() => (mode = 'signin')}>
						Sign in
					</button>
				{/if}
			</div>
		</Card>
	</div>
</div>
