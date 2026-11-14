const I = (n) => `/assets/images/${n}`;
const hash = (s = "") => [...String(s)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

// Keyword -> photo, so every card gets a relevant image even when the data has none.
const RULES = [
  [/paws|animal|pet|dog|cat|adoption|shelter|vet|zoo/i, ["paws.jpeg", "panda.jpg"]],
  [/dance|music|mic|concert|choir|band|film|screening/i, ["dance.jpeg", "social.jpeg"]],
  [/debate|mun|model un|speaking/i, ["mun.jpg"]],
  [/picnic|park|outdoor|hike|walk|sport|football|cricket|basketball/i, ["picnic.webp"]],
  [/cafe|café|coffee|matcha|bake|food|brunch/i, ["matcha.webp"]],
  [/treasurer|finance|budget/i, ["treasurer.jpg"]],
  [/president/i, ["president.jpg"]],
  [/event|officer|coordinator|manager/i, ["event_officer.jpg", "edit_role.jpg"]],
  [/social media|design|content/i, ["edit_role.jpg"]],
  [/news|newsletter|announce|welcome|term/i, ["news-img.jpeg"]],
  [/startup|entrepreneur|business|pitch|career|hackathon|tech|acm|robot|stem|code|coding/i, ["img.jpeg", "student-casual.jpeg"]],
];
const POOL = ["student-casual.jpeg", "social.jpeg", "img.jpeg", "picnic.webp", "hero.jpeg", "dance.jpeg", "news-img.jpeg", "matcha.webp"];
export const SAFE = I("student-casual.jpeg");

export const pickImage = (...keys) => {
  const text = keys.filter(Boolean).join(" ");
  for (const [re, files] of RULES) if (re.test(text)) return I(files[hash(text) % files.length]);
  return I(POOL[hash(text) % POOL.length]);
};
