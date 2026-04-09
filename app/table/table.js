import { useMemo, useState, useCallback } from 'react';

const ElementCell = ({ element, onMouseMove, onMouseLeave }) => {
  const [num, sym, name, mass, cat] = element;
  
  return (
    <div
      className={`cell-inner ${cat}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <span className="num">{num}</span>
      <span className="sym">{sym}</span>
      <span className="name">{name}</span>
      <span className="mass">{mass}</span>
    </div>
  );
};

const Tooltip = ({ data, pos }) => {
  if (!data) return null;

  const CATS = {
    "alkali-metal": "Alkali metal",
    "alkaline-earth": "Alkaline earth metal",
    "transition-metal": "Transition metal",
    "post-transition": "Post-transition metal",
    "metalloid": "Metalloid",
    "nonmetal": "Nonmetal",
    "halogen": "Halogen",
    "noble-gas": "Noble gas",
    "lanthanide": "Lanthanide",
    "actinide": "Actinide",
  };

  return (
    <div className="tooltip" style={{ left: `${pos.x}px`, top: `${pos.y}px` }}>
      <div className="tip-sym">{data.sym}</div>
      <div className="tip-name">{data.name}</div>
      <div className="tip-row">Atomic number: <b>{data.num}</b></div>
      <div className="tip-row">Atomic mass: <b>{data.mass} u</b></div>
      <div className="tip-row">Category: <b>{CATS[data.cat] || data.cat}</b></div>
    </div>
  );
};

export default function PeriodicTable() {
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const ELEMENTS = useMemo(() => [
    [1,"H","Hydrogen",1.008,"nonmetal",1,1],
    [2,"He","Helium",4.003,"noble-gas",1,18],
    [3,"Li","Lithium",6.941,"alkali-metal",2,1],
    [4,"Be","Beryllium",9.012,"alkaline-earth",2,2],
    [5,"B","Boron",10.811,"metalloid",2,13],
    [6,"C","Carbon",12.011,"nonmetal",2,14],
    [7,"N","Nitrogen",14.007,"nonmetal",2,15],
    [8,"O","Oxygen",15.999,"nonmetal",2,16],
    [9,"F","Fluorine",18.998,"halogen",2,17],
    [10,"Ne","Neon",20.18,"noble-gas",2,18],
    [11,"Na","Sodium",22.99,"alkali-metal",3,1],
    [12,"Mg","Magnesium",24.305,"alkaline-earth",3,2],
    [13,"Al","Aluminum",26.982,"post-transition",3,13],
    [14,"Si","Silicon",28.086,"metalloid",3,14],
    [15,"P","Phosphorus",30.974,"nonmetal",3,15],
    [16,"S","Sulfur",32.065,"nonmetal",3,16],
    [17,"Cl","Chlorine",35.453,"halogen",3,17],
    [18,"Ar","Argon",39.948,"noble-gas",3,18],
    [19,"K","Potassium",39.098,"alkali-metal",4,1],
    [20,"Ca","Calcium",40.078,"alkaline-earth",4,2],
    [21,"Sc","Scandium",44.956,"transition-metal",4,3],
    [22,"Ti","Titanium",47.867,"transition-metal",4,4],
    [23,"V","Vanadium",50.942,"transition-metal",4,5],
    [24,"Cr","Chromium",51.996,"transition-metal",4,6],
    [25,"Mn","Manganese",54.938,"transition-metal",4,7],
    [26,"Fe","Iron",55.845,"transition-metal",4,8],
    [27,"Co","Cobalt",58.933,"transition-metal",4,9],
    [28,"Ni","Nickel",58.693,"transition-metal",4,10],
    [29,"Cu","Copper",63.546,"transition-metal",4,11],
    [30,"Zn","Zinc",65.38,"transition-metal",4,12],
    [31,"Ga","Gallium",69.723,"post-transition",4,13],
    [32,"Ge","Germanium",72.64,"metalloid",4,14],
    [33,"As","Arsenic",74.922,"metalloid",4,15],
    [34,"Se","Selenium",78.96,"nonmetal",4,16],
    [35,"Br","Bromine",79.904,"halogen",4,17],
    [36,"Kr","Krypton",83.798,"noble-gas",4,18],
    [37,"Rb","Rubidium",85.468,"alkali-metal",5,1],
    [38,"Sr","Strontium",87.62,"alkaline-earth",5,2],
    [39,"Y","Yttrium",88.906,"transition-metal",5,3],
    [40,"Zr","Zirconium",91.224,"transition-metal",5,4],
    [41,"Nb","Niobium",92.906,"transition-metal",5,5],
    [42,"Mo","Molybdenum",95.96,"transition-metal",5,6],
    [43,"Tc","Technetium",98,"transition-metal",5,7],
    [44,"Ru","Ruthenium",101.07,"transition-metal",5,8],
    [45,"Rh","Rhodium",102.906,"transition-metal",5,9],
    [46,"Pd","Palladium",106.42,"transition-metal",5,10],
    [47,"Ag","Silver",107.868,"transition-metal",5,11],
    [48,"Cd","Cadmium",112.411,"transition-metal",5,12],
    [49,"In","Indium",114.818,"post-transition",5,13],
    [50,"Sn","Tin",118.71,"post-transition",5,14],
    [51,"Sb","Antimony",121.76,"metalloid",5,15],
    [52,"Te","Tellurium",127.6,"metalloid",5,16],
    [53,"I","Iodine",126.904,"halogen",5,17],
    [54,"Xe","Xenon",131.293,"noble-gas",5,18],
    [55,"Cs","Cesium",132.905,"alkali-metal",6,1],
    [56,"Ba","Barium",137.327,"alkaline-earth",6,2],
    [57,"La","Lanthanum",138.905,"lanthanide",6,3],
    [72,"Hf","Hafnium",178.49,"transition-metal",6,4],
    [73,"Ta","Tantalum",180.948,"transition-metal",6,5],
    [74,"W","Tungsten",183.84,"transition-metal",6,6],
    [75,"Re","Rhenium",186.207,"transition-metal",6,7],
    [76,"Os","Osmium",190.23,"transition-metal",6,8],
    [77,"Ir","Iridium",192.217,"transition-metal",6,9],
    [78,"Pt","Platinum",195.084,"transition-metal",6,10],
    [79,"Au","Gold",196.967,"transition-metal",6,11],
    [80,"Hg","Mercury",200.59,"transition-metal",6,12],
    [81,"Tl","Thallium",204.383,"post-transition",6,13],
    [82,"Pb","Lead",207.2,"post-transition",6,14],
    [83,"Bi","Bismuth",208.98,"post-transition",6,15],
    [84,"Po","Polonium",209,"post-transition",6,16],
    [85,"At","Astatine",210,"halogen",6,17],
    [86,"Rn","Radon",222,"noble-gas",6,18],
    [87,"Fr","Francium",223,"alkali-metal",7,1],
    [88,"Ra","Radium",226,"alkaline-earth",7,2],
    [89,"Ac","Actinium",227,"actinide",7,3],
    [104,"Rf","Rutherfordium",267,"transition-metal",7,4],
    [105,"Db","Dubnium",270,"transition-metal",7,5],
    [106,"Sg","Seaborgium",271,"transition-metal",7,6],
    [107,"Bh","Bohrium",270,"transition-metal",7,7],
    [108,"Hs","Hassium",277,"transition-metal",7,8],
    [109,"Mt","Meitnerium",278,"transition-metal",7,9],
    [110,"Ds","Darmstadtium",281,"transition-metal",7,10],
    [111,"Rg","Roentgenium",282,"transition-metal",7,11],
    [112,"Cn","Copernicium",285,"transition-metal",7,12],
    [113,"Nh","Nihonium",286,"post-transition",7,13],
    [114,"Fl","Flerovium",289,"post-transition",7,14],
    [115,"Mc","Moscovium",290,"post-transition",7,15],
    [116,"Lv","Livermorium",293,"post-transition",7,16],
    [117,"Ts","Tennessine",294,"halogen",7,17],
    [118,"Og","Oganesson",294,"noble-gas",7,18],
    [58,"Ce","Cerium",140.116,"lanthanide",9,4],
    [59,"Pr","Praseodymium",140.908,"lanthanide",9,5],
    [60,"Nd","Neodymium",144.242,"lanthanide",9,6],
    [61,"Pm","Promethium",145,"lanthanide",9,7],
    [62,"Sm","Samarium",150.36,"lanthanide",9,8],
    [63,"Eu","Europium",151.964,"lanthanide",9,9],
    [64,"Gd","Gadolinium",157.25,"lanthanide",9,10],
    [65,"Tb","Terbium",158.925,"lanthanide",9,11],
    [66,"Dy","Dysprosium",162.5,"lanthanide",9,12],
    [67,"Ho","Holmium",164.93,"lanthanide",9,13],
    [68,"Er","Erbium",167.259,"lanthanide",9,14],
    [69,"Tm","Thulium",168.934,"lanthanide",9,15],
    [70,"Yb","Ytterbium",173.054,"lanthanide",9,16],
    [71,"Lu","Lutetium",174.967,"lanthanide",9,17],
    [90,"Th","Thorium",232.038,"actinide",10,4],
    [91,"Pa","Protactinium",231.036,"actinide",10,5],
    [92,"U","Uranium",238.029,"actinide",10,6],
    [93,"Np","Neptunium",237,"actinide",10,7],
    [94,"Pu","Plutonium",244,"actinide",10,8],
    [95,"Am","Americium",243,"actinide",10,9],
    [96,"Cm","Curium",247,"actinide",10,10],
    [97,"Bk","Berkelium",247,"actinide",10,11],
    [98,"Cf","Californium",251,"actinide",10,12],
    [99,"Es","Einsteinium",252,"actinide",10,13],
    [100,"Fm","Fermium",257,"actinide",10,14],
    [101,"Md","Mendelevium",258,"actinide",10,15],
    [102,"No","Nobelium",259,"actinide",10,16],
    [103,"Lr","Lawrencium",266,"actinide",10,17],
  ], []);

  const grid = useMemo(() => {
    const g = {};
    ELEMENTS.forEach(e => { g[`${e[5]}-${e[6]}`] = e; });
    return g;
  }, [ELEMENTS]);

  const handleMouseMove = useCallback((e, element) => {
    const [num, sym, name, mass, cat] = element;
    setTooltip({ num, sym, name, mass, cat });
    
    let x = e.clientX + 14;
    let y = e.clientY - 10;
    if (x + 180 > window.innerWidth) x = e.clientX - 190;
    
    setTooltipPos({ x, y });
  }, []);

  const renderGrid = useMemo(() => {
    const cells = [];
    const TOTAL_ROWS = 10;

    for (let row = 1; row <= TOTAL_ROWS; row++) {
      if (row === 9) {
        cells.push(
          <div key="sep-lan" className="sep-row">
            <div className="sep-line"></div>
            <span className="sep-label">Lanthanides</span>
            <div className="sep-line"></div>
          </div>
        );
      }
      if (row === 10) {
        cells.push(
          <div key="sep-act" className="sep-row">
            <div className="sep-line"></div>
            <span className="sep-label">Actinides</span>
            <div className="sep-line"></div>
          </div>
        );
      }

      for (let col = 1; col <= 18; col++) {
        const key = `${row}-${col}`;
        const el = grid[key];

        if (!el) {
          cells.push(<div key={key} className="cell empty" />);
          continue;
        }

        cells.push(
          <div key={key} className="cell">
            <ElementCell 
              element={el}
              onMouseMove={(e) => handleMouseMove(e, el)}
              onMouseLeave={() => setTooltip(null)}
            />
          </div>
        );
      }
    }

    return cells;
  }, [grid, handleMouseMove]);

  const categories = useMemo(() => ({
    "alkali-metal": "Alkali metal",
    "alkaline-earth": "Alkaline earth",
    "transition-metal": "Transition metal",
    "post-transition": "Post-transition",
    "metalloid": "Metalloid",
    "nonmetal": "Nonmetal",
    "halogen": "Halogen",
    "noble-gas": "Noble gas",
    "lanthanide": "Lanthanide",
    "actinide": "Actinide",
  }), []);

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: linear-gradient(135deg, #0f172a 0%, #1a1a2e 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-height: 100vh; }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        h1 { text-align: center; color: #f0f9ff; font-size: 28px; font-weight: 600; margin-bottom: 8px; letter-spacing: 0.5px; }
        .subtitle { text-align: center; color: #94a3b8; font-size: 14px; margin-bottom: 24px; }
        
        .table-wrapper { 
          background: rgba(30, 41, 59, 0.8); 
          backdrop-filter: blur(10px);
          border-radius: 12px; 
          padding: 20px; 
          border: 1px solid rgba(148, 163, 184, 0.2);
          overflow-x: auto;
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
        }
        
        .table { 
          display: grid; 
          grid-template-columns: repeat(18, 1fr); 
          gap: 4px; 
          min-width: fit-content;
        }

        .cell { position: relative; min-height: 56px; }
        .cell.empty { pointer-events: none; }
        
        .cell-inner {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          padding: 4px 3px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          will-change: transform, box-shadow;
        }
        
        .cell-inner:hover {
          transform: scale(1.15) translateZ(0);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
          z-index: 20;
        }
        
        .cell-inner .num { font-size: 7px; line-height: 1; opacity: 0.7; align-self: flex-start; padding-left: 2px; font-weight: 500; }
        .cell-inner .sym { font-size: 13px; font-weight: 700; line-height: 1.2; letter-spacing: 0.5px; }
        .cell-inner .name { font-size: 5.5px; line-height: 1; opacity: 0.75; text-align: center; width: 100%; margin-top: 1px; }
        .cell-inner .mass { font-size: 5px; line-height: 1; opacity: 0.6; margin-top: 1px; }

        /* Category colors - vibrant gradient look */
        .alkali-metal      { background: linear-gradient(135deg, #7c2d12 0%, #92400e 100%); color: #fed7aa; }
        .alkaline-earth    { background: linear-gradient(135deg, #7c2d12 0%, #d97706 100%); color: #fef3c7; }
        .transition-metal  { background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%); color: #bae6fd; }
        .post-transition   { background: linear-gradient(135deg, #3f0f5c 0%, #7c3aed 100%); color: #e9d5ff; }
        .metalloid         { background: linear-gradient(135deg, #134e4a 0%, #0d9488 100%); color: #ccfbf1; }
        .nonmetal          { background: linear-gradient(135deg, #292e33 0%, #1f2937 100%); color: #e5e7eb; }
        .halogen           { background: linear-gradient(135deg, #581c87 0%, #a21caf 100%); color: #f3e8ff; }
        .noble-gas         { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: #dbeafe; }
        .lanthanide        { background: linear-gradient(135deg, #7c0a02 0%, #dc2626 100%); color: #fee2e2; }
        .actinide          { background: linear-gradient(135deg, #164e63 0%, #0891b2 100%); color: #cffafe; }

        .sep-row { 
          grid-column: 1 / -1; 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          margin: 8px 0 4px;
          opacity: 0.6;
        }
        .sep-label { font-size: 12px; color: #cbd5e1; white-space: nowrap; font-weight: 500; }
        .sep-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #64748b, transparent); }

        .legend { 
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px; 
          margin-top: 24px; 
          padding-top: 16px;
          border-top: 1px solid rgba(148, 163, 184, 0.2);
        }
        .leg-item { 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          font-size: 13px; 
          color: #cbd5e1;
        }
        .leg-swatch { 
          width: 16px; 
          height: 16px; 
          border-radius: 6px; 
          flex-shrink: 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tooltip {
          position: fixed;
          display: block;
          z-index: 9999;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 12px;
          color: #e2e8f0;
          pointer-events: none;
          min-width: 180px;
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        .tip-sym { font-size: 28px; font-weight: 700; margin-bottom: 6px; letter-spacing: 1px; }
        .tip-name { font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #f1f5f9; }
        .tip-row { color: #cbd5e1; line-height: 1.6; font-size: 11px; }
        .tip-row b { color: #f0f9ff; font-weight: 600; }

        @media (max-width: 768px) {
          .table-wrapper { padding: 12px; }
          .table { gap: 2px; grid-template-columns: repeat(10, 1fr); }
          .cell { min-height: 44px; }
          h1 { font-size: 22px; }
          .legend { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); }
        }
      `}</style>

      <div className="container">
        <h1>Periodic Table of Elements</h1>
        <p className="subtitle">Interactive periodic table with element details</p>
        
        <div className="table-wrapper">
          <div className="table">
            {renderGrid}
          </div>

          <div className="legend">
            {Object.entries(categories).map(([cat, label]) => (
              <div key={cat} className="leg-item">
                <div className={`leg-swatch ${cat}`}></div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <Tooltip data={tooltip} pos={tooltipPos} />
      </div>
    </>
  );
}
