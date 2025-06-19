import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';


// Data for our Case Study Slider
const caseStudies = [
  {
    number: '01',
    bgColor: '#e11d48',
    tags: ['Ahemdabad', 'B2E Event'],
    title: 'Kick Off 2025',
    visualClass: 'mock-visual-concert' // A CSS class for the visual
  },
  {
    number: '02',
    bgColor: '#0891b2',
    tags: ['International', 'Brand Activation'],
    title: 'Grand Hotel Oslo 150 Years',
    visualClass: 'mock-visual-festival'
  },
  {
    number: '03',
    bgColor: '#4d7c0f',
    tags: ['Canada', 'B2B Event'],
    title: 'G-7 Ministers Meeting',
    visualClass: 'mock-visual-press'
  }
];

// --- MAIN INITIALIZATION ---
// This single event listener will fire once the HTML is fully loaded.
document.addEventListener('DOMContentLoaded', () => {

  initCaseStudySlider();
  
  // Register GSAP plugins safely inside the listener
  gsap.registerPlugin(ScrollTrigger);

  // --- 1. General Setup ---
  const app = document.getElementById('app');
  const loader = document.querySelector('.loader');
  const body = document.body;

  // --- 2. Loader Logic ---
  setTimeout(() => {
    if (loader) loader.style.display = 'none';
    if (app) {
      app.style.display = 'block';
      setTimeout(() => app.style.opacity = 1, 50);
    }
  }, 2000);

  // --- 3. Run All Feature Initializations ---
  // We call each feature's setup function from here.
  initThemeToggle();
  initCustomCursor();
  initMobileNav();
  initSmoothScroll();
  initHeroSection();
  initClientScroller();
  initTabs();
  initContinuousScroller();


});


// --- FEATURE SETUP FUNCTIONS ---
// Each feature is now neatly encapsulated in its own function.

function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark-mode') {
    document.body.classList.add('dark-mode');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark-mode');
    } else {
      localStorage.removeItem('theme');
    }
  });
}

// Custom cursor initialization
function initCustomCursor() {
  const cursor = document.querySelector('.cursor');
  const aura = document.querySelector('.cursor-aura');
  if (!cursor || !aura) return;

  // Main cursor remains fast and responsive
  const cursorX = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
  const cursorY = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });
  
  // Aura has a longer duration for a more noticeable "chase"
  const auraX = gsap.quickTo(aura, "x", { duration: 0.5, ease: "power3" });
  const auraY = gsap.quickTo(aura, "y", { duration: 0.5, ease: "power3" });

  window.addEventListener('mousemove', e => {
    cursorX(e.clientX);
    cursorY(e.clientY);
    auraX(e.clientX);
    auraY(e.clientY);
  });
}

function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      // Do not scroll for the logo link
      if (targetId === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}


// Hero section initialization
function initHeroSection() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const crystalGroup = new THREE.Group();
  const geometry = new THREE.OctahedronGeometry(1, 0);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffd700, metalness: 0.8, roughness: 0.4,
  });

  const ringRadius = 3.5;
  for (let i = 0; i < 80; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    const angle = (i / 80) * Math.PI * 2;
    const x = Math.cos(angle) * ringRadius;
    const z = Math.sin(angle) * ringRadius;
    const y = (Math.random() - 0.5) * 3;
    mesh.position.set(x, y, z);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    const scale = Math.random() * 0.2 + 0.1;
    mesh.scale.set(scale, scale, scale);
    crystalGroup.add(mesh);
  }
  scene.add(crystalGroup);

  // --- DYNAMIC LIGHTING SYSTEM ---
  const mouseLight = new THREE.PointLight(0xffe8b8, 1.5); // Light that follows mouse
  scene.add(mouseLight);

  const orbitingLight = new THREE.PointLight(0xff8c00, 2); // Automated orange-gold light
  scene.add(orbitingLight);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
  bloomPass.threshold = 0.3; bloomPass.strength = 0.8; bloomPass.radius = 0.6;
  composer.addPass(bloomPass);

  const mouse = new THREE.Vector2();
  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  const clock = new THREE.Clock();
  const animate = () => {
    const elapsedTime = clock.getElapsedTime();
    crystalGroup.rotation.y = elapsedTime * 0.15;
    crystalGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.05;
    crystalGroup.rotation.z = Math.sin(elapsedTime * 1.2) * 0.02;

    // Update mouse light
    mouseLight.position.set(mouse.x * 5, mouse.y * 5, 2);

    // Animate the "Pulsing Orbiter" light
    orbitingLight.position.x = Math.cos(elapsedTime * 0.5) * ringRadius;
    orbitingLight.position.z = Math.sin(elapsedTime * 0.5) * ringRadius;
    orbitingLight.intensity = Math.sin(elapsedTime * 2) * 0.5 + 1.5; // Pulse intensity

    composer.render();
    requestAnimationFrame(animate);
  };
  animate();

  // GSAP UI Animations (Unchanged)
  const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.5 } });
  tl.from('.hero-title', { opacity: 0, y: 50, scale: 0.9 })
    .from('.hero-subtitle', { opacity: 0, y: 40, scale: 0.9 }, '-=1.3')
    .from('.cta-button', { opacity: 0, y: 30, scale: 0.9 }, '-=1.3')
    .from('.hero-card', { opacity: 0, y: 60, scale: 0.8, stagger: 0.2 }, '-=1.2')
    .from('.bar', { scaleY: 0, transformOrigin: 'bottom', stagger: 0.1, duration: 0.6 }, '-=0.8');
  const donut = document.querySelector('.donut-chart');
  if (donut) { tl.from(donut, { '--p': 0, duration: 1, ease: 'power2.inOut' }, '-=0.8'); }

  // Resize Handler (Unchanged)
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

