# MacIntodd Math - Algebra 2 Website

A modern, interactive website for Algebra 2 students featuring assignments, practice apps, and progress tracking.

## 🎯 Features

- **Interactive Assignments**: Organized by units with clear learning objectives
- **Math Practice Apps**: Interactive tools for practicing specific skills
- **Progress Tracking**: Integration with Google Sheets for student data
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern Stack**: Built with Next.js 15, TypeScript, and Tailwind CSS

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd macintodd-math-site
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Course Structure

### Unit 1: Linear Functions
- Slope-intercept form
- Point-slope form  
- Graphing linear equations
- **App**: Linear Function Grapher

### Unit 2: Systems of Equations
- Substitution method
- Elimination method
- Graphing systems
- **App**: Systems of Equations Solver

### Unit 3: Quadratic Functions (Current)
- Standard form and vertex form
- Factoring techniques
- Quadratic formula
- **Apps**: Factoring Practice, Quadratic Formula Calculator

### Unit 4: Exponential Functions (Coming Soon)
- Exponential growth and decay
- Compound interest
- **App**: Exponential Growth Simulator

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (planned)
- **Domain**: macintodd.net (planned)
- **Data**: Google Sheets API (planned)

## 📁 Project Structure

```
src/
├── app/
│   ├── assignments/          # Assignment pages by unit
│   │   ├── unit1/
│   │   ├── unit2/
│   │   ├── unit3/
│   │   └── page.tsx
│   ├── apps/                 # Interactive math applications
│   │   ├── factoring/
│   │   ├── quadratic-formula/
│   │   └── page.tsx
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/               # Reusable components (future)
└── utils/                    # Utility functions (future)
```

## 🎨 Design System

The site uses a consistent design system with:
- **Primary Colors**: Blue tones for navigation and primary actions
- **Secondary Colors**: Green for practice apps and success states
- **Accent Colors**: Yellow for hints and warnings
- **Typography**: Clear, readable fonts optimized for educational content
- **Cards**: Consistent card layouts for assignments and apps

## 🚀 Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Content

1. **New Assignment**: Create a new folder in `src/app/assignments/`
2. **New App**: Create a new folder in `src/app/apps/`
3. **Update Navigation**: Modify the layout component as needed

## 🔮 Future Enhancements

- [ ] Google Sheets integration for progress tracking
- [ ] More interactive math apps
- [ ] Student authentication system
- [ ] Real-time collaboration features
- [ ] Advanced analytics dashboard
- [ ] Mobile app version

## 📊 Deployment

This site is designed to be deployed on Vercel with automatic GitHub integration:

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure custom domain (macintodd.net)
4. Set up environment variables for Google Sheets API

## 📄 License

This project is for educational use in Shawn Todd's Algebra 2 class.

## 🤝 Contributing

This is a private educational project. If you're a student with suggestions, please reach out through the usual class channels.

---

Built with ❤️ for Algebra 2 students
