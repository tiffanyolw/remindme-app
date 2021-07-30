export interface Order {
    orderBy: string,
    ordering: Ordering    
}

export enum Ordering {
    DESC = "desc",
    ASC = "asc"
}