function initClientScroller() {
  const scrollers = document.querySelectorAll(".scroller");
  if (!scrollers.length) return;

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    addAnimation();
  }

  function addAnimation() {
    scrollers.forEach((scroller) => {
      scroller.setAttribute("data-animated", true);
      const scrollerInner = scroller.querySelector(".scroller__inner");
      const scrollerContent = Array.from(scrollerInner.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        duplicatedItem.setAttribute("aria-hidden", true);
        scrollerInner.appendChild(duplicatedItem);
      });
    });
  }
}

function initTabs() {
  const tabsComponent = document.querySelector('.tabs-component');
  if (!tabsComponent) return;

  const tabButtons = tabsComponent.querySelectorAll('.tab-btn');
  const tabContents = tabsComponent.querySelectorAll('.tab-content');

  tabsComponent.addEventListener('click', (e) => {
    const clickedButton = e.target.closest('.tab-btn');
    if (!clickedButton) return;
    const tabNumber = clickedButton.dataset.tab;
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    clickedButton.classList.add('active');
    tabsComponent.querySelector(`.tab-content[data-tab="${tabNumber}"]`).classList.add('active');
  });
}

function initContinuousScroller() {
  const track = document.querySelector('.testimonials-track-css');
  if (!track) return;

  // Clone all children to create the seamless loop
  const cards = Array.from(track.children);
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', true);
    track.appendChild(clone);
  });
}

function initCaseStudySlider() {
  const slider = document.querySelector('.case-study-slider');
  if (!slider) return;

  // Get all the elements we need to animate
  const bg = document.querySelector('.case-study-background');
  const bgNumber = document.querySelector('.slider-bg-number');
  const visual = document.querySelector('.slider-visual > div');
  const tagsContainer = document.querySelector('.slider-tags');
  const title = document.querySelector('.slider-title');
  const nextBtn = document.querySelector('.next-arrow');
  const prevBtn = document.querySelector('.prev-arrow');

  let currentIndex = 0;

  function updateSlide(index, direction = 'right') {
    const slide = caseStudies[index];
    const fromDirection = (direction === 'right') ? '-100%' : '100%';
    const toDirection = (direction === 'right') ? '100%' : '-100%';

    const tl = gsap.timeline({
      onStart: () => {
        nextBtn.disabled = true;
        prevBtn.disabled = true;
      },
      onComplete: () => {
        nextBtn.disabled = false;
        prevBtn.disabled = false;
      }
    });

    tl.to([title, tagsContainer, visual], { opacity: 0, y: 30, duration: 0.4, ease: 'power2.in' })
      .to(bgNumber, { x: toDirection, opacity: 0, duration: 0.4, ease: 'power2.in' }, '-=0.4')
      .call(() => {
        // --- UPDATE CONTENT IN THE MIDDLE OF THE ANIMATION ---
        bg.style.backgroundColor = slide.bgColor;
        bgNumber.textContent = slide.number;
        title.textContent = slide.title;
        visual.className = slide.visualClass; // Swap visual style
        
        // Update tags
        tagsContainer.innerHTML = '';
        slide.tags.forEach(tagText => {
          const span = document.createElement('span');
          span.className = 'tag';
          span.textContent = tagText;
          tagsContainer.appendChild(span);
        });
      })
      .from(bgNumber, { x: fromDirection, opacity: 0, duration: 0.4, ease: 'power2.out' })
      .from([title, tagsContainer, visual], { opacity: 0, y: -30, duration: 0.4, ease: 'power2.out' }, '-=0.2');
  }

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % caseStudies.length;
    updateSlide(currentIndex, 'right');
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + caseStudies.length) % caseStudies.length;
    updateSlide(currentIndex, 'left');
  });
}

