/**
 * Notes & Noir Fragrances — Product & Editorial Data (data_i263085.js)
 * Roll Number: i263085
 */
(function (global) {
  "use strict";

  const FREE_SHIPPING_THRESHOLD = 75;
  const CURRENCY_SYMBOL = "$";
  const MAX_STOCK_PER_ITEM = 10;

  const PRODUCTS = [
    {
      id: "noir-oud",
      name: "Noir Oud",
      title: "Noir Oud",
      subtitle: "Eau de Parfum",
      category: "Woody & Oud",
      family: "Woody",
      familyTags: "Woody • Amber • Spicy",
      occasion: ["evening", "cozy", "formal"],
      price: 45,
      pricePKR: "Rs. 8,500",
      image: "images/noir-oud-main.svg",
      description:
        "A bold and luxurious fragrance for those who seek elegance in every detail.",
      shortDescription:
        "A bold and luxurious fragrance for those who seek elegance in every detail.",
      editorialDescription:
        "Noir Oud is a sophisticated blend of rich woods, warm amber and spicy notes, crafted for those who seek elegance and lasting impression.",
      editorialTagline: "TIMELESS. BOLD. YOU.",
      concentration: "24% Extrait de Parfum",
      longevity: "10–12 Hours",
      sillage: "Intimate to Enveloping",
      stockLimit: 10,
      variants: [
        { size: "50 ml", price: 45 },
        { size: "100 ml", price: 72 }
      ],
      gallery: [
        {
          src: "images/noir-oud-main.svg",
          alt: "Noir Oud 50 ml dark obsidian glass perfume bottle resting on a travertine stone plinth",
          label: "Main bottle on stone"
        },
        {
          src: "images/noir-oud-cap.svg",
          alt: "Macro closeup of the brushed gold cap and engraved collar of Noir Oud",
          label: "Gold cap closeup"
        },
        {
          src: "images/noir-oud-box.svg",
          alt: "Textured obsidian linen presentation box with gold foil Notes & Noir emblem",
          label: "Textured box packaging"
        },
        {
          src: "images/noir-oud-lily.svg",
          alt: "Botanical macro of a white lily blossom symbolizing the floral heart of the collection",
          label: "White lily macro"
        }
      ],
      notes: {
        top: ["Cardamom", "Saffron"],
        heart: ["Agarwood (Oud)", "Damask Rose"],
        base: ["Warm Amber", "Sandalwood"]
      },
      reviews: [
        {
          id: "rev-noir-1",
          author: "Zainab Tariq",
          rating: 5,
          date: "2026-10-18",
          comment:
            "The saffron opening settles smoothly into velvety oud and warm amber. Easily lasts all evening without feeling overpowering."
        },
        {
          id: "rev-noir-2",
          author: "Hamza Siddiqui",
          rating: 5,
          date: "2026-11-04",
          comment:
            "Wore the 100 ml bottle to a formal dinner and received three compliments within an hour. The packaging feels truly bespoke."
        }
      ]
    },
    {
      id: "velvet-rose",
      name: "Velvet Rose",
      title: "Velvet Rose",
      subtitle: "Eau de Parfum",
      category: "Floral & Musk",
      family: "Floral",
      familyTags: "Floral • Powdery • Musky",
      occasion: ["evening", "cozy", "daily"],
      price: 39,
      pricePKR: "Rs. 7,500",
      image: "images/velvet-rose-main.svg",
      description:
        "Velvety crimson petals layered over cashmere woods and soft white musk.",
      shortDescription:
        "Velvety crimson petals layered over cashmere woods and soft white musk.",
      editorialDescription:
        "Velvet Rose pairs hand-harvested Damascus rose with pink peppercorn and airy white musk for a romantic, modern signature.",
      editorialTagline: "SOFT. RADIANT. POETIC.",
      concentration: "20% Eau de Parfum",
      longevity: "8–10 Hours",
      sillage: "Moderate",
      stockLimit: 10,
      variants: [
        { size: "50 ml", price: 39 },
        { size: "100 ml", price: 66 }
      ],
      gallery: [
        {
          src: "images/velvet-rose-main.svg",
          alt: "Velvet Rose burgundy glass flacon with dark cap",
          label: "Velvet Rose bottle"
        },
        {
          src: "images/noir-oud-lily.svg",
          alt: "Delicate botanical petal macro for Velvet Rose",
          label: "Botanical macro"
        },
        {
          src: "images/noir-oud-box.svg",
          alt: "Notes & Noir luxury presentation box",
          label: "Gift box"
        },
        {
          src: "images/noir-oud-cap.svg",
          alt: "Engraved gold collar detail",
          label: "Cap detail"
        }
      ],
      notes: {
        top: ["Pink Pepper", "Bergamot"],
        heart: ["Damascus Rose", "Peony"],
        base: ["Cashmere Wood", "White Musk"]
      },
      reviews: [
        {
          id: "rev-vr-1",
          author: "Ayesha Malik",
          rating: 5,
          date: "2026-10-29",
          comment:
            "Not a dated rose at all—fresh, powdery, and deeply comforting on knitwear."
        }
      ]
    },
    {
      id: "amber-solstice",
      name: "Amber Solstice",
      title: "Amber Solstice",
      subtitle: "Eau de Parfum",
      category: "Amber & Spice",
      family: "Sweet",
      familyTags: "Amber • Gourmand • Resin",
      occasion: ["cozy", "evening", "daily"],
      price: 42,
      pricePKR: "Rs. 8,000",
      image: "images/amber-solstice-main.svg",
      description:
        "Golden benzoin resin, roasted vanilla bean, and spiced labdanum warmth.",
      shortDescription:
        "Golden benzoin resin, roasted vanilla bean, and spiced labdanum warmth.",
      editorialDescription:
        "Amber Solstice captures twilight glow in a bottle—golden resinous warmth tempered by bitter orange peel and smoked cedar.",
      editorialTagline: "WARM. GOLDEN. LUMINOUS.",
      concentration: "22% Eau de Parfum",
      longevity: "9–11 Hours",
      sillage: "Moderate to Strong",
      stockLimit: 10,
      variants: [
        { size: "50 ml", price: 42 },
        { size: "100 ml", price: 70 }
      ],
      gallery: [
        {
          src: "images/amber-solstice-main.svg",
          alt: "Amber Solstice warm amber glass bottle with obsidian cap",
          label: "Amber Solstice bottle"
        },
        {
          src: "images/noir-oud-cap.svg",
          alt: "Brushed gold atomizer collar detail",
          label: "Collar detail"
        },
        {
          src: "images/noir-oud-box.svg",
          alt: "Signature dark linen box",
          label: "Packaging"
        },
        {
          src: "images/noir-oud-lily.svg",
          alt: "Botanical studio composition",
          label: "Botanical study"
        }
      ],
      notes: {
        top: ["Bitter Orange", "Cinnamon Bark"],
        heart: ["Labdanum", "Tonka Bean"],
        base: ["Golden Amber", "Madagascar Vanilla"]
      },
      reviews: [
        {
          id: "rev-as-1",
          author: "Bilal Raza",
          rating: 4,
          date: "2026-11-12",
          comment:
            "Rich resinous vanilla without being overly sweet. Wonderful for winter evenings."
        }
      ]
    },
    {
      id: "neroli-blanc",
      name: "Neroli Blanc",
      title: "Neroli Blanc",
      subtitle: "Eau de Parfum",
      category: "Floral & Musk",
      family: "Fresh",
      familyTags: "Citrus • White Floral • Clean",
      occasion: ["daily", "outdoor"],
      price: 38,
      pricePKR: "Rs. 7,200",
      image: "images/neroli-blanc-main.svg",
      description:
        "Sun-drenched Mediterranean neroli, crisp petitgrain, and creamy cedar.",
      shortDescription:
        "Sun-drenched Mediterranean neroli, crisp petitgrain, and creamy cedar.",
      editorialDescription:
        "Neroli Blanc opens with sparkling Tunisian neroli and crushed citrus leaf before resting on serene white cedar and clean linen musk.",
      editorialTagline: "CRISP. SERENE. EFFORTLESS.",
      concentration: "18% Eau de Parfum",
      longevity: "7–9 Hours",
      sillage: "Airy & Fresh",
      stockLimit: 10,
      variants: [
        { size: "50 ml", price: 38 },
        { size: "100 ml", price: 64 }
      ],
      gallery: [
        {
          src: "images/neroli-blanc-main.svg",
          alt: "Neroli Blanc frosted ivory perfume bottle",
          label: "Neroli Blanc bottle"
        },
        {
          src: "images/noir-oud-lily.svg",
          alt: "White blossom macro study",
          label: "White blossom"
        },
        {
          src: "images/noir-oud-box.svg",
          alt: "Notes & Noir presentation box",
          label: "Presentation box"
        },
        {
          src: "images/noir-oud-cap.svg",
          alt: "Brushed gold neck detail",
          label: "Cap closeup"
        }
      ],
      notes: {
        top: ["Tunisian Neroli", "Amalfi Lemon"],
        heart: ["Orange Blossom", "White Lily"],
        base: ["White Cedar", "Clean Musk"]
      },
      reviews: [
        {
          id: "rev-nb-1",
          author: "Sana Javed",
          rating: 5,
          date: "2026-11-01",
          comment:
            "My daily daytime signature. Uplifting, polished, and remarkably long-lasting for a citrus floral."
        }
      ]
    },
    {
      id: "santal-fumee",
      name: "Santal Fumée",
      title: "Santal Fumée",
      subtitle: "Eau de Parfum",
      category: "Woody & Oud",
      family: "Woody",
      familyTags: "Woody • Smoky • Earthy",
      occasion: ["daily", "evening", "cozy", "outdoor"],
      price: 44,
      pricePKR: "Rs. 8,200",
      image: "images/santal-fumee-main.svg",
      description:
        "Creamy Mysore sandalwood warmed by dry papyrus, vetiver, and black tea.",
      shortDescription:
        "Creamy Mysore sandalwood warmed by dry papyrus, vetiver, and black tea.",
      editorialDescription:
        "Santal Fumée balances velvety sandalwood shavings with smoky black tea leaves and earthy vetiver root for quiet sophistication.",
      editorialTagline: "GROUNDED. SMOKY. REFINED.",
      concentration: "22% Eau de Parfum",
      longevity: "9–11 Hours",
      sillage: "Moderate",
      stockLimit: 10,
      variants: [
        { size: "50 ml", price: 44 },
        { size: "100 ml", price: 71 }
      ],
      gallery: [
        {
          src: "images/santal-fumee-main.svg",
          alt: "Santal Fumée smoked umber glass flacon",
          label: "Santal Fumée bottle"
        },
        {
          src: "images/noir-oud-cap.svg",
          alt: "Brushed gold cap detail",
          label: "Cap closeup"
        },
        {
          src: "images/noir-oud-box.svg",
          alt: "Luxury textured linen packaging",
          label: "Packaging"
        },
        {
          src: "images/noir-oud-main.svg",
          alt: "Atelier bottle lineup on stone plinth",
          label: "Atelier display"
        }
      ],
      notes: {
        top: ["Black Tea", "Violet Leaf"],
        heart: ["Papyrus", "Iris Root"],
        base: ["Mysore Sandalwood", "Haitian Vetiver"]
      },
      reviews: [
        {
          id: "rev-sf-1",
          author: "Omar Farooq",
          rating: 5,
          date: "2026-11-15",
          comment:
            "Dry, woody, and meditative. The black tea and sandalwood pairing feels architectural."
        }
      ]
    }
  ];

  const BLOG_POSTS = [
    {
      id: "art-of-maceration",
      title: "The Quiet Patience of Six-Week Maceration",
      category: "Craftsmanship",
      readTime: "4 min read",
      date: "November 14, 2026",
      excerpt:
        "Why rushing fine fragrance oils compromises depth—and how resting each batch in dark vessels lets agarwood and rose harmonize.",
      image: "images/about-atelier.svg"
    },
    {
      id: "layering-oud-and-florals",
      title: "A Guide to Layering Oud with Airy White Florals",
      category: "Scent Rituals",
      readTime: "5 min read",
      date: "October 28, 2026",
      excerpt:
        "Pair Noir Oud with Neroli Blanc on pulse points to create a luminous contrast between luminous citrus blossom and smoky resin.",
      image: "images/noir-oud-lily.svg"
    },
    {
      id: "storing-extrait-perfumes",
      title: "Preserving Top Notes: Light, Temperature & Glass",
      category: "Care Guide",
      readTime: "3 min read",
      date: "October 10, 2026",
      excerpt:
        "Simple habits—from keeping flacons inside their textured linen boxes to avoiding steamy shelves—that protect delicate saffron and bergamot.",
      image: "images/noir-oud-box.svg"
    }
  ];

  /* =========================================================================
     Scent Finder Quiz Data
     ========================================================================= */
  const QUIZ_QUESTIONS = [
    {
      id: "family",
      step: 1,
      question: "Which scent family do you enjoy?",
      options: [
        {
          value: "Floral",
          label: "Floral",
          image: "images/quiz-floral.svg",
          alt: "Pink roses in soft bloom — floral scent family",
          description: "Fresh roses, jasmine & soft petals"
        },
        {
          value: "Woody",
          label: "Woody",
          image: "images/quiz-woody.svg",
          alt: "Textured dark wood bark — woody scent family",
          description: "Oud, sandalwood & smoky woods"
        },
        {
          value: "Fresh",
          label: "Fresh",
          image: "images/quiz-fresh.svg",
          alt: "Vibrant green botanical leaves — fresh scent family",
          description: "Citrus, neroli & green herbs"
        },
        {
          value: "Sweet",
          label: "Sweet",
          image: "images/quiz-sweet.svg",
          alt: "Vanilla flower and vanilla beans — sweet scent family",
          description: "Vanilla, amber & golden resins"
        }
      ]
    },
    {
      id: "occasion",
      step: 2,
      question: "When do you plan to wear this fragrance?",
      options: [
        {
          value: "daily",
          label: "Daily & Office",
          image: "images/quiz-daily.svg",
          alt: "Bright minimalist office desk — everyday wear",
          description: "Light, fresh & professional"
        },
        {
          value: "evening",
          label: "Evening & Formal",
          image: "images/quiz-evening.svg",
          alt: "Candlelit elegant dinner table — evening wear",
          description: "Bold, luxurious & lasting"
        },
        {
          value: "outdoor",
          label: "Warm & Sunny Days",
          image: "images/quiz-outdoor.svg",
          alt: "Sunlit garden with warm golden light — outdoor wear",
          description: "Airy, vibrant & uplifting"
        },
        {
          value: "cozy",
          label: "Cozy Nights",
          image: "images/quiz-cozy.svg",
          alt: "Warm blanket and candle glow — intimate evenings",
          description: "Warm, comforting & intimate"
        }
      ]
    }
  ];

  /* =========================================================================
     Scent Finder Match Matrix
     Maps [family][occasion] → product id + score
     ========================================================================= */
  const SCENT_MATCH_MATRIX = {
    Floral: {
      daily:   { primaryId: "neroli-blanc",   score: 96, runnerId: "velvet-rose",    runnerScore: 82 },
      evening: { primaryId: "velvet-rose",    score: 94, runnerId: "neroli-blanc",   runnerScore: 78 },
      outdoor: { primaryId: "neroli-blanc",   score: 92, runnerId: "velvet-rose",    runnerScore: 80 },
      cozy:    { primaryId: "velvet-rose",    score: 90, runnerId: "amber-solstice", runnerScore: 76 }
    },
    Woody: {
      daily:   { primaryId: "santal-fumee",   score: 94, runnerId: "noir-oud",       runnerScore: 80 },
      evening: { primaryId: "noir-oud",       score: 97, runnerId: "santal-fumee",   runnerScore: 84 },
      outdoor: { primaryId: "santal-fumee",   score: 88, runnerId: "noir-oud",       runnerScore: 74 },
      cozy:    { primaryId: "noir-oud",       score: 93, runnerId: "santal-fumee",   runnerScore: 85 }
    },
    Fresh: {
      daily:   { primaryId: "neroli-blanc",   score: 97, runnerId: "velvet-rose",    runnerScore: 76 },
      evening: { primaryId: "neroli-blanc",   score: 86, runnerId: "santal-fumee",   runnerScore: 72 },
      outdoor: { primaryId: "neroli-blanc",   score: 98, runnerId: "velvet-rose",    runnerScore: 79 },
      cozy:    { primaryId: "santal-fumee",   score: 85, runnerId: "neroli-blanc",   runnerScore: 77 }
    },
    Sweet: {
      daily:   { primaryId: "amber-solstice", score: 91, runnerId: "velvet-rose",    runnerScore: 78 },
      evening: { primaryId: "amber-solstice", score: 96, runnerId: "noir-oud",       runnerScore: 82 },
      outdoor: { primaryId: "velvet-rose",    score: 87, runnerId: "amber-solstice", runnerScore: 80 },
      cozy:    { primaryId: "amber-solstice", score: 98, runnerId: "noir-oud",       runnerScore: 83 }
    }
  };

  /* Match reason templates */
  const MATCH_REASONS = {
    "neroli-blanc-daily":   "Neroli Blanc's crisp citrus neroli and clean linen musk make it your ideal daily companion — fresh, polished, and effortlessly professional.",
    "neroli-blanc-evening": "Neroli Blanc's white florals and serene cedar lend a sophisticated airiness that elevates any evening occasion.",
    "neroli-blanc-outdoor": "Sun-drenched Tunisian neroli and sparkling Amalfi lemon are made for open skies and warm breezes.",
    "neroli-blanc-cozy":    "The creamy cedar and musk base of Neroli Blanc wrap you in quiet elegance on cool, intimate evenings.",
    "velvet-rose-daily":    "Velvet Rose's soft Damascus petals and clean white musk create a modern, polished signature for everyday moments.",
    "velvet-rose-evening":  "Velvety crimson rose over cashmere woods — a romantic, enveloping presence for evenings that deserve more.",
    "velvet-rose-outdoor":  "Pink peppercorn and bright bergamot lift Velvet Rose into a joyful, vivacious outdoor fragrance.",
    "velvet-rose-cozy":     "Velvet Rose's powdery musk and warm cashmere base are the perfect cozy night-in companion.",
    "noir-oud-daily":       "Noir Oud's dry-down sandalwood and amber make a surprisingly refined daily statement for confident wearers.",
    "noir-oud-evening":     "Rich agarwood, warm amber, and spicy saffron — Noir Oud is the definitive evening fragrance for bold elegance.",
    "noir-oud-outdoor":     "Noir Oud's woody depth provides grounding warmth even in outdoor settings with cooler air.",
    "noir-oud-cozy":        "Enveloping warm amber and velvety oud wrap you in luxurious comfort on quiet, cozy evenings.",
    "santal-fumee-daily":   "Santal Fumée's dry black tea and creamy sandalwood offer a refined, meditative aura for focused days.",
    "santal-fumee-evening": "Smoky papyrus and iris root give Santal Fumée a sophisticated, architectural presence for evening wear.",
    "santal-fumee-outdoor": "Earthy vetiver and sandalwood echo the natural world — a grounded fragrance for outdoor explorations.",
    "santal-fumee-cozy":    "Mysore sandalwood shavings and smoky vetiver create the ultimate cozy, contemplative evening scent.",
    "amber-solstice-daily": "Amber Solstice's golden benzoin and orange peel bring warmth and approachability to your daily routine.",
    "amber-solstice-evening": "Golden amber and smoked cedar create a luminous, enveloping presence that commands any formal occasion.",
    "amber-solstice-outdoor": "Bright cinnamon bark and bitter orange peel bring joyful warmth to sun-soaked outdoor adventures.",
    "amber-solstice-cozy":  "Roasted vanilla bean and labdanum resin — the ultimate comfort fragrance for wrapped-up winter nights."
  };

  global.NN_CONFIG = {
    FREE_SHIPPING_THRESHOLD: FREE_SHIPPING_THRESHOLD,
    CURRENCY_SYMBOL: CURRENCY_SYMBOL,
    MAX_STOCK_PER_ITEM: MAX_STOCK_PER_ITEM
  };
  global.NN_PRODUCTS = PRODUCTS;
  global.NN_BLOG_POSTS = BLOG_POSTS;
  global.NN_QUIZ_QUESTIONS = QUIZ_QUESTIONS;
  global.NN_SCENT_MATCH_MATRIX = SCENT_MATCH_MATRIX;
  global.NN_MATCH_REASONS = MATCH_REASONS;
})(window);
