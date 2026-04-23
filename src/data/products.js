/** Demo catalogue (fallback when API empty). */
export const PRODS = [
  { id: 1, name: "Sérum Éclat Vitamine C", price: 3200, old: 4000, cat: "Soins du visage", r: 4.8, rev: 124, badge: "Bestseller", em: "\u2728", bg: "#F5EDE4", offer: true },
  { id: 2, name: "Huile Rose Précieuse", price: 2800, old: null, cat: "Huiles & Soins", r: 4.9, rev: 89, badge: "Nouveau", em: "\u{1F339}", bg: "#FAE8E8", offer: false },
  { id: 3, name: "Crème Hydratante Luxe", price: 2400, old: 2900, cat: "Soins du visage", r: 4.7, rev: 203, badge: null, em: "\u{1F4A7}", bg: "#E8F0F5", offer: true },
  { id: 4, name: "Masque Argile Purifiant", price: 1800, old: null, cat: "Masques", r: 4.6, rev: 156, badge: "Populaire", em: "\u{1F33F}", bg: "#E8F0E8", offer: false },
  { id: 5, name: "Contour des Yeux Or", price: 3600, old: 4500, cat: "Soins du visage", r: 4.9, rev: 67, badge: "Premium", em: "\u2B50", bg: "#F5EDD8", offer: true },
  { id: 6, name: "Lotion Tonique Florale", price: 1600, old: null, cat: "Soins essentiels", r: 4.5, rev: 312, badge: null, em: "\u{1F338}", bg: "#F5E0EE", offer: false },
  { id: 7, name: "Baume Lèvres Miel", price: 950, old: null, cat: "Soins lèvres", r: 4.8, rev: 445, badge: "Coup de Cœur", em: "\u{1F36F}", bg: "#F5EDD8", offer: true },
  { id: 8, name: "Brume Fixante Nacre", price: 1400, old: 1700, cat: "Soins essentiels", r: 4.6, rev: 178, badge: null, em: "\u{1F48E}", bg: "#E8E8F5", offer: false },
  { id: 9, name: "Gommage Sucre Rose", price: 2100, old: null, cat: "Masques", r: 4.7, rev: 93, badge: "Nouveau", em: "\u{1F337}", bg: "#FAE8EE", offer: false },
  { id: 10, name: "Crème Corps Karité", price: 2600, old: 3200, cat: "Corps", r: 4.8, rev: 231, badge: null, em: "\u{1FAE7}", bg: "#F0EBE8", offer: true },
  { id: 11, name: "Huile Sèche Argan", price: 3100, old: null, cat: "Huiles & Soins", r: 4.9, rev: 167, badge: "Premium", em: "\u{1F33E}", bg: "#F5EDD8", offer: false },
  { id: 12, name: "Gel Nettoyant Douceur", price: 1500, old: 1900, cat: "Soins essentiels", r: 4.5, rev: 289, badge: null, em: "\u{1F9F4}", bg: "#E8F5EE", offer: true },
];

/** @deprecated Use SIDEBAR_FILTER_OPTIONS in utils/productFilters.js for shop filters */
export const CATS = ["Tous", "Skincare", "Makeup", "Hair Care", "Hair Color", "Fragrance", "Soins", "Soldes"];

export const MOCK_ORDERS = [
  { id: "#BB-1042", cust: "Amira Benali", date: "02 Avr 2026", items: 3, total: 8400, status: "delivered", w: "Alger" },
  { id: "#BB-1041", cust: "Sarah Khelifi", date: "02 Avr 2026", items: 1, total: 3200, status: "shipped", w: "Oran" },
  { id: "#BB-1040", cust: "Nadia Meziane", date: "01 Avr 2026", items: 2, total: 5600, status: "pending", w: "Constantine" },
  { id: "#BB-1039", cust: "Lina Hamdani", date: "01 Avr 2026", items: 4, total: 10200, status: "delivered", w: "Blida" },
  { id: "#BB-1038", cust: "Fatima Larabi", date: "31 Mar 2026", items: 1, total: 2800, status: "shipped", w: "Tizi Ouzou" },
  { id: "#BB-1037", cust: "Yasmine Ouali", date: "30 Mar 2026", items: 2, total: 4200, status: "cancelled", w: "Sétif" },
];

export const MOCK_USERS = [
  { id: 1, name: "Amira Benali", email: "amira@ex.com", orders: 8, joined: "Jan 2025", spent: 24600 },
  { id: 2, name: "Sarah Khelifi", email: "sarah@ex.com", orders: 3, joined: "Fév 2025", spent: 9200 },
  { id: 3, name: "Nadia Meziane", email: "nadia@ex.com", orders: 5, joined: "Mar 2025", spent: 14800 },
  { id: 4, name: "Lina Hamdani", email: "lina@ex.com", orders: 12, joined: "Déc 2024", spent: 38400 },
  { id: 5, name: "Fatima Larabi", email: "fatima@ex.com", orders: 2, joined: "Avr 2025", spent: 5600 },
];

export const LANGS = {
  fr: {
    delivery: "Livraison gratuite à partir de 3 500 DA — 24H Alger • 48-72H autres wilayas",
    cartBtn: "Mon panier",
    signIn: "Se connecter / S'inscrire",
    reorder: "Acheter à nouveau",
    addCart: "AJOUTER AU PANIER",
    addedToCart: "Ajouté !",
    viewAll: "Voir tout",
    filter: "Filtrer",
    sortBy: "Trier par :",
    cats: "Catégories",
    price: "Prix",
    rating: "Note",
    onSale: "En Vente",
    da: "DA",
    cartTitle: "Mon Panier",
    cartEmpty: "Votre panier est vide",
    total: "Total",
    checkout: "Passer la commande",
    cod: "Paiement à la livraison uniquement",
    codSub: "Payez en main propre à la livraison — COD",
    heroTitle: "Votre beauté,\nnotre expertise.",
    heroSub: "Système Protection et Brillance — formulé en Algérie.",
    shopNow: "Magasinez",
    new_: "Nouveau",
    trending: "Tendance",
    dashboard: "Tableau de Bord",
    offer: "Offre Badee™ :",
    wishlistBtn: "Favoris",
    wishlistTitle: "Mes favoris",
    wishlistEmpty: "Vous n'avez pas encore ajouté de produits. Cliquez sur le cœur sur une carte pour les retrouver ici.",
    youMightLike: "Vous aimerez aussi",
    youMightLikeSub: "D’autres articles de la boutique, en priorité dans la même catégorie.",
    browseShop: "Parcourir la boutique",
    noSuggestionsYet: "Explorez la boutique pour découvrir nos autres soins.",
    productOptionLabel: "Teinte / couleur",
    pickProductOption: "Choisir une option",
    optionRequiredHint: "Veuillez sélectionner une option avant d’ajouter au panier.",
    packBadge: "Pack",
    packContents: "Contenu du pack",
    packColName: "Nom",
    packColVolume: "Volume",
    packColType: "Type",
  },
};
