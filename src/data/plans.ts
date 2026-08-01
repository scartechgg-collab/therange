export interface Plan {
  id: string;
  name: string;
  category: 'minecraft' | 'discord' | 'vps';
  subCategory?: string;
  ram: string;
  storage: string;
  cpu: string;
  location?: string;
  ddos: string;
  price: {
    INR: number;
    USD: number;
  };
  popular?: boolean;
}

export const minecraftPlans: Plan[] = [
  { id: 'mc-starter', name: 'STARTER', category: 'minecraft', ram: '2GB RAM', storage: '25GB NVMe SSD', cpu: '100%', location: 'India Location', ddos: 'DDoS Protection Included', price: { INR: 160, USD: 1.99 } },
  { id: 'mc-basic', name: 'BASIC', category: 'minecraft', ram: '4GB RAM', storage: '50GB NVMe SSD', cpu: '150%', location: 'India Location', ddos: 'DDoS Protection Included', price: { INR: 320, USD: 3.99 }, popular: true },
  { id: 'mc-pro', name: 'PRO', category: 'minecraft', ram: '6GB RAM', storage: '75GB NVMe SSD', cpu: '200%', location: 'India Location', ddos: 'DDoS Protection Included', price: { INR: 480, USD: 5.99 } },
  { id: 'mc-advanced', name: 'ADVANCED', category: 'minecraft', ram: '8GB RAM', storage: '100GB NVMe SSD', cpu: '250%', location: 'India Location', ddos: 'DDoS Protection Included', price: { INR: 640, USD: 7.99 } },
  { id: 'mc-elite', name: 'ELITE', category: 'minecraft', ram: '10GB RAM', storage: '125GB NVMe SSD', cpu: '300%', location: 'India Location', ddos: 'DDoS Protection Included', price: { INR: 800, USD: 9.99 } },
  { id: 'mc-titan', name: 'TITAN', category: 'minecraft', ram: '12GB RAM', storage: '150GB NVMe SSD', cpu: '350%', location: 'India Location', ddos: 'DDoS Protection Included', price: { INR: 960, USD: 11.99 } },
  { id: 'mc-supreme', name: 'SUPREME', category: 'minecraft', ram: '14GB RAM', storage: '175GB NVMe SSD', cpu: '400%', location: 'India Location', ddos: 'DDoS Protection Included', price: { INR: 1120, USD: 13.99 } },
  { id: 'mc-beast', name: 'BEAST', category: 'minecraft', ram: '16GB RAM', storage: '200GB NVMe SSD', cpu: '450%', location: 'India Location', ddos: 'DDoS Protection Included', price: { INR: 1280, USD: 15.99 }, popular: true },
  { id: 'mc-enterprise', name: 'ENTERPRISE', category: 'minecraft', ram: '24GB RAM', storage: '300GB NVMe SSD', cpu: '600%', location: 'India Location', ddos: 'DDoS Protection Included', price: { INR: 1920, USD: 23.99 } },
  { id: 'mc-ultra', name: 'ULTRA ENTERPRISE', category: 'minecraft', ram: '32GB RAM', storage: '400GB NVMe SSD', cpu: '800%', location: 'India Location', ddos: 'DDoS Protection Included', price: { INR: 2560, USD: 31.99 } },
  { id: 'mc-infinity', name: 'INFINITY', category: 'minecraft', ram: '48GB RAM', storage: '600GB NVMe SSD', cpu: '1200%', location: 'India Location', ddos: 'DDoS Protection Included', price: { INR: 3840, USD: 47.99 } },
];

export const discordPlans: Plan[] = [
  { id: 'bot-starter', name: 'BOT STARTER', category: 'discord', ram: '512MB RAM', storage: '5GB NVMe SSD', cpu: '50%', ddos: 'DDoS Protection Included', price: { INR: 49, USD: 0.59 } },
  { id: 'bot-basic', name: 'BOT BASIC', category: 'discord', ram: '1GB RAM', storage: '10GB NVMe SSD', cpu: '100%', ddos: 'DDoS Protection Included', price: { INR: 99, USD: 1.19 }, popular: true },
  { id: 'bot-pro', name: 'BOT PRO', category: 'discord', ram: '2GB RAM', storage: '20GB NVMe SSD', cpu: '150%', ddos: 'DDoS Protection Included', price: { INR: 199, USD: 2.39 } },
  { id: 'bot-advanced', name: 'BOT ADVANCED', category: 'discord', ram: '4GB RAM', storage: '40GB NVMe SSD', cpu: '200%', ddos: 'DDoS Protection Included', price: { INR: 299, USD: 3.59 } },
  { id: 'bot-elite', name: 'BOT ELITE', category: 'discord', ram: '8GB RAM', storage: '80GB NVMe SSD', cpu: '300%', ddos: 'DDoS Protection Included', price: { INR: 499, USD: 5.99 } },
];

