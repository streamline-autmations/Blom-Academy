import type { Course, Module, Lesson } from "./types";

const allCourses: Course[] = [
  {
    id: "watercolour-101",
    title: "Online Watercolour Workshop",
    slug: "online-watercolour-workshop",
    cover: "/online-watercolor-card.webp",
    summary: "Learn how to create soft, dreamy watercolour designs from the comfort of your home. With step-by-step guidance and detailed videos. Let your creativity bloom with BLOM.",
    level: "Beginner",
    tags: ["Watercolour", "Art", "DIY"],
    priceZAR: 480,
    durationText: "Self-paced",
    tagline: "Create soft, dreamy watercolour designs from home.",
    description: "Learn how to create soft, dreamy watercolour designs from the comfort of your home. With step-by-step guidance and detailed videos. Let your creativity bloom with BLOM.",
    notes: [
      "Kit not included—after purchase you'll receive a list of recommended paints and brushes.",
      "Private Facebook group access for detailed video uploads.",
      "Submit completed work via WhatsApp 079 548 3317 or email for your certificate.",
    ],
    materials: [
      { name: "Watercolour Paints", image: "/paints.webp" },
      { name: "Brushes (Round & Flat)", image: "/brushes.webp" },
      { name: "Watercolour Paper", image: "/paper.webp" },
      { name: "Water Jars & Palette", image: "/jars.webp" },
    ]
  },
  {
    id: "watercolour-christmas",
    title: "Christmas Watercolor Nail Art Workshop",
    slug: "holiday-watercolor-workshop",
    cover: "/christmas-watercolor-card.webp",
    summary: "Create festive Christmas watercolor nail art designs. Learn beautiful seasonal patterns perfect for the festive season.",
    level: "Beginner",
    tags: ["Watercolor", "Nail Art", "Christmas"],
    durationText: "Self-paced",
    tagline: "Create beautiful Christmas watercolor nail art.",
    description: "Get into the festive spirit with our Christmas Watercolor Nail Art Workshop! Learn to create stunning seasonal nail art designs that will add sparkle and joy to your client's nails this festive season.",
    notes: [
      "Kit not included. A full list of recommended materials is provided inside the course.",
      "Access to a private Facebook group for sharing your floral creations.",
      "Certificate of completion available upon finishing all lessons.",
    ],
    materials: [
        { name: "Fine Line Detailer Brush", image: "/brush.webp", link: "https://www.takealot.com/5pcs-nail-stretching-brush-set-line-pattern-paint-pen-nail-stret/PLID96616954" },
        { name: "Practice Tips", image: "/tips.webp", link: "https://www.takealot.com/imbali-portable-fan-gel-polish-colour-display-natural-nail-colou/PLID64858431" },
        { name: "Watercolor Palette", image: "/palette.webp", link: "https://atlaspaints.co.za/shop/mont-marte-two-seasons-watercolours-18pce-12ml/" },
        { name: "White Gel Polish or Acrylic", image: "/gel.webp", link: "https://artattack.co.za/iris-acrylic/iris-acrylic-paints-75ml-tubes/" },
        { name: "Buffer", image: "/buffer.webp", link: "https://www.takealot.com/professional-nail-and-beauty-4-way-white-buffer/PLID91636988" },
        { name: "Bowl of Water", image: "/water.webp" },
    ]
  },
  {
    id: "faded-flowers-workshop",
    title: "Faded Flowers Workshop",
    slug: "faded-flowers-workshop",
    cover: "https://res.cloudinary.com/dnlgohkcc/image/upload/q_auto/f_auto/v1775453928/WhatsApp_Image_2026-04-03_at_12.34.07_uelxcc.jpg",
    summary: "Master the art of soft, faded floral nail designs. Learn how to create beautifully blended watercolor flowers with a dreamy, ethereal finish.",
    level: "Beginner",
    tags: ["Nail Art", "Flowers", "Watercolor", "Faded"],
    priceZAR: 690,
    durationText: "Self-paced",
    tagline: "Create soft, dreamy faded floral nail art.",
    description: "Step into the world of faded floral nail art with our Faded Flowers Workshop. You'll learn how to sketch and paint beautifully blended flower designs, from understanding your materials to mastering 6 unique designs with soft, watercolor-style fading techniques. Perfect for nail technicians looking to expand their creative menu.",
    notes: [
      "Kit not included. A full list of recommended materials is provided inside the course.",
      "Access to a private Facebook group for sharing your floral creations.",
      "Certificate of completion available upon finishing all lessons.",
    ],
    materials: [
      { name: "Blom Gel Paint Set", image: "https://res.cloudinary.com/drsrbzm2t/image/upload/q_auto/f_auto/v1772433762/GelPaints1_buvq6f.jpg", link: "https://blom-cosmetics.co.za/products/blom-gel-paint-set-12x-colours" },
      { name: "Nail Forms", image: "https://res.cloudinary.com/drsrbzm2t/image/upload/q_auto/f_auto/v1771405847/nail-forms-white_u5dyzz.webp", link: "https://blom-cosmetics.co.za/products/nail-forms" },
      { name: "Professional Detail Brush", image: "https://res.cloudinary.com/drsrbzm2t/image/upload/q_auto/f_auto/v1771405824/detail-brush-set-colorful_xylfgh.webp", link: "https://blom-cosmetics.co.za/products/professional-detail-brush" },
      { name: "Brush Gallery Bristle Filbert (#2)", image: "https://res.cloudinary.com/drsrbzm2t/image/upload/q_auto/f_auto/v1775643852/WhatsApp_Image_2026-04-08_at_12.15.32_wjspfh.jpg", popup: "Brush Gallery Bristle Filbert (#2) — Code 1181805\nR55.60 per brush, available at any PEP store, or find it in-store at our BLOM Cosmetics store." },
    ]
  },
  {
    id: "7c5276c1-9207-4653-89c3-bb4c675db5e2",
    title: "Flower Nail Art Workshop",
    slug: "blom-flower-watercolor-workshop",
    cover: "/Blom-flower-workshop.webp",
    summary: "Master the art of creating stunning floral watercolor nail designs. Learn essential techniques and create beautiful flower patterns that will make your clients bloom with joy.",
    level: "Beginner",
    tags: ["Nail Art", "Flowers", "Watercolor", "Craft"],
    durationText: "Self-paced",
    tagline: "Create beautiful floral nail art designs.",
    description: "Dive deep into the world of floral nail art with our step-by-step workshop. From basic petal techniques to complex flower designs, you'll learn everything needed to create stunning botanical nail art that will set your work apart.",
    notes: [
      "Kit not included. A full list of recommended materials is provided inside the course.",
      "Access to a private Facebook group for sharing your floral creations.",
      "Certificate of completion available upon finishing all lessons.",
    ],
    materials: [
        { name: "Fine Line Detailer Brush", image: "/brush.webp", link: "https://www.takealot.com/5pcs-nail-stretching-brush-set-line-pattern-paint-pen-nail-stret/PLID96616954" },
        { name: "Practice Tips", image: "/tips.webp", link: "https://www.takealot.com/imbali-portable-fan-gel-polish-colour-display-natural-nail-colou/PLID64858431" },
        { name: "Watercolor Palette", image: "/palette.webp", link: "https://atlaspaints.co.za/shop/mont-marte-two-seasons-watercolours-18pce-12ml/" },
        { name: "White Gel Polish or Acrylic", image: "/gel.webp", link: "https://artattack.co.za/iris-acrylic/iris-acrylic-paints-75ml-tubes/" },
        { name: "Buffer", image: "/buffer.webp", link: "https://www.takealot.com/professional-nail-and-beauty-4-way-white-buffer/PLID91636988" },
        { name: "Bowl of Water", image: "/water.webp" },
    ]
  },
];

