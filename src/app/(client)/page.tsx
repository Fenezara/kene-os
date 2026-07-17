'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Sparkles, ShoppingBag, Calendar, User, LogOut, ArrowRight, 
  Sprout, FlaskConical, Wallet, Sun, Thermometer, Droplets, AlertTriangle 
} from 'lucide-react'
import OTPAuth from '@/components/kene/OTPAuth'

export default function ClientHomePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    // Check if session cookie exists/fetch current session
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('kene_user')
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser))
        }
      } catch (e) {
        console.error(e)
      } finally {
        setCheckingSession(false)
      }
    }
    checkSession()
  }, [])

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user)
    localStorage.setItem('kene_user', JSON.stringify(user))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('kene_user')
    // Clear cookie
    document.cookie = 'kene_session=; Max-Age=0; path=/;'
  }

  if (checkingSession) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-karite/60 min-h-[85vh]">
        <div className="w-8 h-8 border-4 border-gold-kene border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col justify-between p-6 min-h-[85vh]">
      {/* Top Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Duafe Logo" className="w-8 h-8 filter brightness-110" />
          <span className="font-display font-bold text-xl text-gold-kene tracking-wider">Kènè</span>
        </div>
        {currentUser && (
          <button
            onClick={handleLogout}
            className="text-xs text-karite/40 hover:text-karite flex items-center gap-1.5 transition font-sans cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Déconnexion
          </button>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center my-auto">
        {!currentUser ? (
          <div className="space-y-6">
            {/* Logo and Intro */}
            <div className="text-center space-y-3 mb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                className="w-16 h-16 mx-auto bg-gradient-to-tr from-gold-kene to-sunset rounded-3xl flex items-center justify-center shadow-lg shadow-gold-kene/20"
              >
                <img src="/logo.svg" alt="Duafe" className="w-10 h-10 invert" />
              </motion.div>
              <h1 className="text-3xl font-bold font-display text-karite tracking-wide">
                La beauté mélanoderme, <br />
                <span className="text-gold-kene">révélée.</span>
              </h1>
              <p className="text-sm text-karite/50 font-sans max-w-xs mx-auto">
                Diagnostic de peau par IA calibré Fitzpatrick IV-VI, soins botaniques et réservation d'instituts.
              </p>
            </div>

            {/* Auth Card */}
            <div className="bg-[#241C16]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl">
              <OTPAuth onSuccess={handleLoginSuccess} />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Welcome banner */}
            <div className="bg-[#241C16]/40 backdrop-blur-lg border border-white/5 rounded-3xl p-6 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gold-kene/10 border border-gold-kene/20 flex items-center justify-center text-gold-kene">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-karite/40 font-sans block">Content de vous revoir,</span>
                  <span className="text-lg font-bold text-karite font-display">Membre Kènè</span>
                  <span className="text-xs text-gold-kene font-sans block mt-0.5">{currentUser.phone}</span>
                </div>
              </div>
              <button
                onClick={() => router.push('/wallet')}
                className="bg-gold-kene/10 hover:bg-gold-kene/20 border border-gold-kene/20 text-gold-kene text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                Portefeuille
              </button>
            </div>

            {/* Skin Weather Widget */}
            <SkinWeatherWidget />

            {/* Grid menu */}
            <div className="grid grid-cols-2 gap-4">
              {/* Scan Card */}
              <button 
                onClick={() => router.push('/diagnostic')}
                className="bg-gradient-to-b from-[#241C16]/70 to-[#1A1410]/70 border border-white/5 rounded-3xl p-5 text-left flex flex-col justify-between h-40 hover:border-gold-kene/30 transition group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-gold-kene/10 flex items-center justify-center text-gold-kene group-hover:scale-110 transition">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-karite/40 font-sans block">Scan de peau IA</span>
                  <span className="text-sm font-bold font-display text-karite group-hover:text-gold-kene transition block mt-1">Diagnostic</span>
                </div>
              </button>

              {/* Customizer Card */}
              <button 
                onClick={() => router.push('/customizer')}
                className="bg-gradient-to-b from-[#241C16]/70 to-[#1A1410]/70 border border-white/5 rounded-3xl p-5 text-left flex flex-col justify-between h-40 hover:border-gold-kene/30 transition group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-sunset/10 flex items-center justify-center text-sunset group-hover:scale-110 transition">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-karite/40 font-sans block">Lab de Formulation</span>
                  <span className="text-sm font-bold font-display text-karite group-hover:text-sunset transition block mt-1">Soin Sur Mesure</span>
                </div>
              </button>

              {/* Jardin du Glow Card */}
              <button 
                onClick={() => router.push('/jardin')}
                className="bg-gradient-to-b from-[#241C16]/70 to-[#1A1410]/70 border border-white/5 rounded-3xl p-5 text-left flex flex-col justify-between h-40 hover:border-gold-kene/30 transition group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-baobab/10 flex items-center justify-center text-baobab group-hover:scale-110 transition">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-karite/40 font-sans block">Routine de soins</span>
                  <span className="text-sm font-bold font-display text-karite group-hover:text-baobab transition block mt-1">Jardin du Glow</span>
                </div>
              </button>

              {/* Appointments Card */}
              <button 
                onClick={() => router.push('/appointments')}
                className="bg-gradient-to-b from-[#241C16]/70 to-[#1A1410]/70 border border-white/5 rounded-3xl p-5 text-left flex flex-col justify-between h-40 hover:border-gold-kene/30 transition group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-gold-kene/10 flex items-center justify-center text-gold-kene group-hover:scale-110 transition">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-karite/40 font-sans block">Mes soins en cabine</span>
                  <span className="text-sm font-bold font-display text-karite group-hover:text-gold-kene transition block mt-1">Rendez-vous</span>
                </div>
              </button>

              {/* Chatbot Card */}
              <button 
                onClick={() => router.push('/chat')}
                className="col-span-2 bg-gradient-to-r from-gold-kene/10 to-sunset/10 border border-gold-kene/20 rounded-3xl p-5 text-left flex items-center justify-between hover:border-gold-kene/40 transition group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gold-kene/20 flex items-center justify-center text-gold-kene group-hover:scale-110 transition">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] text-karite/40 font-sans block">Mama Kènè AI</span>
                    <span className="text-xs font-bold font-display text-white group-hover:text-gold-kene transition block">Conseillère Dermo-Botanique</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gold-kene group-hover:translate-x-1 transition" />
              </button>
            </div>
            
            {/* CTA action */}
            <button 
              onClick={() => router.push('/diagnostic')}
              className="w-full bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 transition font-display shadow-lg shadow-gold-kene/10 cursor-pointer"
            >
              Lancer mon Diagnostic IA
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer Branding */}
      <footer className="text-center text-[10px] text-karite/30 pt-6">
        Kènè — Expérience Beauté Mélanoderme &copy; 2026
      </footer>
    </div>
  )
}

