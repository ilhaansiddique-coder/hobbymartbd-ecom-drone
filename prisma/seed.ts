import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  console.log("Seeding database...");

  // Hash the demo password at seed time so it can never drift from the plaintext.
  const adminPassword = await bcrypt.hash("admin123", 12);

  // Create categories
  const categoryData = [
    { name: "DJI", slug: "dji", description: "DJI drones and accessories - the world leader in consumer drones" },
    { name: "Professional Drone", slug: "professional-drone", description: "High-end professional drones for filmmakers and surveyors" },
    { name: "Beginner Drone", slug: "beginner-drone", description: "Affordable and easy-to-fly drones for beginners" },
    { name: "Drone Accessories", slug: "drone-accessories", description: "Batteries, chargers, propellers, and more" },
    { name: "Camera", slug: "camera", description: "Action cameras and photography equipment" },
  ];

  const categories = await Promise.all(
    categoryData.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  );

  console.log(`Created ${categories.length} categories`);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@droneplacebd.com" },
    update: { password: adminPassword, role: "ADMIN" },
    create: {
      name: "Admin",
      email: "admin@droneplacebd.com",
      role: "ADMIN",
      password: adminPassword,
    },
  });

  console.log(`Created admin user: ${admin.email}`);

  // Create staff user
  const staff = await prisma.user.upsert({
    where: { email: "staff@droneplacebd.com" },
    update: { password: adminPassword, role: "STAFF" },
    create: {
      name: "Staff",
      email: "staff@droneplacebd.com",
      role: "STAFF",
      password: adminPassword,
    },
  });

  console.log(`Created staff user: ${staff.email}`);

  // Create sample products
  const products = [
    {
      name: "DJI Mini 4 Pro Fly More Combo",
      slug: "dji-mini-4-pro-fly-more-combo",
      sku: "DJI-1001",
      description: "The DJI Mini 4 Pro is the ultimate mini drone for creators. Weighing under 249g, it features a 1/1.3-inch CMOS sensor with 4K/100fps video, omnidirectional obstacle sensing, and a 34-min max flight time. The Fly More Combo includes 3 batteries, charging hub, ND filters, and a carrying bag.",
      price: 120000,
      salePrice: 117990,
      stock: 10,
      images: [
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
        "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&q=80",
      ],
      specs: { Weight: "249g", "Flight Time": "34 min", "Video": "4K/100fps", "Sensor": "1/1.3-inch CMOS" },
      featured: true,
      categories: ["dji"],
    },
    {
      name: "DJI Air 3S Fly More Combo with RC 2",
      slug: "dji-air-3s-fly-more-combo-w-dji-rc-2",
      sku: "DJI-1002",
      description: "The DJI Air 3S features dual primary cameras with 1-inch CMOS sensor, 4K/120fps video, 46-min max flight time, and omnidirectional obstacle sensing. Includes RC 2 with built-in screen.",
      price: 180000,
      salePrice: 154990,
      stock: 5,
      images: [
        "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&q=80",
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
      ],
      specs: { "Flight Time": "46 min", "Video": "4K/120fps", "Sensor": "1-inch CMOS", "Obstacle Sensing": "Omnidirectional" },
      featured: true,
      categories: ["dji"],
    },
    {
      name: "DJI Avata 2 Fly Smart Combo",
      slug: "dji-avata-2-fly-smart-combo",
      sku: "DJI-1003",
      description: "The DJI Avata 2 is an immersive FPV drone with a 1/1.3-inch sensor, 4K/60fps video, and incredible agility. The Fly Smart Combo includes 3 batteries and the Goggles 3.",
      price: 124000,
      salePrice: 85000,
      stock: 3,
      images: [
        "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&q=80",
        "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&q=80",
      ],
      specs: { "Flight Time": "23 min", "Video": "4K/60fps", "Sensor": "1/1.3-inch CMOS", Type: "FPV" },
      featured: true,
      categories: ["dji"],
    },
    {
      name: "DJI Flip Standard DJI RC 2",
      slug: "dji-flip-standard-dji-rc-2",
      sku: "DJI-1004",
      description: "The DJI Flip is a compact folding drone perfect for travel. Features 4K video, 31-min flight time, and quick-launch design.",
      price: 75000,
      salePrice: 63990,
      stock: 8,
      images: [
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
        "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&q=80",
      ],
      specs: { "Flight Time": "31 min", "Video": "4K/30fps", "Foldable": "Yes", Weight: "300g" },
      featured: true,
      categories: ["dji"],
    },
    {
      name: "D12 4K Camera Professional Drone",
      slug: "d12-4k-camera-professional-drone",
      sku: "PRO-2001",
      description: "Professional-grade drone with 4K HD camera, GPS positioning, brushless motors, and intelligent flight modes. Perfect for aerial photography.",
      price: 52000,
      salePrice: 44500,
      stock: 15,
      images: [
        "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&q=80",
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
      ],
      specs: { Camera: "4K HD", "Flight Time": "25 min", "Motor Type": "Brushless", GPS: "Yes" },
      featured: true,
      categories: ["professional-drone"],
    },
    {
      name: "M108 Plus New 2025",
      slug: "m108-plus-new-2025",
      sku: "PRO-2002",
      description: "The M108 Plus features a 3-axis gimbal, 4K camera, GPS auto-return, and 30-minute flight time. Includes carrying case and extra batteries.",
      price: 36000,
      salePrice: 29500,
      stock: 12,
      images: [
        "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&q=80",
        "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&q=80",
      ],
      specs: { Camera: "4K", "Flight Time": "30 min", Gimbal: "3-Axis", "Auto Return": "Yes" },
      featured: false,
      categories: ["professional-drone"],
    },
    {
      name: "E88 Max Brushless HD Camera Drone",
      slug: "e88-max-brushless-hd-camera-drone",
      sku: "BEG-3001",
      description: "Perfect starter drone with brushless motors, HD camera, altitude hold, and one-key takeoff/landing. Great for beginners!",
      price: 4000,
      salePrice: 3700,
      stock: 50,
      images: [
        "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&q=80",
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
      ],
      specs: { Camera: "HD", "Flight Time": "15 min", "Motor Type": "Brushless", "Altitude Hold": "Yes" },
      featured: false,
      categories: ["beginner-drone"],
    },
    {
      name: "A21 Pro Gaming Version",
      slug: "a21-pro-gaming-version",
      sku: "BEG-3002",
      description: "Feature-packed beginner drone with HD dual cameras, VR compatibility, foldable design, and trajectory flight mode.",
      price: 8500,
      salePrice: 5990,
      stock: 25,
      images: [
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
        "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&q=80",
      ],
      specs: { Camera: "HD Dual", "Flight Time": "12 min", "VR Compatible": "Yes", Foldable: "Yes" },
      featured: false,
      categories: ["beginner-drone"],
    },
    {
      name: "DJI 100W USB-C Power Adapter",
      slug: "dji-100w-usb-c-power-adapter",
      sku: "ACC-4001",
      description: "Official DJI 100W USB-C fast charger. Compatible with DJI Mini 4 Pro, Air 3S, and other USB-C devices.",
      price: 15000,
      salePrice: 9000,
      stock: 20,
      images: [
        "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&q=80",
      ],
      specs: { "Power Output": "100W", Type: "USB-C", Brand: "DJI", Compatible: "Mini 4 Pro, Air 3S" },
      featured: false,
      categories: ["drone-accessories"],
    },
    {
      name: "DJI 65W Portable Charger",
      slug: "dji-65w-portable-charger",
      sku: "ACC-4002",
      description: "Compact 65W portable charger for your DJI drone batteries. Lightweight and travel-friendly.",
      price: 6500,
      salePrice: 4500,
      stock: 30,
      images: [
        "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&q=80",
      ],
      specs: { "Power Output": "65W", Type: "Portable", Brand: "DJI", Weight: "200g" },
      featured: false,
      categories: ["drone-accessories"],
    },
  ];

  for (const product of products) {
    const { categories: catSlugs, ...productData } = product;
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        price: productData.price,
        salePrice: productData.salePrice,
        categories: {
          create: catSlugs.map((slug) => ({
            category: { connect: { slug } },
          })),
        },
      },
    });
  }

  console.log(`Created ${products.length} products`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
