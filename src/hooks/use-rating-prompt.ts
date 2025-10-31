
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './use-local-storage';

const RATING_SNOOZE_KEY = 'webintel_rating_snooze_until';
const RATING_SUBMITTED_KEY = 'webintel_rating_submitted';
const USAGE_STATS_KEY = 'webintel_usage_stats';
const SESSION_START_KEY = 'webintel_session_start_time'; // Reusing from layout suggestion

const SESSION_DURATION_TRIGGER = 10 * 60 * 1000; // 10 minutes
const DAILY_USAGE_TRIGGER = 30 * 60 * 1000; // 30 minutes
const WEEKLY_USAGE_TRIGGER = 2 * 60 * 60 * 1000; // 2 hours
const SNOOZE_DURATION = 2 * 24 * 60 * 60 * 1000; // 2 days

type UsageStats = {
  lastUpdated: string; // ISO string
  dailyTotal: number;
  weeklyTotal: number;
};

export function useRatingPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [snoozeUntil, setSnoozeUntil] = useLocalStorage<number | null>(RATING_SNOOZE_KEY, null);
  const [submitted, setSubmitted] = useLocalStorage<boolean>(RATING_SUBMITTED_KEY, false);
  const [usageStats, setUsageStats] = useLocalStorage<UsageStats>(USAGE_STATS_KEY, {
    lastUpdated: new Date().toISOString(),
    dailyTotal: 0,
    weeklyTotal: 0,
  });

  const checkVisibility = useCallback(() => {
    if (submitted || isVisible) return;

    const now = new Date();
    
    // Check if snoozed
    if (snoozeUntil && now.getTime() < snoozeUntil) {
      return;
    }

    // Update usage stats
    const today = now.toISOString().split('T')[0];
    const lastUpdateDate = new Date(usageStats.lastUpdated);
    const lastUpdateDay = lastUpdateDate.toISOString().split('T')[0];
    
    let daily = usageStats.dailyTotal;
    let weekly = usageStats.weeklyTotal;

    // Reset daily if it's a new day
    if (today !== lastUpdateDay) {
        daily = 0;
    }
    // Reset weekly if it's a new week (Sunday is start of week)
    if (now.getDay() < lastUpdateDate.getDay() && now.getTime() - lastUpdateDate.getTime() > 6 * 24 * 60 * 60 * 1000) {
        weekly = 0;
    }

    // Check triggers
    const sessionStartTime = sessionStorage.getItem(SESSION_START_KEY);
    if (sessionStartTime) {
        const sessionDuration = now.getTime() - new Date(sessionStartTime).getTime();
        if (sessionDuration >= SESSION_DURATION_TRIGGER) {
            setIsVisible(true);
            return;
        }
    }

    if (daily >= DAILY_USAGE_TRIGGER || weekly >= WEEKLY_USAGE_TRIGGER) {
        setIsVisible(true);
    }
  }, [submitted, snoozeUntil, usageStats, isVisible]);
  
  // Track usage time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const lastUpdateDate = new Date(usageStats.lastUpdated);
      const lastUpdateDay = lastUpdateDate.toISOString().split('T')[0];

      setUsageStats(prev => {
        let daily = prev.dailyTotal;
        let weekly = prev.weeklyTotal;

        if (today !== lastUpdateDay) {
          daily = 0;
        }
        if (now.getDay() < lastUpdateDate.getDay() && now.getTime() - lastUpdateDate.getTime() > 6 * 24 * 60 * 60 * 1000) {
           weekly = 0;
        }
        
        const increment = 1000; // 1 second
        return {
          lastUpdated: now.toISOString(),
          dailyTotal: daily + increment,
          weeklyTotal: weekly + increment
        };
      });

      checkVisibility();
    }, 1000); // Update usage every second

    return () => clearInterval(interval);
  }, [checkVisibility, setUsageStats, usageStats]);


  const dismiss = () => {
    setIsVisible(false);
    setSnoozeUntil(new Date().getTime() + SNOOZE_DURATION);
  };

  const submit = () => {
    setIsVisible(false);
    setSubmitted(true);
  };

  return { isVisible, dismiss, submit };
}