export const courses: Course[] = allCourses.filter(course => course.slug !== 'online-watercolour-workshop');

export const modules: Module[] = [
  { id: "wc-m1", courseId: "watercolour-101", title: "0 - Start Here", order: 1, summary: "Learn how to navigate the workshop.", icon: "Compass" },
  { id: "wc-m2", courseId: "watercolour-101", title: "1 - Materials & Setup", order: 2, summary: "Get your workspace and tools ready.", icon: "Paintbrush" },
  { id: "wc-m3", courseId: "watercolour-101", title: "2 - Core Techniques", order: 3, summary: "Master the fundamental watercolour skills.", icon: "Layers" },
  { id: "wc-m4", courseId: "watercolour-101", title: "3 - Floral Projects", order: 4, summary: "Create beautiful floral paintings.", icon: "Flower" },
  { id: "wc-m5", courseId: "watercolour-101", title: "4 - Advanced Effects", order: 5, summary: "Explore special effects and textures.", icon: "Sparkles" },
  { id: "wc-m6", courseId: "watercolour-101", title: "5 - Finish & Share", order: 6, summary: "Prepare and present your final artwork.", icon: "Award" },
  
  // New Christmas Workshop Modules
  { id: "xmas-m1", courseId: "watercolour-christmas", title: "Module 1 – Welcome & Materials", order: 1, icon: "Sparkles" },
  { id: "xmas-m2", courseId: "watercolour-christmas", title: "Module 2 – Understanding Watercolor for Nail Art", order: 2, icon: "Layers" },
  { id: "xmas-m3", courseId: "watercolour-christmas", title: "Module 3 – Step-by-Step Tutorials", order: 3, icon: "Paintbrush" },
  { id: "xmas-m4", courseId: "watercolour-christmas", title: "Module 4 – Sealing Your Designs", order: 4, icon: "Award" },
  { id: "xmas-m5", courseId: "watercolour-christmas", title: "Module 5 – Certificate of Completion", order: 5, icon: "Compass" },
  
  // Flower Nail Art Workshop Modules
  { id: "flower-m1", courseId: "7c5276c1-9207-4653-89c3-bb4c675db5e2", title: "Module 1 – Welcome & Materials", order: 1, icon: "Sparkles" },
  { id: "flower-m2", courseId: "7c5276c1-9207-4653-89c3-bb4c675db5e2", title: "Module 2 – Practice Flowers", order: 2, icon: "Flower" },
  { id: "flower-m3", courseId: "7c5276c1-9207-4653-89c3-bb4c675db5e2", title: "Module 3 – Step-by-Step Designs", order: 3, icon: "Paintbrush" },
  { id: "flower-m4", courseId: "7c5276c1-9207-4653-89c3-bb4c675db5e2", title: "Module 4 – Certificate of Completion", order: 4, icon: "Award" },

  // Faded Flowers Workshop Modules
  { id: "ff-m1", courseId: "faded-flowers-workshop", title: "Module 1 – Welcome & Materials", order: 1, icon: "Sparkles" },
  { id: "ff-m2", courseId: "faded-flowers-workshop", title: "Module 2 – Sketch & Techniques", order: 2, icon: "Pencil" },
  { id: "ff-m3", courseId: "faded-flowers-workshop", title: "Module 3 – Step-by-Step Designs", order: 3, icon: "Paintbrush" },
  { id: "ff-m4", courseId: "faded-flowers-workshop", title: "Module 4 – Certificate of Completion", order: 4, icon: "Award" },
];

