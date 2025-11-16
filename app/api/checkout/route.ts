import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createMollieClient } from '@mollie/api-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      firstName,
      lastName,
      phone,
      address,
      city,
      postalCode,
      country,
      shippingMethod,
      paymentMethod,
      items,
      subtotal,
      vat,
      shipping,
      total,
      locale,
    } = body

    const supabase = await createClient()

    // Get authenticated user (if any)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null,
        status: 'payment_pending',
        subtotal_cents: subtotal,
        vat_total_cents: vat,
        shipping_cents: shipping,
        total_cents: total,
        currency: 'EUR',
        payment_provider: 'mollie',
        customer_email: email,
        customer_name: `${firstName} ${lastName}`,
        customer_phone: phone,
        shipping_method: shippingMethod,
        locale,
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('Order creation error:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      sku: item.sku || 'UNKNOWN',
      product_title: item.title || 'Product',
      quantity: item.quantity,
      unit_price_cents: item.unitPrice,
      vat_rate: 21.0,
      total_cents: item.unitPrice * item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items error:', itemsError)
      // Rollback order
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      )
    }

    // Create shipping address
    const { data: shippingAddress } = await supabase
      .from('addresses')
      .insert({
        user_id: user?.id || null,
        type: 'shipping',
        full_name: `${firstName} ${lastName}`,
        phone,
        line1: address,
        city,
        postal_code: postalCode,
        country,
      })
      .select()
      .single()

    // Update order with shipping address
    if (shippingAddress) {
      await supabase
        .from('orders')
        .update({
          shipping_address_id: shippingAddress.id,
          billing_address_id: shippingAddress.id,
        })
        .eq('id', order.id)
    }

    // Create Mollie payment
    if (process.env.MOLLIE_API_KEY) {
      try {
        const mollieClient = createMollieClient({
          apiKey: process.env.MOLLIE_API_KEY,
        })

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

        const payment = await mollieClient.payments.create({
          amount: {
            currency: 'EUR',
            value: (total / 100).toFixed(2),
          },
          description: `Bestelling ${order.order_number}`,
          redirectUrl: `${baseUrl}/${locale}/checkout/success?order=${order.id}`,
          webhookUrl: `${baseUrl}/api/webhooks/mollie`,
          metadata: {
            orderId: order.id,
            orderNumber: order.order_number,
          },
          method: paymentMethod === 'ideal' ? 'ideal' : 'creditcard',
        })

        // Update order with payment intent ID
        await supabase
          .from('orders')
          .update({
            payment_intent_id: payment.id,
          })
          .eq('id', order.id)

        return NextResponse.json({
          orderId: order.id,
          orderNumber: order.order_number,
          paymentUrl: payment.getCheckoutUrl(),
        })
      } catch (mollieError) {
        console.error('Mollie payment error:', mollieError)
        // Continue without payment - can be completed later
      }
    }

    // If no Mollie API key or payment failed, return order without payment URL
    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.order_number,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
