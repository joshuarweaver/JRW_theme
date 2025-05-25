// Cloudflare Worker for Notion API CORS Proxy
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// Enhanced CORS headers for maximum compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
  'Access-Control-Max-Age': '86400',
  'Vary': 'Origin'
}

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Add detailed logging for debugging
  console.log('🔄 NEW REQUEST')
  console.log('Method:', request.method)
  console.log('URL:', url.toString())
  console.log('Origin:', request.headers.get('Origin'))
  console.log('Headers:', [...request.headers.entries()])

  // Handle CORS preflight requests (OPTIONS)
  if (request.method === 'OPTIONS') {
    console.log('✅ Handling CORS preflight request')
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    })
  }
  
  // Extract database ID from path: /api/notion/database/{databaseId}/query
  const pathMatch = url.pathname.match(/^\/api\/notion\/database\/([^\/]+)\/query$/)
  
  if (!pathMatch) {
    console.log('❌ Invalid path:', url.pathname)
    return new Response(JSON.stringify({ 
      error: 'Invalid endpoint. Use: /api/notion/database/{databaseId}/query' 
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    })
  }

  let databaseId = pathMatch[1]
  
  console.log('📊 Database ID from URL:', databaseId)
  
  // Get authorization header
  const authorization = request.headers.get('Authorization')
  console.log('🔑 Authorization header:', authorization ? authorization.substring(0, 20) + '...' : 'MISSING')
  
  // Validate inputs
  if (!databaseId || databaseId.length < 4) {
    console.error('❌ Invalid database ID length:', databaseId?.length)
    return new Response(JSON.stringify({ 
      error: 'Invalid database ID length' 
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    })
  }

  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.error('❌ Missing or invalid authorization header')
    return new Response(JSON.stringify({ 
      error: 'Missing or invalid authorization header' 
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    })
  }

  try {
    // Get request body
    const requestBody = await request.text()
    console.log('📋 Request body:', requestBody || '{}')
    
    console.log('✅ Input validation passed')
    
    // Try the request with the database ID as-is first
    const response = await makeNotionRequest(databaseId, authorization, requestBody)
    
    if (response.ok) {
      const data = await response.text()
      console.log('✅ Success! Found results')
      console.log('📋 Response length:', data.length)
      
      return new Response(data, {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    } else {
      // If first attempt fails with 404, try with UUID formatting
      if (response.status === 404 && databaseId.length === 32 && !databaseId.includes('-')) {
        console.log('❌ First attempt failed with 404, trying with UUID format...')
        const formattedId = databaseId.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')
        console.log('🔧 Trying with dashes:', formattedId)
        
        const retryResponse = await makeNotionRequest(formattedId, authorization, requestBody)
        
        if (retryResponse.ok) {
          const data = await retryResponse.text()
          console.log('✅ Success with UUID format!')
          
          return new Response(data, {
            status: retryResponse.status,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          })
        } else {
          const errorData = await retryResponse.text()
          console.log('❌ Both attempts failed. Final response:', retryResponse.status)
          console.log('❌ Error:', errorData)
          
          return new Response(errorData, {
            status: retryResponse.status,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          })
        }
      } else {
        const errorData = await response.text()
        console.log('❌ Notion API Error:', response.status, errorData)
        
        return new Response(errorData, {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        })
      }
    }
  } catch (error) {
    console.error('❌ Proxy Error:', error)
    
    return new Response(JSON.stringify({ 
      error: 'Proxy server error',
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    })
  }
}

async function makeNotionRequest(databaseId, authorization, requestBody) {
  console.log('📤 Making request to Notion API...')
  console.log('🎯 Using Database ID:', databaseId)
  
  const notionUrl = `https://api.notion.com/v1/databases/${databaseId}/query`
  
  return await fetch(notionUrl, {
    method: 'POST',
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: requestBody || '{}'
  })
} 