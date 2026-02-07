/**
 * Calculate PR metrics from GitHub data
 */

/**
 * Calculate cycle time (PR created to merged)
 */
export function calculateCycleTime(pr) {
  if (!pr.merged_at) return null;
  const created = new Date(pr.created_at);
  const merged = new Date(pr.merged_at);
  return (merged - created) / (1000 * 60 * 60); // hours
}

/**
 * Calculate review pickup time (PR created to first review)
 */
export function calculatePickupTime(pr, reviews) {
  if (!reviews || reviews.length === 0) return null;
  const created = new Date(pr.created_at);
  const firstReview = new Date(reviews[0].submitted_at);
  return (firstReview - created) / (1000 * 60 * 60); // hours
}

/**
 * Calculate PR size category
 */
export function categorizeSize(additions, deletions) {
  const total = additions + deletions;
  if (total < 10) return 'xs';
  if (total < 100) return 'small';
  if (total < 500) return 'medium';
  if (total < 1000) return 'large';
  return 'xl';
}

/**
 * Calculate metrics for a list of PRs
 */
export function calculatePRMetrics(prs, reviewsMap = {}) {
  const merged = prs.filter(pr => pr.merged_at);
  const open = prs.filter(pr => pr.state === 'open');
  
  const cycleTimes = merged.map(pr => calculateCycleTime(pr)).filter(Boolean);
  const avgCycleTime = cycleTimes.length > 0
    ? cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length
    : 0;

  const sizes = prs.map(pr => categorizeSize(pr.additions || 0, pr.deletions || 0));
  const sizeDistribution = sizes.reduce((acc, size) => {
    acc[size] = (acc[size] || 0) + 1;
    return acc;
  }, {});

  return {
    totalPRs: prs.length,
    openPRs: open.length,
    mergedPRs: merged.length,
    avgCycleTimeHours: Math.round(avgCycleTime * 10) / 10,
    avgCycleTimeDays: Math.round((avgCycleTime / 24) * 10) / 10,
    sizeDistribution,
    mergeRate: prs.length > 0 ? Math.round((merged.length / prs.length) * 100) : 0
  };
}

/**
 * Calculate per-author metrics
 */
export function calculateAuthorMetrics(prs) {
  const authorMap = {};

  prs.forEach(pr => {
    const author = pr.user?.login || 'unknown';
    if (!authorMap[author]) {
      authorMap[author] = {
        author,
        prsOpened: 0,
        prsMerged: 0,
        additions: 0,
        deletions: 0
      };
    }
    authorMap[author].prsOpened++;
    if (pr.merged_at) authorMap[author].prsMerged++;
    authorMap[author].additions += pr.additions || 0;
    authorMap[author].deletions += pr.deletions || 0;
  });

  return Object.values(authorMap).sort((a, b) => b.prsOpened - a.prsOpened);
}

/**
 * Identify stale/blocked PRs
 */
export function identifyBlockedPRs(prs, staleDays = 7) {
  const staleDate = new Date();
  staleDate.setDate(staleDate.getDate() - staleDays);

  return prs
    .filter(pr => pr.state === 'open')
    .filter(pr => new Date(pr.updated_at) < staleDate)
    .map(pr => ({
      number: pr.number,
      title: pr.title,
      author: pr.user?.login,
      daysSinceUpdate: Math.floor((new Date() - new Date(pr.updated_at)) / (1000 * 60 * 60 * 24)),
      url: pr.html_url
    }));
}
