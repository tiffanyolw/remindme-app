export interface Product {
    id?: number;
    name: string;
    quantity: number;
    unit: string;
    purchaseDate?: Date;
    expiryDate?: Date;
    category?: string;
    locationStored?: string;
    notes?: string;
    daysBeforeNotify?: number;
    status: Status
}

export enum Status {
    Ready = "ready",
    Consumed = "consumed",
    Trashed = "trashed"
}
