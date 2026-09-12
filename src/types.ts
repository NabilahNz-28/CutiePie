export interface Dessert {
  id: number
  name: string
  emoji: string
  description: string
  price: number
  spriteX: number  // grid column in sprite sheet (0-indexed)
  spriteY: number  // grid row in sprite sheet (0-indexed)
  tags: string[]
  calories: number
  rating: number
  available: boolean
  color: string
}

export interface CartItem {
  dessert: Dessert
  quantity: number
}

export interface Review {
  id: number
  author: string
  avatar: string
  text: string
  rating: number
  date: string
}
