<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Textarea from '$lib/components/ui/textarea.svelte';
	import Card from '$lib/components/ui/card.svelte';

	let { form } = $props();
</script>

<svelte:head>
	<title>Contact Us — Vidvie</title>
	<meta name="description" content="Get in touch with Vidvie. We'd love to hear from you." />
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
	<h1 class="text-4xl font-bold text-surface-900">Contact Us</h1>
	<p class="mt-2 text-surface-500">Have a question or feedback? We'd love to hear from you.</p>

	<div class="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
		<!-- Contact Form -->
		<Card>
			<form
				method="POST"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							toast.success('Message sent! We\'ll get back to you soon.');
							await update({ reset: true });
						} else {
							await update();
						}
					};
				}}
				class="space-y-4"
			>
				<div>
					<label for="name" class="mb-1 block text-sm font-medium text-surface-700">Name</label>
					<Input id="name" name="name" required value={form?.data?.name ?? ''} placeholder="Your name" />
					{#if form?.errors?.name}
						<p class="mt-1 text-sm text-danger-500">{form.errors.name[0]}</p>
					{/if}
				</div>

				<div>
					<label for="email" class="mb-1 block text-sm font-medium text-surface-700">Email</label>
					<Input id="email" name="email" type="email" required value={form?.data?.email ?? ''} placeholder="you@example.com" />
					{#if form?.errors?.email}
						<p class="mt-1 text-sm text-danger-500">{form.errors.email[0]}</p>
					{/if}
				</div>

				<div>
					<label for="phone" class="mb-1 block text-sm font-medium text-surface-700">Phone (optional)</label>
					<Input id="phone" name="phone" type="tel" value={form?.data?.phone ?? ''} placeholder="+234..." />
				</div>

				<div>
					<label for="message" class="mb-1 block text-sm font-medium text-surface-700">Message</label>
					<Textarea id="message" name="message" required rows={5} value={form?.data?.message ?? ''} placeholder="How can we help?" />
					{#if form?.errors?.message}
						<p class="mt-1 text-sm text-danger-500">{form.errors.message[0]}</p>
					{/if}
				</div>

				<Button type="submit" class="w-full">Send Message</Button>
			</form>
		</Card>

		<!-- Contact Info -->
		<div class="space-y-6">
			<div>
				<h3 class="font-semibold text-surface-900">Email</h3>
				<p class="mt-1 text-surface-500">
					<a href="mailto:hello@vidvie.ng" class="text-brand-600 hover:text-brand-700">hello@vidvie.ng</a>
				</p>
			</div>
			<div>
				<h3 class="font-semibold text-surface-900">Location</h3>
				<p class="mt-1 text-surface-500">Lagos, Nigeria</p>
			</div>
			<div>
				<h3 class="font-semibold text-surface-900">Business Hours</h3>
				<p class="mt-1 text-surface-500">Monday — Friday: 9am — 6pm<br />Saturday: 10am — 4pm</p>
			</div>
		</div>
	</div>
</div>
