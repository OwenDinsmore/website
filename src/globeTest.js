/**
 * Globe Diagnostic Tests
 * Run these in browser console to debug globe issues
 */

export function runGlobeDiagnostics() {
  console.log('=== GLOBE DIAGNOSTICS ===\n');

  // Test 1: Check if elements exist
  console.log('1. Checking DOM elements...');
  const canvas = document.getElementById('globeCanvas');
  const section = document.getElementById('globe');

  console.log('Canvas element:', canvas);
  console.log('Section element:', section);

  if (!canvas) {
    console.error('❌ Canvas element not found!');
  } else {
    console.log('✅ Canvas found');
    console.log('  - Width:', canvas.width);
    console.log('  - Height:', canvas.height);
    console.log('  - Client dimensions:', canvas.clientWidth, 'x', canvas.clientHeight);
    console.log('  - Computed style:', window.getComputedStyle(canvas).display);
  }

  if (!section) {
    console.error('❌ Globe section not found!');
  } else {
    console.log('✅ Globe section found');
    console.log('  - Height:', section.offsetHeight);
    console.log('  - Display:', window.getComputedStyle(section).display);
  }

  // Test 2: Check Three.js
  console.log('\n2. Checking Three.js...');
  import('three').then(THREE => {
    console.log('✅ Three.js loaded:', THREE);

    // Try to create a simple scene
    const testScene = new THREE.Scene();
    console.log('✅ Can create Three.js scene:', testScene);
  }).catch(err => {
    console.error('❌ Three.js error:', err);
  });

  // Test 3: Check canvas rendering context
  console.log('\n3. Checking canvas context...');
  if (canvas) {
    try {
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (gl) {
        console.log('✅ WebGL context available:', gl);
      } else {
        console.error('❌ WebGL context not available');
      }
    } catch (err) {
      console.error('❌ Error getting WebGL context:', err);
    }
  }

  // Test 4: Check viewport and positioning
  console.log('\n4. Checking viewport...');
  console.log('  - Window size:', window.innerWidth, 'x', window.innerHeight);
  console.log('  - Scroll position:', window.scrollY);

  if (section) {
    const rect = section.getBoundingClientRect();
    console.log('  - Section position:', {
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      visible: rect.top < window.innerHeight && rect.bottom > 0
    });
  }

  // Test 5: Check for JavaScript errors
  console.log('\n5. Checking for errors...');
  console.log('Check the console for any red error messages above');

  console.log('\n=== DIAGNOSTICS COMPLETE ===');
}

// Auto-run diagnostics
export function setupGlobeDiagnostics() {
  // Add a global function to run diagnostics
  window.testGlobe = runGlobeDiagnostics;

  console.log('Globe diagnostics loaded. Run window.testGlobe() to test.');

  // Run after a short delay to let everything initialize
  setTimeout(() => {
    console.log('Auto-running globe diagnostics...');
    runGlobeDiagnostics();
  }, 2000);
}
