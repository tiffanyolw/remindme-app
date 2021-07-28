export interface Product {
    id?: number;
    name: string;
    quantity: number;
    unitId: number;
    purchaseDate?: Date;
    expiryDate?: Date;
    categoryId?: number;
    locationStoredId?: number;
    notes?: string;
    daysBeforeNotify?: number;
    status: Status
}

export enum Status {
    Ready = "ready",
    Consumed = "consumed",
    Trashed = "trashed"
}
