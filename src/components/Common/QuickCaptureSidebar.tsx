import React, { useState, useRef } from 'react';
import { Plus, Zap } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { categories } from '../../data/categories';
import { CategoryName, Priority, TimeEstimate } from '../../types';

export function QuickCaptureSidebar() {
  const { addTask } = useTaskContext();
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const parseInput = (text: string) => {
    let title = text;
    let category: CategoryName | null = null;
    let tags: string[] = [];
    let priority: Priority = null;
    let timeEstimate: TimeEstimate = '2-5 min';
    let dueDate: string | undefined = undefined;

    // Extract categories (/read, /write, etc.)
    const categoryMatch = text.match(/\/(\w+)/g);
    if (categoryMatch) {
      const categoryText = categoryMatch[0].substring(1).toLowerCase();
      const foundCategory = categories.find(cat => 
        cat.name.toLowerCase() === categoryText
      );
      if (foundCategory) {
        category = foundCategory.name;
        title = title.replace(categoryMatch[0], '').trim();
      }
    }

    // Extract tags (#urgent, #work, etc.)
    const tagMatches = text.match(/#(\w+)/g);
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
        else if (tag === 'quick' || tag === '2min' || tag === '5min') {
          timeEstimate = '2-5 min';
        } else if (tag === '10min') {
          timeEstimate = '5-10 min';
        } else if (tag === 'long' || tag === '15min' || tag === '30min') {
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
      dueDate
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
      due_date: parsed.dueDate
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
    }
  };

  const preview = parseInput(input);

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
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsExpanded(true)}
              placeholder="Write email to John /write #urgent #today"
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
            <div><kbd className="px-1 bg-gray-100 dark:bg-gray-600 rounded text-xs">⌘+Enter</kbd> to submit</div>
          </div>
        </div>
      )}
    </div>
  );
}
