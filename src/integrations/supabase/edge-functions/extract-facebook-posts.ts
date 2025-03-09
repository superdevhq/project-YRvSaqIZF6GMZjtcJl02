
// Use Supabase's built-in serve function
// This is available in the Supabase Edge Function runtime
// No need to import from Deno

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Facebook cookies provided by the user
const facebookCookies = [
  {
    "domain": ".facebook.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "ar_debug",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": true,
    "storeId": "0",
    "value": "1"
  },
  {
    "domain": ".facebook.com",
    "expirationDate": 1773071849.113212,
    "hostOnly": false,
    "httpOnly": false,
    "name": "c_user",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "100000882732459"
  },
  {
    "domain": ".facebook.com",
    "expirationDate": 1774439352.57788,
    "hostOnly": false,
    "httpOnly": true,
    "name": "datr",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "Q5SCZxR-akGFMzFM2tIOCzG1"
  },
  {
    "domain": ".facebook.com",
    "expirationDate": 1749312851.467902,
    "hostOnly": false,
    "httpOnly": true,
    "name": "fr",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "1VTnVBJCDLMvNo2fz.AWWtvHE1OTc40YHmieSi80ieWbV1qQHnsr9TBg.Bnzbpn..AAA.0.0.Bnzb5T.AWWxeADXo1Q"
  },
  {
    "domain": ".facebook.com",
    "expirationDate": 1742119696.63476,
    "hostOnly": false,
    "httpOnly": false,
    "name": "locale",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "en_US"
  },
  {
    "domain": ".facebook.com",
    "expirationDate": 1772022019.81375,
    "hostOnly": false,
    "httpOnly": true,
    "name": "oo",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "v1"
  },
  {
    "domain": ".facebook.com",
    "hostOnly": false,
    "httpOnly": false,
    "name": "presence",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": true,
    "storeId": "0",
    "value": "C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1741535847656%2C%22v%22%3A1%7D"
  },
  {
    "domain": ".facebook.com",
    "expirationDate": 1771170974.656584,
    "hostOnly": false,
    "httpOnly": true,
    "name": "ps_l",
    "path": "/",
    "sameSite": "lax",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "1"
  },
  {
    "domain": ".facebook.com",
    "expirationDate": 1771170974.656607,
    "hostOnly": false,
    "httpOnly": true,
    "name": "ps_n",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "1"
  },
  {
    "domain": ".facebook.com",
    "expirationDate": 1776074943.331547,
    "hostOnly": false,
    "httpOnly": true,
    "name": "sb",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "Q5SCZ3Tx2roLLnrVqZ4jursz"
  },
  {
    "domain": ".facebook.com",
    "hostOnly": false,
    "httpOnly": false,
    "name": "usida",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": true,
    "storeId": "0",
    "value": "eyJ2ZXIiOjEsImlkIjoiQXNxdGhyODR4aGowayIsInRpbWUiOjE3MzgwOTkwMTB9"
  },
  {
    "domain": ".facebook.com",
    "expirationDate": 1744563920,
    "hostOnly": false,
    "httpOnly": false,
    "name": "vpd",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "v1%3B932x430x3"
  },
  {
    "domain": ".facebook.com",
    "expirationDate": 1742141653,
    "hostOnly": false,
    "httpOnly": false,
    "name": "wd",
    "path": "/",
    "sameSite": "lax",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "1383x914"
  },
  {
    "domain": ".facebook.com",
    "expirationDate": 1747155919,
    "hostOnly": false,
    "httpOnly": false,
    "name": "wl_cbv",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "v2%3Bclient_version%3A2740%3Btimestamp%3A1739379919"
  },
  {
    "domain": ".facebook.com",
    "expirationDate": 1773071849.113255,
    "hostOnly": false,
    "httpOnly": true,
    "name": "xs",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "11%3Aic8g_zepuppRIg%3A2%3A1741514941%3A-1%3A15165%3A%3AAcUFSsuVRONnMklTDYMybppjbe2FtJ5U8RUeQmZMWg"
  }
];

// Format cookies for Apify
const formatCookiesForApify = (cookies) => {
  return cookies.map(cookie => ({
    name: cookie.name,
    value: cookie.value,
    domain: cookie.domain,
    path: cookie.path,
    expires: cookie.expirationDate ? Math.floor(cookie.expirationDate) : undefined,
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    sameSite: cookie.sameSite === "no_restriction" ? "None" : cookie.sameSite === "lax" ? "Lax" : "Strict"
  }));
};

// Process the extracted posts to match our frontend format
const processApifyResults = (results) => {
  if (!results || !Array.isArray(results)) {
    return [];
  }

  // Limit to 10 posts
  const limitedResults = results.slice(0, 10);

  return limitedResults.map(post => {
    // Extract initials from author name
    const authorName = post.authorName || 'Unknown';
    const initials = authorName
      .split(' ')
      .map(name => name[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    return {
      id: post.postId || post.postUrl || Math.random().toString(36).substring(2),
      author: {
        name: authorName,
        profilePic: post.authorProfilePicUrl || '',
        initials: initials
      },
      content: post.postText || '',
      likes: post.likesCount || 0,
      comments: post.commentsCount || 0,
      date: post.postTimestamp ? new Date(post.postTimestamp).toLocaleDateString() : 'Unknown date'
    };
  });
};

// Main handler function
Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Parse request body
    const requestData = await req.json();
    const { url } = requestData;

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Validate URL format
    if (!url.includes('facebook.com/groups/')) {
      return new Response(JSON.stringify({ error: 'Invalid Facebook group URL' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Get Apify API token from environment variables
    const APIFY_API_TOKEN = Deno.env.get('APIFY_API_TOKEN');
    if (!APIFY_API_TOKEN) {
      return new Response(JSON.stringify({ error: 'Apify API token not configured' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Format cookies for Apify
    const formattedCookies = formatCookiesForApify(facebookCookies);

    // Call Apify API to extract Facebook group posts
    const apifyResponse = await fetch('https://api.apify.com/v2/acts/apify~facebook-posts-scraper/run-sync-get-dataset-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${APIFY_API_TOKEN}`
      },
      body: JSON.stringify({
        startUrls: [{ url }],
        maxPosts: 10,
        commentsMode: "RANKED_THREADED",
        maxComments: 0,
        maxReplies: 0,
        useStealth: true,
        useEnhancedStealth: true,
        cookies: formattedCookies
      })
    });

    if (!apifyResponse.ok) {
      const errorText = await apifyResponse.text();
      console.error('Apify API error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to extract posts from Apify' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Process Apify results
    const apifyResults = await apifyResponse.json();
    const processedPosts = processApifyResults(apifyResults);

    // Return the processed posts
    return new Response(JSON.stringify({ posts: processedPosts }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Error extracting posts:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});
