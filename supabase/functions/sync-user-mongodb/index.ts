import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { MongoClient } from "mongodb";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserData {
  email: string;
  name?: string;
  avatar_url?: string;
  role?: string;
  provider?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let mongoClient: MongoClient | null = null;

  try {
    // Validate auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No token provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const mongoUri = Deno.env.get('MONGODB_URI');

    if (!mongoUri) {
      console.error('MONGODB_URI is not configured');
      return new Response(
        JSON.stringify({ error: 'MongoDB not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user's token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify user token
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error('Token verification failed:', claimsError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user data from request body
    const body = await req.json();
    const { action, userData } = body as { action: string; userData?: UserData };

    console.log(`Processing action: ${action} for user: ${claimsData.claims.sub}`);

    // Connect to MongoDB
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    console.log('Connected to MongoDB');

    const db = mongoClient.db('voicesentinel');
    const usersCollection = db.collection('users');

    const userId = claimsData.claims.sub;
    const userEmail = claimsData.claims.email;

    if (action === 'sync_login') {
      // Upsert user data on login
      const result = await usersCollection.updateOne(
        { supabase_id: userId },
        {
          $set: {
            supabase_id: userId,
            email: userEmail,
            name: userData?.name || userEmail?.split('@')[0] || 'User',
            avatar_url: userData?.avatar_url || null,
            role: userData?.role || 'agent',
            provider: userData?.provider || 'google',
            last_login: new Date(),
            updated_at: new Date(),
          },
          $setOnInsert: {
            created_at: new Date(),
          }
        },
        { upsert: true }
      );

      console.log('User synced to MongoDB:', result);

      // Fetch the user document to return
      const user = await usersCollection.findOne({ supabase_id: userId });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'User synced to MongoDB',
          user: {
            id: user?._id?.toString(),
            supabase_id: user?.supabase_id,
            email: user?.email,
            name: user?.name,
            role: user?.role,
            avatar_url: user?.avatar_url,
            last_login: user?.last_login,
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'get_user') {
      const user = await usersCollection.findOne({ supabase_id: userId });
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'User not found in MongoDB' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          user: {
            id: user._id?.toString(),
            supabase_id: user.supabase_id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar_url: user.avatar_url,
            last_login: user.last_login,
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'update_role') {
      const { role } = userData || {};
      
      if (!role) {
        return new Response(
          JSON.stringify({ error: 'Role is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await usersCollection.updateOne(
        { supabase_id: userId },
        { $set: { role, updated_at: new Date() } }
      );

      console.log('Role updated:', result);

      return new Response(
        JSON.stringify({ success: true, message: 'Role updated' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sync-user-mongodb:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } finally {
    if (mongoClient) {
      await mongoClient.close();
      console.log('MongoDB connection closed');
    }
  }
});
