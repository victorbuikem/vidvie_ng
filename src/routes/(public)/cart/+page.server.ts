import type { PageServerLoad, Actions } from './$types';
import { getCartWithItems, updateItemQuantity, removeItem } from '$lib/server/cart';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const userId = locals.user?.id;
	const sessionId = cookies.get('cart_session_id');

	const cart = await getCartWithItems(userId, sessionId);

	return {
		cart: cart ?? null
	};
};

export const actions: Actions = {
	updateQuantity: async ({ request }) => {
		const formData = await request.formData();
		const itemId = formData.get('itemId') as string;
		const quantity = Number(formData.get('quantity'));

		await updateItemQuantity(itemId, quantity);
		return { success: true };
	},

	removeItem: async ({ request }) => {
		const formData = await request.formData();
		const itemId = formData.get('itemId') as string;

		await removeItem(itemId);
		return { success: true };
	}
};
