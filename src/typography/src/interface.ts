type Str<T extends number> = T | `${T}`

export type TypographyDepth = Str<1 | 2 | 3>
