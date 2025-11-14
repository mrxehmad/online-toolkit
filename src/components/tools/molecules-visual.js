import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCw, Search, Info, Atom, Beaker, Zap, Eye, EyeOff, ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';

const ChemistryMoleculeVisualizer = () => {
  const [selectedMolecule, setSelectedMolecule] = useState('water');
  const [isRotating, setIsRotating] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const rotationRef = useRef(0);
  const fullscreenRef = useRef(null);

  // Molecule data with 3D coordinates and properties
  const molecules = {
    water: {
      name: 'Water',
      formula: 'H₂O',
      description: 'The most essential molecule for life, consisting of two hydrogen atoms covalently bonded to one oxygen atom.',
      atoms: [
        { element: 'O', x: 0, y: 0, z: 0, color: '#ff4444', radius: 20 },
        { element: 'H', x: -30, y: 20, z: 10, color: '#ffffff', radius: 12 },
        { element: 'H', x: 30, y: 20, z: -10, color: '#ffffff', radius: 12 }
      ],
      bonds: [
        { from: 0, to: 1, strength: 2 },
        { from: 0, to: 2, strength: 2 }
      ],
      properties: {
        molarMass: '18.02 g/mol',
        boilingPoint: '100°C',
        meltingPoint: '0°C'
      }
    },
    methane: {
      name: 'Methane',
      formula: 'CH₄',
      description: 'The simplest hydrocarbon and primary component of natural gas, featuring a tetrahedral geometry.',
      atoms: [
        { element: 'C', x: 0, y: 0, z: 0, color: '#444444', radius: 18 },
        { element: 'H', x: 25, y: 25, z: 25, color: '#ffffff', radius: 12 },
        { element: 'H', x: -25, y: -25, z: 25, color: '#ffffff', radius: 12 },
        { element: 'H', x: -25, y: 25, z: -25, color: '#ffffff', radius: 12 },
        { element: 'H', x: 25, y: -25, z: -25, color: '#ffffff', radius: 12 }
      ],
      bonds: [
        { from: 0, to: 1, strength: 1 },
        { from: 0, to: 2, strength: 1 },
        { from: 0, to: 3, strength: 1 },
        { from: 0, to: 4, strength: 1 }
      ],
      properties: {
        molarMass: '16.04 g/mol',
        boilingPoint: '-161.5°C',
        meltingPoint: '-182.5°C'
      }
    },
    caffeine: {
      name: 'Caffeine',
      formula: 'C₈H₁₀N₄O₂',
      description: 'A central nervous system stimulant found in coffee, tea, and many other plants, known for its alertness-enhancing effects.',
      atoms: [
        { element: 'C', x: 0, y: 0, z: 0, color: '#444444', radius: 16 },
        { element: 'N', x: 30, y: -20, z: 5, color: '#4444ff', radius: 16 },
        { element: 'C', x: 60, y: 0, z: 0, color: '#444444', radius: 16 },
        { element: 'C', x: 45, y: 30, z: -5, color: '#444444', radius: 16 },
        { element: 'N', x: 15, y: 35, z: -3, color: '#4444ff', radius: 16 },
        { element: 'O', x: 85, y: -15, z: 8, color: '#ff4444', radius: 18 },
        { element: 'C', x: -25, y: -25, z: 10, color: '#444444', radius: 16 },
        { element: 'N', x: 70, y: 45, z: -8, color: '#4444ff', radius: 16 }
      ],
      bonds: [
        { from: 0, to: 1, strength: 1 },
        { from: 1, to: 2, strength: 1 },
        { from: 2, to: 3, strength: 2 },
        { from: 3, to: 4, strength: 1 },
        { from: 4, to: 0, strength: 2 },
        { from: 2, to: 5, strength: 2 },
        { from: 0, to: 6, strength: 1 }
      ],
      properties: {
        molarMass: '194.19 g/mol',
        boilingPoint: '178°C',
        meltingPoint: '227-228°C'
      }
    },
    ethanol: {
      name: 'Ethanol',
      formula: 'C₂H₆O',
      description: 'Also known as ethyl alcohol, this molecule is commonly found in alcoholic beverages and used as a solvent.',
      atoms: [
        { element: 'C', x: -20, y: 0, z: 0, color: '#444444', radius: 16 },
        { element: 'C', x: 20, y: 0, z: 0, color: '#444444', radius: 16 },
        { element: 'O', x: 40, y: 20, z: 5, color: '#ff4444', radius: 18 },
        { element: 'H', x: -35, y: 15, z: 10, color: '#ffffff', radius: 12 },
        { element: 'H', x: -35, y: -15, z: -10, color: '#ffffff', radius: 12 },
        { element: 'H', x: -5, y: -20, z: 8, color: '#ffffff', radius: 12 },
        { element: 'H', x: 35, y: -20, z: -8, color: '#ffffff', radius: 12 },
        { element: 'H', x: 55, y: 15, z: 12, color: '#ffffff', radius: 12 }
      ],
      bonds: [
        { from: 0, to: 1, strength: 1 },
        { from: 1, to: 2, strength: 1 },
        { from: 0, to: 3, strength: 1 },
        { from: 0, to: 4, strength: 1 },
        { from: 0, to: 5, strength: 1 },
        { from: 1, to: 6, strength: 1 },
        { from: 2, to: 7, strength: 1 }
      ],
      properties: {
        molarMass: '46.07 g/mol',
        boilingPoint: '78.37°C',
        meltingPoint: '-114.1°C'
      }
    }
  };

  const filteredMolecules = Object.entries(molecules).filter(([key, mol]) =>
    mol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mol.formula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fullscreen functionality
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await fullscreenRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('Error attempting to exit fullscreen:', err);
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 3D projection function
  const project3D = (x, y, z, rotation) => {
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    const rotatedX = x * cos - z * sin;
    const rotatedZ = x * sin + z * cos;
    
    const scale = (200 / (200 + rotatedZ)) * zoomLevel;
    return {
      x: rotatedX * scale,
      y: y * scale,
      z: rotatedZ
    };
  };

  // Draw molecule on canvas
  const drawMolecule = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const mol = molecules[selectedMolecule];
    const projectedAtoms = mol.atoms.map(atom => ({
      ...atom,
      projected: project3D(atom.x, atom.y, atom.z, rotationRef.current)
    }));

    // Sort atoms by z-depth for proper layering
    projectedAtoms.sort((a, b) => b.projected.z - a.projected.z);

    // Draw bonds
    mol.bonds.forEach(bond => {
      const atom1 = projectedAtoms[bond.from];
      const atom2 = projectedAtoms[bond.to];
      
      ctx.beginPath();
      ctx.moveTo(centerX + atom1.projected.x, centerY + atom1.projected.y);
      ctx.lineTo(centerX + atom2.projected.x, centerY + atom2.projected.y);
      ctx.strokeStyle = '#e5e5e5';
      ctx.lineWidth = bond.strength * 2;
      ctx.stroke();
    });

    // Draw atoms
    projectedAtoms.forEach((atom, index) => {
      const x = centerX + atom.projected.x;
      const y = centerY + atom.projected.y;
      const scale = (200 + atom.projected.z) / 400;
      const radius = atom.radius * scale;

      // Shadow
      ctx.beginPath();
      ctx.arc(x + 2, y + 2, radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fill();

      // Atom
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = atom.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Highlight
      ctx.beginPath();
      ctx.arc(x - radius/3, y - radius/3, radius/3, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fill();

      // Labels
      if (showLabels) {
        ctx.fillStyle = '#333';
        ctx.font = `bold ${12 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(atom.element, x, y);
      }
    });
  }, [selectedMolecule, showLabels, zoomLevel]);

  // Animation loop
  const animate = useCallback(() => {
    if (isRotating) {
      rotationRef.current += 0.02;
    }
    drawMolecule();
    animationRef.current = requestAnimationFrame(animate);
  }, [isRotating, drawMolecule]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedMolecule, isRotating, showLabels, zoomLevel, animate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Information */}
      <div className="sr-only">
        <h1>Chemistry Molecule Visualizer - 3D Interactive Molecular Viewer</h1>
        <p>Explore chemistry molecules in 3D with our interactive visualizer. View water, methane, caffeine, and ethanol molecules with detailed properties and real-time rotation. Perfect for students, educators, and chemistry enthusiasts.</p>
        <p>Keywords: chemistry, molecule visualizer, 3D molecules, molecular viewer, chemistry education, interactive chemistry, molecular structure, chemical compounds</p>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-xl shadow-lg">
                <Atom className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Chemistry Visualizer</h1>
                <p className="text-sm text-gray-600">Interactive 3D Molecular Viewer</p>
              </div>
            </div>
            
            {/* Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search molecules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`p-2.5 rounded-xl transition-all duration-200 ${showLabels 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                title={showLabels ? 'Hide labels' : 'Show labels'}
              >
                {showLabels ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`p-2.5 rounded-xl transition-all duration-200 ${isRotating 
                  ? 'bg-green-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                title={isRotating ? 'Pause rotation' : 'Start rotation'}
              >
                {isRotating ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Molecule Selector */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Beaker className="h-5 w-5 mr-2 text-blue-500" />
                  Molecules
                </h2>
              </div>
              <div className="p-4 space-y-2">
                {filteredMolecules.map(([key, mol]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedMolecule(key)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      selectedMolecule === key
                        ? 'bg-blue-50 border-2 border-blue-500 shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{mol.name}</h3>
                        <p className="text-sm text-blue-600 font-mono">{mol.formula}</p>
                      </div>
                      <div className="bg-gray-200 p-2 rounded-lg">
                        <Zap className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Properties Panel */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-green-500" />
                  Properties
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {Object.entries(molecules[selectedMolecule].properties).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3D Visualizer */}
          <div className="lg:col-span-2">
            <div 
              ref={fullscreenRef}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
              }`}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {molecules[selectedMolecule].name}
                    </h2>
                    <p className="text-sm text-blue-600 font-mono">
                      {molecules[selectedMolecule].formula}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Zoom Controls */}
                    <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-xl">
                      <ZoomOut className="h-4 w-4 text-gray-500" />
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min="0.3"
                          max="3.0"
                          step="0.1"
                          value={zoomLevel}
                          onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                          className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((zoomLevel - 0.3) / (3.0 - 0.3)) * 100}%, #e5e7eb ${((zoomLevel - 0.3) / (3.0 - 0.3)) * 100}%, #e5e7eb 100%)`
                          }}
                        />
                        <span className="text-xs text-gray-600 min-w-[2.5rem]">{zoomLevel.toFixed(1)}x</span>
                      </div>
                      <ZoomIn className="h-4 w-4 text-gray-500" />
                    </div>
                    <button
                      onClick={() => rotationRef.current = 0}
                      className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                      title="Reset rotation"
                    >
                      <RotateCw className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                      title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    >
                      {isFullscreen ? 
                        <Minimize className="h-5 w-5 text-gray-600" /> : 
                        <Maximize className="h-5 w-5 text-gray-600" />
                      }
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className={`w-full cursor-grab active:cursor-grabbing ${
                    isFullscreen ? 'h-screen' : 'h-96 sm:h-[500px]'
                  }`}
                  style={{ touchAction: 'none' }}
                />
                
                {/* Fullscreen Zoom Slider */}
                {isFullscreen && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-black bg-opacity-75 backdrop-blur-sm px-6 py-3 rounded-2xl">
                      <div className="flex items-center space-x-4 text-white">
                        <ZoomOut className="h-5 w-5" />
                        <input
                          type="range"
                          min="0.3"
                          max="3.0"
                          step="0.1"
                          value={zoomLevel}
                          onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                          className="w-32 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #60a5fa 0%, #60a5fa ${((zoomLevel - 0.3) / (3.0 - 0.3)) * 100}%, #4b5563 ${((zoomLevel - 0.3) / (3.0 - 0.3)) * 100}%, #4b5563 100%)`
                          }}
                        />
                        <ZoomIn className="h-5 w-5" />
                        <span className="text-sm font-medium min-w-[3rem]">{zoomLevel.toFixed(1)}x</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Overlay Instructions */}
                <div className={`absolute ${isFullscreen ? 'bottom-6' : 'bottom-4'} left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm`}>
                  {isRotating ? 'Auto-rotating • Click pause to stop' : 'Paused • Click play to auto-rotate'}
                </div>
                
                {/* Zoom Level Indicator */}
                {!isFullscreen && (
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg text-sm">
                    Zoom: {zoomLevel.toFixed(1)}x
                  </div>
                )}

                {/* Fullscreen Exit Hint */}
                {isFullscreen && (
                  <div className="absolute bottom-6 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm">
                    Press ESC or click minimize to exit fullscreen
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About {molecules[selectedMolecule].name}</h3>
              <p className="text-gray-700 leading-relaxed">
                {molecules[selectedMolecule].description}
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Advanced 3D Chemistry Visualization
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-500 p-4 rounded-2xl w-16 h-16 mx-auto mb-4">
                <Atom className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Interactive 3D Models</h3>
              <p className="text-gray-600">Explore molecules in three dimensions with real-time rotation and scaling</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500 p-4 rounded-2xl w-16 h-16 mx-auto mb-4">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Detailed Properties</h3>
              <p className="text-gray-600">Access comprehensive molecular data including mass, boiling points, and structure</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500 p-4 rounded-2xl w-16 h-16 mx-auto mb-4">
                <Beaker className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Educational Focus</h3>
              <p className="text-gray-600">Perfect for students, teachers, and chemistry enthusiasts of all levels</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Interactive Chemistry Molecule Visualizer • Built with React • Educational Tool for Chemistry Learning
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Visualize water, methane, caffeine, ethanol and more in stunning 3D
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChemistryMoleculeVisualizer;