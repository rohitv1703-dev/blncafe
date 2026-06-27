import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import heroImg from "@/assets/hero-coffee.jpg";
import coldCoffee from "@/assets/cold-coffee.jpg";
import pizzaImg from "@/assets/pizza.jpg";
import burgerImg from "@/assets/burger.jpg";
import shakeImg from "@/assets/shake.jpg";
import friesImg from "@/assets/fries.jpg";
import mocktailImg from "@/assets/mocktail.jpg";
import pastaImg from "@/assets/pasta.jpg";
import interior1 from "@/assets/interior1.png";
import interior2 from "@/assets/interior2.png";
import interior3 from "@/assets/interior3.png";
import sandwichImg from "@/assets/sandwich.png";
import {
  Coffee, ShoppingBag, Phone, MapPin, Clock, Instagram,
  Star, Plus, Minus, X, MessageCircle, Navigation as NavIcon, Search, Heart, Leaf
} from "lucide-react";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BLN Café — Crafted Coffee. Fresh Food. Perfect Moments." },
      { name: "description", content: "Premium café in Wanwadi, Pune. Order freshly brewed coffee, sandwiches, pizza, pasta & more online." },
    ],
  }),
  component: Home,
});

type Item = {
  id: string; name: string; desc: string; price: number;
  img: string; veg: boolean; tag?: string; cat: string;
};

const MENU: Item[] = [
  { id: "esp", cat: "Coffee", name: "Hot Coffee", desc: "Double-shot espresso, velvety crema.", price: 20, img: heroImg, veg: true, tag: "Best Seller" },
  { id: "cap", cat: "Coffee", name: "Cold Coffee", desc: "Slow-brewed, frothed cold.", price: 40, img: coldCoffee, veg: true },
  { id: "cgt", cat: "Coffee", name: "Classic Green Tea", desc: "Light, floral, calming.", price: 25, img: heroImg, veg: true },
  { id: "frc", cat: "Coffee", name: "Frost Coffee", desc: "Iced, smooth, refreshing.", price: 30, img: coldCoffee, veg: true },

  { id: "vgs", cat: "Sandwich", name: "Veg Cheese Grill", desc: "Garden greens, melted cheese, golden grill.", price: 90, img: sandwichImg, veg: true, tag: "Chef's Pick" },
  { id: "ccs", cat: "Sandwich", name: "Corn Cheese Sandwich", desc: "Sweet corn, mozzarella, herbs.", price: 90, img: sandwichImg, veg: true },
  { id: "clb", cat: "Sandwich", name: "Club Sandwich", desc: "Triple-decker, crisp veggies.", price: 70, img: sandwichImg, veg: true },

  { id: "pz1", cat: "Pizza", name: "Margherita", desc: "San marzano, basil, fresh mozzarella.", price: 180, img: pizzaImg, veg: true, tag: "Popular" },
  { id: "bg1", cat: "Burger", name: "Cheese Smash Burger", desc: "Double patty, american cheese, brioche.", price: 160, img: burgerImg, veg: false },

  { id: "ps1", cat: "Pasta", name: "Red Sauce Pasta", desc: "Slow-cooked tomato, garlic, basil.", price: 120, img: pastaImg, veg: true },
  { id: "ps2", cat: "Pasta", name: "White Sauce Pasta", desc: "Creamy béchamel, parmesan.", price: 150, img: pastaImg, veg: true },

  { id: "sh1", cat: "Shakes", name: "Chocolate Shake", desc: "Thick, indulgent, real cocoa.", price: 80, img: shakeImg, veg: true, tag: "Loved" },
  { id: "sh2", cat: "Shakes", name: "Mango Shake", desc: "Alphonso, fresh & cold.", price: 60, img: shakeImg, veg: true },

  { id: "fr1", cat: "Fries", name: "Peri Peri Fries", desc: "Crispy, smoky heat.", price: 100, img: friesImg, veg: true },
  { id: "fr2", cat: "Fries", name: "Cheese Fries", desc: "Molten cheddar drizzle.", price: 120, img: friesImg, veg: true },

  { id: "mk1", cat: "Mocktails", name: "Virgin Mojito", desc: "Mint, lime, soda.", price: 80, img: mocktailImg, veg: true },
  { id: "mk2", cat: "Mocktails", name: "Blue Lagoon", desc: "Citrus & blue curaçao soda.", price: 80, img: mocktailImg, veg: true },
  { id: "mk3", cat: "Mocktails", name: "Pink Lady", desc: "Berry, rose, fizz.", price: 100, img: mocktailImg, veg: true, tag: "Premium" },
];

const CATS = ["All", "Coffee", "Sandwich", "Pizza", "Burger", "Pasta", "Shakes", "Fries", "Mocktails"];

