export const get = async function (kv, id) {
  const r = await kv.get(id)
  if (r === null) {
    return { ok: false }
  } else {
    const j = JSON.parse(r)
    j.id = id
    return { ok: true, doc: j }
  }
}

export const list = async function (kv) {
  const l = await kv.list(/* { prefix: 'doc:' } */)
  const output = l.keys.map((k) => {
    return {
      id: k.name,
      ...k.metadata
    }
  })
  return output
}

export const add = async function (kv, json) {
  if (!json.id) {
    json.id = new Date().getTime().toString()
  }
  if (!json.metadata) {
    json.metadata = {}
  }

  // if there's all the parts we need
  if (json.id && json.doc && json.metadata) {
    await kv.put(json.id, JSON.stringify(json.doc), { metadata: json.metadata })

    // send response
    return { ok: true, id: json.id }
  }

  // oops
  return { ok: false }
}

export const del = async function (kv, id) {
  // delete original doc
  await kv.delete(id)
  return { ok: true }
}
