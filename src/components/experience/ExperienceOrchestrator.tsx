'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrandSplashScreen } from './BrandSplashScreen';
import { Onboarding3DExperience } from './Onboarding3DExperience';
import { WelcomeScreen } from './WelcomeScreen';

type ExperienceStep = 'splash' | 'onboarding' | 'welcome';

export function ExperienceOrchestrator() {
  const [step, setStep] = useState<ExperienceStep>('splash');

  // Auto transition from Splash to Onboarding after 3.8 seconds (generous logo visibility)
  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => {
        setStep('onboarding');
      }, 3800);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleSplashComplete = () => {
    setStep('onboarding');
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
