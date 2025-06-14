import React from 'react'
import { FaTimes, FaGithub, FaDiscord, FaExternalLinkAlt } from 'react-icons/fa'

import { AboutModalProps } from '@/types/props'

import { Button } from '@/ui/button'

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">About Todo List</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="size-8">
            <FaTimes />
          </Button>
        </div>

        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
              <svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
                <circle cx="256" cy="256" r="240" fill="#3b82f6" opacity="0.1" />
                <rect
                  x="85"
                  y="43"
                  width="342"
                  height="426"
                  rx="43"
                  ry="43"
                  fill="#ffffff"
                  stroke="#374151"
                  stroke-width="16"
                />
                <rect
                  x="171"
                  y="21"
                  width="170"
                  height="64"
                  rx="21"
                  ry="21"
                  fill="#9ca3af"
                  stroke="#374151"
                  stroke-width="12"
                />
                <circle cx="256" cy="53" r="16" fill="#374151" />
                <rect
                  x="95"
                  y="53"
                  width="342"
                  height="426"
                  rx="43"
                  ry="43"
                  fill="#000000"
                  opacity="0.05"
                  transform="translate(8, 8)"
                />
                <rect x="149" y="149" width="43" height="43" rx="6" fill="#f3f4f6" stroke="#374151" stroke-width="12" />
                <path
                  d="M156 171 L171 186 L192 156"
                  stroke="#10b981"
                  stroke-width="16"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <rect x="235" y="160" width="128" height="21" rx="10" fill="#e5e7eb" />
                <rect x="149" y="235" width="43" height="43" rx="6" fill="#f3f4f6" stroke="#374151" stroke-width="12" />
                <path
                  d="M156 256 L171 271 L192 241"
                  stroke="#10b981"
                  stroke-width="16"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <rect x="235" y="245" width="149" height="21" rx="10" fill="#e5e7eb" />
                <rect x="149" y="320" width="43" height="43" rx="6" fill="#ffffff" stroke="#374151" stroke-width="12" />
                <rect x="235" y="331" width="171" height="21" rx="10" fill="#d1d5db" />
                <circle cx="384" cy="384" r="96" fill="#10b981" opacity="0.1" />
                <path
                  d="M341 384 L363 406 L427 341"
                  stroke="#10b981"
                  stroke-width="24"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Todo List</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
              A modern, elegant desktop todo application built with Electron, React, and TypeScript. Organize your tasks
              with categories, priorities, due dates, and drag-and-drop functionality.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Version 1.0.0</p>
          </div>

          <div className="space-y-3 mb-6">
            <a
              href="https://github.com/chiefpansancolt/todo-list-app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
            >
              <div className="flex items-center">
                <FaGithub className="text-gray-700 dark:text-gray-300 text-xl mr-3" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">View on GitHub</span>
              </div>
              <FaExternalLinkAlt className="text-gray-400 text-sm group-hover:text-gray-600 dark:group-hover:text-gray-200" />
            </a>

            <a
              href="https://discord.gg/chiefpansancolt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors group"
            >
              <div className="flex items-center">
                <FaDiscord className="text-indigo-600 dark:text-indigo-400 text-xl mr-3" />
                <span className="text-indigo-700 dark:text-indigo-300 font-medium">Join Discord</span>
              </div>
              <FaExternalLinkAlt className="text-indigo-400 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-200" />
            </a>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Feedback & Bug Reports</h4>
            <p className="text-xs text-yellow-700 dark:text-yellow-400">
              Found a bug or have a feature request? Please report it in our Discord community for the fastest response.
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Created by{' '}
              <a
                href="https://chiefpansancolt.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                chiefpansancolt
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
