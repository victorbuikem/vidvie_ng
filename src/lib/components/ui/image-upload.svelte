<script lang="ts">
	import { toast } from 'svelte-sonner';

	interface Props {
		value?: string[];
		multiple?: boolean;
		maxFiles?: number;
		name?: string;
		class?: string;
	}

	let {
		value = $bindable([]),
		multiple = true,
		maxFiles = 5,
		name = 'images',
		class: className = ''
	}: Props = $props();

	let uploading = $state(false);
	let dragOver = $state(false);
	let fileInput: HTMLInputElement;

	const MAX_SIZE = 5 * 1024 * 1024; // 5MB

	async function uploadFile(file: File) {
		if (!file.type.startsWith('image/')) {
			toast.error(`"${file.name}" is not an image file`);
			return null;
		}
		if (file.size > MAX_SIZE) {
			toast.error(`"${file.name}" exceeds 5MB limit`);
			return null;
		}

		// Get pre-signed URL
		const res = await fetch('/api/upload', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ filename: file.name, contentType: file.type })
		});

		if (!res.ok) {
			const err = await res.json();
			toast.error(err.error ?? 'Failed to get upload URL');
			return null;
		}

		const { uploadUrl, publicUrl } = await res.json();

		// Upload directly to S3
		const uploadRes = await fetch(uploadUrl, {
			method: 'PUT',
			headers: { 'Content-Type': file.type },
			body: file
		});

		if (!uploadRes.ok) {
			toast.error(`Failed to upload "${file.name}"`);
			return null;
		}

		return publicUrl as string;
	}

	async function handleFiles(files: FileList | File[]) {
		const fileArray = Array.from(files);
		const available = maxFiles - value.length;

		if (fileArray.length > available) {
			toast.error(`Can only upload ${available} more image${available === 1 ? '' : 's'}`);
		}

		const toUpload = fileArray.slice(0, available);
		if (toUpload.length === 0) return;

		uploading = true;
		try {
			const results = await Promise.all(toUpload.map(uploadFile));
			const urls = results.filter((u): u is string => u !== null);
			if (urls.length > 0) {
				value = [...value, ...urls];
			}
		} finally {
			uploading = false;
		}
	}

	function removeImage(index: number) {
		value = value.filter((_, i) => i !== index);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		if (e.dataTransfer?.files) {
			handleFiles(e.dataTransfer.files);
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	function handleClick() {
		fileInput?.click();
	}

	function handleInputChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files) {
			handleFiles(input.files);
			input.value = '';
		}
	}

	// Hidden input value for form submission
	let hiddenValue = $derived(multiple ? value.join('\n') : (value[0] ?? ''));
</script>

<div class={className}>
	<!-- Hidden input for form submission -->
	<input type="hidden" {name} value={hiddenValue} />

	<!-- Drop zone -->
	{#if value.length < maxFiles}
		<button
			type="button"
			onclick={handleClick}
			ondrop={handleDrop}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			class="flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-sm transition-colors
				{dragOver ? 'border-brand-500 bg-brand-500/5' : 'border-surface-300 hover:border-surface-400'}"
			disabled={uploading}
		>
			{#if uploading}
				<svg class="h-8 w-8 animate-spin text-surface-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				<span class="text-surface-500">Uploading...</span>
			{:else}
				<svg class="h-8 w-8 text-surface-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
				</svg>
				<span class="text-surface-500">Click or drag images to upload</span>
				<span class="text-xs text-surface-400">JPEG, PNG, WebP, GIF up to 5MB</span>
			{/if}
		</button>
	{/if}

	<input
		bind:this={fileInput}
		type="file"
		accept="image/*"
		multiple={multiple}
		onchange={handleInputChange}
		class="hidden"
	/>

	<!-- Image previews -->
	{#if value.length > 0}
		<div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
			{#each value as url, i}
				<div class="group relative aspect-square overflow-hidden rounded-lg border border-surface-200">
					<img src={url} alt="Upload {i + 1}" class="h-full w-full object-cover" />
					<button
						type="button"
						onclick={() => removeImage(i)}
						class="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
					>
						<svg class="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
					{#if i === 0 && multiple}
						<span class="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">Primary</span>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
