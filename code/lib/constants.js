export const headers = {
  'content-type': 'application/json',
  'Access-Control-Allow-Origin': '*'
}
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Max-Age': '86400'
}
export const okResponse = {
  status: 200,
  headers
}
export const notOkResponse = {
  status: 400,
  headers
}
export const missingResponse = {
  status: 404,
  headers
}
export const notAuthorisedResponse = {
  status: 401,
  headers
}
export const notOk = JSON.stringify({ ok: false })
export const badMethod = JSON.stringify({ ok: false, message: 'only POST requests accepted' })
export const badContentType = JSON.stringify({ ok: false, message: 'only application/json accepted' })
