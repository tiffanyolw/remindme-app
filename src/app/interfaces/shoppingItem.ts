import { Category } from "./category";
import { Unit } from "./unit";

export interface ShoppingItem {
    id?: number;
    name: string;
    quantity?: number;
    unitId?: number;
    price?: number;
    storeName?: string;
    categoryId: number;
    notes?: string;
    bought: boolean;
    cleared: boolean;
    itemCategory?: Category;
    itemUnit?: Unit,
    createdAt?: Date,
    updatedAt?: Date
}