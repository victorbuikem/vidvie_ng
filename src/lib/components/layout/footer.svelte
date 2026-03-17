<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer class="border-t border-surface-200 bg-surface-50">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
			<!-- Brand -->
			<div class="md:col-span-2">
				<span class="text-xl font-bold text-brand-600">Vidvie</span>
				<p class="mt-3 max-w-md text-sm text-surface-500">
					Your trusted source for quality electronics and accessories. Headphones, power banks, and more — delivered to your doorstep across Nigeria.
				</p>
			</div>

			<!-- Quick Links -->
			<div>
				<h3 class="text-sm font-semibold text-surface-900">Quick Links</h3>
				<ul class="mt-3 space-y-2">
					<li><a href="/shop" class="text-sm text-surface-500 hover:text-surface-700">Shop</a></li>
					<li><a href="/about" class="text-sm text-surface-500 hover:text-surface-700">About Us</a></li>
					<li><a href="/contact" class="text-sm text-surface-500 hover:text-surface-700">Contact</a></li>
				</ul>
			</div>

			<!-- Contact -->
			<div>
				<h3 class="text-sm font-semibold text-surface-900">Contact</h3>
				<ul class="mt-3 space-y-2">
					<li class="text-sm text-surface-500">Lagos, Nigeria</li>
					<li>
						<a href="mailto:hello@vidvie.ng" class="text-sm text-surface-500 hover:text-surface-700">
							hello@vidvie.ng
						</a>
					</li>
				</ul>
			</div>
		</div>

		<div class="mt-8 border-t border-surface-200 pt-8 text-center text-sm text-surface-400">
			&copy; {currentYear} Vidvie. All rights reserved.
		</div>
	</div>
</footer>
