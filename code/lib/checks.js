import { corsHeaders, notOkResponse, notOk, badMethod, badContentType, notAuthorisedResponse } from './constants.js'

export const handleCORS = (request) => {
  // handle OPTIONS (CORS pre-flight request)
  if (request.method.toUpperCase() === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Headers': request.headers.get(
          'Access-Control-Request-Headers'
        )
      }
    })
  }
  return null
}

export const mustBePOST = (request) => {
  // must be a POST
  if (request.method.toUpperCase() !== 'POST') {
    return new Response(badMethod, notOkResponse)
  }
  return null
}

export const mustBeJSON = (request) => {
  // must be an application/json header
  const contentType = request.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    return new Response(badContentType, notOkResponse)
  }
  return null
}

export const apiKey = (request, env) => {
  // must be an application/json header
  const apiKey = request.headers.get('apikey')
  if (!apiKey || apiKey !== env.API_KEY) {
    return new Response(notOk, notAuthorisedResponse)
  }
  return null
}
