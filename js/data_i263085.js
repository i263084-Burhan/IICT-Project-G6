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
      title: "Noir Oud",
      subtitle: "Eau de Parfum",
      category: "Woody & Oud",
      familyTags: "Woody • Amber • Spicy",
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
      title: "Velvet Rose",
      subtitle: "Eau de Parfum",
      category: "Floral & Musk",
      familyTags: "Floral • Powdery • Musky",
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
      title: "Amber Solstice",
      subtitle: "Eau de Parfum",
      category: "Amber & Spice",
      familyTags: "Amber • Gourmand • Resin",
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
      title: "Neroli Blanc",
      subtitle: "Eau de Parfum",
      category: "Floral & Musk",
      familyTags: "Citrus • White Floral • Clean",
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
      title: "Santal Fumée",
      subtitle: "Eau de Parfum",
      category: "Woody & Oud",
      familyTags: "Woody • Smoky • Earthy",
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

  global.NN_CONFIG = {
    FREE_SHIPPING_THRESHOLD: FREE_SHIPPING_THRESHOLD,
    CURRENCY_SYMBOL: CURRENCY_SYMBOL,
    MAX_STOCK_PER_ITEM: MAX_STOCK_PER_ITEM
  };
  global.NN_PRODUCTS = PRODUCTS;
  global.NN_BLOG_POSTS = BLOG_POSTS;
})(window);
