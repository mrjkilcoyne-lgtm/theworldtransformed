import type { APIRoute } from 'astro';

export const prerender = false;

interface RequestBody {
  email: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json() as RequestBody;

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({
        error: 'Invalid email address'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // TODO: In production, this should:
    // 1. Store email in database with timestamp
    // 2. Schedule follow-up emails for 1 month and 1 year
    // 3. Use an email service (SendGrid, Mailgun, etc.)
    // 4. Implement proper data privacy compliance (GDPR, etc.)

    // For now, log the registration
    console.log(`Follow-up registered: ${email} at ${new Date().toISOString()}`);

    // In production, you might want to send a confirmation email
    // await sendFollowUpConfirmation(email);

    return new Response(JSON.stringify({
      success: true,
      message: 'Follow-up registered successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error registering follow-up:', error);
    return new Response(JSON.stringify({
      error: 'Failed to register follow-up',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
