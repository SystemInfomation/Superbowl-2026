'use client'

import { motion } from 'framer-motion'
import { useState, ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  icon?: string
  content: ReactNode
}

interface TabsNavigationProps {
  tabs: Tab[]
}

/**
 * TabsNavigation - Framer Motion powered tabs for switching between views
 */
export default function TabsNavigation({ tabs }: TabsNavigationProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '')

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  return (
    <div className="bg-black/60 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-white/10 overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex-1 min-w-[120px] px-4 py-4 font-bebas text-sm md:text-base transition-colors ${
              activeTab === tab.id
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {/* Active indicator */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-patriots-red to-seahawks-green"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            
            <div className="flex items-center justify-center gap-2">
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="p-6 md:p-8"
      >
        {activeTabContent}
      </motion.div>
    </div>
  )
}
