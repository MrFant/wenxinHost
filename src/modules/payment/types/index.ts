export interface Order {
  id: string
  userId: string
  courseId: string
  amount: number
  status: 'pending' | 'paid' | 'cancelled'
  transactionId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  orderId: string
  method: string
  amount: number
  paidAt?: Date
  wxPrepayId?: string
  createdAt: Date
}

export interface CheckoutData {
  courseId: string
  amount: number
  description: string
}
