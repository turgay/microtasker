import { Category } from '../types';

export const categories: Category[] = [
  { name: 'Read', icon: 'BookOpen', color: 'blue' },
  { name: 'Write', icon: 'PenTool', color: 'green' },
  { name: 'Speak', icon: 'MessageCircle', color: 'purple' },
  { name: 'Learn', icon: 'GraduationCap', color: 'orange' },
  { name: 'Pray', icon: 'Heart', color: 'pink' },
  { name: 'Break', icon: 'Coffee', color: 'amber' },
  { name: 'Build', icon: 'Hammer', color: 'red' }
];

export const getCategoryData = (name: string) => 
  categories.find(cat => cat.name === name);

export const getCategoryColor = (name: string) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    pink: 'bg-pink-100 text-pink-800 border-pink-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    red: 'bg-red-100 text-red-800 border-red-200'
  };
  
  const category = getCategoryData(name);
  return category ? colorMap[category.color] || 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-gray-100 text-gray-800 border-gray-200';
};