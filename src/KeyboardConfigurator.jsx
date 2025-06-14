import React, { useState, useRef, useLayoutEffect } from 'react';

// Component for the keyboard preview with pan and zoom
const KeyboardPreview = ({ selectedParts, scale, showBody, showPlate, showSwitches, showKeycaps }) => {
  const { body, plate, switches, keycaps } = selectedParts;
  const containerRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [startOffset, setStartOffset] = useState({ x: 0, y: 0 });

  // Function to map thumbnail names to actual switch image names
  const getSwitchImageName = (switchName) => {
    const switchMap = {
      'switches-blue': 'switches-blue',
      'switches-brown': 'switches-brown',
      'switches-red': 'switches-red',
      'switches-black': 'switches-black',
      'switches-Milk-Blue-Switch-(Pre-Lubed)': 'switches-Milk-Blue-Switch-(Pre-Lubed)',
      'switches-Maple-Cold-Plum-Switch-(Pre-Lubed)': 'switches-Maple-Cold-Plum-Switch-(Pre-Lubed)',
      'switches-Lotus Switch-(Pre-Lubed)': 'switches-Lotus Switch-(Pre-Lubed)',
      'switches-Maple-Leaf-Switch-(Pre-Lubed)': 'switches-Jerry Switch-(Pre-Lubed)',
      'switches-Jadeite-Switch-(Pre-Lubed)': 'switches-Jadeite-Switch-(Pre-Lubed)',
    };
    return switchMap[switchName] || 'switches-blue';
  };

  // Mouse events
  const handleMouseDown = (e) => {
    if (scale === 2.0) return; // No pan at min zoom
    setIsPanning(true);
    setStart({ x: e.clientX, y: e.clientY });
    setStartOffset(offset);
    document.body.style.cursor = 'grabbing';
  };
  const handleMouseMove = (e) => {
    if (!isPanning) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    setOffset({ x: startOffset.x + dx, y: startOffset.y + dy });
  };
  const handleMouseUp = () => {
    setIsPanning(false);
    document.body.style.cursor = '';
  };

  // Touch events
  const handleTouchStart = (e) => {
    if (scale === 2.0) return;
    setIsPanning(true);
    const touch = e.touches[0];
    setStart({ x: touch.clientX, y: touch.clientY });
    setStartOffset(offset);
  };
  const handleTouchMove = (e) => {
    if (!isPanning) return;
    const touch = e.touches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    setOffset({ x: startOffset.x + dx, y: startOffset.y + dy });
  };
  const handleTouchEnd = () => {
    setIsPanning(false);
  };

  // Attach/remove mouse event listeners
  React.useEffect(() => {
    if (isPanning) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
    // eslint-disable-next-line
  }, [isPanning, start, startOffset, offset]);

  // Reset pan when scale changes
  React.useEffect(() => {
    setOffset({ x: 0, y: 0 });
  }, [scale]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-6xl h-[clamp(180px,40vw,500px)] mx-auto mb-8 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden select-none"
      onMouseDown={scale > 2.0 ? handleMouseDown : undefined}
      onTouchStart={scale > 2.0 ? handleTouchStart : undefined}
      style={{ cursor: scale > 2.0 && isPanning ? 'grabbing' : scale > 2.0 ? 'grab' : 'default' }}
    >
      <div
        className="relative flex items-center justify-center h-full"
        style={{
          transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
          transition: isPanning ? 'none' : 'transform 0.3s',
        }}
      >
        <div className="relative w-full h-full">
          {showBody && (
            <img 
              src={`${process.env.PUBLIC_URL}/images/Body/${body}.png`}
              alt="Keyboard body"
              loading="lazy"
              className="relative z-10 w-full h-full object-contain"
              style={{ transform: 'translateX(-0.5px)' }}
            />
          )}
          {showPlate && (
            <img 
              src={`${process.env.PUBLIC_URL}/images/Plate/${plate}.png`}
              alt="Keyboard plate"
              loading="lazy"
              className="absolute z-20 top-0 left-0 w-full h-full object-contain"
              style={{ transform: 'translateX(-0.5px)' }}
            />
          )}
          {showSwitches && (
            <img 
              src={`${process.env.PUBLIC_URL}/images/Switches/${getSwitchImageName(switches)}.png`}
              alt="Keyboard switches"
              loading="lazy"
              className="absolute z-30 top-0 left-0 w-full h-full object-contain"
            />
          )}
          {showKeycaps && (
            <img 
              src={`${process.env.PUBLIC_URL}/images/Keycaps/${keycaps}.png`}
              alt="Keyboard keycaps"
              loading="lazy"
              className="absolute z-40 top-0 left-0 w-full h-full object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Mapping for switch thumbnail filenames
const switchThumbnailMap = {
  'switches-blue': 'blue.png',
  'switches-brown': 'brown.png',
  'switches-red': 'red.png',
  'switches-black': 'black.png',
  'switches-Milk-Blue-Switch-(Pre-Lubed)': 'Milk Blue Switch (Pre-Lubed).png',
  'switches-Maple-Cold-Plum-Switch-(Pre-Lubed)': 'Maple Cold Plum Switch (Pre-Lubed).png',
  'switches-Lotus Switch-(Pre-Lubed)': 'Lotus Switch (Pre-Lubed).png',
  'switches-Maple-Leaf-Switch-(Pre-Lubed)': 'Maple Leaf Switch (Pre-Lubed).png',
  'switches-Jadeite-Switch-(Pre-Lubed)': 'Jadeite Switch (Pre-Lubed).png',
};

// Component for selection options
const SelectionOptions = ({ options, selected, onSelect, type, scale }) => {
  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-1 md:p-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`option-button group p-2 rounded-xl border-2 shadow-sm flex flex-col items-center bg-white focus:outline-none
            ${selected === option.value
              ? 'selected border-blue-600 shadow-lg'
              : 'border-gray-200'}
          `}
        >
          <img
            src={type === 'switches' 
              ? `${process.env.PUBLIC_URL}/images/Switches Logo/${switchThumbnailMap[option.value] || 'blue.png'}`
              : `${process.env.PUBLIC_URL}/images/${type}/${option.value}.png`}
            alt={option.label}
            loading="lazy"
            className="w-16 h-16 object-contain mb-1"
          />
          <p className={`mt-1 text-sm font-medium text-center ${selected === option.value ? 'text-blue-700' : 'text-gray-700'}`}>{option.label}</p>
        </button>
      ))}
    </div>
  );
};

