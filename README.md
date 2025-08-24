# MicroTasker

A modern, intuitive task management application built with React and TypeScript. MicroTasker helps you organize and complete micro-tasks across seven key life categories with a clean, responsive interface.

## ✨ Features

### 📋 Task Management
- **Quick Capture**: Rapidly add tasks with minimal friction
- **Smart Categorization**: Organize tasks across 7 predefined categories
- **Priority Levels**: High, Medium, Low priority assignment
- **Time Estimates**: 2-5 min, 5-10 min, 10+ min duration tracking
- **Flexible Scheduling**: Set due dates and repeat patterns

### 🎯 Seven Life Categories
- **📖 Read** - Books, articles, documentation
- **✍️ Write** - Content creation, journaling, notes
- **💬 Speak** - Calls, presentations, conversations
- **🎓 Learn** - Study, courses, skill development
- **💝 Pray** - Meditation, reflection, spiritual practice
- **☕ Break** - Rest, relaxation, self-care
- **🔨 Build** - Projects, creation, development

### 📊 Four Powerful Views
- **📥 Backlog** - All unscheduled tasks with smart filtering
- **📅 Planning** - Schedule and organize upcoming tasks
- **🎯 Today** - Focus on today's priorities and quick captures
- **📈 Progress** - Track completion rates and productivity insights

### 💾 Data Persistence
- **Local Storage**: All data persists locally in your browser
- **No Account Required**: Start using immediately without signup
- **Privacy First**: Your tasks stay on your device

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd microtasker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

- **Frontend**: React 18.3.1 + TypeScript 5.5.3
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React 0.344.0
- **State Management**: React Context + Custom Hooks
- **Storage**: Browser LocalStorage
- **Linting**: ESLint 9.9.1

## 📱 Usage

### Quick Task Creation
1. Use the **Quick Capture** sidebar for rapid task entry
2. Add title, select category, set priority and time estimate
3. Tasks automatically save to your backlog

### Task Organization
- **Backlog**: View all uncompleted tasks, filter by category or status
- **Planning**: Drag tasks to schedule them for specific days
- **Today**: Focus on today's scheduled tasks and quick captures
- **Progress**: Review completed tasks and productivity metrics

### Task Management
- ✅ **Complete**: Click checkbox to mark tasks done
- ✏️ **Edit**: Click on task details to modify
- 🗑️ **Delete**: Remove tasks you no longer need
- 🔄 **Repeat**: Set up recurring tasks (daily, weekly, custom)

## 🎨 Customization

### Categories
Modify categories in `src/data/categories.ts`:
```typescript
export const categories: Category[] = [
  { name: 'Read', icon: 'BookOpen', color: 'blue' },
  // Add your custom categories
];
```

### Styling
- Tailwind classes can be customized in `tailwind.config.js`
- Component styles are in individual `.tsx` files
- Global styles in `src/index.css`

## 📁 Project Structure

```
src/
├── components/
│   ├── Common/          # Reusable components
│   ├── Layout/          # Navigation and layout
│   └── Views/           # Main view components
├── context/
│   └── TaskContext.tsx  # Global state management
├── data/
│   └── categories.ts    # Category definitions
├── hooks/
│   └── useLocalStorage.ts # Local storage hook
├── types/
│   └── index.ts         # TypeScript interfaces
├── App.tsx              # Main app component
└── main.tsx            # App entry point
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- TypeScript strict mode enabled
- ESLint with React hooks rules
- Consistent component structure with props interfaces

## 🌟 Key Design Principles

- **Minimal Friction**: Quick task capture without overwhelming options
- **Visual Clarity**: Color-coded categories and clean typography
- **Mobile Responsive**: Works seamlessly on all device sizes
- **Performance**: Optimized with Vite and efficient React patterns
- **Accessibility**: Semantic HTML and keyboard navigation support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🚀 Future Enhancements

- [ ] Cloud sync and backup
- [ ] Team collaboration features
- [ ] Advanced analytics and insights
- [ ] Mobile app (React Native)
- [ ] Integration with calendar apps
- [ ] Custom category creation
- [ ] Task templates and automation

---

**MicroTasker** - Making productivity simple, one micro-task at a time. ✨
