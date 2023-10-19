export const getDays = (timeSec?: number) => (timeSec ? (timeSec / 60 / 60 / 24).toFixed(2) : 0);

export const getEndDate = (timeSec?: number) => new Date(Date.now() + (timeSec ?? 0) * 1000).toLocaleString();
