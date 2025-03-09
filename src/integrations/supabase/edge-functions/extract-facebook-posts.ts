
// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Facebook cookies provided by the user - simplified to the essential ones
const facebookCookies = [
  {
    "name": "c_user",
    "value": "100000882732459",
    "domain": ".facebook.com",
    "path": "/",
    "expires": 1773071849,
    "httpOnly": false,
    "secure": true,
    "sameSite": "None"
  },
  {
    "name": "xs",
    "value": "11%3Aic8g_zepuppRIg%3A2%3A1741514941%3A-1%3A15165%3A%3AAcUFSsuVRONnMklTDYMybppjbe2FtJ5U8RUeQmZMWg",
    "domain": ".facebook.com",
    "path": "/",
    "expires": 1773071849,
    "httpOnly": true,
    "secure": true,
    "sameSite": "None"
  },
  {
    "name": "fr",
    "value": "1VTnVBJCDLMvNo2fz.AWWtvHE1OTc40YHmieSi80ieWbV1qQHnsr9TBg.Bnzbpn..AAA.0.0.Bnzb5T.AWWxeADXo1Q",
    "domain": ".facebook.com",
    "path": "/",
    "expires": 1749312851,
    "httpOnly": true,
    "secure": true,
    "sameSite": "None"
  },
  {
    "name": "datr",
    "value": "Q5SCZxR-akGFMzFM2tIOCzG1",
    "domain": ".facebook.com",
    "path": "/",
    "expires": 1774439352,
    "httpOnly": true,
    "secure": true,
    "sameSite": "None"
  },
  {
    "name": "sb",
    "value": "Q5SCZ3Tx2roLLnrVqZ4jursz",
    "domain": ".facebook.com",
    "path": "/",
    "expires": 1776074943,
    "httpOnly": true,
    "secure": true,
    "sameSite": "None"
  }
];

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
        proxyConfiguration: {
          useApifyProxy: true
        },
        loginCookies: facebookCookies
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
