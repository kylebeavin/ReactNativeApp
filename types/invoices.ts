export type Invoice = {
	_id: string; 
    account_id: string;
	charges: Array<string>;
	contact_id: string;
	group_id: string;
	invoice_date: string;
	invoice_id: string;
	is_active: boolean;
	purchase_order: string;
	order_id: Array<string>;
	subtotal: number;
	tax: number;
	total: number;
	type: string;
}

export enum InvoiceType {
    recurring = 'recurring',
    ondemand = 'on-demand'
}