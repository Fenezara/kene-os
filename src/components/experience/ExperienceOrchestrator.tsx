'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrandSplashScreen } from './BrandSplashScreen';
import { Onboarding3DExperience } from './Onboarding3DExperience';
import { WelcomeScreen } from './WelcomeScreen';

type ExperienceStep = 'splash' | 'onboarding' | 'welcome';

export function ExperienceOrchestrator() {
  const [step, setStep] = useState<ExperienceStep>('splash');

  // 📱 PERSISTENT SOCIAL APP PATTERN (Facebook / TikTok / Instagram style)
  // If user is already logged in, seamlessly restore their active portal session immediately
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const forceIntro = params.get('intro') === 'true';
      const forceWelcome = params.get('welcome') === 'true';
      const isLoggedOut = params.get('logged_out') === 'true';

      if (forceWelcome) {
        setStep('welcome');
        return;
      }

      if (!forceIntro && !isLoggedOut) {
        const savedUser = localStorage.getItem('kene_user');
        if (savedUser) {
          try {
            const user = JSON.parse(savedUser);
            const role = user.role || 'client';
            const target = role === 'admin' ? '/admin' : role === 'gerant' || role === 'salon' ? '/dashboard' : '/portal';
            
            // Ensure session cookie is refreshed for 1 year
            document.cookie = `kene-session=${role}-${Date.now()}; path=/; max-age=31536000; SameSite=Lax`;
            
            // Instant seamless portal entry
            window.location.replace(target);
            return;
          } catch (e) {}
        }
      }
    }
  }, []);

  // Auto transition from Splash to Welcome after 2.2 seconds for quick entry
  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => {
        setStep('welcome');
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleSplashComplete = () => {
    setStep('welcome');
  };

  const handleOnboardingComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kene_onboarding_seen', 'true');
    }
    setStep('welcome');
  };

  const handleReplayIntro = () => {
    setStep('splash');
  };

  return (
    <AnimatePresence mode="wait">
      {step === 'splash' && (
        <BrandSplashScreen key="splash" onComplete={handleSplashComplete} />
      )}

      {step === 'onboarding' && (
        <Onboarding3DExperience key="onboarding" onComplete={handleOnboardingComplete} />
      )}

      {step === 'welcome' && (
        <WelcomeScreen key="welcome" onReplayIntro={handleReplayIntro} />
      )}
    </AnimatePresence>
  );
}
