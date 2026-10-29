import { SITE_URL } from '@/lib/site';

const publicPages = [
  ['', 'weekly'],
  ['/about', 'monthly'],
  ['/how-it-works', 'monthly'],
  ['/community-guidelines', 'monthly'],
  ['/privacy', 'yearly'],
  ['/terms', 'yearly'],
  ['/contact', 'yearly'],
  ['/explore', 'hourly'],
  ['/community', 'hourly'],
  ['/discover', 'hourly'],
];

export default function sitemap() {
  return publicPages.map(([path, changeFrequency]) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority: path === '' ? 1 : path === '/explore' || path === '/community' ? 0.8 : 0.5,
  }));
}
