import React, { useState } from 'react';
import { Plus, Zap } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { Priority, CategoryName, TimeEstimate, RepeatType } from '../../types';

interface QuickCaptureSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickCaptureSidebar({ isOpen, onClose }: QuickCaptureSidebarProps) {
  const { addTask } = useTaskContext();
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const parseInput = (input: string) => {
    let title = input;
    let category: CategoryName | null = null;
    let priority: Priority = null;
    let timeEstimate: TimeEstimate = '2-5 min';
    let dueDate = '';
    const tags: string[] = [];
    let isRecurring = false;
    let startDate = '';
    let endDate = '';
    let frequency: RepeatType = 'daily';

    // Extract categories
    const categoryMatches = title.match(/\/(read|write|speak|learn|pray|break|build)/gi);
    if (categoryMatches) {
      const categoryMatch = categoryMatches[0].substring(1).toLowerCase();
      category = (categoryMatch.charAt(0).toUpperCase() + categoryMatch.slice(1)) as CategoryName;
      title = title.replace(categoryMatches[0], '').trim();
    }

    // Extract tags and special keywords
    const tagMatches = title.match(/#\w+/g);
    if (tagMatches) {
      tagMatches.forEach(tagMatch => {
        const tag = tagMatch.substring(1).toLowerCase();
        
        // Special tags for priority
        if (tag === 'high' || tag === 'urgent') {
          priority = 'High';
        } else if (tag === 'medium') {
          priority = 'Medium';
        } else if (tag === 'low') {
          priority = 'Low';
        }
        // Special tags for time
        else if (tag === 'quick' || tag === '2min' || tag === '5min' || tag === 'fast' || tag === 'short') {
          timeEstimate = '2-5 min';
        } else if (tag === '10min' || tag === 'medium' || tag === 'mid') {
          timeEstimate = '5-10 min';
        } else if (tag === 'long' || tag === '15min' || tag === '30min' || tag === 'slow' || tag === 'extended') {
          timeEstimate = '10+ min';
        }
        // Special tags for dates
        else if (tag === 'today') {
          dueDate = new Date().toISOString().split('T')[0];
        } else if (tag === 'tomorrow') {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          dueDate = tomorrow.toISOString().split('T')[0];
        }
        // Recurring tags
        else if (tag === 'daily' || tag === 'weekly' || tag === 'monthly') {
          isRecurring = true;
          frequency = tag as RepeatType;
          startDate = new Date().toISOString().split('T')[0];
        }
        // Regular tags
        else {
          tags.push(tag);
        }
        
        title = title.replace(tagMatch, '').trim();
      });
    }

    return {
      title: title.trim(),
      category,
      tags,
      priority,
      timeEstimate,
      dueDate,
      isRecurring,
      startDate,
      endDate,
      frequency
    };
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const parsed = parseInput(input);
    if (!parsed.title) return;

    addTask({
      title: parsed.title,
      category: parsed.category,
      tags: parsed.tags,
      priority: parsed.priority,
      completed: false,
      repeat: 'none',
      time_estimate: parsed.timeEstimate,
      due_date: parsed.dueDate,
      is_recurring: parsed.isRecurring,
      start_date: parsed.isRecurring ? parsed.startDate : undefined,
      end_date: parsed.isRecurring && parsed.endDate ? parsed.endDate : undefined,
      frequency: parsed.isRecurring ? parsed.frequency : undefined,
    });

    // Reset form
    setInput('');
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setInput('');
      onClose();
    }
  };

  const preview = parseInput(input);

  if (!isOpen) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Zap className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Capture</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Add tasks quickly with shortcuts like <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">/read</code> <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">#urgent</code>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsExpanded(true)}
              placeholder="Write email to John /write #urgent #today #daily"
              className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || !preview.title}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>

        {/* Live preview when expanded */}
        {isExpanded && input.trim() && preview.title && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 border border-gray-200 dark:border-gray-600">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Preview:</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              {preview.title}
            </div>
            <div className="flex flex-wrap gap-1">
              {preview.category && (
                <span className="px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded">
                  {preview.category}
                </span>
              )}
              {preview.priority && (
                <span className={`px-1.5 py-0.5 text-xs rounded ${
                  preview.priority === 'High' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
                  preview.priority === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
                  'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                }`}>
                  {preview.priority}
                </span>
              )}
              <span className="px-1.5 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded">
                {preview.timeEstimate}
              </span>
              {preview.dueDate && (
                <span className="px-1.5 py-0.5 text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded">
                  {new Date(preview.dueDate).toLocaleDateString()}
                </span>
              )}
              {preview.tags.map((tag, index) => (
                <span key={index} className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

      </form>

      {/* Quick tips when expanded */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div><code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">/read</code> <code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">/write /speak /learn /pray /break /build</code> for categories</div>
            <div><code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">#urgent</code> <code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">#today</code> <code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">#tomorrow</code> for tags</div>
            <div><code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">#quick</code> <code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">#10min</code> <code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">#long</code> for time estimates</div>
            <div><code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">#daily</code> <code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">#weekly</code> <code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">#monthly</code> for recurring tasks</div>
            <div><kbd className="px-1 bg-gray-100 dark:bg-gray-600 rounded text-xs">⌘+Enter</kbd> to submit</div>
          </div>
        </div>
      )}
    </div>
  );
}
