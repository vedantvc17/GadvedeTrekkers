export const toursData = {
  himachal: [
    { name: "Manali Kullu Kasol",           duration: "5-6 Days", price: 9999,  originalPrice: 12999, nextDate: "5 Oct 2025",  image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" },
    { name: "Manali Kasol Kheerganga",      duration: "6 Days",   price: 10999, originalPrice: 13999, nextDate: "10 Oct 2025", image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff" },
    { name: "Manali Kasol Jibhi",           duration: "6 Days",   price: 11499, originalPrice: 14999, nextDate: "15 Oct 2025", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429" },
    { name: "Spiti Circuit",                duration: "8-10 Days",price: 18999, originalPrice: 22999, nextDate: "20 Oct 2025", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
    { name: "Winter Spiti Valley",          duration: "9 Days",   price: 19999, originalPrice: 24999, nextDate: "10 Jan 2026", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5" },
  ],
  kashmir: [
    { name: "Kashmir Srinagar Gulmarg Sonamarg", duration: "5 Days", price: 14999, originalPrice: 18999, nextDate: "12 Oct 2025", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
    { name: "Pahalgam",                     duration: "4 Days",   price: 9999,  originalPrice: 12999, nextDate: "18 Oct 2025", image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff" },
    { name: "Leh Nubra Pangong Leh",        duration: "6 Days",   price: 16999, originalPrice: 20999, nextDate: "25 Oct 2025", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" },
  ],
  northeast: [
    { name: "Meghalaya",                    duration: "5 Days",   price: 13999, originalPrice: 17999, nextDate: "5 Oct 2025",  image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429" },
    { name: "Kaziranga",                    duration: "4 Days",   price: 11999, originalPrice: 14999, nextDate: "8 Oct 2025",  image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff" },
    { name: "Sikkim Gangtok",               duration: "5 Days",   price: 14499, originalPrice: 17999, nextDate: "12 Oct 2025", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" },
  ],
  rajasthan: [
    { name: "Jodhpur Jaisalmer Udaipur",    duration: "6 Days",   price: 15999, originalPrice: 19999, nextDate: "15 Oct 2025", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
    { name: "Jaipur Jaisalmer Jodhpur",     duration: "5 Days",   price: 13999, originalPrice: 17999, nextDate: "18 Oct 2025", image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff" },
  ],
  southindia: [
    { name: "Munnar Thekkady Alleppey",     duration: "5 Days",   price: 14999, originalPrice: 18999, nextDate: "10 Oct 2025", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429" },
    { name: "Kerala with Kanyakumari",      duration: "6 Days",   price: 17999, originalPrice: 21999, nextDate: "14 Oct 2025", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" },
    { name: "Goa Backpacking",              duration: "4 Days",   price: 8999,  originalPrice: 11999, nextDate: "20 Oct 2025", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
  ],
  uttarakhand: [
    { name: "Kedarnath Yatra",              duration: "5 Days",   price: 11999, originalPrice: 14999, nextDate: "18 Oct 2025", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5" },
    { name: "Char Dham Yatra",              duration: "10 Days",  price: 24999, originalPrice: 29999, nextDate: "25 Oct 2025", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" },
  ],
};

/* Flat array with region field — used by admin panel */
export const toursList = Object.entries(toursData).flatMap(([region, tours]) =>
  tours.map((t) => ({ ...t, region }))
);
