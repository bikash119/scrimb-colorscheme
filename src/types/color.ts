export interface HEX  {
    value: string
    clean: string
}

export interface RGB  {
    r: number
    g: number
    b: number
    value: string
}
export const ColorMode = ["monochrome" , 
     "monochrome-dark" ,
     "monochrome-light" ,
     "analogic" ,
     "complement" ,
     "analogic-complement" ,
     "triad" ,
     "quad"
    ] as const;

export type ColorMode = typeof ColorMode[number]
export interface Color {
    hex: HEX
    rgb: RGB
}
export interface SchemeRequestQueryParams  {
    hex: string
    // rgb: string
    // hsl: string
    // cmyk: string
    // format: string
    mode: ColorMode
    count: number
}

export interface SchemeResponse  {
    // Add the response type properties based on the API response
    mode: string
    count: number
    colors: Array<Color>
} 