function SkinWeatherWidget() {
  const [city, setCity] = useState<'abidjan' | 'dakar'>('abidjan')
  const [temp, setTemp] = useState(32)
  const [humidity, setHumidity] = useState(82)
  const [uvIndex, setUvIndex] = useState(9)
  const [season, setSeason] = useState<'humide' | 'harmattan' | 'seche'>('humide')

  useEffect(() => {
    const month = new Date().getMonth()
    if (city === 'abidjan') {
      if (month >= 4 && month <= 6) { // May-July
        setSeason('humide')
        setTemp(29)
        setHumidity(86)
        setUvIndex(8)
      } else if (month === 11 || month <= 1) { // Dec-Feb
        setSeason('harmattan')
        setTemp(33)
        setHumidity(38)
        setUvIndex(10)
      } else {
        setSeason('seche')
        setTemp(32)
        setHumidity(74)
        setUvIndex(9)
      }
    } else {
      if (month >= 6 && month <= 9) { // Jul-Oct
        setSeason('humide')
        setTemp(31)
        setHumidity(80)
        setUvIndex(9)
      } else if (month === 11 || month <= 1) {
        setSeason('harmattan')
        setTemp(28)
        setHumidity(35)
        setUvIndex(8)
      } else {
        setSeason('seche')
        setTemp(26)
        setHumidity(60)
        setUvIndex(7)
      }
    }
  }, [city])

  const getWeatherTitle = () => {
    if (season === 'humide') return { label: 'Mousson Humide (Hivernage)', style: 'text-blue-400' }
    if (season === 'harmattan') return { label: 'Harmattan Chaud & Sec', style: 'text-orange-400' }
    return { label: 'Saison Sèche Standard', style: 'text-gold-kene' }
  }

  const getSkinForecast = () => {
    if (season === 'humide') {
      return {
        alert: "⚠️ Alerte Sébum : Risque de brillance élevé sur la zone T.",
        advice: "Mama Kènè dit : « Ma fille, l'air d'Abidjan est lourd aujourd'hui. Laisse de côté les huiles trop denses en journée. Privilégie un gel nettoyant au Moringa pour réguler le sébum et garder ton teint frais. »"
      }
    }
    if (season === 'harmattan') {
      return {
        alert: "⚠️ Alerte Déshydratation : Tiraillements et perte d'eau critiques.",
        advice: "Mama Kènè dit : « Mon enfant, le vent sec de l'Harmattan s'élève. C'est le moment d'insister sur le beurre de Karité pur et l'huile de Baobab soir et matin pour sceller l'hydratation. »"
      }
    }
    return {
      alert: "☀️ Indice UV Élevé : Protection mélanine requise.",
      advice: "Mama Kènè dit : « Le soleil brille fort aujourd'hui. Protège ta mélanine avec notre crème hydratante protectrice au Karité et évite l'exposition directe aux heures chaudes. »"
    }
  }

  const forecast = getSkinForecast()
  const weatherInfo = getWeatherTitle()

  return (
    <div className="bg-[#241C16]/30 border border-white/5 rounded-3xl p-5 space-y-4 shadow-lg backdrop-blur-lg">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-gold-kene">Météo de la Peau</h3>
          <p className="text-[10px] text-karite/40 font-sans">Adapter votre rituel beauté au climat local</p>
        </div>
        
        <div className="flex bg-[#1A1410] p-0.5 rounded-lg border border-white/5">
          <button 
            onClick={() => setCity('abidjan')}
            className={`text-[9px] font-bold px-2 py-1 rounded-md transition ${city === 'abidjan' ? 'bg-gold-kene text-[#1A1410]' : 'text-karite/40'}`}
          >
            Abidjan 🇨🇮
          </button>
          <button 
            onClick={() => setCity('dakar')}
            className={`text-[9px] font-bold px-2 py-1 rounded-md transition ${city === 'dakar' ? 'bg-gold-kene text-[#1A1410]' : 'text-karite/40'}`}
          >
            Dakar 🇸🇳
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#1A1410]/50 border border-white/5 rounded-2xl p-2.5 flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-orange-400 shrink-0" />
          <div className="space-y-0.5">
            <span className="text-[8px] text-karite/40 uppercase block font-sans">Temp.</span>
            <span className="text-xs font-mono font-bold text-white">{temp}°C</span>
          </div>
        </div>
        
        <div className="bg-[#1A1410]/50 border border-white/5 rounded-2xl p-2.5 flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-400 shrink-0" />
          <div className="space-y-0.5">
            <span className="text-[8px] text-karite/40 uppercase block font-sans">Humidité</span>
            <span className="text-xs font-mono font-bold text-white">{humidity}%</span>
          </div>
        </div>

        <div className="bg-[#1A1410]/50 border border-white/5 rounded-2xl p-2.5 flex items-center gap-2">
          <Sun className="w-4 h-4 text-gold-kene shrink-0" />
          <div className="space-y-0.5">
            <span className="text-[8px] text-karite/40 uppercase block font-sans">Indice UV</span>
            <span className="text-xs font-mono font-bold text-white">{uvIndex} / 12</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-1 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-orange-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{forecast.alert}</span>
        </div>
        <p className="text-[10px] text-karite/70 italic leading-relaxed bg-[#1A1410]/30 border border-white/5 p-3 rounded-2xl font-sans">
          {forecast.advice}
        </p>
        <div className="text-[9px] text-karite/40 flex items-center justify-between font-sans">
          <span>Climat actuel : <span className={`font-semibold ${weatherInfo.style}`}>{weatherInfo.label}</span></span>
        </div>
      </div>
    </div>
  )
}
