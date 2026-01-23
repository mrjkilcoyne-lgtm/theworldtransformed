import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const prerender = false;

interface RequestBody {
  tier: 'standard' | 'council';
  answers: Record<string, string>;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { tier } = await request.json() as RequestBody;

    const stripeKey = import.meta.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      // If Stripe is not configured, allow free access
      return new Response(JSON.stringify({
        success: true,
        freeAccess: true,
        message: 'Payment processing not configured, proceeding with free access'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-01-27.acacia',
    });

    const amount = tier === 'standard' ? 10 : 50; // in pence
    const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `The Brunel Engine - ${tier === 'standard' ? 'Standard' : 'Council'} Tier`,
              description: tier === 'standard'
                ? 'Enhanced analysis with multiple perspectives'
                : 'Multi-model synthesis with contrarian viewpoints',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${siteUrl}/brunel?payment=success`,
      cancel_url: `${siteUrl}/brunel?payment=cancelled`,
    });

    return new Response(JSON.stringify({
      success: true,
      sessionId: session.id,
      url: session.url
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    return new Response(JSON.stringify({
      error: 'Failed to create payment',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
