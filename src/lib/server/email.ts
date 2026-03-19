import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { env } from '$env/dynamic/private';

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
	if (transporter) return transporter;

	const host = env.SMTP_HOST;
	const port = env.SMTP_PORT;
	const user = env.SMTP_USER;
	const pass = env.SMTP_PASS;

	if (!host || !user || !pass) {
		throw new Error('SMTP_HOST, SMTP_USER, and SMTP_PASS must be set');
	}

	transporter = nodemailer.createTransport({
		host,
		port: Number(port) || 587,
		secure: port === '465',
		auth: { user, pass }
	});

	return transporter;
}

function getFromAddress(): string {
	return env.SMTP_FROM || 'VIDVIE Store <noreply@vidvie.store>';
}

function formatKoboToNaira(kobo: number): string {
	return new Intl.NumberFormat('en-NG', {
		style: 'currency',
		currency: 'NGN',
		minimumFractionDigits: 0
	}).format(kobo / 100);
}

export interface OrderReceiptParams {
	to: string;
	customerName: string;
	orderId: string;
	items: Array<{
		name: string;
		quantity: number;
		priceAtPurchase: number;
	}>;
	total: number;
	shippingAddress: {
		name: string;
		phone: string;
		address: string;
		city: string;
		state: string;
	};
}

