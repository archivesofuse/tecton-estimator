const SUPPLIER_SEARCHES = [
  "site:chadwicks.ie",
  "site:goodwins.ie OR site:brooks.ie OR site:tjomahony.ie OR site:mcmahons.ie",
  "site:woodies.ie OR site:ganlys.ie OR site:irishbuildingsupply.ie",
  ""
];

function decodeHtml(value) {
  return value.replace(/&amp;/g, "&").replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
function stripTags(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ")).trim();
}
function unwrapUrl(raw) {
  try {
    const url = new URL(raw.startsWith("//") ? "https:" + raw : raw);
    const target = url.searchParams.get("uddg");
    return target ? decodeURIComponent(target) : url.href;
  } catch { return raw; }
}
function extractResults(html) {
  const rows = [];
  const anchors = [...html.matchAll(/<a[^>]*class=["'][^"']*result__a[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  for (let i = 0; i < anchors.length; i++) {
    const url = unwrapUrl(decodeHtml(anchors[i][1]));
    if (!/^https?:\/\//i.test(url) || /duckduckgo\.com/i.test(url)) continue;
    const title = stripTags(anchors[i][2]);
    const next = html.slice(anchors[i].index, anchors[i].index + 3500);
    const snippetMatch = next.match(/class=["'][^"']*result__snippet[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i);
    const snippet = snippetMatch ? stripTags(snippetMatch[1]) : "";
    const text = title + " " + snippet;
    const matches = [...text.matchAll(/(?:€\s?|EUR\s?)(\d{1,3}(?:[,.\s]\d{3})*(?:[,.]\d{2})?)/gi)];
    let price = null;
    if (matches.length) {
      const raw = matches[0][1].replace(/\s/g, "");
      const normal = raw.includes(",") && raw.includes(".") ? raw.replace(/,/g, "") : raw.replace(",", ".");
      const n = Number(normal);
      if (Number.isFinite(n) && n > 0 && n < 1000000) price = Math.round(n * 100) / 100;
    }
    let source = "Web result";
    try { source = new URL(url).hostname.replace(/^www\./, ""); } catch {}
    rows.push({ title, url, source, snippet, price });
  }
  return rows;
}

export async function onRequestGet({ request }) {
  const origin = new URL(request.url).origin;
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": origin,
    "Vary": "Origin"
  };
  const q = new URL(request.url).searchParams.get("q")?.trim();
  if (!q || q.length < 2 || q.length > 180) {
    return new Response(JSON.stringify({ error: "Enter an item description between 2 and 180 characters." }), { status: 400, headers });
  }
  try {
    const searches = SUPPLIER_SEARCHES.map(async prefix => {
      const query = [prefix, q, "Ireland price euro"].filter(Boolean).join(" ");
      const url = "https://html.duckduckgo.com/html/?q=" + encodeURIComponent(query);
      const response = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; TectonEstimator/1.0)", "Accept": "text/html" }
      });
      if (!response.ok) return [];
      return extractResults(await response.text());
    });
    const batches = await Promise.all(searches);
    const seen = new Set();
    const results = batches.flat().filter(row => {
      if (seen.has(row.url)) return false;
      seen.add(row.url);
      return true;
    }).slice(0, 20);
    return new Response(JSON.stringify({
      query: q,
      checkedAt: new Date().toISOString().slice(0, 10),
      results,
      priceCount: results.filter(row => row.price !== null).length,
      method: "Live web search; prices are extracted from indexed listing text and must be verified at source."
    }), { headers });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Search provider unavailable: " + error.message }), { status: 502, headers });
  }
}
