// Time estimates for calculating operator time spent per client (in seconds)
// 'real' means use actual duration from activity log event_data.duration_seconds
export const TIME_ESTIMATES = {
  visio: 'real' as const,
  message: 120,     // 2 min per message
  validation: 300,  // 5 min per validation
} satisfies Record<string, number | 'real'>

export type TimeEstimateConfig = typeof TIME_ESTIMATES
