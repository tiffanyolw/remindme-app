import { Category } from "./category";
import { Unit } from "./unit";

export interface Product {
    id?: number;
    name: string;
    quantity: number;
    quantityConsumed: number;
    quantityTrashed: number;
    unitId: number;
    purchaseDate?: Date;
    expiryDate?: Date;
    categoryId: number;
    locationStoredId: number;
    notes?: string;
    daysBeforeNotify?: number;
    status: Status,
    category?: Category,
    locationStored?: Location,
    unit?: Unit
}

export enum Status {
    Ready = "ready",
    Consumed = "consumed",
    Trashed = "trashed"
}
