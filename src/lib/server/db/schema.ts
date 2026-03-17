import {
	pgTable,
	text,
	integer,
	boolean,
	timestamp,
	jsonb
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.schema';

export * from './auth.schema';

// ── Categories ──────────────────────────────────────────────────────

export const categories = pgTable('categories', {
	id: text('id').primaryKey(), // cat_<ulid>
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	image: text('image'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const categoriesRelations = relations(categories, ({ many }) => ({
	products: many(products)
}));

// ── Products ────────────────────────────────────────────────────────

export const products = pgTable('products', {
	id: text('id').primaryKey(), // prod_<ulid>
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description').notNull(),
	price: integer('price').notNull(), // in kobo (100 kobo = 1 Naira)
	discountPrice: integer('discount_price'), // nullable, also in kobo
	categoryId: text('category_id')
		.notNull()
		.references(() => categories.id, { onDelete: 'restrict' }),
	stock: integer('stock').notNull().default(0),
	images: text('images').array().notNull().default([]),
	featuredOnLanding: boolean('featured_on_landing').notNull().default(false),
	active: boolean('active').notNull().default(true),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const productsRelations = relations(products, ({ one, many }) => ({
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id]
	}),
	orderItems: many(orderItems),
	cartItems: many(cartItems)
}));

// ── Orders ──────────────────────────────────────────────────────────

export const orders = pgTable('orders', {
	id: text('id').primaryKey(), // ord_<ulid>
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'restrict' }),
	status: text('status').notNull().default('pending'), // pending | confirmed | shipped | delivered | cancelled
	total: integer('total').notNull(), // in kobo
	shippingAddress: jsonb('shipping_address').notNull(), // { name, phone, address, city, state }
	paymentReference: text('payment_reference').unique(),
	paymentStatus: text('payment_status').notNull().default('pending'), // pending | success | failed
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
	user: one(user, {
		fields: [orders.userId],
		references: [user.id]
	}),
	items: many(orderItems)
}));

// ── Order Items ─────────────────────────────────────────────────────

export const orderItems = pgTable('order_items', {
	id: text('id').primaryKey(), // oi_<ulid>
	orderId: text('order_id')
		.notNull()
		.references(() => orders.id, { onDelete: 'cascade' }),
	productId: text('product_id')
		.notNull()
		.references(() => products.id, { onDelete: 'restrict' }),
	quantity: integer('quantity').notNull(),
	priceAtPurchase: integer('price_at_purchase').notNull() // in kobo
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id]
	})
}));

// ── Carts ───────────────────────────────────────────────────────────

export const carts = pgTable('carts', {
	id: text('id').primaryKey(), // cart_<ulid>
	userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
	sessionId: text('session_id'), // for anonymous users
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const cartsRelations = relations(carts, ({ one, many }) => ({
	user: one(user, {
		fields: [carts.userId],
		references: [user.id]
	}),
	items: many(cartItems)
}));

// ── Cart Items ──────────────────────────────────────────────────────

export const cartItems = pgTable('cart_items', {
	id: text('id').primaryKey(), // ci_<ulid>
	cartId: text('cart_id')
		.notNull()
		.references(() => carts.id, { onDelete: 'cascade' }),
	productId: text('product_id')
		.notNull()
		.references(() => products.id, { onDelete: 'cascade' }),
	quantity: integer('quantity').notNull().default(1)
});

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
	cart: one(carts, {
		fields: [cartItems.cartId],
		references: [carts.id]
	}),
	product: one(products, {
		fields: [cartItems.productId],
		references: [products.id]
	})
}));