export const vpsPlans: Plan[] = [
  // AMD EPYC VPS
  { id: 'vps-epyc-8g', name: 'VPS 8GB', category: 'vps', subCategory: 'AMD EPYC VPS', ram: '8GB RAM', storage: '80GB NVMe SSD', cpu: '2 vCPU', ddos: 'DDoS Protection Included', price: { INR: 899, USD: 10.99 } },
  { id: 'vps-epyc-16g', name: 'VPS 16GB', category: 'vps', subCategory: 'AMD EPYC VPS', ram: '16GB RAM', storage: '160GB NVMe SSD', cpu: '4 vCPU', ddos: 'DDoS Protection Included', price: { INR: 1499, USD: 17.99 }, popular: true },
  { id: 'vps-epyc-32g', name: 'VPS 32GB', category: 'vps', subCategory: 'AMD EPYC VPS', ram: '32GB RAM', storage: '320GB NVMe SSD', cpu: '6 vCPU', ddos: 'DDoS Protection Included', price: { INR: 2699, USD: 31.99 } },
  { id: 'vps-epyc-64g', name: 'VPS 64GB', category: 'vps', subCategory: 'AMD EPYC VPS', ram: '64GB RAM', storage: '640GB NVMe SSD', cpu: '8 vCPU', ddos: 'DDoS Protection Included', price: { INR: 5199, USD: 62.99 } },

  // RYZEN 7 7700X VPS
  { id: 'vps-ryzen7-8g', name: 'VPS 8GB', category: 'vps', subCategory: 'RYZEN 7 7700X VPS', ram: '8GB RAM', storage: '80GB NVMe SSD', cpu: '2 vCPU', ddos: 'DDoS Protection Included', price: { INR: 1199, USD: 14.49 } },
  { id: 'vps-ryzen7-16g', name: 'VPS 16GB', category: 'vps', subCategory: 'RYZEN 7 7700X VPS', ram: '16GB RAM', storage: '160GB NVMe SSD', cpu: '4 vCPU', ddos: 'DDoS Protection Included', price: { INR: 2099, USD: 24.99 }, popular: true },
  { id: 'vps-ryzen7-32g', name: 'VPS 32GB', category: 'vps', subCategory: 'RYZEN 7 7700X VPS', ram: '32GB RAM', storage: '320GB NVMe SSD', cpu: '6 vCPU', ddos: 'DDoS Protection Included', price: { INR: 3999, USD: 47.99 } },
  { id: 'vps-ryzen7-64g', name: 'VPS 64GB', category: 'vps', subCategory: 'RYZEN 7 7700X VPS', ram: '64GB RAM', storage: '640GB NVMe SSD', cpu: '8 vCPU', ddos: 'DDoS Protection Included', price: { INR: 7799, USD: 92.99 } },

  // RYZEN 9 9950X VPS
  { id: 'vps-ryzen9-8g', name: 'VPS 8GB', category: 'vps', subCategory: 'RYZEN 9 9950X VPS', ram: '8GB RAM', storage: '100GB NVMe SSD', cpu: '2 vCPU', ddos: 'DDoS Protection Included', price: { INR: 1499, USD: 17.99 } },
  { id: 'vps-ryzen9-16g', name: 'VPS 16GB', category: 'vps', subCategory: 'RYZEN 9 9950X VPS', ram: '16GB RAM', storage: '200GB NVMe SSD', cpu: '4 vCPU', ddos: 'DDoS Protection Included', price: { INR: 2699, USD: 31.99 }, popular: true },
  { id: 'vps-ryzen9-32g', name: 'VPS 32GB', category: 'vps', subCategory: 'RYZEN 9 9950X VPS', ram: '32GB RAM', storage: '400GB NVMe SSD', cpu: '6 vCPU', ddos: 'DDoS Protection Included', price: { INR: 5199, USD: 62.99 } },
  { id: 'vps-ryzen9-64g', name: 'VPS 64GB', category: 'vps', subCategory: 'RYZEN 9 9950X VPS', ram: '64GB RAM', storage: '800GB NVMe SSD', cpu: '8 vCPU', ddos: 'DDoS Protection Included', price: { INR: 10199, USD: 122.99 } },
];

export const allPlans = [...minecraftPlans, ...discordPlans, ...vpsPlans];
