const PRODUCTS = [
  {
    id: 'arc-chair', num: '01', name: 'ARC CHAIR',
    category: 'seating', material: 'wood', collection: '01',
    tagline: 'Designed for quiet spaces and long conversations.',
    description: 'A sculptural lounge chair with a curved back and generous seat. The arc geometry distributes weight evenly and invites long sittings. Hand-finished in our European workshop.',
    variants: [
      { name: 'NATURAL OAK', price: 680, sku: 'ARC-01-OAK', color: '#C9B28C', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=85' },
      { name: 'BLACK OAK', price: 720, sku: 'ARC-01-BLK', color: '#1C1C1C', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=85' },
      { name: 'WALNUT', price: 760, sku: 'ARC-01-WAL', color: '#5C3A22', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=85' },
    ],
    dimensions: { w: 72, d: 74, h: 78 }, weight: '11 kg',
    availability: 'IN STOCK', svgType: 'chair',
    contextImages: [
      { label: 'IN SPACE', src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85' },
      { label: 'DETAIL', src: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=85' },
    ],
  },
  {
    id: 'line-sofa', num: '02', name: 'LINE SOFA',
    category: 'seating', material: 'fabric', collection: '01',
    tagline: 'A long, low silhouette for slow evenings.',
    description: 'The LINE SOFA extends horizontally, emphasizing the architecture of the room. Cushions are filled with high-density foam wrapped in wool textile. The frame is solid oak.',
    variants: [
      { name: 'SAND WOOL', price: 1890, sku: 'LINE-02-SND', color: '#D9CDB8', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85' },
      { name: 'STONE FABRIC', price: 1890, sku: 'LINE-02-STN', color: '#8E8B84', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=85' },
    ],
    dimensions: { w: 220, d: 92, h: 74 }, weight: '48 kg',
    availability: 'MADE TO ORDER', svgType: 'sofa',
    contextImages: [
      { label: 'IN SPACE', src: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=85' },
      { label: 'DETAIL', src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=85' },
    ],
  },
  {
    id: 'mono-table', num: '03', name: 'MONO TABLE',
    category: 'tables', material: 'wood', collection: '01',
    tagline: 'One plane, one material, one idea.',
    description: 'A low coffee table reduced to its essential form. Solid oak top on a slim leg structure. Designed to disappear quietly and hold everything you place on it.',
    variants: [
      { name: 'NATURAL OAK', price: 1240, sku: 'MONO-03-OAK', color: '#C9B28C', image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1200&q=85' },
      { name: 'BLACK OAK', price: 1290, sku: 'MONO-03-BLK', color: '#1C1C1C', image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=85' },
    ],
    dimensions: { w: 140, d: 70, h: 32 }, weight: '24 kg',
    availability: 'IN STOCK', svgType: 'table',
    contextImages: [
      { label: 'IN SPACE', src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85' },
      { label: 'DETAIL', src: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=85' },
    ],
  },
  {
    id: 'void-lamp', num: '04', name: 'VOID LAMP',
    category: 'lighting', material: 'metal', collection: '02',
    tagline: 'Light as architecture.',
    description: 'A floor lamp with a suspended diffuser that casts light downward with minimal glare. Steel frame, powder-coated. Cable length 2.5m.',
    variants: [
      { name: 'MATTE BLACK', price: 420, sku: 'VOID-04-BLK', color: '#1C1C1C', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85' },
      { name: 'WARM WHITE', price: 420, sku: 'VOID-04-WHT', color: '#EDE6D8', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85' },
    ],
    dimensions: { w: 34, d: 34, h: 168 }, weight: '6 kg',
    availability: 'IN STOCK', svgType: 'lamp-floor',
    contextImages: [
      { label: 'IN SPACE', src: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=85' },
      { label: 'DETAIL', src: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85' },
    ],
  },
  {
    id: 'frame-shelf', num: '05', name: 'FRAME SHELF',
    category: 'storage', material: 'wood', collection: '01',
    tagline: 'A structure for objects and emptiness.',
    description: 'A freestanding shelving frame with four adjustable planes. The visible joinery becomes the ornament. Assembles with four bolts, no tools required beyond that.',
    variants: [
      { name: 'NATURAL OAK', price: 760, sku: 'FRAM-05-OAK', color: '#C9B28C', image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=1200&q=85' },
      { name: 'BLACK OAK', price: 820, sku: 'FRAM-05-BLK', color: '#1C1C1C', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=85' },
    ],
    dimensions: { w: 90, d: 32, h: 180 }, weight: '28 kg',
    availability: 'IN STOCK', svgType: 'shelf',
    contextImages: [
      { label: 'IN SPACE', src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85' },
      { label: 'DETAIL', src: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=85' },
    ],
  },
  {
    id: 'form-stool', num: '06', name: 'FORM STOOL',
    category: 'seating', material: 'wood', collection: '01',
    tagline: 'A seat, a side table, an object.',
    description: 'The FORM STOOL is deliberately ambiguous. It works as seating, as a side surface, or as a standalone object. Solid oak throughout, hand-sanded finish.',
    variants: [
      { name: 'NATURAL OAK', price: 390, sku: 'FORM-06-OAK', color: '#C9B28C', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=85' },
      { name: 'WALNUT', price: 440, sku: 'FORM-06-WAL', color: '#5C3A22', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=85' },
    ],
    dimensions: { w: 38, d: 38, h: 45 }, weight: '4 kg',
    availability: 'IN STOCK', svgType: 'stool',
    contextImages: [
      { label: 'IN SPACE', src: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=85' },
      { label: 'DETAIL', src: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=85' },
    ],
  },
  {
    id: 'plinth-table', num: '07', name: 'PLINTH TABLE',
    category: 'tables', material: 'wood', collection: '02',
    tagline: 'Elevated to its essential proportion.',
    description: 'A side table based on the classical plinth — but reduced. The top sits flush with the base, creating a single monolithic form. Solid oak, four contact points.',
    variants: [
      { name: 'NATURAL OAK', price: 890, sku: 'PLIN-07-OAK', color: '#C9B28C', image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=85' },
      { name: 'BLACK OAK', price: 940, sku: 'PLIN-07-BLK', color: '#1C1C1C', image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1200&q=85' },
    ],
    dimensions: { w: 46, d: 46, h: 52 }, weight: '12 kg',
    availability: 'IN STOCK', svgType: 'table',
    contextImages: [
      { label: 'IN SPACE', src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85' },
      { label: 'DETAIL', src: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=85' },
    ],
  },
  {
    id: 'loop-chair', num: '08', name: 'LOOP CHAIR',
    category: 'seating', material: 'wood', collection: '02',
    tagline: 'A continuous line, bent around the body.',
    description: 'The LOOP CHAIR is formed from a single bent-wood loop. The back and arms are one continuous element. The seat is a suspended canvas.',
    variants: [
      { name: 'NATURAL OAK', price: 590, sku: 'LOOP-08-OAK', color: '#C9B28C', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=85' },
      { name: 'BLACK OAK', price: 640, sku: 'LOOP-08-BLK', color: '#1C1C1C', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=85' },
    ],
    dimensions: { w: 68, d: 70, h: 74 }, weight: '9 kg',
    availability: 'IN STOCK', svgType: 'chair',
    contextImages: [
      { label: 'IN SPACE', src: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=85' },
      { label: 'DETAIL', src: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=85' },
    ],
  },
  {
    id: 'grid-cabinet', num: '09', name: 'GRID CABINET',
    category: 'storage', material: 'wood', collection: '01',
    tagline: 'A system for things that matter.',
    description: 'The GRID CABINET organizes objects in an orthogonal structure. Two doors, four open shelves, one adjustable internal shelf. Oak throughout.',
    variants: [
      { name: 'NATURAL OAK', price: 1450, sku: 'GRID-09-OAK', color: '#C9B28C', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=85' },
      { name: 'BLACK OAK', price: 1520, sku: 'GRID-09-BLK', color: '#1C1C1C', image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=1200&q=85' },
    ],
    dimensions: { w: 120, d: 42, h: 160 }, weight: '52 kg',
    availability: 'MADE TO ORDER', svgType: 'cabinet',
    contextImages: [
      { label: 'IN SPACE', src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85' },
      { label: 'DETAIL', src: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=85' },
    ],
  },
  {
    id: 'arc-lamp', num: '10', name: 'ARC LAMP',
    category: 'lighting', material: 'metal', collection: '02',
    tagline: 'Precision lighting for close work.',
    description: 'A table lamp with a directional shade that pivots on two axes. The armature is machined steel. Ideal for desks and reading corners.',
    variants: [
      { name: 'MATTE BLACK', price: 520, sku: 'ARC-10-BLK', color: '#1C1C1C', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85' },
      { name: 'WARM WHITE', price: 520, sku: 'ARC-10-WHT', color: '#EDE6D8', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85' },
    ],
    dimensions: { w: 24, d: 24, h: 52 }, weight: '4 kg',
    availability: 'IN STOCK', svgType: 'lamp-table',
    contextImages: [
      { label: 'IN SPACE', src: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=85' },
      { label: 'DETAIL', src: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85' },
    ],
  },
  {
    id: 'mono-bench', num: '11', name: 'MONO BENCH',
    category: 'seating', material: 'wood', collection: '01',
    tagline: 'For entryways, hallways, and quiet pauses.',
    description: 'A long low bench in solid oak. The seat surface is one continuous plank — no visible joins from above. The leg structure is minimal and load-bearing.',
    variants: [
      { name: 'NATURAL OAK', price: 840, sku: 'MONO-11-OAK', color: '#C9B28C', image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=85' },
      { name: 'BLACK OAK', price: 890, sku: 'MONO-11-BLK', color: '#1C1C1C', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=85' },
    ],
    dimensions: { w: 160, d: 40, h: 42 }, weight: '22 kg',
    availability: 'IN STOCK', svgType: 'bench',
    contextImages: [
      { label: 'IN SPACE', src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85' },
      { label: 'DETAIL', src: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=85' },
    ],
  },
  {
    id: 'object-mirror', num: '12', name: 'OBJECT MIRROR',
    category: 'objects', material: 'glass', collection: '02',
    tagline: 'A wall object that completes the room.',
    description: 'A circular mirror with a solid oak frame. The bevel is subtle — the frame sits flush with the glass. Diameter 60cm. Hangs on a hidden bracket.',
    variants: [
      { name: 'NATURAL OAK', price: 360, sku: 'OBJE-12-OAK', color: '#C9B28C', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85' },
      { name: 'BLACK OAK', price: 390, sku: 'OBJE-12-BLK', color: '#1C1C1C', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=85' },
    ],
    dimensions: { w: 60, d: 3, h: 60 }, weight: '5 kg',
    availability: 'IN STOCK', svgType: 'mirror',
    contextImages: [
      { label: 'IN SPACE', src: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=85' },
      { label: 'DETAIL', src: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=85' },
    ],
  },
];

const ROOM_CATEGORIES = [
  { key: 'sofa', label: 'SOFA', products: ['line-sofa'], position: { top: '58%', left: '18%' } },
  { key: 'chair', label: 'CHAIR', products: ['arc-chair', 'loop-chair', 'form-stool'], position: { top: '48%', left: '68%' } },
  { key: 'table', label: 'TABLE', products: ['mono-table', 'plinth-table', 'mono-bench'], position: { top: '70%', left: '50%' } },
  { key: 'lighting', label: 'LIGHTING', products: ['void-lamp', 'arc-lamp'], position: { top: '32%', left: '82%' } },
];