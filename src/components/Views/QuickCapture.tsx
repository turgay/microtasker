import React, { useState, useRef, useEffect } from 'react';
import { Plus, Zap, Hash, Calendar, Tag } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { categories } from '../../data/categories';
import { CategoryName, Priority, TimeEstimate } from '../../types';

export function QuickCapture() {
  const { addTask } = useTaskContext();
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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

  const updateSuggestions = (text: string) => {
    const suggestions: string[] = [];
    
    // Category suggestions
    if (text.includes('/')) {
      const partial = text.split('/').pop()?.toLowerCase() || '';
      categories.forEach(cat => {
        if (cat.name.toLowerCase().startsWith(partial)) {
          suggestions.push(`/${cat.name.toLowerCase()}`);
        }
      });
    }
    
    // Tag suggestions
    if (text.includes('#')) {
      const partial = text.split('#').pop()?.toLowerCase() || '';
      const commonTags = ['today', 'tomorrow', 'urgent', 'high', 'medium', 'low', 'quick', 'long', 'work', 'personal'];
      commonTags.forEach(tag => {
        if (tag.startsWith(partial)) {
          suggestions.push(`#${tag}`);
        }
      });
    }
    
    setSuggestions(suggestions.slice(0, 5));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    updateSuggestions(value);
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
    setSuggestions([]);
    
    // Keep focus on input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Quick submit with Cmd/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const insertSuggestion = (suggestion: string) => {
    const lastSlashIndex = input.lastIndexOf('/');
    const lastHashIndex = input.lastIndexOf('#');
    const lastSpecialIndex = Math.max(lastSlashIndex, lastHashIndex);
    
    if (lastSpecialIndex !== -1) {
      const newInput = input.substring(0, lastSpecialIndex) + suggestion + ' ';
      setInput(newInput);
      setSuggestions([]);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const preview = parseInput(input);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Zap className="w-8 h-8 text-green-600" />
            Quick Capture
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Type naturally with shortcuts: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">/read</code> for categories, <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">#urgent</code> for tags, <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">#today</code> for dates
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Write email to John /write #urgent #today"
              className="w-full px-6 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            
            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => insertSuggestion(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Live preview */}
          {input.trim() && preview.title && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</div>
              <div className="space-y-2">
                <div className="font-medium text-gray-900 dark:text-white">
                  {preview.title}
                </div>
                <div className="flex flex-wrap gap-2">
                  {preview.category && (
                    <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md border border-blue-200 dark:border-blue-800">
                      {preview.category}
                    </span>
                  )}
                  {preview.priority && (
                    <span className={`px-2 py-1 text-xs rounded-md border ${
                      preview.priority === 'High' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' :
                      preview.priority === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' :
                      'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
                    }`}>
                      {preview.priority} Priority
                    </span>
                  )}
                  <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-md border border-purple-200 dark:border-purple-800">
                    {preview.timeEstimate}
                  </span>
                  {preview.dueDate && (
                    <span className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-md border border-orange-200 dark:border-orange-800">
                      Due: {new Date(preview.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {preview.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={!input.trim() || !preview.title}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">⌘ + Enter</kbd> to quick add
            </div>
          </div>
        </form>

        {/* Quick reference */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick Reference:</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                <Tag className="w-4 h-4" />
                Categories
              </div>
              <div className="space-y-1 text-gray-600 dark:text-gray-400">
                <div><code>/read</code> <code>/write</code> <code>/speak</code></div>
                <div><code>/learn</code> <code>/pray</code> <code>/break</code> <code>/build</code></div>
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                <Hash className="w-4 h-4" />
                Tags & Priority
              </div>
              <div className="space-y-1 text-gray-600 dark:text-gray-400">
                <div><code>#urgent</code> <code>#high</code> <code>#medium</code> <code>#low</code></div>
                <div><code>#quick</code> <code>#long</code> <code>#work</code> <code>#personal</code></div>
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Dates
              </div>
              <div className="space-y-1 text-gray-600 dark:text-gray-400">
                <div><code>#today</code> <code>#tomorrow</code></div>
                <div>Auto-schedules the task</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}