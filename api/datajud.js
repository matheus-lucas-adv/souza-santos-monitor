export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { tribunal, numero } = req.body;

  const TRIBUNAIS = {
    tjgo: 'api_publica_tjgo',
    trf1: 'api_publica_trf1',
    trf2: 'api_publica_trf2',
    trf3: 'api_publica_trf3',
    trf4: 'api_publica_trf4',
    trf5: 'api_publica_trf5',
    jfgo: 'api_publica_trf1',
  };

  const endpoint = TRIBUNAIS[tribunal] || 'api_publica_tjgo';
  const url = `https://api-publica.datajud.cnj.jus.br/${endpoint}/_search`;
  const numeroLimpo = numero.replace(/[.\-]/g, '');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'APIKey cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: {
          match: { numeroProcesso: numeroLimpo }
        }
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
