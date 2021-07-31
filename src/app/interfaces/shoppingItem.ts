export interface ShoppingItem {
    id?: number;
    name: string;
    quantity?: number;
    unit?: string;
    price?: number;
    storeName?: string;
    category?: string;
    notes?: string;
    bought: boolean;
    cleared: boolean;
}