function Home() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [favs, setFavs] = useState<Record<string, boolean>>({});
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const items = useMemo(() => MENU.filter(
    i => (cat === "All" || i.cat === cat) && (!q || i.name.toLowerCase().includes(q.toLowerCase()))
  ), [cat, q]);

  const cartItems = useMemo(() => MENU.filter(m => cart[m.id]).map(m => ({ ...m, qty: cart[m.id] })), [cart]);
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const gst = Math.round(subtotal * 0.05);
  const delivery = subtotal > 0 ? 25 : 0;
  const total = subtotal + gst + delivery;
  const count = Object.values(cart).reduce((a, b) => a + b, 0);

  const add = (id: string) => {
    setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
    toast.success("Added to cart", { description: MENU.find(m => m.id === id)?.name });
  };
  const sub = (id: string) => setCart(c => {
    const n = (c[id] || 0) - 1;
    const next = { ...c };
    if (n <= 0) delete next[id]; else next[id] = n;
    return next;
  });

  return (
    <div className="min-h-screen text-foreground">
      <Toaster theme="dark" position="top-center" />

      {/* NAV */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}>
        <div className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6 ${scrolled ? "glass mx-3 sm:mx-auto" : "bg-transparent"}`}>
          <a href="#top" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
              <Coffee className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">BLN<span className="gold-text"> Café</span></span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            {["Menu", "Gallery", "About", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="transition-colors hover:text-foreground">{l}</a>
            ))}
          </nav>
          <button onClick={() => setCartOpen(true)} className="btn-gold relative hidden items-center gap-2 rounded-full px-4 py-2 text-sm md:flex">
            <ShoppingBag className="h-4 w-4" /> Order
            {count > 0 && <span className="ml-1 rounded-full bg-foreground/15 px-2 py-0.5 text-xs">{count}</span>}
          </button>
          <button onClick={() => setCartOpen(true)} className="relative grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground md:hidden">
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">{count}</span>}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative min-h-[100svh] overflow-hidden">
        <img src={heroImg} alt="" width={1536} height={1920} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/40 to-background" />
        {/* steam */}
        <div className="pointer-events-none absolute bottom-1/3 left-1/2 -translate-x-1/2">
          {[0, 1, 2].map(i => (
            <span key={i} className="steam absolute block h-24 w-1 rounded-full bg-foreground/15 blur-md" style={{ left: `${i * 12 - 12}px`, animationDelay: `${i * 1.2}s` }} />
          ))}
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-20 pt-32 sm:justify-center sm:px-8 sm:pb-32">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs tracking-wide text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Now serving · Wanwadi, Pune
            </div>
            <h1 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] font-light leading-[1.02] tracking-tight">
              Crafted Coffee. <br />
              Fresh Food. <br />
              <span className="gold-text italic">Perfect moments.</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
              Freshly brewed coffee, delicious snacks and unforgettable café vibes — right in the heart of Wanwadi.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#menu" onClick={() => setCartOpen(false)} className="btn-gold inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm">
                Order Now <ShoppingBag className="h-4 w-4" />
              </a>
              <a href="#menu" className="btn-ghost-gold inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm">
                Explore Menu
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map(i => <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />)}
                <span className="ml-1 text-foreground">5.0</span>
              </div>
              <span className="hairline hidden h-4 border-l sm:block" />
              <span className="hidden sm:inline">Loved by 2,400+ guests</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y hairline bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden sm:grid-cols-4">
          {[
            { k: "5.0", v: "Google Rating" },
            { k: "100%", v: "Fresh Ingredients" },
            { k: "<15m", v: "Fast Service" },
            { k: "₹", v: "Pocket Friendly" },
          ].map(s => (
            <div key={s.v} className="bg-background px-6 py-7 text-center">
              <div className="font-display text-2xl font-medium gold-text">{s.k}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mb-10 flex flex-col gap-6 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary">The Menu</p>
            <h2 className="mt-3 font-display text-4xl font-light leading-tight sm:text-5xl">Swaad jo <em className="gold-text not-italic">yaad rahe</em>.</h2>
          </div>
          <div className="glass flex items-center gap-2 rounded-full px-4 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search menu..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:w-56"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="-mx-5 mb-10 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`whitespace-nowrap rounded-full border px-5 py-2 text-sm transition-all ${
                cat === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hairline text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}>
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i, idx) => (
            <article key={i.id}
              style={{ animationDelay: `${idx * 40}ms` }}
              className="group relative animate-fade-in overflow-hidden rounded-2xl border hairline bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_30px_60px_-30px_oklch(0.82_0.13_80/0.4)]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={i.img} alt={i.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <span className={`grid h-6 w-6 place-items-center rounded border ${i.veg ? "border-emerald-400/60 text-emerald-400" : "border-rose-400/60 text-rose-400"} bg-background/70 backdrop-blur`}>
                    <span className={`h-2 w-2 rounded-full ${i.veg ? "bg-emerald-400" : "bg-rose-400"}`} />
                  </span>
                  {i.tag && <span className="rounded-full bg-primary/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">{i.tag}</span>}
                </div>
                <button onClick={() => setFavs(f => ({ ...f, [i.id]: !f[i.id] }))}
                  className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/70 backdrop-blur transition hover:scale-110">
                  <Heart className={`h-4 w-4 ${favs[i.id] ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                </button>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-medium leading-tight">{i.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{i.desc}</p>
                  </div>
                  <span className="shrink-0 font-display text-lg gold-text">₹{i.price}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{i.cat}</span>
                  {cart[i.id] ? (
                    <div className="flex items-center gap-3 rounded-full border hairline bg-background px-2 py-1">
                      <button onClick={() => sub(i.id)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-primary/10"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="min-w-[1ch] text-sm font-medium">{cart[i.id]}</span>
                      <button onClick={() => add(i.id)} className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                  ) : (
                    <button onClick={() => add(i.id)} className="btn-gold inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs">
                      <Plus className="h-3.5 w-3.5" /> Add
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        {items.length === 0 && (
          <p className="py-20 text-center text-muted-foreground">No items match your search.</p>
        )}
      </section>

      {/* GALLERY */}
      <section id="gallery" className="border-t hairline bg-card/30 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">The Space</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-light sm:text-5xl">A corner of Wanwadi that feels like <em className="gold-text not-italic">somewhere else</em>.</h2>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[interior1, interior2, interior3, sandwichImg].map((src, i) => (
              <div key={i} className={`group relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-[4/5]"}`}>
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <img src={interior2} alt="BLN Café interior" loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-background/50 to-transparent" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary">About</p>
            <h2 className="mt-3 font-display text-4xl font-light leading-[1.1] sm:text-5xl">
              Where students, friends &amp; coffee lovers find <em className="gold-text not-italic">their second home</em>.
            </h2>
            <p className="mt-6 text-muted-foreground">
              Tucked beside Vidya Bhavan College, BLN Café is built around three things — honest ingredients,
              friendly faces, and prices that respect your pocket. Stay a while.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-6">
              {[
                ["Fresh", "Made on order"],
                ["Premium", "Beans & ingredients"],
                ["Cozy", "Designed to linger"],
                ["Honest", "Pocket-friendly menu"],
              ].map(([k, v]) => (
                <div key={k} className="border-l hairline pl-4">
                  <div className="font-display text-xl">{k}</div>
                  <div className="text-sm text-muted-foreground">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="border-y hairline bg-card/30 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Loved By</p>
          <h2 className="mt-3 font-display text-4xl font-light sm:text-5xl">Words from our guests.</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              ["Aarav P.", "The coffee is amazing and the vibe is absolutely perfect for a study session."],
              ["Sneha M.", "Pocket-friendly with excellent service. My go-to café near Fatima Nagar."],
              ["Rohan K.", "One of the best cafés in Wanwadi. The sandwiches are next level."],
            ].map(([n, t]) => (
              <figure key={n} className="glass rounded-2xl p-6">
                <div className="mb-3 flex gap-0.5">
                  {[0, 1, 2, 3, 4].map(i => <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />)}
                </div>
                <blockquote className="text-sm leading-relaxed text-foreground">"{t}"</blockquote>
                <figcaption className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">— {n}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary">Visit</p>
            <h2 className="mt-3 font-display text-4xl font-light sm:text-5xl">Find us in Wanwadi.</h2>
            <div className="mt-8 space-y-5 text-sm">
              <div className="flex gap-4">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <p className="text-muted-foreground">
                  Himalaya Heights, Shop No. 3, Pune-Solapur Road,<br />
                  Near Vidya Bhavan College, Opp. Fatima Nagar Chowk,<br />
                  Wanwadi, Pune — 411013
                </p>
              </div>
              <div className="flex gap-4"><Phone className="h-5 w-5 text-primary" /><a href="tel:+919284360981" className="hover:text-primary">+91 92843 60981</a></div>
              <div className="flex gap-4"><Clock className="h-5 w-5 text-primary" /><p>Open daily · 8:00 AM – 11:30 PM</p></div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="tel:+919284360981" className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm"><Phone className="h-4 w-4" /> Call</a>
              <a href="https://wa.me/919284360981" target="_blank" rel="noreferrer" className="btn-ghost-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
              <a href="https://maps.google.com/?q=BLN+Cafe+Wanwadi+Pune" target="_blank" rel="noreferrer" className="btn-ghost-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm"><NavIcon className="h-4 w-4" /> Directions</a>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border hairline">
            <iframe
              title="BLN Café location"
              src="https://www.google.com/maps?q=Fatima+Nagar+Chowk+Wanwadi+Pune&output=embed"
              className="h-[420px] w-full grayscale-[40%] contrast-110"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t hairline">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3 sm:px-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><Coffee className="h-4 w-4" /></span>
              <span className="font-display text-lg">BLN<span className="gold-text"> Café</span></span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">Crafted coffee, fresh food and perfect moments in Wanwadi, Pune.</p>
          </div>
          <div className="text-sm">
            <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Explore</p>
            <ul className="space-y-2">
              {["Menu", "Gallery", "About", "Contact"].map(l => (
                <li key={l}><a href={`#${l.toLowerCase()}`} className="hover:text-primary">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="text-sm">
            <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Connect</p>
            <ul className="space-y-2">
              <li><a href="tel:+919284360981" className="hover:text-primary">+91 92843 60981</a></li>
              <li><a href="https://wa.me/919284360981" className="hover:text-primary">WhatsApp</a></li>
              <li className="flex items-center gap-2"><Instagram className="h-4 w-4" /> @blncafe</li>
            </ul>
          </div>
        </div>
        <div className="border-t hairline px-5 py-5 text-center text-xs text-muted-foreground sm:px-8">
          © {new Date().getFullYear()} BLN Café. Crafted with <Leaf className="inline h-3 w-3 text-primary" /> in Pune.
        </div>
      </footer>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
        <div className="glass mx-3 mb-3 flex items-center justify-between gap-2 rounded-full p-2 pl-5">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{count > 0 ? `${count} item${count > 1 ? "s" : ""} · ₹${total}` : "Hungry?"}</p>
            <p className="truncate text-sm">Order on BLN Café</p>
          </div>
          <button onClick={() => setCartOpen(true)} className="btn-gold inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm">
            <ShoppingBag className="h-4 w-4" /> {count > 0 ? "Checkout" : "Order"}
          </button>
        </div>
      </div>

      {/* CART DRAWER */}
      <div className={`fixed inset-0 z-[60] transition ${cartOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div onClick={() => setCartOpen(false)} className={`absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity ${cartOpen ? "opacity-100" : "opacity-0"}`} />
        <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-card shadow-2xl transition-transform duration-500 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
          <header className="flex items-center justify-between border-b hairline px-6 py-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Your Order</p>
              <h3 className="font-display text-xl">{count} item{count !== 1 && "s"}</h3>
            </div>
            <button onClick={() => setCartOpen(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"><X className="h-4 w-4" /></button>
          </header>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {cartItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-muted"><ShoppingBag className="h-8 w-8 text-muted-foreground" /></div>
                <p className="mt-5 font-display text-xl">Your cart is empty</p>
                <p className="mt-1 max-w-[26ch] text-sm text-muted-foreground">Browse our menu and add something delicious.</p>
                <button onClick={() => setCartOpen(false)} className="btn-gold mt-6 rounded-full px-6 py-3 text-sm">Explore Menu</button>
              </div>
            ) : (
              <ul className="space-y-4">
                {cartItems.map(i => (
                  <li key={i.id} className="flex gap-4">
                    <img src={i.img} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <p className="truncate text-sm font-medium">{i.name}</p>
                        <p className="text-sm gold-text">₹{i.price * i.qty}</p>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">₹{i.price} each</span>
                        <div className="flex items-center gap-2 rounded-full border hairline px-1.5 py-1">
                          <button onClick={() => sub(i.id)} className="grid h-6 w-6 place-items-center rounded-full hover:bg-muted"><Minus className="h-3 w-3" /></button>
                          <span className="min-w-[1ch] text-xs">{i.qty}</span>
                          <button onClick={() => add(i.id)} className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground"><Plus className="h-3 w-3" /></button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="border-t hairline px-6 py-5">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>₹{subtotal}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">GST (5%)</dt><dd>₹{gst}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>₹{delivery}</dd></div>
                <div className="flex justify-between border-t hairline pt-2 text-base font-medium"><dt>Total</dt><dd className="gold-text font-display text-lg">₹{total}</dd></div>
              </dl>
              <button
                onClick={() => { toast.success("Order placed!", { description: "We'll call you to confirm." }); setCart({}); setCartOpen(false); }}
                className="btn-gold mt-5 w-full rounded-full px-6 py-3.5 text-sm">
                Secure Checkout · ₹{total}
              </button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">UPI · GPay · PhonePe · Paytm · Card · COD</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
