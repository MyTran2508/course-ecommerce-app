
export interface ComboBoxType {
    id: string,
    name: string
}

export const Language: ComboBoxType[] = [
    {id: "0", name: "Vietnamese" },
    {id: "1", name: "English"},
]

export const Price: ComboBoxType[] = [
    {id: "Paid", name: "Paid" },
    {id: "Free", name: "Free"},
]
export const Topic: ComboBoxType[] = [
    { id: "0", name: "Python" },
    { id: "1", name: "Java" },
    { id: "2", name: "HTML" },
    { id: "3", name: "C++" },
    { id: "4", name: "ReactJS" },
    { id: "5", name: "Angular" },
    { id: "6", name: "Android Development" },
    { id: "7", name: "NodeJS" }
]

export const Level: ComboBoxType[] = [
    { id: "0", name: "Beginner" },
    { id: "1", name: "Intermediate" },
    { id: "2", name: "Expert" },
    { id: "3", name: "All Level" }
]