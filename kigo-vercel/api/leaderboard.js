// Leaderboard bersama KiGo — Vercel Function + Upstash Redis (tanpa dependensi npm)
const U = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const T = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const K = 'dihc:board';
async function redis(cmds) {
  const r = await fetch(U + '/pipeline', { method: 'POST', headers: { Authorization: 'Bearer ' + T, 'Content-Type': 'application/json' }, body: JSON.stringify(cmds) });
  if (!r.ok) throw new Error('redis ' + r.status);
  return (await r.json()).map(x => { if (x.error) throw new Error(x.error); return x.result; });
}
const clean = s => String(s || '').replace(/[\u0000-\u001f<>"'&]/g, '').trim().slice(0, 12);
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!U || !T) return res.status(503).json({ error: 'Database belum terhubung' });
  try {
    if (req.method === 'POST') {
      const b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const name = clean(b.name), score = Math.floor(Number(b.score));
      if (!name || !(score >= 1 && score <= 99999)) return res.status(400).json({ error: 'Data tidak valid' });
      await redis([['ZADD', K, 'GT', score, name]]); // hanya naik, tidak pernah turun
      return res.status(200).json({ ok: true });
    }
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const name = clean(req.query.name);
    const cmds = [['ZREVRANGE', K, 0, 9, 'WITHSCORES']];
    if (name) cmds.push(['ZREVRANK', K, name], ['ZSCORE', K, name]);
    const [flat, rank, sc] = await redis(cmds);
    const top = [];
    for (let i = 0; i < flat.length; i += 2) top.push({ name: flat[i], score: Number(flat[i + 1]) });
    res.status(200).json({ top, me: name && rank != null ? { name, rank: rank + 1, score: Number(sc) } : null });
  } catch (e) { res.status(500).json({ error: 'Gagal memproses' }); }
};
