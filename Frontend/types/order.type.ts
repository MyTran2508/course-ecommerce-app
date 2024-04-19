import { User } from "./user.type";


export interface Order {
    id?: string,
    totalPrice: number,
    orderStatus?: OrderStatus,
    shippingMethod?: ShippingMethod,
    orderItems: OrderItem[],
    user: Pick<User, "id"> | User
}

export interface OrderItem {
    Id?: string;
    courseId: string;
    price: number;
}

export enum OrderStatus {
    CANCELED = "CANCELED",
    PAID = "PAID",
    UNPAID = "UNPAID"
}

export enum ShippingMethod {
   PAYPAL = "PAYPAL"
}