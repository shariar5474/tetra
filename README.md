# TETRA — IT Training Institute, Digital Agency & LMS Platform

A pixel-perfect, production-grade educational and digital agency platform built for **TETRA** based on official brand assets and UI/UX design specifications.

---

## 🚀 Key Highlights & Architectural Features

1. **Pixel-Perfect Reference Alignment**
   - **Hero Carousel:** Dark navy background (`#071426`), animated floating badges (*AI Automation, Digital Marketing, Graphics Design, Web Development*), student illustration with TETRA laptop & headphones, feature pills (*Expert Trainers, Hands-on Projects, Certificate, Job Support*), and dynamic slides.
   - **Horizontal Statistics Bar:** Live editable metrics (*10,000+ Happy Learners, 50+ Expert Trainers, 100+ Online Courses, 25+ IT Services, 95% Success Rate*).
   - **Popular Courses:** 4-column responsive grid with Bestseller/Popular/Trending badges, lesson count, course duration, ratings, strikethrough pricing, discount badges, and active checkout/enrollment modal.
   - **Our Services:** 6 digital agency capabilities (*AI Solutions, Digital Marketing, Graphics Design, Web Development, Business Automation, IT Consulting*) with custom icon containers.
   - **Why Choose TETRA & Faculty:** Dark navy card with 6 checklists and glowing 3D trophy + 4-column trainer faculty cards (*Shariar Islam Sohel, Omar Faruque Razib, Zara Islam, Tanvir Ahmed*) with experience badges and portfolio links.
   - **Student Testimonials:** 5-star student review cards with authentic Bengali feedback and avatars.
   - **CTA Banner & Footer:** Official TETRA logo, Agrabad, Chattogram address, phone, email, Google Maps link, and functional newsletter subscription.

2. **Role-Based Authentication & Permissions**
   - **Super Admin:** Master platform management, Homepage Builder, Hero Carousel Manager, Statistics Editor, Course Manager, Pricing & Discount controls, Lead/Inquiry Tracker, and Testimonial approval.
   - **Trainer:** Dedicated portal for instructors to view assigned courses, track student enrollments, and evaluate assignments with marks and feedback.
   - **Student:** Self-service registration, course enrollment, interactive video classroom with module accordions, resource downloads, project submission, and verified digital certificates.
   - **Quick Demo Persona Switcher:** Built-in 1-click persona switcher in the navbar to test Super Admin, Trainer, and Student roles with zero friction.

3. **Digital Credential Verification**
   - Verifiable digital certificates with official seal, grade, trainer signature, and print/download capability at `/verify-certificate?id=TETRA-2026-AI-8839`.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons, Canvas Confetti
- **Backend & Database:** Firebase Authentication, Cloud Firestore, Firebase Storage
- **Routing:** React Router v7
- **Security:** Strict Firestore Security Rules (`firestore.rules`) enforcing role boundaries

---

## 🏃 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 🔐 Credentials & Role Switching

| Role | Email | Password | Access |
|---|---|---|---|
| **Super Admin** | `admin@tetra.com.bd` | `admin123` | Full CMS, Homepage Builder, Lead Manager |
| **Trainer** | `trainer@tetra.com.bd` | `trainer123` | Assigned courses & assignment grading |
| **Student** | `student@tetra.com.bd` | `student123` | Learning classroom & certificates |

*(You can also use the navbar "Demo Persona" button to switch roles with a single click).*
