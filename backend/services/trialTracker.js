const trialUsage = new Map();

const getClientFingerprint = (req) => {
  const ip = req.ip || 
             req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
             req.headers['x-real-ip'] || 
             req.connection?.remoteAddress || 
             'unknown';
  
  const userAgent = req.headers['user-agent'] || 'unknown';
  
  return `${ip}:${userAgent}`;
};

export const checkTrialUsed = (req) => {
  const fingerprint = getClientFingerprint(req);
  return trialUsage.has(fingerprint);
};

export const markTrialUsed = (req) => {
  const fingerprint = getClientFingerprint(req);
  trialUsage.set(fingerprint, {
    used: true,
    timestamp: Date.now()
  });
};

export const clearOldTrials = () => {
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
  for (const [key, value] of trialUsage.entries()) {
    if (value.timestamp < oneDayAgo) {
      trialUsage.delete(key);
    }
  }
};

setInterval(clearOldTrials, 60 * 60 * 1000);

