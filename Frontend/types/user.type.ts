export interface User{
    id: string,
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string
    telephone: string
    photos: string | null,
    roles: RoleType[] | null
    addresses: Address[]
    removed?: boolean
}

export interface RoleType {
    id: string,
    name: string
}
export interface Address {
    addressLine: string,
    postalCode: string | null,
    defaultAddress: boolean | null,
}