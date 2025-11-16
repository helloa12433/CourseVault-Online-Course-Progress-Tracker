const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');

function inferCategoryFromTitle(title) {
  if (!title) return 'General';
  const t = title.toLowerCase();
  if (t.includes('react') || t.includes('frontend') || t.includes('javascript') || t.includes('vue') || t.includes('angular')) return 'WebDev';
  if (t.includes('node') || t.includes('express') || t.includes('backend')) return 'Backend';
  if (t.includes('data') || t.includes('machine') || t.includes('ml') || t.includes('ai')) return 'DataScience';
  if (t.includes('algorith') || t.includes('dsa') || t.includes('leetcode') || t.includes('competitive')) return 'Algorithms';
  if (t.includes('design') || t.includes('ui') || t.includes('ux')) return 'Design';
  return 'General';
}

function inferPlatform(hostname, siteName, title) {
  const h = (hostname || '').toLowerCase();
  if (h.includes('youtube') || siteName?.toLowerCase()?.includes('youtube')) return 'YouTube';
  if (h.includes('udemy') || siteName?.toLowerCase()?.includes('udemy')) return 'Udemy';
  if (h.includes('coursera') || siteName?.toLowerCase()?.includes('coursera')) return 'Coursera';
  if (h.includes('edx') || siteName?.toLowerCase()?.includes('edx')) return 'edX';
  return siteName || (hostname ? hostname.replace('www.', '') : 'Website');
}

exports.fetchMetadata = async (req, res) => {
  try {
    const urlStr = req.query.url;
    if (!urlStr) return res.status(400).json({ message: 'Missing url param' });

    // Validate url
    let parsed;
    try { parsed = new URL(urlStr); } catch (e) { return res.status(400).json({ message: 'Invalid URL' }); }

    // Fetch page (basic GET)
    const resp = await axios.get(urlStr, { timeout: 7000, headers: { 'User-Agent': 'CourseVaultBot/1.0 (+https://example.com)' }});
    const html = resp.data;

    const $ = cheerio.load(html);

    // Try open graph tags first
    const ogTitle = $('meta[property="og:title"]').attr('content') || $('meta[name="twitter:title"]').attr('content') || $('title').text();
    const ogSite = $('meta[property="og:site_name"]').attr('content') || $('meta[name="application-name"]').attr('content');
    const ogDesc = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || $('meta[name="twitter:description"]').attr('content');

    const hostname = parsed.hostname;

    const platform = inferPlatform(hostname, ogSite, ogTitle);
    const category = inferCategoryFromTitle(ogTitle);
    // Set sensible defaults
    const progress = 0;
    const status = progress === 100 ? 'Completed' : 'Not Started';
    const notes = ogDesc ? ogDesc.slice(0, 400) : '';

    return res.json({
      title: ogTitle || '',
      platform,
      category,
      status,
      progress,
      notes,
      raw: { hostname, ogTitle, ogSite, ogDesc }
    });
  } catch (err) {
    console.error('metadata fetch error', err.message || err);
    return res.status(500).json({ message: 'Failed to fetch metadata' });
  }
};
