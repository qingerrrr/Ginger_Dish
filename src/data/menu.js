import tomatoEgg from "../../Images/Food/tomato_egg.jpg";
import mapoTofu from "../../Images/Food/mapo_tofu.jpg";
import saltedPrawn from "../../Images/Food/salted_prawn.jpg";
import matchaLatte from "../../Images/Food/matcha_latte.jpg";

export const categories = [
  { id: "all", label: "All", icon: "cloche" },
  { id: "meat", label: "Meat", icon: "bowl" },
  { id: "vegetables", label: "Vegetables", icon: "leaf" },
  { id: "drinks", label: "Drinks", icon: "drink" },
  { id: "desserts", label: "Desserts", icon: "cupcake" },
  { id: "halal", label: "Halal", icon: "halal" },
];

export const menuItems = [
  {
    id: "tomato-scrambled-eggs",
    name: "Tomato Scrambled Eggs",
    description: "Soft scrambled eggs with juicy tomatoes.",
    category: "vegetables",
    image: tomatoEgg,
    halal: false,
  },
  {
    id: "mapo-tofu",
    name: "Mapo Tofu",
    description: "Spicy tofu with minced meat in a savoury sauce.",
    category: "meat",
    image: mapoTofu,
    halal: true,
  },
  {
    id: "salted-prawn",
    name: "Salted Egg Prawns",
    description: "Juicy prawns tossed in a rich salted egg sauce.",
    category: "meat",
    image: saltedPrawn,
    halal: true,
  },
  {
    id: "matcha-latte",
    name: "Iced Matcha Latte",
    description: "Smooth matcha layered with fresh, creamy milk.",
    category: "drinks",
    image: matchaLatte,
    halal: false,
  },
];
