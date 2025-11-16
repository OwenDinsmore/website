/**
 * 3D Wireframe Globe Animation
 * Rolls diagonally across viewport with scroll
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class Globe {
  constructor(canvasId, sectionId) {
    console.log('Globe constructor called with:', canvasId, sectionId);
    this.canvas = document.getElementById(canvasId);
    this.section = document.getElementById(sectionId);

    console.log('Canvas element:', this.canvas);
    console.log('Section element:', this.section);

    if (!this.canvas || !this.section) {
      console.error('Globe: Canvas or section not found', {
        canvas: this.canvas,
        section: this.section
      });
      return;
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.globe = null;
    this.animationFrameId = null;
    this.isVisible = false;

    console.log('Starting globe initialization...');
    this.init();
    console.log('Globe Three.js scene initialized');

    // Setup scroll-based rotation
    this.setupScrollAnimation();
    console.log('Globe scroll animation enabled');

    this.handleResize();

    // Start rendering continuously
    this.startRendering();
    console.log('Globe constructor complete - rendering started');
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);

    // Move camera far enough to see the whole sphere
    const viewportSize = Math.min(window.innerWidth, window.innerHeight);
    const sphereSize = viewportSize * 0.66;  // Match globe size
    this.camera.position.z = sphereSize * 1.8;  // Closer camera for larger appearance

    console.log('Camera position z:', this.camera.position.z);
    console.log('Expected sphere size:', sphereSize);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.createGlobe();

    window.addEventListener('resize', () => this.handleResize());
  }

  createGlobe() {
    const isMobile = window.innerWidth < 768;
    // Fewer segments = fewer grid lines
    const segments = isMobile ? 8 : 12;
    // Make globe larger - 2/3 of viewport
    this.globeRadius = Math.min(window.innerWidth, window.innerHeight) * 0.66;

    const geometry = new THREE.SphereGeometry(this.globeRadius, segments, segments);

    const material = new THREE.MeshBasicMaterial({
      color: 0x00FF41,
      wireframe: true,
      transparent: true,
      opacity: 0.15,  // Very subtle base wireframe
      side: THREE.FrontSide,  // Only render front faces
      depthWrite: true,
      depthTest: true
    });

    this.globe = new THREE.Mesh(geometry, material);
    this.scene.add(this.globe);

    // Add solid black sphere inside to prevent see-through
    const solidGeometry = new THREE.SphereGeometry(this.globeRadius * 0.99, segments, segments);
    const solidMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide
    });
    const solidSphere = new THREE.Mesh(solidGeometry, solidMaterial);
    this.globe.add(solidSphere);

    // No glow effect - removed to eliminate green haze

    // Add country borders
    this.addCountryBorders();

    // Position at center initially for visibility
    this.globe.position.set(0, 0, 0);

    // Rotation controlled by ScrollTrigger in setupScrollAnimation()

    console.log('Globe created at position:', this.globe.position);
    console.log('Globe size:', this.globeRadius);
  }

  addCountryBorders() {
    // Use simpler GeoJSON format
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(response => response.json())
      .then(data => {
        console.log('Country data loaded:', data);
        this.drawCountryBordersFromGeoJSON(data);
      })
      .catch(err => {
        console.error('Failed to load country borders:', err);
        // Fallback: draw latitude/longitude grid
        this.drawLatLonGrid();
      });
  }

  drawCountryBordersFromGeoJSON(geojson) {
    const material = new THREE.LineBasicMaterial({
      color: 0xFFFFFF,  // White
      transparent: true,
      opacity: 0.9,
      linewidth: 2,
      depthTest: true,
      depthWrite: true
    });

    geojson.features.forEach(feature => {
      if (!feature.geometry) return;

      if (feature.geometry.type === 'Polygon') {
        this.drawPolygon(feature.geometry.coordinates, material);
      } else if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach(polygon => {
          this.drawPolygon(polygon, material);
        });
      }
    });

    console.log('Country borders drawn');
  }

  drawPolygon(coordinates, material) {
    coordinates.forEach(ring => {
      const points = [];
      ring.forEach(coord => {
        const [lon, lat] = coord;
        const point = this.latLonToVector3(lat, lon, this.globeRadius);
        points.push(point);
      });

      if (points.length > 1) {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        this.globe.add(line);
      }
    });
  }

  drawLatLonGrid() {
    // Fallback: draw simple lat/lon grid
    const material = new THREE.LineBasicMaterial({
      color: 0xFFFFFF,  // White
      transparent: true,
      opacity: 0.7,
      depthTest: true,
      depthWrite: true
    });

    // Draw latitude lines
    for (let lat = -80; lat <= 80; lat += 20) {
      const points = [];
      for (let lon = -180; lon <= 180; lon += 5) {
        points.push(this.latLonToVector3(lat, lon, this.globeRadius));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      this.globe.add(line);
    }

    // Draw longitude lines
    for (let lon = -180; lon < 180; lon += 20) {
      const points = [];
      for (let lat = -90; lat <= 90; lat += 5) {
        points.push(this.latLonToVector3(lat, lon, this.globeRadius));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      this.globe.add(line);
    }
  }

  latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
  }

  topojsonToGeojson(topology) {
    // Simple TopoJSON to GeoJSON converter for world-atlas format
    const countries = topology.objects.countries;
    const arcs = topology.arcs;

    const features = countries.geometries.map(geom => {
      const coordinates = this.decodeArcs(geom.arcs, arcs, topology.transform);

      return {
        type: 'Feature',
        geometry: {
          type: geom.type,
          coordinates: coordinates
        }
      };
    });

    return { type: 'FeatureCollection', features };
  }

  decodeArcs(arcs, arcData, transform) {
    if (!arcs || !arcs.length) return [];

    if (typeof arcs[0] === 'number') {
      // Single polygon
      return [this.decodeArc(arcs, arcData, transform)];
    } else if (Array.isArray(arcs[0]) && typeof arcs[0][0] === 'number') {
      // Polygon with holes
      return arcs.map(arc => this.decodeArc(arc, arcData, transform));
    } else {
      // MultiPolygon
      return arcs.map(polygon =>
        polygon.map(arc => this.decodeArc(arc, arcData, transform))
      );
    }
  }

  decodeArc(arc, arcData, transform) {
    const coordinates = [];
    let x = 0, y = 0;

    arc.forEach(arcIndex => {
      const points = arcIndex < 0 ? arcData[~arcIndex].slice().reverse() : arcData[arcIndex];

      points.forEach(point => {
        x += point[0];
        y += point[1];

        const lon = x * transform.scale[0] + transform.translate[0];
        const lat = y * transform.scale[1] + transform.translate[1];

        coordinates.push([lon, lat]);
      });
    });

    return coordinates;
  }

  setupScrollAnimation() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

    const initialRotationY = -0.2; // US/Atlantic Ocean view (adjusted east)
    const initialRotationX = 0.7; // Tilt to show northern hemisphere

    ScrollTrigger.create({
      trigger: this.section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        const progress = self.progress;

        // Keep static until 50% through the animation
        if (progress < 0.5) {
          this.globe.rotation.y = initialRotationY;
        } else {
          // Spin west slowly in the last 50% of scroll
          const rotationProgress = (progress - 0.5) / 0.5; // Map 0.5-1.0 to 0-1
          this.globe.rotation.y = initialRotationY - (rotationProgress * Math.PI * 1.5); // 3/4 rotation west
        }

        // Keep the upward tilt constant to show US/Atlantic
        this.globe.rotation.x = initialRotationX;
      }
    });
  }

  startRendering() {
    if (!this.isVisible) {
      this.isVisible = true;
      this.render();
    }
  }

  stopRendering() {
    this.isVisible = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  render() {
    if (!this.isVisible) return;

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(() => this.render());
  }

  handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (this.globe) {
      const isMobile = width < 768;
      const size = Math.min(width, height) * 0.66;

      this.globe.geometry.dispose();
      this.globe.geometry = new THREE.SphereGeometry(
        size,
        isMobile ? 8 : 12,  // Fewer segments
        isMobile ? 8 : 12
      );

      // Adjust camera distance when size changes
      this.camera.position.z = size * 1.8;
    }
  }

  dispose() {
    this.stopRendering();

    if (this.globe) {
      this.globe.geometry.dispose();
      this.globe.material.dispose();
      this.scene.remove(this.globe);
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    window.removeEventListener('resize', () => this.handleResize());
  }
}
