# PlotLogic

**PlotLogic** is an interactive 3D visualizer for mathematical functions, vector fields, and tangent planes. Built with **React Three Fiber** and **Tailwind CSS**, it allows you to plot surfaces, toggle vector fields, and explore gradients with live controls.

---

## ✨ Features

- **Surface Visualization**: Render 3D surfaces defined by expressions like `sin(x)*cos(y)` or `x^2 - y^2`.  
- **Live Controls**: Adjust domain size, resolution, and parameters interactively.  
- **Vector Fields**: Visualize gradient fields (∇f) with optional normalization.  
- **Tangent Plane**: Inspect tangent planes at custom points on the surface.  
- **Modern UI**: Styled with Tailwind CSS and glassmorphism panels.  

---

## 📂 Project Structure

plotlogic/  
├─ public/              # Static assets (HTML, icons, etc.)  
├─ src/                 # React / TypeScript source files  
│   ├─ components/      # 3D components (Canvas3D, SurfaceMesh, VectorField, GradientPlane)  
│   ├─ math/            # Math + parsing utilities  
│   ├─ App.tsx          # Main UI layout  
│   ├─ main.tsx         # Entry point  
│   └─ index.css        # Tailwind + custom styles  
├─ package.json         # Project metadata & dependencies  
├─ package-lock.json    # Exact dependency versions  
├─ tsconfig.json        # TypeScript configuration  
├─ vite.config.ts       # Vite configuration  
├─ tailwind.config.js   # Tailwind CSS setup  
└─ postcss.config.js    # PostCSS configuration  

---

## 🚀 Setup & Run Locally

### 1. Clone the repo
git clone https://github.com/alexanderleungg/plotlogic.git  
cd plotlogic

### 2. Install dependencies
npm install

### 3. Start development server
npm run dev

### 4. Open in browser
Navigate to http://localhost:5173 to interact with the app.

---

## 🛠 How It Works

- Built with **React** and **TypeScript**  
- **React Three Fiber** + **Three.js** for 3D rendering  
- **drei** for R3F helpers, **Leva** for UI controls, **Zustand** for state  
- Styled with **Tailwind CSS** (with gradients + glassmorphism utilities)  

---

📐 Crafted with care by **Alexander Leung**.
