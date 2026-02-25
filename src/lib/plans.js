/**
 * Plan limits configuration — single source of truth
 * Used by both API routes and Dashboard UI
 */
export const PLAN_LIMITS = {
    Free: 1,
    Starter: 30,
    Professional: 1000,
};

export const PLAN_NAMES = Object.keys(PLAN_LIMITS);
