export const heritageData = {
  city: [
    { name: "Shaniwar Wada Heritage Walk", location: "Pune", duration: "2-3 Hours", type: "city", price: 499, originalPrice: 799, nextDate: "20 Sept 2025", rating: 4.8, reviews: 120, image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09c" },
    { name: "Kasba Peth Walk",             location: "Pune", duration: "2 Hours",   type: "city", price: 399, originalPrice: 699, nextDate: "22 Sept 2025", rating: 4.7, reviews: 90,  image: "https://images.unsplash.com/photo-1581091215367-59ab6b2d6c2d" },
    { name: "Tulshibaug Market Walk",      location: "Pune", duration: "2 Hours",   type: "city", price: 399, originalPrice: 699, nextDate: "25 Sept 2025", rating: 4.6, reviews: 75,  image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1" },
  ],
  forts: [
    { name: "Sinhagad Fort Walk",  location: "Pune",     duration: "Half Day", type: "forts", price: 799, originalPrice: 1199, nextDate: "21 Sept 2025", rating: 4.9, reviews: 210, image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" },
    { name: "Purandar Fort Walk",  location: "Pune",     duration: "1 Day",    type: "forts", price: 999, originalPrice: 1399, nextDate: "28 Sept 2025", rating: 4.8, reviews: 150, image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429" },
    { name: "Lohagad Fort Walk",   location: "Lonavala", duration: "Half Day", type: "forts", price: 699, originalPrice: 999,  nextDate: "24 Sept 2025", rating: 4.7, reviews: 130, image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff" },
  ],
  temples: [
    { name: "Dagdusheth Ganpati Walk",   location: "Pune", duration: "2 Hours",   type: "temples", price: 299, originalPrice: 599, nextDate: "19 Sept 2025", rating: 4.9, reviews: 300, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5" },
    { name: "Parvati Hill Temple Walk",  location: "Pune", duration: "2-3 Hours", type: "temples", price: 399, originalPrice: 699, nextDate: "23 Sept 2025", rating: 4.8, reviews: 180, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
    { name: "Sarasbaug Walk",            location: "Pune", duration: "2 Hours",   type: "temples", price: 299, originalPrice: 599, nextDate: "26 Sept 2025", rating: 4.7, reviews: 140, image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" },
  ],
};

/* Flat array — used by admin panel */
export const heritageList = Object.values(heritageData).flat();
