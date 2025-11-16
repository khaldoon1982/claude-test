import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createMollieClient } from '@mollie/api-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id: paymentId } = body

    if (!paymentId) {
      return NextResponse.json({ error: 'Missing payment ID' }, { status: 400 })
    }

    // Initialize Mollie client
    const mollieClient = createMollieClient({
      apiKey: process.env.MOLLIE_API_KEY || '',
    })

    // Fetch payment details from Mollie
    const payment = await mollieClient.payments.get(paymentId)

    const supabase = await createClient()

    // Find order by payment intent ID
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_intent_id', paymentId)
      .single()

    if (!order) {
      console.error(`Order not found for payment ${paymentId}`)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Update order based on payment status
    let orderStatus = order.status
    let paidAt = order.paid_at

    switch (payment.status) {
      case 'paid':
        orderStatus = 'paid'
        paidAt = new Date().toISOString()
        break
      case 'failed':
      case 'expired':
      case 'canceled':
        orderStatus = 'cancelled'
        break
      case 'pending':
      case 'open':
        orderStatus = 'payment_pending'
        break
    }

    // Update order in database
    await supabase
      .from('orders')
      .update({
        status: orderStatus,
        payment_status: payment.status,
        paid_at: paidAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id)

    // TODO: Send order confirmation email if paid
    if (payment.status === 'paid') {
      // Send email via Resend
      console.log(`Order ${order.order_number} paid successfully`)
      // await sendOrderConfirmationEmail(order)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Mollie webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
