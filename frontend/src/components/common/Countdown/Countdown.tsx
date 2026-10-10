import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import './Countdown.css';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  status: 'COUNTDOWN' | 'TODAY' | 'COMPLETED';
}

export const Countdown: React.FC = () => {
  // Target: 16 October 2026 00:00:00 Asia/Kathmandu (UTC +05:45)
  const targetDateTimestamp = new Date('2026-10-16T00:00:00+05:45').getTime();
  const endDateTimestamp = new Date('2026-10-16T23:59:59+05:45').getTime();

  const calculateTimeLeft = (): CountdownTime => {
    const now = new Date().getTime();

    if (now >= targetDateTimestamp && now <= endDateTimestamp) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, status: 'TODAY' };
    }

    if (now > endDateTimestamp) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, status: 'COMPLETED' };
    }

    const difference = Math.max(0, targetDateTimestamp - now);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, status: 'COUNTDOWN' };
  };

  const [timeLeft, setTimeLeft] = useState<CountdownTime>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTwoDigits = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className="dobato-countdown-container" aria-label="Event Countdown Timer">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--dobato-pink)', fontWeight: 600, fontSize: '0.9rem' }}>
        <Calendar size={16} />
        <span>DOBATOO GRAND LAUNCH • 16 OCTOBER 2026</span>
        <Sparkles size={14} />
      </div>

      {timeLeft.status === 'TODAY' ? (
        <div className="dobato-countdown-completed">
          Dobatoo Grand Launch is Today ❤️
        </div>
      ) : timeLeft.status === 'COMPLETED' ? (
        <div className="dobato-countdown-completed">
          Thank you for being part of Dobatoo.
        </div>
      ) : (
        <div className="dobato-countdown-grid">
          <div className="dobato-countdown-box">
            <span className="dobato-countdown-number">{formatTwoDigits(timeLeft.days)}</span>
            <span className="dobato-countdown-label">DAYS</span>
          </div>

          <div className="dobato-countdown-box">
            <span className="dobato-countdown-number">{formatTwoDigits(timeLeft.hours)}</span>
            <span className="dobato-countdown-label">HOURS</span>
          </div>

          <div className="dobato-countdown-box">
            <span className="dobato-countdown-number">{formatTwoDigits(timeLeft.minutes)}</span>
            <span className="dobato-countdown-label">MINUTES</span>
          </div>

          <div className="dobato-countdown-box">
            <span className="dobato-countdown-number">{formatTwoDigits(timeLeft.seconds)}</span>
            <span className="dobato-countdown-label">SECONDS</span>
          </div>
        </div>
      )}
    </div>
  );
};
