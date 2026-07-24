'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Bell, Coins, Calendar, FlaskConical } from 'lucide-react'

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const storedUser = localStorage.getItem('kene_user')
        if (storedUser) {
          const user = JSON.parse(storedUser)
          const res = await fetch(`/api/notifications?userId=${user.id}`)
          const data = await res.json()
          if (data.success) {
            setNotifications(data.notifications)
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case 'wallet': return <Coins className="w-5 h-5" />
      case 'appointment': return <Calendar className="w-5 h-5" />
      case 'diagnosis': return <FlaskConical className="w-5 h-5" />
      default: return <Bell className="w-5 h-5" />
    }
  }

  const getIconBg = (type: string) => {
    switch (type) {
      case 'wallet': return 'bg-gold-kene/20 text-gold-kene'
      case 'appointment': return 'bg-sunset/20 text-sunset'
      case 'diagnosis': return 'bg-baobab/20 text-baobab'
      default: return 'bg-white/10 text-white'
    }
  }

  return (
    <div className="flex-1 flex flex-col p-6 min-h-[85vh]">
      <header className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold font-display text-white tracking-wide">Notifications</h1>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gold-kene border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-karite/40">
            <Bell className="w-8 h-8" />
          </div>
          <p className="text-sm text-karite/60 font-sans">Vous n'avez aucune notification pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#241C16]/50 border border-white/5 rounded-2xl p-4 flex gap-4 relative overflow-hidden"
            >
              {!notif.read && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gold-kene"></div>
              )}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getIconBg(notif.type)}`}>
                {getIcon(notif.type)}
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-sm pr-4">{notif.title}</h3>
                <p className="text-xs text-karite/60 font-sans mt-1 line-clamp-2">{notif.message}</p>
                <span className="text-[10px] text-karite/40 font-mono mt-2 block">
                  {new Date(notif.date).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