function buildReceiptHtml(params: OrderReceiptParams): string {
	const { customerName, orderId, items, total, shippingAddress } = params;

	const itemRows = items
		.map(
			(item) => `
		<tr>
			<td style="padding: 10px 12px; border-bottom: 1px solid #e8d5c4; font-family: Questrial, Arial, sans-serif; font-size: 14px; color: #201616;">
				${item.name}
			</td>
			<td style="padding: 10px 12px; border-bottom: 1px solid #e8d5c4; font-family: Questrial, Arial, sans-serif; font-size: 14px; color: #201616; text-align: center;">
				${item.quantity}
			</td>
			<td style="padding: 10px 12px; border-bottom: 1px solid #e8d5c4; font-family: Questrial, Arial, sans-serif; font-size: 14px; color: #201616; text-align: right;">
				${formatKoboToNaira(item.priceAtPurchase)}
			</td>
			<td style="padding: 10px 12px; border-bottom: 1px solid #e8d5c4; font-family: Questrial, Arial, sans-serif; font-size: 14px; color: #201616; text-align: right;">
				${formatKoboToNaira(item.priceAtPurchase * item.quantity)}
			</td>
		</tr>`
		)
		.join('');

	return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #f5f0eb;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f0eb; padding: 20px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; max-width: 600px;">

	<!-- Header -->
	<tr>
		<td style="background-color: #201616; padding: 24px 32px; text-align: center;">
			<h1 style="margin: 0; font-family: Trirong, Georgia, serif; font-size: 28px; color: #F6DFC0; letter-spacing: 2px;">VIDVIE</h1>
		</td>
	</tr>

	<!-- Greeting -->
	<tr>
		<td style="padding: 32px 32px 16px;">
			<h2 style="margin: 0 0 8px; font-family: Trirong, Georgia, serif; font-size: 22px; color: #201616;">Thank you for your order!</h2>
			<p style="margin: 0; font-family: Questrial, Arial, sans-serif; font-size: 15px; color: #4a3f3f; line-height: 1.5;">
				Hi ${customerName}, your payment was successful. Here's your order summary.
			</p>
		</td>
	</tr>

	<!-- Order ID -->
	<tr>
		<td style="padding: 0 32px 24px;">
			<table cellpadding="0" cellspacing="0" style="background-color: #F6DFC0; border-radius: 6px; padding: 12px 16px; width: 100%;">
				<tr>
					<td style="font-family: Questrial, Arial, sans-serif; font-size: 13px; color: #4a3f3f;">Order ID</td>
					<td style="font-family: Questrial, Arial, sans-serif; font-size: 14px; color: #201616; font-weight: bold; text-align: right;">${orderId}</td>
				</tr>
			</table>
		</td>
	</tr>

	<!-- Items Table -->
	<tr>
		<td style="padding: 0 32px 24px;">
			<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
				<tr style="background-color: #201616;">
					<th style="padding: 10px 12px; font-family: Questrial, Arial, sans-serif; font-size: 12px; color: #F6DFC0; text-align: left; text-transform: uppercase; letter-spacing: 0.5px;">Item</th>
					<th style="padding: 10px 12px; font-family: Questrial, Arial, sans-serif; font-size: 12px; color: #F6DFC0; text-align: center; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
					<th style="padding: 10px 12px; font-family: Questrial, Arial, sans-serif; font-size: 12px; color: #F6DFC0; text-align: right; text-transform: uppercase; letter-spacing: 0.5px;">Price</th>
					<th style="padding: 10px 12px; font-family: Questrial, Arial, sans-serif; font-size: 12px; color: #F6DFC0; text-align: right; text-transform: uppercase; letter-spacing: 0.5px;">Subtotal</th>
				</tr>
				${itemRows}
				<tr>
					<td colspan="3" style="padding: 14px 12px; font-family: Trirong, Georgia, serif; font-size: 16px; color: #201616; font-weight: bold; text-align: right;">Total</td>
					<td style="padding: 14px 12px; font-family: Trirong, Georgia, serif; font-size: 18px; color: #E6A74F; font-weight: bold; text-align: right;">${formatKoboToNaira(total)}</td>
				</tr>
			</table>
		</td>
	</tr>

	<!-- Shipping Address -->
	<tr>
		<td style="padding: 0 32px 24px;">
			<h3 style="margin: 0 0 8px; font-family: Trirong, Georgia, serif; font-size: 16px; color: #201616;">Shipping Address</h3>
			<p style="margin: 0; font-family: Questrial, Arial, sans-serif; font-size: 14px; color: #4a3f3f; line-height: 1.6;">
				${shippingAddress.name}<br>
				${shippingAddress.address}<br>
				${shippingAddress.city}, ${shippingAddress.state}<br>
				${shippingAddress.phone}
			</p>
		</td>
	</tr>

	<!-- What Happens Next -->
	<tr>
		<td style="padding: 0 32px 32px;">
			<h3 style="margin: 0 0 16px; font-family: Trirong, Georgia, serif; font-size: 16px; color: #201616;">What Happens Next</h3>
			<table width="100%" cellpadding="0" cellspacing="0">
				<tr>
					<td width="40" valign="top" style="padding-bottom: 16px;">
						<div style="width: 32px; height: 32px; background-color: #E6A74F; border-radius: 50%; text-align: center; line-height: 32px; font-family: Questrial, Arial, sans-serif; font-size: 14px; color: #ffffff; font-weight: bold;">1</div>
					</td>
					<td style="padding-bottom: 16px; padding-left: 12px;">
						<p style="margin: 0 0 2px; font-family: Questrial, Arial, sans-serif; font-size: 14px; color: #201616; font-weight: bold;">Order Confirmed</p>
						<p style="margin: 0; font-family: Questrial, Arial, sans-serif; font-size: 13px; color: #4a3f3f;">Your order has been received and is being processed.</p>
					</td>
				</tr>
				<tr>
					<td width="40" valign="top" style="padding-bottom: 16px;">
						<div style="width: 32px; height: 32px; background-color: #E6A74F; border-radius: 50%; text-align: center; line-height: 32px; font-family: Questrial, Arial, sans-serif; font-size: 14px; color: #ffffff; font-weight: bold;">2</div>
					</td>
					<td style="padding-bottom: 16px; padding-left: 12px;">
						<p style="margin: 0 0 2px; font-family: Questrial, Arial, sans-serif; font-size: 14px; color: #201616; font-weight: bold;">Pack &amp; Ship</p>
						<p style="margin: 0; font-family: Questrial, Arial, sans-serif; font-size: 13px; color: #4a3f3f;">We'll carefully pack your items and hand them to our delivery partner.</p>
					</td>
				</tr>
				<tr>
					<td width="40" valign="top">
						<div style="width: 32px; height: 32px; background-color: #E6A74F; border-radius: 50%; text-align: center; line-height: 32px; font-family: Questrial, Arial, sans-serif; font-size: 14px; color: #ffffff; font-weight: bold;">3</div>
					</td>
					<td style="padding-left: 12px;">
						<p style="margin: 0 0 2px; font-family: Questrial, Arial, sans-serif; font-size: 14px; color: #201616; font-weight: bold;">Delivery</p>
						<p style="margin: 0; font-family: Questrial, Arial, sans-serif; font-size: 13px; color: #4a3f3f;">Your order will be delivered to your address. We'll keep you updated!</p>
					</td>
				</tr>
			</table>
		</td>
	</tr>

	<!-- Footer -->
	<tr>
		<td style="background-color: #201616; padding: 20px 32px; text-align: center;">
			<p style="margin: 0 0 4px; font-family: Questrial, Arial, sans-serif; font-size: 13px; color: #F6DFC0;">
				Questions? Contact us at support@vidvie.store
			</p>
			<p style="margin: 0; font-family: Questrial, Arial, sans-serif; font-size: 12px; color: #8a7e7e;">
				&copy; ${new Date().getFullYear()} VIDVIE. All rights reserved.
			</p>
		</td>
	</tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function buildReceiptText(params: OrderReceiptParams): string {
	const { customerName, orderId, items, total, shippingAddress } = params;

	const itemLines = items
		.map(
			(item) =>
				`  ${item.name} x${item.quantity} — ${formatKoboToNaira(item.priceAtPurchase * item.quantity)}`
		)
		.join('\n');

	return `VIDVIE — Order Receipt

Hi ${customerName},

Thank you for your order! Your payment was successful.

Order ID: ${orderId}

Items:
${itemLines}

Total: ${formatKoboToNaira(total)}

Shipping Address:
  ${shippingAddress.name}
  ${shippingAddress.address}
  ${shippingAddress.city}, ${shippingAddress.state}
  ${shippingAddress.phone}

What Happens Next:
  1. Order Confirmed — Your order has been received and is being processed.
  2. Pack & Ship — We'll carefully pack your items and hand them to our delivery partner.
  3. Delivery — Your order will be delivered to your address. We'll keep you updated!

Questions? Contact us at support@vidvie.store

© ${new Date().getFullYear()} VIDVIE. All rights reserved.
`;
}

export async function sendOrderReceipt(params: OrderReceiptParams): Promise<void> {
	const transport = getTransporter();

	await transport.sendMail({
		from: getFromAddress(),
		to: params.to,
		subject: `Order Confirmed — ${params.orderId}`,
		html: buildReceiptHtml(params),
		text: buildReceiptText(params)
	});
}