export const lessons: Lesson[] = [
  // Watercolour 101 Lessons
  { id: "wc-l1-1", moduleId: "wc-m1", title: "Welcome & How This Workshop Works", durationSec: 180, poster: "https://picsum.photos/seed/wc-l1-1/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/0b36c362-eba8-4a58-8351-7c3da37e7502?autoplay=false&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 1, isPreview: true },
  { id: "wc-l1-2", moduleId: "wc-m1", title: "Student Intake Form (Facebook Name + Contact)", durationSec: 120, poster: "https://picsum.photos/seed/wc-l1-2/400/225", content: "<h3>Action Required: Student Intake Form</h3><p>To get access to the private Facebook group and receive your certificate upon completion, please fill out the student intake form.</p><p>You can find the button to open the form on the main page for the <strong>Online Watercolour Workshop</strong>.</p>", resources: [], order: 2 },
  { id: "wc-l2-1", moduleId: "wc-m2", title: "Recommended Paints, Paper & Brushes", durationSec: 390, poster: "https://picsum.photos/seed/wc-l2-1/400/225", resources: [{ name: "Materials List", type: "pdf", href: "#" }], order: 1 },
  { id: "wc-l2-2", moduleId: "wc-m2", title: "Workspace, Water Control & Swatching", durationSec: 440, poster: "https://picsum.photos/seed/wc-l2-2/400/225", resources: [], order: 2 },
  { id: "wc-l3-1", moduleId: "wc-m3", title: "Wet-on-Wet vs Wet-on-Dry", durationSec: 495, poster: "https://picsum.photos/seed/wc-l3-1/400/225", resources: [], order: 1 },
  { id: "wc-l3-2", moduleId: "wc-m3", title: "Layering, Blooming & Soft Edges", durationSec: 550, poster: "https://picsum.photos/seed/wc-l3-2/400/225", resources: [], order: 2 },
  { id: "wc-l4-1", moduleId: "wc-m4", title: "Loose Roses & Peonies", durationSec: 605, poster: "https://picsum.photos/seed/wc-l4-1/400/225", resources: [], order: 1 },
  { id: "wc-l4-2", moduleId: "wc-m4", title: "Leaves, Fillers & Composition", durationSec: 585, poster: "https://picsum.photos/seed/wc-l4-2/400/225", resources: [], order: 2 },
  { id: "wc-l5-1", moduleId: "wc-m5", title: "Salt, Alcohol & Lifting Highlights", durationSec: 460, poster: "https://picsum.photos/seed/wc-l5-1/400/225", resources: [], order: 1 },
  { id: "wc-l6-1", moduleId: "wc-m6", title: "Sealing, Scanning & Presentation", durationSec: 375, poster: "https://picsum.photos/seed/wc-l6-1/400/225", resources: [], order: 1 },
  { id: "wc-l6-2", moduleId: "wc-m6", title: "How to Submit for Certificate", durationSec: 210, poster: "https://picsum.photos/seed/wc-l6-2/400/225", resources: [], order: 2 },

  // New Christmas Workshop Lessons
  // Module 1
  { id: "xmas-l1-1", moduleId: "xmas-m1", title: "Introduction", durationSec: 180, poster: "https://picsum.photos/seed/xmas-intro/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/3a9aaf75-459d-4851-947f-3d2b5d07623c?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 1, isPreview: true },
  { id: "xmas-l1-2", moduleId: "xmas-m1", title: "Workshop Overview", durationSec: 60, poster: "https://picsum.photos/seed/xmas-overview/400/225", content: `<h2>Welcome to the Blom Cosmetics Christmas Watercolor Nail Art Workshop</h2><p>Hi, I’m Avané Crous, and I’d love to welcome you to this special festive workshop.</p><p>Art has always been my passion—I was top of my art class in school, and that love has only grown stronger throughout my career. I’ve been a qualified nail technician for over 10 years, and for the past 7 years I’ve had the privilege of training others in both professional nail art and foundational techniques. Along the way, I’ve been honored to win Nail Artist of the Year in 2019 and 2020, titles I carry with great pride.</p><p>But beyond achievements, what truly fulfills me is teaching. My heart is in empowering fellow nail technicians with the skills, confidence, and support to grow. As one of my favorite quotes goes:</p><blockquote>“A true mentor is not someone who gives you the answers, but someone who shows you the way and inspires you to find your own path.”</blockquote><p>That’s what this workshop is all about.</p><h3>Why This Workshop Is Different</h3><p>This Christmas Watercolor Nail Art Workshop has been carefully designed to be simple, creative, and effective. The quick designs you’ll learn here are versatile and will add something unique to your client menu just in time for the festive season.</p><p>I’m here to give you all the support you need, both on and off the course. I love seeing my students succeed, and nothing makes me happier than hearing how these skills help you in your nail journey.</p><p>At the end of the workshop, I’d be so grateful if you could share your feedback with me. You’re welcome to WhatsApp me directly at <a href="tel:0795483317" class="text-primary hover:underline">079 548 3317</a>—I’d love to hear from you. ♡</p>`, resources: [], order: 2 },
  { id: "xmas-l1-3", moduleId: "xmas-m1", title: "Required Materials Checklist", durationSec: 60, poster: "https://picsum.photos/seed/xmas-materials/400/225", content: `<h3>Products that will be needed</h3><p>Please see the "Required Materials" section on the main course page for a full list of items needed for this workshop.</p><p>Watercolor Palettes are available at PNA stores nationwide.</p>`, resources: [], order: 3 },
  // Module 2
  { id: "xmas-l2-1", moduleId: "xmas-m2", title: "Preparing Your Nails", durationSec: 60, poster: "https://picsum.photos/seed/xmas-prep/400/225", content: `<h3>Understanding Watercolor for Nail Art</h3><p>Watercolor is an incredible medium for nail art because it allows for soft, dreamy, and detailed designs with a professional finish.</p><p><strong>On Acrylic Nails:</strong> Apply a top coat and cure for 60 seconds. Buff to a matte surface before painting—watercolor will not adhere properly to gloss.</p><p><strong>On Gel Nails:</strong> Simply buff the surface to matte and then paint your designs.</p><p>This ensures the watercolor grips beautifully and allows you to create stunning, long-lasting art.</p>`, resources: [], order: 1 },
  // Module 3
  { id: "xmas-l3-12", moduleId: "xmas-m3", title: "Practice Exercises - Part 1", durationSec: 300, poster: "https://picsum.photos/seed/xmas-p1/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/9ea726a8-df2b-42df-b6b3-84602567572b?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 1 },
  { id: "xmas-l3-13", moduleId: "xmas-m3", title: "Practice Exercises - Part 2", durationSec: 300, poster: "https://picsum.photos/seed/xmas-p2/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/5c781948-d3c2-47bf-b894-f70cf884208c?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 2 },
  { id: "xmas-l3-1", moduleId: "xmas-m3", title: "Design 1 - Part 1", durationSec: 300, poster: "https://picsum.photos/seed/xmas-d1-1/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/98d50098-3af0-470a-8023-a0fcfe6ea8ff?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 3 },
  { id: "xmas-l3-2", moduleId: "xmas-m3", title: "Design 1 - Part 2", durationSec: 300, poster: "https://picsum.photos/seed/xmas-d1-2/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/2565bee8-dfd6-4b47-951b-639de55f4c9d?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 4 },
  { id: "xmas-l3-3", moduleId: "xmas-m3", title: "Design 1 - Part 3", durationSec: 300, poster: "https://picsum.photos/seed/xmas-d1-3/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/3adb505a-b1a2-4be0-be22-6b28a5e4b2a2?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 5 },
  { id: "xmas-l3-4", moduleId: "xmas-m3", title: "Design 2 - Part 1", durationSec: 300, poster: "https://picsum.photos/seed/xmas-d2-1/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/42785aaa-cc04-46b0-98a7-a87792ce3dec?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 6 },
  { id: "xmas-l3-5", moduleId: "xmas-m3", title: "Design 2 - Part 2", durationSec: 300, poster: "https://picsum.photos/seed/xmas-d2-2/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/2e220fcd-cb16-410d-8566-ca418aa9b220?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 7 },
  { id: "xmas-l3-6", moduleId: "xmas-m3", title: "Design 2 - Part 3", durationSec: 300, poster: "https://picsum.photos/seed/xmas-d2-3/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/e93e0f12-706f-4ca6-93c6-7060043a9baf?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 8 },
  { id: "xmas-l3-7", moduleId: "xmas-m3", title: "Design 3 - Part 1", durationSec: 300, poster: "https://picsum.photos/seed/xmas-d3-1/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/0b36c362-eba8-4a58-8351-7c3da37e7502?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 9 },
  { id: "xmas-l3-8", moduleId: "xmas-m3", title: "Design 3 - Part 2", durationSec: 300, poster: "https://picsum.photos/seed/xmas-d3-2/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/0b3cd218-5483-4778-ab61-d43ca0ec8e22?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 10 },
  { id: "xmas-l3-9", moduleId: "xmas-m3", title: "Design 3 - Part 3", durationSec: 300, poster: "https://picsum.photos/seed/xmas-d3-3/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/0c652329-c06a-4da2-99d1-1663e71ee501?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 11 },
  { id: "xmas-l3-10", moduleId: "xmas-m3", title: "Design 4 - Part 1", durationSec: 300, poster: "https://picsum.photos/seed/xmas-d4-1/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/62948732-a1f8-476e-8cc2-2e8966b1e11c?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 12 },
  { id: "xmas-l3-11", moduleId: "xmas-m3", title: "Design 4 - Part 2", durationSec: 300, poster: "https://picsum.photos/seed/xmas-d4-2/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/069d1ff8-5855-4806-8ce4-85ff978d57ef?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 13 },
  { id: "xmas-l3-11b", moduleId: "xmas-m3", title: "Design 4 - Part 3", durationSec: 300, poster: "https://picsum.photos/seed/xmas-d4-3/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/069d1ff8-5855-4806-8ce4-85ff978d57ef?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 14 },
  // Module 4
  { id: "xmas-l4-1", moduleId: "xmas-m4", title: "Sealing Your Designs", durationSec: 240, poster: "https://picsum.photos/seed/xmas-sealing/400/225", content: `<h3>How to seal in your designs.</h3><p>Properly sealing your watercolor art is crucial for a long-lasting, professional finish. This video demonstrates the best techniques.</p><p><strong>Product Feature:</strong> For an extra touch of festive sparkle, we recommend using the <strong>Blom Top Coat Glitter</strong>. It adds a beautiful, subtle shimmer while providing a strong, protective layer.</p>`, resources: [], order: 1 },
  { id: "xmas-l4-2", moduleId: "xmas-m4", title: "Sealing your designs and sugaring", durationSec: 300, poster: "https://picsum.photos/seed/xmas-sealing-sugaring/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/3fb00c94-4649-4ed9-bf91-e82ee284231c?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 2 },
  // Module 5
  { id: "xmas-l5-1", moduleId: "xmas-m5", title: "Certificate Mini-Assignment", durationSec: 60, poster: "https://picsum.photos/seed/xmas-cert/400/225", content: `<h2>🎓 Mini Assignment for Your Certificate of Completion</h2><p>To receive your Certificate of Completion, you'll need to complete a short but important assignment. This ensures that you've practiced the skills taught in the workshop and can confidently apply them.</p><h3>What to Submit:</h3><ul><li><strong>4 individual photos</strong> – one of each design you learned in the workshop.</li><li><strong>1 group photo</strong> – showing all four designs together.</li></ul><h3>How to Submit:</h3><p>Please email your photos to: <strong><a href="mailto:shopblomcosmetics@gmail.com" class="text-primary hover:underline">shopblomcosmetics@gmail.com</a></strong></p><h3>What Happens Next:</h3><ol><li>Your work will be reviewed by your mentor.</li><li>If your designs meet the standard, you will receive your Certificate of Completion via email.</li><li>If improvements are needed, you'll receive personalized feedback and guidance on what to practice. Once you've refined your work, you can resubmit your photos for review again.</li></ol><p>This process is not about perfection—it's about growth. 💕 By completing this assignment, you'll not only earn your certificate but also gain confidence in creating these festive watercolor nail designs.</p>`, resources: [], order: 1 },

  // Flower Nail Art Workshop Lessons
  // Module 1 - Welcome & Materials
  { id: "flower-l1-1", moduleId: "flower-m1", title: "Introduction – Part 1", durationSec: 180, poster: "https://picsum.photos/seed/flower-intro/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/931dec10-9389-48fc-87c7-5c32b072729e?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 1, isPreview: true },
  { id: "flower-l1-2", moduleId: "flower-m1", title: "Introduction – Part 2", durationSec: 180, poster: "https://picsum.photos/seed/flower-intro-2/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/93b42dd1-209c-4e74-8b0c-dec0e7366e68?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 2 },
  { id: "flower-l1-3", moduleId: "flower-m1", title: "Required Materials Checklist", durationSec: 60, poster: "https://picsum.photos/seed/flower-materials/400/225", content: `<h3>Products that will be needed</h3><p>Please see the "Required Materials" section on the main course page for a full list of items needed for this workshop.</p><p>Watercolor Palettes are available at PNA stores nationwide.</p>`, resources: [], order: 3 },
  
  // Module 2 - Practice Flowers
  { id: "flower-l2-1", moduleId: "flower-m2", title: "Practice Petals – Part 1", durationSec: 180, poster: "https://picsum.photos/seed/flower-petals-1/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/1205a60b-9c0b-4231-be7f-c835c983bbbf?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 1 },
  { id: "flower-l2-2", moduleId: "flower-m2", title: "Practice Petals – Part 2", durationSec: 180, poster: "https://picsum.photos/seed/flower-petals-2/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/1205a60b-9c0b-4231-be7f-c835c983bbbf?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 2 },
  { id: "flower-l2-3", moduleId: "flower-m2", title: "Petals Design", durationSec: 240, poster: "https://picsum.photos/seed/flower-petals-design/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/1b11d1cb-a72d-4bb0-8404-d5e12d6a6530?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 3 },
  
  // Module 3 - Step-by-Step Designs
  { id: "flower-l3-1", moduleId: "flower-m3", title: "Design 1 – Part 1", durationSec: 300, poster: "https://picsum.photos/seed/flower-d1-1/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/81d28305-8ed8-4da4-891d-1efa592ff45e?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 1 },
  { id: "flower-l3-2", moduleId: "flower-m3", title: "Design 1 – Part 2", durationSec: 300, poster: "https://picsum.photos/seed/flower-d1-2/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/27924541-917f-4089-8141-2112e7000ccc?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 2 },
  { id: "flower-l3-3", moduleId: "flower-m3", title: "Design 1 – Part 3", durationSec: 300, poster: "https://picsum.photos/seed/flower-d1-3/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/f735005f-7f41-4229-816d-a375db4d1003?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 3 },
  { id: "flower-l3-4", moduleId: "flower-m3", title: "Design 2 – Part 1", durationSec: 300, poster: "https://picsum.photos/seed/flower-d2-1/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/1d5f44d4-2f3c-4c2f-b1a9-07cbea5cb6f2?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 4 },
  { id: "flower-l3-5", moduleId: "flower-m3", title: "Design 2 – Part 2", durationSec: 300, poster: "https://picsum.photos/seed/flower-d2-2/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/d7f535d9-66e8-4c14-bf1e-026bce2200e1?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 5 },
  { id: "flower-l3-6", moduleId: "flower-m3", title: "Design 3 – Part 1", durationSec: 300, poster: "https://picsum.photos/seed/flower-d3-1/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/927e52c5-fe56-4a98-87eb-b75151bdd0e8?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 6 },
  { id: "flower-l3-7", moduleId: "flower-m3", title: "Design 3 – Part 2", durationSec: 300, poster: "https://picsum.photos/seed/flower-d3-2/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/7f63e3e4-4667-4593-9a2a-9afd5f9e0c2f?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 7 },
  { id: "flower-l3-8", moduleId: "flower-m3", title: "Design 3 – Part 3", durationSec: 300, poster: "https://picsum.photos/seed/flower-d3-3/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/fa897e9d-e2e7-4ffa-a4ad-d234e96d616d?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 8 },
  
  
  // Faded Flowers Workshop Lessons
  // Module 1 - Welcome & Materials
  { id: "ff-l1-1", moduleId: "ff-m1", title: "What You Need", durationSec: 300, poster: "https://picsum.photos/seed/ff-l1-1/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/e9b60b22-3a84-4948-bdcf-434898c02fe7?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 1, isPreview: true },

  // Module 2 - Sketch & Techniques
  { id: "ff-l2-1", moduleId: "ff-m2", title: "Sketch Description – Part 1", durationSec: 300, poster: "https://picsum.photos/seed/ff-l2-1/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/84d6d45d-5f6b-4ec1-aa99-9b8cd6cf283c?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 1 },

  // Module 3 - Step-by-Step Designs
  { id: "ff-l3-1", moduleId: "ff-m3", title: "Design 1 – Faded Floral", durationSec: 300, poster: "https://picsum.photos/seed/ff-l3-1/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/015be297-58ff-4097-a12e-aaaa10579331?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 1 },
  { id: "ff-l3-2", moduleId: "ff-m3", title: "Design 2 – Faded Floral", durationSec: 300, poster: "https://picsum.photos/seed/ff-l3-2/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/e3f4aa2c-3368-4470-9a0b-b08216f4c97c?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 2 },
  { id: "ff-l3-3", moduleId: "ff-m3", title: "Design 3 – Faded Floral", durationSec: 300, poster: "https://picsum.photos/seed/ff-l3-3/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/a449c6e7-779b-4072-9307-5846ece42160?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 3 },
  { id: "ff-l3-4", moduleId: "ff-m3", title: "Design 4 – Faded Floral", durationSec: 300, poster: "https://picsum.photos/seed/ff-l3-4/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/f5cf52cf-213f-480c-ba56-7f5fb54bef3d?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 4 },
  { id: "ff-l3-5", moduleId: "ff-m3", title: "Design 5 – Faded Floral", durationSec: 300, poster: "https://picsum.photos/seed/ff-l3-5/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/88e5b1db-6a4d-403b-b2a3-d693abcf9510?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 5 },
  { id: "ff-l3-6", moduleId: "ff-m3", title: "Design 6 – Faded Floral", durationSec: 300, poster: "https://picsum.photos/seed/ff-l3-6/400/225", videoUrl: "https://iframe.mediadelivery.net/embed/495863/ac65ae77-8461-4a06-9f0b-fd2825fd3b8c?autoplay=true&loop=false&muted=false&preload=true&responsive=true", resources: [], order: 6 },

  // Module 4 - Certificate of Completion
  { id: "ff-l4-1", moduleId: "ff-m4", title: "Certificate Mini-Assignment", durationSec: 60, poster: "https://picsum.photos/seed/ff-cert/400/225", content: `<h2>🎓 Mini Assignment for Your Certificate of Completion</h2><p>To receive your Certificate of Completion, you'll need to complete a short but important assignment. This ensures that you've practiced the skills taught in the workshop and can confidently apply them.</p><h3>What to Submit:</h3><ul><li><strong>6 individual photos</strong> – one of each design you learned in the workshop.</li><li><strong>1 group photo</strong> – showing all six designs together.</li></ul><h3>How to Submit:</h3><p>Please email your photos to: <strong><a href="mailto:shopblomcosmetics@gmail.com" class="text-primary hover:underline">shopblomcosmetics@gmail.com</a></strong></p><h3>What Happens Next:</h3><ol><li>Your work will be reviewed by your mentor.</li><li>If your designs meet the standard, you will receive your Certificate of Completion via email.</li><li>If improvements are needed, you'll receive personalized feedback and guidance on what to practice. Once you've refined your work, you can resubmit your photos for review again.</li></ol><p>This process is not about perfection—it's about growth. 💕 By completing this assignment, you'll not only earn your certificate but also gain confidence in creating these beautiful faded floral nail art designs.</p>`, resources: [], order: 1 },

  // Module 4 - Certificate of Completion
  { id: "flower-l4-1", moduleId: "flower-m4", title: "Certificate Mini-Assignment", durationSec: 60, poster: "https://picsum.photos/seed/flower-cert/400/225", content: `<h2>🎓 Mini Assignment for Your Certificate of Completion</h2><p>To receive your Certificate of Completion, you'll need to complete a short but important assignment. This ensures that you've practiced the skills taught in the workshop and can confidently apply them.</p><h3>What to Submit:</h3><ul><li><strong>3 individual photos</strong> – one of each design you learned in the workshop.</li><li><strong>1 group photo</strong> – showing all three designs together.</li></ul><h3>How to Submit:</h3><p>Please email your photos to: <strong><a href="mailto:shopblomcosmetics@gmail.com" class="text-primary hover:underline">shopblomcosmetics@gmail.com</a></strong></p><h3>What Happens Next:</h3><ol><li>Your work will be reviewed by your mentor.</li><li>If your designs meet the standard, you will receive your Certificate of Completion via email.</li><li>If improvements are needed, you'll receive personalized feedback and guidance on what to practice. Once you've refined your work, you can resubmit your photos for review again.</li></ol><p>This process is not about perfection—it's about growth. 💕 By completing this assignment, you'll not only earn your certificate but also gain confidence in creating these beautiful floral nail art designs.</p>`, resources: [], order: 1 },
];

export const getCourseData = (slug: string) => {
  const course = allCourses.find(c => c.slug === slug);
  if (!course) return null;

  const courseModules = modules.filter(m => m.courseId === course.id).sort((a, b) => a.order - b.order);
  const moduleIds = courseModules.map(m => m.id);
  const courseLessons = lessons.filter(l => moduleIds.includes(l.moduleId)).sort((a, b) => a.order - b.order);

  return { course, modules: courseModules, lessons: courseLessons };
}

export const getLessonData = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return null;

    const module = modules.find(m => m.id === lesson.moduleId);
    if (!module) return null;

    const course = allCourses.find(c => c.id === module.courseId);
    if (!course) return null;

    const allCourseModules = modules.filter(m => m.courseId === course.id).sort((a, b) => a.order - b.order);
    const allCourseModuleIds = allCourseModules.map(m => m.id);
    const allCourseLessons = lessons.filter(l => allCourseModuleIds.includes(l.moduleId));

    // Create a globally sorted list of lessons for the entire course
    const sortedCourseLessons = allCourseModules.flatMap(mod =>
        allCourseLessons
            .filter(l => l.moduleId === mod.id)
            .sort((a, b) => a.order - b.order)
    );

    const lessonIndex = sortedCourseLessons.findIndex(l => l.id === lessonId);
    const nextLesson = lessonIndex !== -1 && lessonIndex < sortedCourseLessons.length - 1 ? sortedCourseLessons[lessonIndex + 1] : null;
    const prevLesson = lessonIndex > 0 ? sortedCourseLessons[lessonIndex - 1] : null;

    return { lesson, module, course, nextLesson, prevLesson, allCourseModules, allCourseLessons };
}
