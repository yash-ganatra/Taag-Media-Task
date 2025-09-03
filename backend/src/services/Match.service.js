const Creator = require('../models/Creator');

const WEIGHTS = { relevance: 0.4, audience: 0.3, perf_price: 0.2, constraints: 0.1 };

// helpers
function fracOverlap(arrA, arrB){
  if(!arrA || !arrB) return 0;
  const setB = new Set(arrB.map(s => s.toLowerCase()));
  const matchCount = arrA.filter(a => setB.has(a.toLowerCase())).length;
  return arrA.length ? matchCount / arrA.length : 0;
}

// map age bucket string -> numeric interval
const AGE_BUCKETS = {
  "13-17":[13,17],"18-24":[18,24],"25-34":[25,34],"35-44":[35,44],"45-54":[45,54]
};

function ageOverlapScore(brandAgeRange, creatorAgeMap) {
  const [minB, maxB] = brandAgeRange;
  let score = 0;

  // Ensure creatorAgeMap is a valid object
  if (!creatorAgeMap || typeof creatorAgeMap !== "object") {
    return score; // Return 0 if creatorAgeMap is invalid
  }

  for (const [bucket, fraction] of Object.entries(creatorAgeMap)) {
    const b = AGE_BUCKETS[bucket] || null;
    if (!b) continue;
    const overlapMin = Math.max(minB, b[0]);
    const overlapMax = Math.min(maxB, b[1]);
    if (overlapMin <= overlapMax) score += fraction; // fraction is already a fraction of creator audience
  }
  return Math.min(1, score); // 0..1
}

function geoMatchScore(targetLocations, creatorGeoMap){
  let score = 0;
  for(const loc of targetLocations || []){
    if(creatorGeoMap && creatorGeoMap.get && creatorGeoMap.get(loc) !== undefined){
      score += creatorGeoMap.get(loc) || 0;
    } else if (creatorGeoMap && creatorGeoMap[loc] !== undefined){
      score += creatorGeoMap[loc];
    }
  }
  return Math.min(1, score); // 0..1
}

function normalize(value, max){ return Math.min(1, value / (max || 1)); }

async function scoreCreators(brandBrief){
  const creators = await Creator.find().lean();
  const scored = creators.map(c => {
    // relevance
    const categoryMatch = (brandBrief.category && c.verticals) ? (c.verticals.map(v=>v.toLowerCase()).includes(brandBrief.category.toLowerCase()) ? 1 : 0) : 0;
    const platformMatch = fracOverlap(brandBrief.platforms || [], c.platforms || []);
    const toneMatch = fracOverlap(brandBrief.tone || [], c.contentTone || []);
    const relevanceScore = (0.6*categoryMatch + 0.25*platformMatch + 0.15*toneMatch) * 100;

    // audience
    const geoScore = geoMatchScore(brandBrief.targetLocations || [], c.audienceGeo);
    const ageScore = ageOverlapScore(brandBrief.targetAges || [18,35], c.audienceAge);
    const audienceScore = (0.7*geoScore + 0.3*ageScore) * 100;

    // performance / price
    const engagementFactor = normalize(c.engagementRate || 0, 0.06); // sample max ~0.06
    const viewsFactor = normalize(c.avgViews || 0, 150000);
    const priceFit = (brandBrief.budgetINR && c.basePriceINR) ? Math.min(1, brandBrief.budgetINR / c.basePriceINR) : 0;
    const perfPriceScore = (0.55*engagementFactor + 0.35*viewsFactor + 0.1*priceFit) * 100;

    // constraints
    let constraintsScore = 100;
    if(brandBrief.constraints && brandBrief.constraints.noAdultContent){
      if(c.safetyFlags && (c.safetyFlags.adult === true || c.safetyFlags.get && c.safetyFlags.get('adult') === true)){
        constraintsScore = 0;
      }
    }

    const finalScore = Math.round(
      WEIGHTS.relevance*relevanceScore +
      WEIGHTS.audience*audienceScore +
      WEIGHTS.perf_price*perfPriceScore +
      WEIGHTS.constraints*constraintsScore
    );

    const reasons = [];
    if (categoryMatch) reasons.push('Vertical match');
    if (platformMatch > 0) reasons.push(`Platform match ${(platformMatch*100).toFixed(0)}%`);
    if (geoScore > 0) reasons.push(`Geo match ${(geoScore*100).toFixed(0)}%`);
    if (ageScore > 0) reasons.push(`Age match ${(ageScore*100).toFixed(0)}%`);
    if (engagementFactor > 0) reasons.push(`ER ${(c.engagementRate*100).toFixed(2)}%`);
    if (priceFit >= 1) reasons.push('Within budget');

    return {
      _id: c._id,
      handle: c.handle,
      verticals: c.verticals,
      platforms: c.platforms,
      basePriceINR: c.basePriceINR,
      score: finalScore,
      reasons
    };
  });

  // sort by score desc
  scored.sort((a,b) => b.score - a.score);

  // diversification rule: ensure top3 not dominated by same vertical
  const top = [];
  const seenVertical = new Set();
  for(const s of scored){
    const primary = (s.verticals && s.verticals[0]) ? s.verticals[0].toLowerCase() : null;
    if(top.length < 3 && primary && !seenVertical.has(primary)){
      top.push(s);
      seenVertical.add(primary);
    }
  }
  // fill remaining slots normally
  for(const s of scored){
    if(top.length >= scored.length) break;
    if(!top.find(t=>t._id===s._id)) top.push(s);
  }

  return top;
}

module.exports = { scoreCreators };
