// EDIT THIS FILE to change contact details, packages, photos and films.
export const site = {
  brand: "Wedknox", tagline: "Photography",
  phone: "+91 8897963108", whatsapp: "918897963108",
  social: { instagram: "", youtube: "", facebook: "" }, // add links when you have them
  showreelVideo: "", // e.g. "/media/videos/showreel.mp4"
  photographerPhoto: "/media/photos/photographer.jpg",
};
export const packages = [
  { name: "Basic Package", price: "₹75,000" },
  { name: "Classic Package", price: "₹90,000", note: "Includes 2 Premium Albums" },
  { name: "Premium Package", price: "₹1,35,000" },
  { name: "Pre-Wedding Shoot", price: "₹35,000" },
  { name: "Car Delivery", price: "₹7,000" },
  { name: "Half Saree Shoot", price: "₹25,000", note: "Includes 20-Page Album" },
  { name: "Baby Bath Shoot", price: "₹15,000" },
];
// Which packages get the complimentary pre-wedding shoot? Put exact names here, e.g. ["Premium Package"].
export const complimentaryPreWeddingFor: string[] = [];
export const services = [
  ["Wedding Photography","Your ceremony and celebration, told frame by frame."],
  ["Pre-Wedding Photography","Relaxed, cinematic shoots before the big day."],
  ["Half Saree Photography","Traditional half saree portraits, styled and lit with care."],
  ["Baby Photography","Tiny moments, kept for good."],
  ["Events & Functions","Coverage for family and community occasions."],
  ["Cinematic Videography","Films with sound, motion and story."],
  ["Car Delivery Coverage","The moment the keys change hands."],
];
export const categories = ["Weddings","Muhurtam","Pre-Weddings","Half Saree","Baby Shoot"];
// Add real photos: put files in /public/media/photos and list them here.
export const photos: { src: string; cat: string; alt: string; w: number; h: number }[] = [
  {src:"/media/photos/wedding-01.jpg",cat:"Weddings",alt:"Weddings photograph 1",w:1066,h:1600},
  {src:"/media/photos/wedding-02.jpg",cat:"Weddings",alt:"Weddings photograph 2",w:1066,h:1600},
  {src:"/media/photos/wedding-03.jpg",cat:"Weddings",alt:"Weddings photograph 3",w:1066,h:1600},
  {src:"/media/photos/wedding-04.jpg",cat:"Weddings",alt:"Weddings photograph 4",w:1600,h:1066},
  {src:"/media/photos/wedding-05.jpg",cat:"Weddings",alt:"Weddings photograph 5",w:1066,h:1600},
  {src:"/media/photos/wedding-06.jpg",cat:"Weddings",alt:"Weddings photograph 6",w:1066,h:1600},
  {src:"/media/photos/wedding-07.jpg",cat:"Weddings",alt:"Weddings photograph 7",w:1600,h:1066},
  {src:"/media/photos/wedding-08.jpg",cat:"Weddings",alt:"Weddings photograph 8",w:1600,h:1066},
  {src:"/media/photos/wedding-09.jpg",cat:"Weddings",alt:"Weddings photograph 9",w:1600,h:1066},
  {src:"/media/photos/wedding-10.jpg",cat:"Weddings",alt:"Weddings photograph 10",w:1066,h:1600},
  {src:"/media/photos/wedding-11.jpg",cat:"Weddings",alt:"Weddings photograph 11",w:1600,h:1066},
  {src:"/media/photos/wedding-12.jpg",cat:"Weddings",alt:"Weddings photograph 12",w:1066,h:1600},
  {src:"/media/photos/wedding-13.jpg",cat:"Weddings",alt:"Weddings photograph 13",w:1066,h:1600},
  {src:"/media/photos/muhurtam-01.jpg",cat:"Muhurtam",alt:"Muhurtam photograph 1",w:1280,h:852},
  {src:"/media/photos/muhurtam-02.jpg",cat:"Muhurtam",alt:"Muhurtam photograph 2",w:852,h:1280},
  {src:"/media/photos/muhurtam-03.jpg",cat:"Muhurtam",alt:"Muhurtam photograph 3",w:852,h:1280},
  {src:"/media/photos/muhurtam-04.jpg",cat:"Muhurtam",alt:"Muhurtam photograph 4",w:852,h:1280},
  {src:"/media/photos/muhurtam-05.jpg",cat:"Muhurtam",alt:"Muhurtam photograph 5",w:852,h:1280},
  {src:"/media/photos/muhurtam-06.jpg",cat:"Muhurtam",alt:"Muhurtam photograph 6",w:1280,h:852},
  {src:"/media/photos/muhurtam-07.jpg",cat:"Muhurtam",alt:"Muhurtam photograph 7",w:854,h:1280},
  {src:"/media/photos/muhurtam-08.jpg",cat:"Muhurtam",alt:"Muhurtam photograph 8",w:1600,h:1065},
  {src:"/media/photos/muhurtam-09.jpg",cat:"Muhurtam",alt:"Muhurtam photograph 9",w:1600,h:1065},
  {src:"/media/photos/muhurtam-10.jpg",cat:"Muhurtam",alt:"Muhurtam photograph 10",w:1600,h:1065},
  {src:"/media/photos/pre-wedding-01.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 1",w:1066,h:1600},
  {src:"/media/photos/pre-wedding-02.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 2",w:1066,h:1600},
  {src:"/media/photos/pre-wedding-03.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 3",w:1066,h:1600},
  {src:"/media/photos/pre-wedding-04.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 4",w:1066,h:1600},
  {src:"/media/photos/pre-wedding-05.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 5",w:1066,h:1600},
  {src:"/media/photos/pre-wedding-06.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 6",w:1066,h:1600},
  {src:"/media/photos/pre-wedding-07.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 7",w:1600,h:1066},
  {src:"/media/photos/pre-wedding-08.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 8",w:1066,h:1600},
  {src:"/media/photos/pre-wedding-09.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 9",w:1066,h:1600},
  {src:"/media/photos/pre-wedding-10.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 10",w:1600,h:1066},
  {src:"/media/photos/pre-wedding-11.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 11",w:1066,h:1600},
  {src:"/media/photos/pre-wedding-12.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 12",w:1066,h:1600},
  {src:"/media/photos/pre-wedding-13.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 13",w:1066,h:1600},
  {src:"/media/photos/pre-wedding-14.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 14",w:1066,h:1600},
  {src:"/media/photos/pre-wedding-15.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 15",w:1066,h:1600},
  {src:"/media/photos/pre-wedding-16.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 16",w:854,h:1280},
  {src:"/media/photos/pre-wedding-17.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 17",w:1066,h:1600},
  {src:"/media/photos/pre-wedding-18.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 18",w:1066,h:1600},
  {src:"/media/photos/pre-wedding-19.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 19",w:1066,h:1600},
  {src:"/media/photos/pre-wedding-20.jpg",cat:"Pre-Weddings",alt:"Pre-Weddings photograph 20",w:1066,h:1600},
  {src:"/media/photos/half-saree-01.jpg",cat:"Half Saree",alt:"Half Saree photograph 1",w:1600,h:1066},
  {src:"/media/photos/half-saree-02.jpg",cat:"Half Saree",alt:"Half Saree photograph 2",w:1600,h:1066},
  {src:"/media/photos/half-saree-03.jpg",cat:"Half Saree",alt:"Half Saree photograph 3",w:1600,h:1066},
  {src:"/media/photos/half-saree-04.jpg",cat:"Half Saree",alt:"Half Saree photograph 4",w:1600,h:800},
  {src:"/media/photos/half-saree-05.jpg",cat:"Half Saree",alt:"Half Saree photograph 5",w:1600,h:1066},
  {src:"/media/photos/half-saree-06.jpg",cat:"Half Saree",alt:"Half Saree photograph 6",w:1280,h:1600},
  {src:"/media/photos/half-saree-07.jpg",cat:"Half Saree",alt:"Half Saree photograph 7",w:1280,h:1600},
  {src:"/media/photos/baby-01.jpg",cat:"Baby Shoot",alt:"Baby Shoot photograph 1",w:1280,h:961},
  {src:"/media/photos/baby-02.jpg",cat:"Baby Shoot",alt:"Baby Shoot photograph 2",w:961,h:1280},
  {src:"/media/photos/baby-03.jpg",cat:"Baby Shoot",alt:"Baby Shoot photograph 3",w:961,h:1280},
  {src:"/media/photos/baby-04.jpg",cat:"Baby Shoot",alt:"Baby Shoot photograph 4",w:961,h:1280},
  {src:"/media/photos/baby-05.jpg",cat:"Baby Shoot",alt:"Baby Shoot photograph 5",w:961,h:1280},
  {src:"/media/photos/baby-06.jpg",cat:"Baby Shoot",alt:"Baby Shoot photograph 6",w:1280,h:961},
  {src:"/media/photos/baby-07.jpg",cat:"Baby Shoot",alt:"Baby Shoot photograph 7",w:1280,h:961},
  {src:"/media/photos/baby-08.jpg",cat:"Baby Shoot",alt:"Baby Shoot photograph 8",w:1280,h:961},
  {src:"/media/photos/baby-09.jpg",cat:"Baby Shoot",alt:"Baby Shoot photograph 9",w:1280,h:961},
  {src:"/media/photos/baby-10.jpg",cat:"Baby Shoot",alt:"Baby Shoot photograph 10",w:1280,h:961},
  {src:"/media/photos/baby-11.jpg",cat:"Baby Shoot",alt:"Baby Shoot photograph 11",w:1280,h:961},
  {src:"/media/photos/baby-12.jpg",cat:"Baby Shoot",alt:"Baby Shoot photograph 12",w:1280,h:961},
  {src:"/media/photos/baby-13.jpg",cat:"Baby Shoot",alt:"Baby Shoot photograph 13",w:1280,h:961},
  {src:"/media/photos/baby-14.jpg",cat:"Baby Shoot",alt:"Baby Shoot photograph 14",w:1280,h:961},
  {src:"/media/photos/baby-15.jpg",cat:"Baby Shoot",alt:"Baby Shoot photograph 15",w:1280,h:961},
  {src:"/media/photos/baby-16.jpg",cat:"Baby Shoot",alt:"Baby Shoot photograph 16",w:1280,h:961},
  {src:"/media/photos/baby-17.jpg",cat:"Baby Shoot",alt:"Baby Shoot photograph 17",w:961,h:1280}
];
// Add real films: put files in /public/media/videos. Leave src empty for placeholder.
export const films: { title: string; src: string; poster: string }[] = [
  {title:"House Opening",src:"/media/videos/house-opening.mp4",poster:"/media/videos/house-opening.jpg"},
  {title:"Car Delivery",src:"/media/videos/car-delivery.mp4",poster:"/media/videos/car-delivery.jpg"}];
export const testimonials: { quote: string; name: string }[] = []; // add only real, authorised reviews
