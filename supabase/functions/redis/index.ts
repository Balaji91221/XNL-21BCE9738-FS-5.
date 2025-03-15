
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@upstash/redis@1.20.6";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const REDIS_URL = "redis://default:AVukAAIjcDEzODg4MDE1ZDVjYTc0MWVhYTA5ZjlkZGRjYTc3N2E1NHAxMA@awake-heron-23460.upstash.io:6379";

const redis = createClient({
  url: REDIS_URL,
  retry: {
    retries: 3
  }
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    
    // In a real app, you would validate the auth token
    // This is just a simple example
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body
    const { action, key, value, expiry } = await req.json();

    let result;
    switch (action) {
      case 'get':
        result = await redis.get(key);
        break;
      case 'set':
        if (expiry) {
          result = await redis.set(key, value, { ex: expiry });
        } else {
          result = await redis.set(key, value);
        }
        break;
      case 'del':
        result = await redis.del(key);
        break;
      case 'incr':
        result = await redis.incr(key);
        break;
      case 'keys':
        result = await redis.keys(key || '*');
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error handling request:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
