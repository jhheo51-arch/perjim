const decode = value => String(value ?? '')
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ')
  .trim();

function tag(block, name) {
  return decode(block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] || '');
}

export function parseGoogleNews(xml, limit = 5) {
  return [...String(xml).matchAll(/<item>([\s\S]*?)<\/item>/gi)]
    .slice(0, limit)
    .map(([, block]) => ({
      title: tag(block, 'title'),
      url: tag(block, 'link'),
      publisher: tag(block, 'source') || '매체 확인 필요',
      publishedAt: tag(block, 'pubDate')
    }))
    .filter(item => item.title && /^https:\/\//.test(item.url));
}

export function selectNews(items, keyword, limit = 5) {
  const koreanQuery=/[가-힣]/.test(String(keyword));
  return items
    .filter(item=>!koreanQuery||/[가-힣]/.test(item.publisher))
    .slice(0,limit);
}

export function naverWindow(now = new Date()) {
  const korea = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const end = new Date(Date.UTC(korea.getUTCFullYear(), korea.getUTCMonth(), korea.getUTCDate() - 1));
  const start = new Date(end.getTime() - 13 * 86400000);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10)
  };
}

export function summarizeNaver(payload) {
  const rows = (payload?.results?.[0]?.data || [])
    .map(row => ({ period: row.period, ratio: Number(row.ratio) }))
    .filter(row => row.period && Number.isFinite(row.ratio))
    .sort((a, b) => a.period.localeCompare(b.period))
    .slice(-14);
  if (rows.length < 14) return null;
  const average = values => values.reduce((sum, row) => sum + row.ratio, 0) / values.length;
  const previous = average(rows.slice(0, 7));
  const recent = average(rows.slice(7));
  const changePercent = previous > 0 ? ((recent - previous) / previous) * 100 : null;
  return {
    previousAverage: Number(previous.toFixed(1)),
    recentAverage: Number(recent.toFixed(1)),
    changePercent: changePercent === null ? null : Number(changePercent.toFixed(1)),
    startDate: rows[0].period,
    splitDate: rows[7].period,
    endDate: rows.at(-1).period,
    points: rows
  };
}

export function normalizeYouTube(searchPayload, videoPayload) {
  const details = new Map((videoPayload?.items || []).map(item => [item.id, item]));
  return (searchPayload?.items || []).map(item => {
    const id = item?.id?.videoId;
    const detail = details.get(id);
    if (!id || !detail) return null;
    return {
      title: decode(detail.snippet?.title || item.snippet?.title),
      channel: decode(detail.snippet?.channelTitle || item.snippet?.channelTitle),
      publishedAt: detail.snippet?.publishedAt || item.snippet?.publishedAt || '',
      viewCount: Number(detail.statistics?.viewCount ?? 0),
      commentCount: detail.statistics?.commentCount === undefined ? null : Number(detail.statistics.commentCount),
      url: `https://www.youtube.com/watch?v=${id}`
    };
  }).filter(Boolean);
}