// Move calculateTotal function outside of PriceSummary component
const calculateTotal = (selectedParts, prices) => {
  const basePrice = 0;
  const switchPrice = 1799;
  const platePrice = 1149;
  const keycapPrice = 2799;
  const bodyPrice = 1549;
  const stabilizerPrice = 2999;
  
  const subtotal = basePrice + switchPrice + platePrice + keycapPrice + bodyPrice + stabilizerPrice;
  // Calculate tax included in the total (18% of the pre-tax amount)
  const preTaxAmount = Math.round(subtotal / 1.18);
  const taxIncluded = subtotal - preTaxAmount;
  return subtotal; // Return the total that includes tax
};

// Component for price summary
const PriceSummary = ({ selectedParts, prices }) => {
  const total = 1799 + 1149 + 2799 + 1549 + 2999; // Total including tax
  const preTaxAmount = Math.round(total / 1.18); // Calculate pre-tax amount
  const taxIncluded = total - preTaxAmount; // Calculate tax included

  return (
    <div className="price-summary p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl border border-gray-100 max-w-md mx-auto">
      <h3 className="text-2xl font-extrabold mb-6 text-gray-900 text-center tracking-tight">Price Summary</h3>
      <div className="space-y-3 text-lg">
        <div className="flex justify-between"><span>Body/Case:</span> <span className="font-semibold">₹1,549</span></div>
        <div className="flex justify-between"><span>Plate:</span> <span className="font-semibold">₹1,149</span></div>
        <div className="flex justify-between"><span>Switches:</span> <span className="font-semibold">₹1,799</span></div>
        <div className="flex justify-between"><span>Keycaps:</span> <span className="font-semibold">₹2,799</span></div>
        <div className="flex justify-between"><span>Base Kit:</span> <span className="font-semibold">₹2,999</span></div>
        <div className="flex justify-between text-green-600"><span>Shipping:</span> <span className="font-semibold">FREE</span></div>
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between mb-2"><span>Total (including GST):</span> <span className="font-semibold">₹{total.toLocaleString()}</span></div>
          <div className="flex justify-between text-gray-600"><span>GST (18%) included:</span> <span className="font-semibold">₹{taxIncluded.toLocaleString()}</span></div>
        </div>
        <div className="border-t pt-4 mt-4 flex justify-between items-center">
          <span className="text-xl font-bold text-gray-800">Final Amount:</span>
          <span className="text-2xl font-extrabold text-blue-600">₹{calculateTotal(selectedParts, prices).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

// Main Configurator Component
const KeyboardConfigurator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [scale, setScale] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 2.2; // mobile (30% of slider)
      if (window.innerWidth < 1024) return 1.4; // tablet
      return 2.0; // desktop
    }
    return 2.0;
  });
  const [selectedParts, setSelectedParts] = useState({
    body: 'body-black',
    plate: 'plate-mirror',
    switches: 'switches-blue',
    keycaps: 'keycaps-white'
  });
  const previewContainerRef = useRef(null);

  const prices = {
    switches: {
      'switches-blue': 1799,
      'switches-brown': 1799,
      'switches-red': 1799,
      'switches-black': 1799,
      'switches-Milk-Blue-Switch-(Pre-Lubed)': 1799,
      'switches-Maple-Cold-Plum-Switch-(Pre-Lubed)': 1799,
      'switches-Lotus Switch-(Pre-Lubed)': 1799,
      'switches-Maple-Leaf-Switch-(Pre-Lubed)': 1799,
      'switches-Jadeite-Switch-(Pre-Lubed)': 1799
    },
    plates: {
      'plate-mirror': 1149,
      'plate-rose-gold': 1149,
      'plate-matte': 1149,
      'plate-gold': 1149
    }
  };

  const options = {
    body: [
      { value: 'body-black', label: 'Black' },
      { value: 'body-gray', label: 'Gray' },
      { value: 'body-blue', label: 'Blue' },
      { value: 'body-red', label: 'Red' },
      { value: 'body-light-green', label: 'Light Green' },
      { value: 'body-green', label: 'Green' },
      { value: 'body-yellow', label: 'Yellow' },
      { value: 'body-skin', label: 'Skin' },
      { value: 'body-pink', label: 'Pink' },
      { value: 'body-orange', label: 'Orange' },
      { value: 'body-white', label: 'White' }
    ],
    plate: [
      { value: 'plate-mirror', label: 'Mirror' },
      { value: 'plate-rose-gold', label: 'Rose Gold' },
      { value: 'plate-matte', label: 'Matte' },
      { value: 'plate-gold', label: 'Gold' }
    ],
    switches: [
      { value: 'switches-blue', label: 'Blue' },
      { value: 'switches-brown', label: 'Brown' },
      { value: 'switches-red', label: 'Red' },
      { value: 'switches-black', label: 'Black' },
      { value: 'switches-Milk-Blue-Switch-(Pre-Lubed)', label: 'Milk Blue (Lubed)' },
      { value: 'switches-Maple-Cold-Plum-Switch-(Pre-Lubed)', label: 'Maple Cold Plum (Lubed)' },
      { value: 'switches-Lotus Switch-(Pre-Lubed)', label: 'Lotus (Lubed)' },
      { value: 'switches-Maple-Leaf-Switch-(Pre-Lubed)', label: 'Maple Leaf (Lubed)' },
      { value: 'switches-Jadeite-Switch-(Pre-Lubed)', label: 'Jadeite (Lubed)' }
    ],
    keycaps: [
      { value: 'keycaps-white', label: 'White' },
      { value: 'keycaps-black', label: 'Black' },
      { value: 'keycaps-red', label: 'Red' },
      { value: 'keycaps-white-red', label: 'White-Red' },
      { value: 'keycaps-red-white', label: 'Red-White' },
      { value: 'keycaps-black-white', label: 'Black-White' },
      { value: 'keycaps-Black-Beige-Cherry-Doubleshot-PBT-Keycaps', label: 'Black Beige' },
      { value: 'keycaps-Dark-Knight-Kingdom-Doubleshot-Cherry-PBT-Keycaps', label: 'Dark Knight' },
      { value: 'keycaps-Dark-Red-White-Cherry-Doubleshot-PBT-Keycaps', label: 'Dark Red White' },
      { value: 'keycaps-Green-White-Cherry-Doubleshot-PBT-Keycaps', label: 'Green White' },
      { value: 'keycaps-Blue-White-Cherry-Doubleshot-PBT-Keycaps', label: 'Blue White' },
      { value: 'keycaps-Classic-Red-Quality-Cherry-Doubleshot-PBT-Keycaps', label: 'Classic Red' }
    ]
  };

  const steps = [
    { title: 'Body Color', type: 'body' },
    { title: 'Plate Type', type: 'plate' },
    { title: 'Switch Type', type: 'switches' },
    { title: 'Keycap Set', type: 'keycaps' },
    { title: 'Price Summary', type: 'summary' }
  ];

  const handleSelect = (type, value) => {
    setSelectedParts(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleScale = (delta) => {
    setScale((prev) => {
      const next = Math.max(1.0, Math.min(5.0, prev + delta));
      return Math.round(next * 100) / 100;
    });
  };

  // On resize, update scale if on mobile
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScale(2.2);
      } else if (window.innerWidth < 1024) {
        setScale(1.4);
      } else {
        setScale(2.0);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine which layers to show based on current step
  const showBody = true;
  const showPlate = currentStep >= 1;
  const showSwitches = currentStep >= 2;
  const showKeycapsLayer = currentStep >= 3;

  return (
    <div className="w-full mx-auto px-2 md:px-8 bg-white rounded-2xl mt-6 mb-10">
      {/* Stepper (Progress Steps) - Full width, above main layout */}
      <div className="w-full mb-8 mt-4">
        <div className="flex justify-between items-end mb-2">
          {steps.map((step, index) => (
            <div
              key={step.type}
              className={`stepper-step flex-1 flex flex-col items-center select-none ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'} cursor-pointer group min-h-[60px]`}
              onClick={() => setCurrentStep(index)}
              style={{ minWidth: 0 }}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-1 font-bold text-lg shadow-md transition
                ${index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 group-hover:bg-blue-100'}`}>
                {index + 1}
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm font-semibold leading-tight text-center w-full truncate">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-blue-600 rounded-full progress-bounce"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
      {/* Main two-column layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Keyboard Preview */}
        <div className="md:w-1/2 flex flex-col items-center justify-start" ref={previewContainerRef}>
          {/* Preview Area with Keycap Toggle and Scale Controls */}
          <div className="w-full mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-4">
              {/* Scale Controls */}
              <div className="flex items-center gap-4 w-full max-w-xs">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  onClick={() => setScale(prev => Math.max(1, prev - 0.1))}
                  aria-label="Zoom out"
                  type="button"
                >
                  <span className="text-lg">-</span>
                </button>
                <div className="relative w-full">
                  <input
                    type="range"
                    min={1.0}
                    max={5.0}
                    step={0.01}
                    value={scale}
                    onChange={e => setScale(Number(e.target.value))}
                    className="w-full accent-blue-600 h-2 rounded-lg appearance-none bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow"
                    style={{
                      background: `linear-gradient(90deg, #2563eb ${(scale-1)/(5-1)*100}%, #e5e7eb ${(scale-1)/(5-1)*100}%)`
                    }}
                    aria-label="Zoom"
                  />
                </div>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  onClick={() => setScale(prev => Math.min(5, prev + 0.1))}
                  aria-label="Zoom in"
                  type="button"
                >
                  <span className="text-lg">+</span>
                </button>
              </div>
            </div>
            <div className="rounded-xl bg-white">
              <KeyboardPreview
                selectedParts={selectedParts}
                scale={scale}
                showBody={showBody}
                showPlate={showPlate}
                showSwitches={showSwitches}
                showKeycaps={showKeycapsLayer}
              />
            </div>
          </div>
        </div>
        {/* Right: Steps, Options, Navigation, Price Summary */}
        <div className="md:w-1/2 flex flex-col justify-start">
          {/* Step Title and Navigation Buttons (title above, buttons below) */}
          {steps[currentStep].type !== 'summary' && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 text-center m-0 mb-6">{steps[currentStep].title}</h2>
              <div className="flex justify-center gap-6">
                <button
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold shadow hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ minWidth: '110px' }}
                >
                  Previous
                </button>
                {currentStep < steps.length - 1 && (
                  <button
                    onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                    style={{ minWidth: '110px' }}
                  >
                    {currentStep === steps.length - 2 ? 'Review' : 'Next'}
                  </button>
                )}
              </div>
            </div>
          )}
          {/* Show Price Summary and Buy Now only on last step */}
          {currentStep === steps.length - 1 && (
            <div className="w-full flex flex-col items-center mt-16 mb-12">
              <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
                <PriceSummary selectedParts={selectedParts} prices={prices} />
              </div>
              <button
                onClick={async () => {
                  const storefrontAccessToken = "0e7e4357867db232cd1e866cfc498f38";
                  const shopifyDomain = "jgypac-4j.myshopify.com";
                  const merchandiseId = "gid://shopify/ProductVariant/51366442205458";

                  const attributes = [
                    { key: "Body", value: selectedParts.body.replace("body-", "") },
                    { key: "Plate", value: selectedParts.plate.replace("plate-", "") },
                    { key: "Switches", value: selectedParts.switches.replace("switches-", "") },
                    { key: "Keycaps", value: selectedParts.keycaps.replace("keycaps-", "") },
                    { key: "TotalPrice", value: String(calculateTotal(selectedParts, prices)) }
                  ];

                  const query = `
                    mutation cartCreate($input: CartInput!) {
                      cartCreate(input: $input) {
                        cart {
                          id
                          checkoutUrl
                        }
                        userErrors {
                          field
                          message
                        }
                      }
                    }
                  `;

                  const variables = {
                    input: {
                      lines: [
                        {
                          merchandiseId,
                          quantity: 1,
                          attributes
                        }
                      ]
                    }
                  };

                  const response = await fetch(`https://${shopifyDomain}/api/2023-04/graphql.json`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "X-Shopify-Storefront-Access-Token": storefrontAccessToken
                    },
                    body: JSON.stringify({ query, variables })
                  });

                  const data = await response.json();
                  console.log('Shopify Storefront API response:', data);
                  const errors = data.data?.cartCreate?.userErrors;
                  if (errors && errors.length > 0) {
                    alert('Shopify error: ' + errors.map(e => e.message).join('\n'));
                    return;
                  }
                  const checkoutUrl = data.data?.cartCreate?.cart?.checkoutUrl;
                  if (!checkoutUrl) {
                    alert('No checkout URL returned. See console for details.');
                    return;
                  }
                  window.location.href = checkoutUrl;
                }}
                className="mt-10 px-8 py-3 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-700 transition"
              >
                Buy Now
              </button>
            </div>
          )}
          {/* Selection Options (hide on summary step) */}
          {steps[currentStep].type !== 'summary' && (
            <div className="mb-10">
              <SelectionOptions
                options={options[steps[currentStep].type]}
                selected={selectedParts[steps[currentStep].type]}
                onSelect={(value) => handleSelect(steps[currentStep].type, value)}
                type={steps[currentStep].type}
                scale={scale}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeyboardConfigurator; 