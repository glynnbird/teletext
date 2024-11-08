export const generateid = function () {
  // this is a simple randomness generator.. assuming that the probability of
  // generating the same id twice is tiny
  const chars = 'ABCDEFGHJKLMNPQRTUVWXYZ2346789'
  let treeid = ''
  for (let i = 0; i < 8; i++) {
    const nextchar = Math.floor(Math.random() * chars.length)
    treeid = treeid + chars[nextchar]
  }
  return treeid
}
