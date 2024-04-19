import { MouseEventHandler } from "react"

export interface CustomButtonProps{
    title: string,
    containerStyles?: string,
    iconStyles?:string
    handleClick?: MouseEventHandler<HTMLButtonElement>,
    icon?: string,
    type?: string
}
export interface SearchManufacturerProps {
    manufacturer: string,
    setManufacturer: (manufacturer:string) => void
}

export interface CourseCardProps {
    id: string;
    title: string;
    image: string;
    price: string;
}