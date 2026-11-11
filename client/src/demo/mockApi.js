// Demo mode only (VITE_DEMO_MODE=true): answers every /api call in the browser with
// realistic fake data, so the site works with no backend and no database.
// Committee view = PAWS only. Student/admin view = everything.
// Data lives in memory: follows/joins/edits work until the page is reloaded.

const DEMO = import.meta.env?.VITE_DEMO_MODE === "true";

const DAY = 86400000;
const NOW = Date.now();
const iso = (days, hour = 12) => {
  const d = new Date(NOW + days * DAY);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};
const longDate = (days) =>
  new Date(NOW + days * DAY).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const PAWS = 2;
const IMG = (n) => `/assets/images/${n}`;

/* ------------------------------------------------------------------ clubs */
const clubs = [
  { club_id: 1, club_name: "WiSTEM Society", club_category: "STEM", club_thumbnail_url: null,
    club_description: "A community for women in science, technology, engineering and maths: speaker nights, mentoring, lab visits and a very good snack budget." },
  { club_id: 2, club_name: "PAWS", club_category: "Social", club_thumbnail_url: IMG("logo-paws.jpeg"),
    club_description: "Plants and Animal Welfare Society. We run shelter volunteering days, adoption drives, pet therapy sessions and fundraisers for local rescues." },
  { club_id: 3, club_name: "ACM", club_category: "Tech", club_thumbnail_url: null,
    club_description: "The Association for Computing Machinery chapter: hackathons, coding workshops, interview prep and industry talks." },
  { club_id: 4, club_name: "Robotics Club", club_category: "Engineering", club_thumbnail_url: null,
    club_description: "Design, build and compete. Weekly build nights, line-follower leagues and an annual robotics showcase." },
  { club_id: 5, club_name: "Music Club", club_category: "Arts", club_thumbnail_url: null,
    club_description: "Open mic nights, jam sessions, a student choir and the winter concert. All instruments and levels welcome." },
  { club_id: 6, club_name: "Debate Society", club_category: "Social", club_thumbnail_url: null,
    club_description: "Weekly practice rounds, the Intra-Uni Debate Cup and training for inter-university tournaments." },
  { club_id: 7, club_name: "Photography Society", club_category: "Arts", club_thumbnail_url: null,
    club_description: "Photo walks, editing workshops, gallery nights and a shared pool of camera equipment." },
  { club_id: 8, club_name: "Dance Crew", club_category: "Arts", club_thumbnail_url: null,
    club_description: "Hip-hop, contemporary and Bollywood classes plus the Intra-Uni Dance Competition each spring." },
  { club_id: 9, club_name: "Entrepreneurship Society", club_category: "Business", club_thumbnail_url: null,
    club_description: "Pitch nights, founder talks, a startup incubator and CV clinics for students who want to build something of their own." },
  { club_id: 10, club_name: "Sports Club", club_category: "Sports", club_thumbnail_url: null,
    club_description: "Football, basketball, badminton and cricket leagues with weekly training sessions and an annual inter-university cup." },
  { club_id: 11, club_name: "Film Society", club_category: "Arts", club_thumbnail_url: null,
    club_description: "Weekly screenings, documentary nights and a short-film competition judged by industry guests." },
].map((c) => ({ ...c, club_created_at: iso(-300) }));

const clubName = (id) => clubs.find((c) => c.club_id === Number(id))?.club_name;
const budgets = { 9: 9000, 10: 11000, 11: 6000, 1: 15000, 2: 16000, 3: 18000, 4: 20000, 5: 12000, 6: 8000, 7: 7000, 8: 9000 };

const contacts = {
  1: { phone: "+971 50 111 2201", email: "wistem@example.com", instagram: "@uobd_wistem", whatsapp: "+971 50 111 2201" },
  2: { phone: "+971 55 482 9017", email: "paws.society@example.com", instagram: "@uobd_paws", whatsapp: "+971 55 482 9017" },
  3: { phone: "+971 50 111 2203", email: "acm@example.com", instagram: "@uobd_acm", whatsapp: "+971 50 111 2203" },
  4: { phone: "+971 50 111 2204", email: "robotics@example.com", instagram: "@uobd_robotics", whatsapp: "+971 50 111 2204" },
  5: { phone: "+971 50 111 2205", email: "music@example.com", instagram: "@uobd_music", whatsapp: "+971 50 111 2205" },
  6: { phone: "+971 50 111 2206", email: "debate@example.com", instagram: "@uobd_debate", whatsapp: "+971 50 111 2206" },
  7: { phone: "+971 50 111 2207", email: "photo@example.com", instagram: "@uobd_photo", whatsapp: "+971 50 111 2207" },
  8: { phone: "+971 50 111 2208", email: "dance@example.com", instagram: "@uobd_dance", whatsapp: "+971 50 111 2208" },
  9: { phone: "+971 50 111 2209", email: "entrepreneurship@example.com", instagram: "@uobd_ent", whatsapp: "+971 50 111 2209" },
  10: { phone: "+971 50 111 2210", email: "sports@example.com", instagram: "@uobd_sports", whatsapp: "+971 50 111 2210" },
  11: { phone: "+971 50 111 2211", email: "film@example.com", instagram: "@uobd_film", whatsapp: "+971 50 111 2211" },
};

/* ------------------------------------------------------------------ users */
const users = [
  { id: 1, email: "admin@example.com", name: "Admin User", role: "admin" },
  { id: 2, email: "student@example.com", name: "Alex Morgan", role: "student" },
  { id: 6, email: "committee@example.com", name: "Sameer Roy", role: "committee" },
];

/* -------------------------------------------------------- committee members */
const ALL_PERMS = ["CreateEvent", "ListRoleOpening", "UpdateLink", "AssignPosition", "UpdateBudget"];
const mkMember = (id, user_id, name, email, position, club_id, desc, perms) => ({
  committee_member_id: id,
  user_id,
  committee_member_name: name,
  committee_member_email: email,
  committee_member_description: desc,
  committee_member_assigned_at: iso(-200),
  committee_member_position: position,
  club_id,
  permissions: perms.map((permission) => ({ permission })),
});
let members = [
  // PAWS (the demo committee club)
  mkMember(4, 6, "Sameer Roy", "committee@example.com", "PRESIDENT", 2, "Third-year biology student. Fosters two rescue cats.", ALL_PERMS),
  mkMember(5, 10, "Emily Nguyen", "emily.nguyen@example.com", "VICE_PRESIDENT", 2, "Design lead, runs our socials.", ["CreateEvent", "ListRoleOpening", "UpdateLink"]),
  mkMember(6, 11, "Carlos Mendez", "carlos.mendez@example.com", "OPERATIONS_HEAD", 2, "Handles event logistics.", ["CreateEvent", "UpdateBudget"]),
  mkMember(16, 31, "Hana Suleiman", "hana.suleiman@example.com", "TREASURER", 2, "Keeps the books balanced.", ["UpdateBudget", "ListRoleOpening"]),
  mkMember(17, 32, "Jonah Brooks", "jonah.brooks@example.com", "EVENTS_OFFICER", 2, "Coordinates volunteers on the day.", ["CreateEvent"]),
  // other clubs
  mkMember(1, 41, "Ariana Patel", "ariana.patel@example.com", "PRESIDENT", 1, "Psychology student.", ALL_PERMS),
  mkMember(2, 42, "David Chen", "david.chen@example.com", "VICE_PRESIDENT", 1, "CS student.", ["CreateEvent"]),
  mkMember(3, 43, "Leila Hassan", "leila.hassan@example.com", "TREASURER", 1, "Economics student.", ["UpdateBudget"]),
  mkMember(7, 44, "Hina Sato", "hina.sato@example.com", "PRESIDENT", 5, "Club vocalist.", ALL_PERMS),
  mkMember(8, 45, "Marcus Lee", "marcus.lee@example.com", "VICE_PRESIDENT", 5, "Sponsorships.", ["CreateEvent"]),
  mkMember(9, 46, "Sara Ibrahim", "sara.ibrahim@example.com", "EVENTS_OFFICER", 5, "Events.", ["CreateEvent"]),
  mkMember(10, 47, "Zane Malik", "zane.malik@example.com", "PRESIDENT", 3, "Hackathon organiser.", ALL_PERMS),
  mkMember(11, 48, "Priya Sharma", "priya.sharma@example.com", "VICE_PRESIDENT", 3, "Workshops.", ["CreateEvent"]),
  mkMember(12, 49, "Noah Walker", "noah.walker@example.com", "SOCIAL_MEDIA_MANAGER", 3, "Socials.", ["UpdateLink"]),
  mkMember(13, 50, "Fatima Zahra", "fatima.zahra@example.com", "PRESIDENT", 4, "Robotics lead.", ALL_PERMS),
  mkMember(14, 51, "Liam O'Connor", "liam.oconnor@example.com", "VICE_PRESIDENT", 4, "Build nights.", ["CreateEvent"]),
  mkMember(15, 52, "Jade Liu", "jade.liu@example.com", "TREASURER", 4, "Fundraising.", ["UpdateBudget"]),
  mkMember(18, 53, "Omar Hussein", "omar.hussein@example.com", "PRESIDENT", 6, "Debate captain.", ALL_PERMS),
  mkMember(19, 54, "Maria Lee", "maria.lee@example.com", "PRESIDENT", 7, "Photographer.", ALL_PERMS),
  mkMember(20, 55, "Kenji Tanaka", "kenji.tanaka@example.com", "PRESIDENT", 8, "Choreographer.", ALL_PERMS),
  mkMember(21, 56, "Yusuf Karim", "yusuf.karim@example.com", "PRESIDENT", 9, "Founder of a campus startup.", ALL_PERMS),
  mkMember(22, 57, "Natalie Cho", "natalie.cho@example.com", "TREASURER", 9, "Finance student.", ["UpdateBudget"]),
  mkMember(23, 58, "Idris Bello", "idris.bello@example.com", "PRESIDENT", 10, "Football captain.", ALL_PERMS),
  mkMember(24, 59, "Ines Duarte", "ines.duarte@example.com", "EVENTS_OFFICER", 10, "Runs league fixtures.", ["CreateEvent"]),
  mkMember(25, 60, "Theo Park", "theo.park@example.com", "PRESIDENT", 11, "Media student.", ALL_PERMS),
];
let nextMemberId = 100;

/* ------------------------------------------------------------------- images */
const GALLERY = ["paws.jpeg", "social.jpeg", "picnic.webp", "panda.jpg", "matcha.webp", "dance.jpeg", "mun.jpg", "hero.jpeg", "img.jpeg", "imageM.jpg", "news-img.jpeg"].map(IMG);
const team = (o, c, m, s) => [
  { role: "Organizer", name: o || "" },
  { role: "Co-organizer", name: c || "" },
  { role: "Manager", name: m || "" },
  { role: "Speaker", name: s || "" },
];

/* ------------------------------------------------------------------- events */
// [id, title, club, dayOffset, time, location, capacity, followed, price, description, thumbnail, team]
const EV = [
  [1, "Welcome Week Stall", "PAWS", -85, "11:00-15:00", "Student Union Atrium", 300, 212, 0, "Meet the PAWS committee, sign up for the year and take home a free pet-care starter pack.", "paws.jpeg", team("Sameer Roy", "Emily Nguyen", "Carlos Mendez")],
  [2, "Adoption Awareness Fair", "PAWS", -52, "10:00-16:00", "Main Courtyard", 250, 187, 0, "Local rescue shelters bring adoptable dogs and cats while we run talks on responsible pet ownership.", "social.jpeg", team("Emily Nguyen", "Sameer Roy", "Carlos Mendez", "Dr. Rania Aziz (Vet)")],
  [3, "Plant and Animal Social", "PAWS", -38, "14:00-15:30", "Room 120B", 75, 71, 8, "Games, snacks and succulents to take home. A relaxed way to meet the society.", "picnic.webp", team("Jonah Brooks", "Hana Suleiman", "Carlos Mendez")],
  [4, "Shelter Volunteering Day", "PAWS", -30, "09:00-14:00", "Dubai Animal Rescue Centre", 40, 38, 0, "A day of walking dogs, cleaning kennels and socialising kittens. Transport provided.", "panda.jpg", team("Jonah Brooks", "Sameer Roy", "Carlos Mendez")],
  [5, "Pet Therapy Session", "PAWS", -16, "13:00-15:00", "Library Garden", 60, 60, 5, "Certified therapy dogs visit campus for a pre-exam stress break.", "matcha.webp", team("Emily Nguyen", "Jonah Brooks", "Hana Suleiman", "Layla Fernandes (Handler)")],
  [6, "Halloween Pet Costume Contest", "PAWS", -9, "16:00-18:00", "Main Courtyard", 150, 144, 10, "Bring your pet (or a photo of them) in costume. Prizes for scariest, cutest and most creative.", "dance.jpeg", team("Emily Nguyen", "Carlos Mendez", "Jonah Brooks")],
  [7, "Paw-sitive Study Break", "PAWS", 3, "12:30-14:00", "Library Garden", 50, 33, 0, "Puppy café for finals season: drop in, de-stress, donate what you can to the shelter.", "paws.jpeg", team("Jonah Brooks", "Emily Nguyen", "Hana Suleiman")],
  [8, "Winter Fundraiser Bake Sale", "PAWS", 12, "11:00-16:00", "Student Union Atrium", 200, 96, 0, "Cakes, cookies and hot chocolate with every AED going to the Dubai Animal Rescue Centre winter appeal.", "matcha.webp", team("Sameer Roy", "Hana Suleiman", "Emily Nguyen")],
  [9, "Zoo Trip", "PAWS", 26, "08:30-17:00", "Dubai Safari Park (bus from campus)", 45, 29, 55, "Full-day trip with a keeper-led behind-the-scenes tour. Bus, ticket and lunch included.", "panda.jpg", team("Carlos Mendez", "Sameer Roy", "Jonah Brooks", "Park Zoologist")],
  [10, "Women in STEM Panel Night", "WiSTEM Society", 5, "18:00-20:00", "Main Auditorium", 180, 124, 0, "Four industry guests talk about careers, setbacks and what they would tell their first-year selves.", "mun.jpg", team("Ariana Patel", "David Chen", "Leila Hassan", "Industry Panel")],
  [11, "Lab Tour & Networking", "WiSTEM Society", 19, "15:00-17:30", "Science Block, Level 3", 40, 22, 0, "Small-group tours of the chemistry and physics labs, followed by coffee with postgraduate researchers.", "hero.jpeg", team("Ariana Patel", "Leila Hassan")],
  [12, "Hack the Night 24h Hackathon", "ACM", 8, "18:00-18:00", "Engineering Lab 2", 120, 103, 15, "24 hours, teams of four, one theme revealed at kickoff. Food, mentors and prizes from sponsors.", "social.jpeg", team("Zane Malik", "Priya Sharma", "Noah Walker", "Keynote: Sponsor CTO")],
  [13, "Intro to Git Workshop", "ACM", 2, "16:00-17:30", "Computer Lab 4", 35, 31, 0, "Branching, merging and pull requests with exercises. Bring a laptop.", "img.jpeg", team("Priya Sharma", "Zane Malik")],
  [14, "Line-Follower Build Day", "Robotics Club", 6, "10:00-16:00", "Workshop B", 30, 24, 20, "Build and tune a line-following robot from a kit; leaderboard race at 15:00.", "imageM.jpg", team("Fatima Zahra", "Liam O'Connor", "Jade Liu")],
  [15, "Robotics Showcase", "Robotics Club", 33, "13:00-17:00", "Atrium", 200, 61, 0, "Demos of every club project this year, plus a drone display.", "hero.jpeg", team("Fatima Zahra", "Liam O'Connor", "Jade Liu")],
  [16, "Open Mic Night", "Music Club", 4, "19:00-21:30", "Student Café", 90, 77, 0, "Sign up for a five-minute slot or just come to listen. Acoustic and vocals welcome.", "dance.jpeg", team("Hina Sato", "Marcus Lee", "Sara Ibrahim")],
  [17, "Winter Concert", "Music Club", 21, "19:30-21:30", "Chapel Hall", 250, 140, 12, "Choir, jazz ensemble and student soloists perform seasonal favourites.", "social.jpeg", team("Hina Sato", "Marcus Lee", "Sara Ibrahim", "Guest Conductor")],
  [18, "Intra-Uni Debate Cup", "Debate Society", 15, "10:00-17:00", "Lecture Theatre 2", 80, 54, 5, "Eight teams, three rounds and a grand final judged by faculty.", "mun.jpg", team("Omar Hussein", "Maria Lee")],
  [19, "Golden Hour Photo Walk", "Photography Society", 7, "16:30-18:30", "Creek Harbour (meet at Gate 2)", 25, 19, 0, "Chase the light with tips on composition and exposure from senior members.", "picnic.webp", team("Maria Lee", "Omar Hussein")],
  [20, "Intra-Uni Dance Competition", "Dance Crew", 28, "17:00-20:00", "Main Auditorium", 200, 88, 5, "Solo and crew categories judged by professional choreographers.", "dance.jpeg", team("Kenji Tanaka", "Maria Lee")],
  [21, "Dog Training Basics Workshop", "PAWS", 9, "15:00-16:30", "Sports Field", 30, 18, 10, "A professional trainer teaches sit, stay and recall. Bring your own dog or practise with ours from the shelter.", "paws.jpeg", team("Jonah Brooks", "Carlos Mendez", "Hana Suleiman", "Tariq Al Fahim (Trainer)")],
  [22, "Cat Café Pop-up", "PAWS", 17, "11:00-15:00", "Student Café", 80, 41, 15, "Spend time with adoptable cats over coffee and cake. All proceeds go to the Dubai Animal Rescue Centre.", "matcha.webp", team("Emily Nguyen", "Sameer Roy", "Jonah Brooks")],
  [23, "Careers in Veterinary Science", "PAWS", 22, "17:00-18:30", "Lecture Theatre 3", 120, 57, 0, "A practising vet and a wildlife conservationist discuss training routes, daily life and how to get work experience.", "panda.jpg", team("Sameer Roy", "Emily Nguyen", "Carlos Mendez", "Dr. Rania Aziz (Vet)")],
  [24, "Beach Clean-up with PAWS", "PAWS", -24, "08:00-12:00", "Kite Beach", 50, 46, 0, "Morning clean-up to protect nesting turtles and shore birds. Gloves, bags and breakfast provided.", "social.jpeg", team("Jonah Brooks", "Sameer Roy", "Carlos Mendez")],
  [25, "Spring Adoption Drive", "PAWS", 40, "10:00-16:00", "Main Courtyard", 300, 52, 0, "Our biggest adoption event of the year, with four partner shelters, a vet check-up booth and a pet-photo corner.", "paws.jpeg", team("Sameer Roy", "Emily Nguyen", "Carlos Mendez", "Shelter Partners")],
  [26, "Startup Pitch Night", "Entrepreneurship Society", 10, "18:00-20:30", "Campus Innovation Hub", 100, 64, 0, "Six student teams pitch to a panel of local founders and investors for seed prizes and mentoring.", "mun.jpg", team("Yusuf Karim", "Natalie Cho", "", "Judging Panel")],
  [27, "Sunday Football League: Round 4", "Sports Club", 4, "16:00-19:00", "Sports Complex Pitch 2", 70, 56, 0, "Four-team round of the inter-faculty league. Spectators welcome.", "hero.jpeg", team("Idris Bello", "Ines Duarte")],
  [28, "Film Night: Documentary Screening", "Film Society", 13, "19:00-21:30", "Lecture Theatre 1", 140, 72, 0, "A screening of an award-winning environmental documentary followed by a short discussion.", "img.jpeg", team("Theo Park", "Maria Lee")],
  [29, "CV & LinkedIn Clinic", "Entrepreneurship Society", -14, "14:00-16:00", "Careers Room 210", 40, 40, 0, "One-to-one feedback on CVs and profiles from recent graduates working in industry.", "imageM.jpg", team("Natalie Cho", "Yusuf Karim")],
  [30, "Python for Beginners Bootcamp", "ACM", -20, "10:00-16:00", "Computer Lab 4", 40, 38, 0, "A full day introduction to Python with exercises, culminating in a small text-adventure game.", "img.jpeg", team("Priya Sharma", "Zane Malik", "Noah Walker")],
  [31, "Charity 5-a-side Tournament", "Sports Club", 23, "14:00-18:00", "Sports Complex", 96, 48, 10, "Teams of five compete for the trophy; entry fees are donated to the university hardship fund.", "hero.jpeg", team("Idris Bello", "Ines Duarte")],
  [32, "Acoustic Sessions", "Music Club", -12, "18:30-20:30", "Student Café", 60, 58, 0, "An intimate evening of unplugged sets by Music Club members.", "dance.jpeg", team("Hina Sato", "Sara Ibrahim")],
  [33, "Mock Parliament", "Debate Society", -30, "13:00-17:00", "Lecture Theatre 2", 90, 74, 0, "Students take on ministerial roles and debate a live policy bill in parliamentary style.", "mun.jpg", team("Omar Hussein", "Maria Lee")],
  [34, "Women in Tech Mentoring Brunch", "WiSTEM Society", 30, "10:30-12:30", "Faculty Lounge", 50, 27, 0, "Pair up with an industry mentor for a relaxed brunch and goal-setting session.", "hero.jpeg", team("Ariana Patel", "David Chen", "Leila Hassan", "Industry Mentors")],
];

const followersOf = (id) => {
  const f = [];
  if ([8, 12].includes(id)) f.push({ email: "student@example.com", id: 2 });
  return f;
};

let events = EV.map(([id, title, club, off, time, location, capacity, followed, price, description, thumb, tm]) => ({
  id,
  title,
  club,
  image: { thumbnail: IMG(thumb), prev: IMG("picnic.webp") },
  description,
  location,
  time,
  date: longDate(off),
  date_iso: iso(off, 12),
  deadline: iso(off - 1, 9),
  capacity,
  followed,
  waiting: 0,
  price,
  budget_required: club === "PAWS",
  budget: { catering: true, materials: true, prize: false, transportation: false, venue: true },
  team: tm,
  follower: followersOf(id),
  created: iso(off - 30),
  _off: off,
}));
let nextEventId = 200;
const publicEvent = (e) => {
  const { _off, ...rest } = e;
  return rest;
};

/* ----------------------------------------------------------- budget tracker */
// PAWS budget events: [eventId, categories]
const PAWS_BT = {
  1: { catering: 200, materials: 250, venue: 300 },
  2: { catering: 450, materials: 380, venue: 600 },
  3: { catering: 320, materials: 150, prize: 120 },
  4: { transportation: 700, materials: 220 },
  5: { venue: 400, materials: 180, catering: 250 },
  6: { prize: 500, catering: 420, materials: 260, venue: 350 },
  7: { catering: 180, venue: 120, materials: 60 },
  8: { catering: 600, materials: 300, venue: 250 },
  9: { transportation: 1200, venue: 800, catering: 500 },
  21: { materials: 150, venue: 100 },
  22: { catering: 300, materials: 120, venue: 200 },
  23: { venue: 150, catering: 100 },
  24: { transportation: 350, materials: 80 },
  25: { catering: 500, venue: 300, materials: 200 },
};
const cats = ["catering", "materials", "prize", "venue", "transportation"];
let btEvents = [];
let nextBtId = 1;
events.forEach((e) => {
  const cid = clubs.find((c) => c.club_name === e.club)?.club_id;
  let c = PAWS_BT[e.id];
  if (!c) {
    // generated, deterministic budget for other clubs' events
    const base = 300 + ((e.id * 137) % 700);
    c = { catering: base, materials: Math.round(base * 0.6), venue: Math.round(base * 0.8) };
  }
  btEvents.push({
    id: nextBtId++,
    name: e.title,
    iso: new Date(NOW + e._off * DAY).toISOString(),
    status: e._off < 0 ? "COMPLETED" : "ONGOING",
    description: e.description,
    club_id: cid,
    general_event_id: e.id,
    categories: cats.filter((k) => c[k]).map((k) => ({ name: k, amount: c[k] })),
  });
});
const btTotal = (b) => b.categories.reduce((s, c) => s + Number(c.amount || 0), 0);
const fmtBT = (b) => ({
  id: b.id,
  key: String(b.id),
  name: b.name,
  date: new Date(b.iso).toLocaleDateString("en-GB"),
  status: b.status,
  expense: `AED ${btTotal(b).toFixed(2)}`,
  description: b.description,
  categories: b.categories.map((c) => ({ ...c })),
  club_id: b.club_id,
  general_event_id: b.general_event_id,
  is_general_event: !!b.general_event_id,
});
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthKey = (isoStr) => {
  const d = new Date(isoStr);
  return d.getFullYear() * 12 + d.getMonth();
};
const btFor = (clubId) => btEvents.filter((b) => !clubId || Number(b.club_id) === Number(clubId));
const dashboard = (clubId) => {
  const list = btFor(clubId);
  const total = clubId ? budgets[clubId] || 10000 : Object.values(budgets).reduce((a, b) => a + b, 0);
  const spent = list.reduce((s, b) => s + btTotal(b), 0);
  const byMonth = new Map();
  list.forEach((b) => byMonth.set(monthKey(b.iso), (byMonth.get(monthKey(b.iso)) || 0) + btTotal(b)));
  const keys = [...byMonth.keys()].sort((a, b) => a - b);
  const monthlyExpenses = keys.map((k) => ({ month: MON[k % 12], amount: byMonth.get(k) }));
  const byCat = {};
  list.forEach((b) => b.categories.forEach((c) => (byCat[c.name] = (byCat[c.name] || 0) + Number(c.amount))));
  const expenseBreakdown = Object.entries(byCat).map(([k, v]) => ({ category: k[0].toUpperCase() + k.slice(1), amount: v }));
  const latestEvents = [...list]
    .sort((a, b) => new Date(b.iso) - new Date(a.iso))
    .slice(0, 3)
    .map((b) => ({ id: b.id, name: b.name, totalExpense: btTotal(b) }));
  return { budgetSummary: { totalBudget: total, totalSpent: spent, remaining: total - spent }, monthlyExpenses, latestEvents, expenseBreakdown };
};
const clubStats = (clubId) => {
  const d = dashboard(clubId);
  const now = new Date(NOW);
  const labels = [];
  const data = [];
  for (let i = 2; i >= 0; i--) {
    const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(MON[m.getMonth()]);
    const key = m.getFullYear() * 12 + m.getMonth();
    data.push(btFor(clubId).filter((b) => monthKey(b.iso) === key).reduce((s, b) => s + btTotal(b), 0));
  }
  return { recentExpenses: { labels, data }, budgetSummary: d.budgetSummary };
};

/* ------------------------------------------------------------ role openings */
const RO_IMG = ["edit_role.jpg", "event_officer.jpg", "treasurer.jpg", "president.jpg"];
const roleOpenings = [
  [1, 2, "Social Media Manager", "Run PAWS' Instagram and TikTok: plan content, film event highlights and grow our following. Around 4 hours a week.", 14, "ONGOING", "Open to all years. Experience with Canva or video editing is a plus but not required."],
  [2, 2, "Events Officer", "Help plan and run our monthly events, from booking venues to coordinating volunteers on the day.", 21, "ONGOING", "Must be available for at least two weekend events per semester."],
  [3, 2, "Volunteer Coordinator", "Organise shelter volunteering rotas and be the main contact for partner rescue centres.", -20, "COMPLETED", "Second year or above. Comfortable communicating with external organisations."],
  [4, 1, "Treasurer", "Manage the WiSTEM budget, process reimbursements and present termly reports.", 10, "ONGOING", "Strong organisation skills; some finance or maths background helps."],
  [5, 3, "Workshop Lead", "Design and deliver weekly coding workshops for beginners.", 9, "ONGOING", "Confident in Python or JavaScript and happy to teach."],
  [6, 4, "Build Team Lead", "Lead the build team for this year's competition robot and manage the parts inventory.", 16, "ONGOING", "Hands-on experience with electronics or CAD."],
  [7, 5, "Band Coordinator", "Match musicians into jam groups and schedule practice rooms.", 12, "ONGOING", "Any instrument. Good with scheduling."],
  [8, 1, "Outreach Officer", "Build links with local schools and run STEM outreach days.", -12, "COMPLETED", "Enthusiastic communicator; DBS check required."],
  [9, 7, "Equipment Manager", "Look after camera gear loans and maintain the kit inventory.", 18, "ONGOING", "Reliable and detail-oriented."],
  [10, 2, "Fundraising Lead", "Plan and run PAWS fundraisers: bake sales, sponsored walks and corporate donations for our partner shelters.", 20, "ONGOING", "Good communicator who is comfortable approaching local businesses."],
  [11, 2, "Photographer & Videographer", "Capture event highlights for our social channels and newsletter. Own camera or phone with a good lens preferred.", 11, "ONGOING", "Portfolio or sample work helpful; available for evening events."],
  [12, 9, "Partnerships Officer", "Build relationships with startups and sponsors to bring speakers and prizes to our events.", 15, "ONGOING", "Confident at networking and writing professional emails."],
  [13, 10, "Fixtures Secretary", "Schedule league fixtures, book pitches and keep results up to date.", 8, "ONGOING", "Organised, and reliable on weekends."],
  [14, 11, "Programme Curator", "Choose the films for each semester and write the screening notes.", -6, "COMPLETED", "A broad film knowledge and an eye for variety."],
].map(([id, club_id, position, description, due, status, elig], i) => ({
  role_opening_id: id,
  club_id,
  position,
  description,
  due_date: iso(due, 23),
  status,
  eligibility_criteria: elig,
  thumbnail_url: IMG(RO_IMG[i % RO_IMG.length]),
  created_at: iso(due - 30),
}));
let nextRoleId = 100;

const APPLICANTS = [
  ["Aisha Rahman", "+971 50 441 2290", "aisha.rahman@example.com", "I manage my cousin's rescue-cat Instagram (11k followers) and have a good eye for short-form video."],
  ["Tom Whitfield", "+971 52 903 1187", "tom.whitfield@example.com", "I have volunteered with PAWS twice and want to help make our online presence as friendly as our events."],
  ["Mei Lin", "+971 56 220 7745", "mei.lin@example.com", "Second-year media student. I can shoot and edit Reels and keep a consistent posting schedule."],
  ["Rohan Kapoor", "+971 50 118 6632", "rohan.kapoor@example.com", "Ran the social channels for my school's eco club. Happy to commit four hours weekly."],
  ["Sofia Alvarez", "+971 54 775 0921", "sofia.alvarez@example.com", "I love animals and storytelling. I have a small photography portfolio of shelter dogs."],
  ["Alex Morgan", "+971 50 000 0002", "student@example.com", "I have joined three PAWS events this term and would love to take on more responsibility."],
  ["Hamza Qureshi", "+971 55 310 4468", "hamza.qureshi@example.com", "Treasurer of my secondary school's charity club; I raised AED 4,000 for a local shelter and enjoy approaching sponsors."],
  ["Chloe Martin", "+971 52 774 1903", "chloe.martin@example.com", "Business student with a part-time job in retail events. I can pitch to businesses and handle cash responsibly."],
  ["Dev Patel", "+971 50 662 8821", "dev.patel@example.com", "I shoot weddings and events on weekends and can deliver edited highlights within 48 hours."],
  ["Lina Haddad", "+971 54 108 3396", "lina.haddad@example.com", "Photography minor with a portfolio of animal portraits. Available for every evening event."],
];
let registrations = [];
let nextRegId = 1;
const addRegs = (roleId, rows, statuses) =>
  rows.forEach((r, i) =>
    registrations.push({
      role_opening_registration_id: nextRegId++,
      role_opening_id: roleId,
      user_id: r[2] === "student@example.com" ? 2 : 200 + nextRegId,
      user_name: r[0],
      user_phone: r[1],
      user_email: r[2],
      applicant_suitability: r[3],
      applicant_cv_url: "/demo/newsletter.pdf",
      status: statuses[i] || "PENDING",
      created_at: iso(-3 - i),
    })
  );
addRegs(1, [APPLICANTS[0], APPLICANTS[1], APPLICANTS[2], APPLICANTS[3], APPLICANTS[5]], ["PENDING", "PENDING", "SELECTED", "PENDING", "PENDING"]);
addRegs(2, [APPLICANTS[1], APPLICANTS[4], APPLICANTS[3], APPLICANTS[0]], ["PENDING", "PENDING", "REJECTED", "PENDING"]);
addRegs(3, [APPLICANTS[0], APPLICANTS[1], APPLICANTS[2], APPLICANTS[3], APPLICANTS[4], APPLICANTS[5]], ["SELECTED", "REJECTED", "REJECTED", "SELECTED", "REJECTED", "REJECTED"]);
addRegs(10, [APPLICANTS[6], APPLICANTS[7], APPLICANTS[1], APPLICANTS[4]], ["PENDING", "PENDING", "PENDING", "REJECTED"]);
addRegs(11, [APPLICANTS[8], APPLICANTS[9], APPLICANTS[2]], ["PENDING", "PENDING", "SELECTED"]);
addRegs(5, [{ 0: "Alex Morgan", 1: "+971 50 000 0002", 2: "student@example.com", 3: "I teach Python to my younger cousins and want to do it for the club." }], ["PENDING"]);
const roleWithCount = (r) => ({ ...r, number_of_registrations: registrations.filter((g) => g.role_opening_id === r.role_opening_id).length });

/* -------------------------------------------------------------------- news */
const PDF = "/demo/newsletter.pdf";
let news = [
  [1, "Welcome Back: Autumn Term Newsletter", "Everything you need for the term: society fair dates, the new study spaces on Level 2, and a round-up of the clubs that are recruiting right now.", "news-img.jpeg", "Student Affairs", -3],
  [2, "PAWS Raises AED 6,400 for Local Shelters", "Thanks to everyone who came to the Halloween Pet Costume Contest and Adoption Fair: the funds will cover a winter kennel heating upgrade at the Dubai Animal Rescue Centre.", "paws.jpeg", "PAWS Committee", -6],
  [3, "Library Extended Hours During Exams", "From 24 November the library opens 24/7. Extra quiet-zone seating and free tea will be available on Levels 2 and 3.", "hero.jpeg", "Library Services", -8],
  [4, "Hack the Night Registration Now Open", "ACM's 24-hour hackathon returns on a mystery theme. Teams of up to four can register through the ACM page until places run out.", "social.jpeg", "ACM", -10],
  [5, "Careers Fair: Meet 40 Employers", "Bring your CV and join recruiters from engineering, finance, healthcare and tech. Interview-skills drop-ins run all day in Room 210.", "mun.jpg", "Careers Team", -14],
  [6, "Winter Concert Tickets On Sale", "The Music Club's winter concert features the choir, jazz ensemble and guest soloists. Tickets are limited to 250 and available at the Student Union desk.", "dance.jpeg", "Music Club", -17],
  [7, "New Sports Hall Opening Hours", "The refurbished sports hall is open 7am to 10pm weekdays. Court bookings are now handled through the UniHub app.", "picnic.webp", "Student Affairs", -21],
  [8, "Robotics Club Wins Regional Qualifier", "Our team placed first in the regional line-follower qualifier and will travel to the national finals in February. Congratulations!", "imageM.jpg", "Robotics Club", -26],
  [9, "Entrepreneurship Society Opens Incubator Applications", "Student teams with an early-stage idea can apply for desk space, mentoring and a AED 3,000 seed grant. Applications close at the end of the month.", "social.jpeg", "Entrepreneurship Society", -4],
  [10, "Campus Sustainability Week: What's On", "Five days of talks, a clothes swap, a bike repair clinic and the PAWS beach clean-up. Full timetable inside the newsletter.", "picnic.webp", "Student Affairs", -11],
  [11, "Debate Society Takes Second at Regional Cup", "Our first team reached the grand final in Abu Dhabi and lost by a single point. Practice rounds continue every Thursday.", "mun.jpg", "Debate Society", -19],
  [12, "Counselling & Wellbeing Drop-ins Extended", "Free drop-in sessions are now available Monday to Thursday afternoons in the Student Support Centre, no booking needed.", "hero.jpeg", "Student Support", -23],
].map(([news_id, news_title, news_content, thumb, news_author, off]) => ({
  news_id,
  news_title,
  news_content,
  news_thumbnail_url: IMG(thumb),
  news_pdf_url: PDF,
  news_author,
  news_created_at: iso(off),
}));
let nextNewsId = 100;

/* --------------------------------------------------------- external events */
const EXT_CAT = ["HACKATHON", "WORKSHOP", "NETWORKING", "CAREER", "SPORTS", "GUEST_LECTURE", "SOCIAL_GATHERING", "VOLUNTEERING"];
let externalEvents = [
  [1, "Dubai AI Hackathon 2026", "A 36-hour inter-university hackathon focused on applied AI, hosted at Dubai Internet City.", "Dubai Internet City", 14, 10, 300, 212, "AED 50", "HACKATHON", "Dubai Tech Council", "Student Partnerships", "Hack Ops Team", "Keynote: Head of AI, regional bank"],
  [2, "Regional Careers Expo", "Meet over 60 employers across engineering, finance, health and media. CV clinics all day.", "Dubai World Trade Centre", 20, 9, 1000, 640, "Free", "CAREER", "Gulf Careers Network", "Expo Team", "Expo Ops", "Panel: Hiring Managers"],
  [3, "Coastal Clean-up Day", "Volunteer with students from six universities to clear Kite Beach; gloves, bags and lunch provided.", "Kite Beach", 9, 8, 150, 98, "Free", "VOLUNTEERING", "Clean Coast Initiative", "Volunteer Lead", "Logistics", ""],
  [4, "Inter-University Basketball Cup", "Teams from across the emirate compete over a weekend. Spectators welcome.", "Hamdan Sports Complex", 31, 17, 400, 175, "AED 20", "SPORTS", "UAE Student Sports Federation", "Tournament Director", "Venue Manager", ""],
  [5, "Founders in Conversation", "An evening with three local startup founders on building companies from campus.", "Campus Innovation Hub", 6, 18, 120, 88, "Free", "GUEST_LECTURE", "UoB Entrepreneurship Hub", "Event Host", "Hub Manager", "Founder Panel"],
  [6, "Data Visualisation Workshop", "Hands-on three-hour workshop on turning messy data into clear charts using free tools.", "Knowledge Park Lab 3", 11, 14, 40, 31, "AED 30", "WORKSHOP", "Data Society UAE", "Workshop Lead", "Lab Assistant", "Guest Instructor"],
  [7, "Winter Social Mixer", "Casual networking evening for students from every local university with live music and food trucks.", "Alserkal Avenue", 24, 19, 250, 120, "AED 25", "SOCIAL_GATHERING", "Student Mixer Collective", "Social Chair", "Venue Team", ""],
  [9, "Women in Engineering Conference", "A day of keynotes, workshops and mentoring for women studying or working in engineering fields.", "Dubai Design District", 29, 9, 350, 190, "AED 40", "CAREER", "Engineers UAE", "Programme Chair", "Venue Lead", "Keynote: Chief Engineer, utilities provider"],
  [10, "Sustainability Hackathon", "Teams design low-cost solutions for campus energy and waste problems, judged by sustainability professionals.", "Masdar Hub Dubai", 36, 10, 160, 72, "Free", "HACKATHON", "Green Futures Network", "Hack Lead", "Operations", "Judge: Head of Sustainability"],
  [8, "Cybersecurity Industry Night", "Short talks from security teams plus a capture-the-flag warm-up for beginners.", "Emirates Towers Conference Room", 17, 18, 100, 64, "Free", "NETWORKING", "Cyber Guild", "Host", "Operations", "Security Lead"],
].map(([id, name, description, location, off, hour, max, att, ticket, category, org, corg, mgr, speaker]) => ({
  external_event_id: id,
  external_event_name: name,
  external_event_description: description,
  external_event_location: location,
  external_event_date: iso(off, 0),
  external_event_time: iso(off, hour),
  external_event_max_number_of_attendees: max,
  external_event_number_of_attendees: att,
  external_event_registered_number_of_attendees: att,
  external_event_ticket_amount: ticket,
  external_event_category: category,
  external_event_organizer: org,
  external_event_corganizer: corg,
  external_event_manager: mgr,
  external_event_speaker: speaker,
}));
let nextExtId = 100;

/* ----------------------------------------------------------- image management */
let images = [];
let nextImageId = 1;
const addImg = (eventName, eventType, position, url) =>
  images.push({ id: nextImageId++, eventName, eventType, position, URL: url, brightness: 100, saturation: 100, blur: 0, inversion: 0 });
events.forEach((e, i) => {
  const n = e.club === "PAWS" ? 3 : 1;
  addImg(e.title, "Internal", 1, e.image.thumbnail);
  for (let p = 2; p <= n; p++) addImg(e.title, "Internal", p, GALLERY[(i + p) % GALLERY.length]);
});
externalEvents.forEach((e, i) => {
  addImg(e.external_event_name, "External", 1, GALLERY[(i * 2) % GALLERY.length]);
  addImg(e.external_event_name, "External", 2, GALLERY[(i * 2 + 3) % GALLERY.length]);
});

/* -------------------------------------------------------------- memberships */
let memberships = [
  { userId: 2, clubId: 2, joinedAt: iso(-60) },
  { userId: 2, clubId: 3, joinedAt: iso(-45) },
  { userId: 6, clubId: 2, joinedAt: iso(-200) },
];

/* ------------------------------------------------------------------ helpers */
const sess = () => {
  try {
    return JSON.parse(sessionStorage.getItem("user"));
  } catch {
    return null;
  }
};
const committeeOnly = () => sess()?.role === "committee";
const inCommitteeArea = () => typeof location !== "undefined" && location.pathname.startsWith("/committee");
// A committee user only ever sees PAWS. Admin can pick any club.
const scopeClub = (id) => (committeeOnly() ? PAWS : id ? Number(id) : undefined);
const num = (v) => (v === undefined || v === null || v === "" ? undefined : Number(v));
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const ok = (data, status = 200) => ({ status, data });
const notFound = (msg = "Not found") => ({ status: 404, data: { message: msg, error: msg } });

const parseBody = async (init, input) => {
  let body = init?.body;
  if (body === undefined && input && typeof input !== "string" && input.clone) {
    try {
      body = await input.clone().text();
    } catch {
      body = undefined;
    }
  }
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    const o = {};
    body.forEach((v, k) => {
      o[k] = typeof v === "string" ? v : v?.name || "";
    });
    return o;
  }
  return {};
};
const maybeJSON = (v, fallback) => {
  if (typeof v !== "string") return v ?? fallback;
  try {
    return JSON.parse(v);
  } catch {
    return fallback;
  }
};

/* ------------------------------------------------------------------- router */
export function handle(method, path, query, body) {
  const seg = path.split("/").filter(Boolean);
  const [a, b, c] = seg;
  const id = num(b);

  switch (a) {
    case "health":
      return ok({ status: "healthy", mode: "demo" });

    /* ---------------------------------------------------------------- users */
    case "users": {
      if (b === "by-email") {
        const u = users.find((x) => x.email.toLowerCase() === decodeURIComponent(c || "").toLowerCase());
        const m = members.find((x) => x.committee_member_email.toLowerCase() === decodeURIComponent(c || "").toLowerCase());
        if (u) return ok(u);
        if (m) return ok({ id: m.user_id, email: m.committee_member_email, name: m.committee_member_name });
        return notFound("User not found");
      }
      if (id) return ok(users.find((x) => x.id === id) || { id, email: `user${id}@example.com`, name: `Student ${id}`, role: "student" });
      return ok(users);
    }

    /* ----------------------------------------------------------------- news */
    case "news": {
      if (method === "GET" && !b) return ok(news);
      if (method === "GET") return news.find((n) => n.news_id === id) ? ok(news.find((n) => n.news_id === id)) : notFound();
      if (method === "POST") {
        const n = {
          news_id: nextNewsId++,
          news_title: body.news_title || "Untitled",
          news_content: body.news_content || "",
          news_thumbnail_url: IMG("news-img.jpeg"),
          news_pdf_url: PDF,
          news_author: body.news_author || "Admin",
          news_created_at: new Date().toISOString(),
        };
        news = [n, ...news];
        return ok(n, 201);
      }
      if (method === "PUT") {
        news = news.map((n) => (n.news_id === id ? { ...n, ...body } : n));
        return ok(news.find((n) => n.news_id === id) || {});
      }
      if (method === "DELETE") {
        news = news.filter((n) => n.news_id !== id);
        return ok({ message: "Deleted" });
      }
      break;
    }

    /* --------------------------------------------------------------- events */
    case "events": {
      if (method === "GET" && !b) {
        const list = committeeOnly() && inCommitteeArea() ? events.filter((e) => e.club === "PAWS") : events;
        return ok(list.map(publicEvent));
      }
      if (b === "follow" || b === "unfollow") {
        const e = events.find((x) => x.id === num(c));
        if (!e) return notFound("Event not found");
        const uid = body.id ?? sess()?.id;
        const email = body.email ?? sess()?.email;
        const has = e.follower.some((f) => Number(f.id) === Number(uid));
        if (b === "follow") {
          if (has) return ok({ error: "Already followed event" }, 400);
          if (e.followed >= e.capacity) return ok({ error: "Event is full" }, 400);
          e.follower = [...e.follower, { email, id: uid }];
          e.followed += 1;
        } else {
          if (!has) return ok({ error: "Not following the event" }, 400);
          e.follower = e.follower.filter((f) => Number(f.id) !== Number(uid));
          e.followed = Math.max(0, e.followed - 1);
        }
        return ok(publicEvent(e));
      }
      if (method === "GET") {
        const e = events.find((x) => x.id === id);
        return e ? ok(publicEvent(e)) : notFound("Event not found");
      }
      if (method === "POST") {
        const e = {
          id: nextEventId++,
          title: body.title || "New Event",
          club: body.club || "PAWS",
          image: maybeJSON(body.image, { image0: IMG("social.jpeg") }),
          description: body.description || "",
          location: body.location || "TBC",
          time: body.time || "12:00-13:00",
          date: body.date ? new Date(body.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : longDate(14),
          date_iso: body.date ? new Date(body.date + "T12:00:00").toISOString() : iso(14, 12),
          deadline: body.deadline || iso(13),
          capacity: Number(body.capacity) || 50,
          followed: 0,
          waiting: 0,
          price: Number(body.price) || 0,
          budget_required: body.budget_required === true || body.budget_required === "true",
          budget: maybeJSON(body.budget, {}),
          team: maybeJSON(body.team, team()),
          follower: [],
          created: new Date().toISOString(),
          _off: 14,
        };
        events = [...events, e];
        if (e.budget_required) {
          const cid = clubs.find((x) => x.club_name === e.club)?.club_id;
          btEvents.push({ id: nextBtId++, name: e.title, iso: new Date(NOW + 14 * DAY).toISOString(), status: "ONGOING", description: e.description, club_id: cid, general_event_id: e.id, categories: [] });
        }
        return ok({ message: "Event created successfully", event: publicEvent(e) }, 201);
      }
      if (method === "PUT") {
        events = events.map((e) => (e.id === id ? { ...e, ...body, id } : e));
        return ok({ message: "Event updated successfully", event: publicEvent(events.find((e) => e.id === id) || {}) });
      }
      if (method === "DELETE") {
        events = events.filter((e) => e.id !== id);
        btEvents = btEvents.filter((x) => x.general_event_id !== id);
        return ok({ message: "Event deleted successfully" });
      }
      break;
    }

    /* ------------------------------------------------------ external events */
    case "external-events": {
      const find = (x) => externalEvents.find((e) => e.external_event_id === x);
      if (method === "GET" && !b) return ok(externalEvents);
      if (method === "GET") return find(id) ? ok(find(id)) : notFound();
      if (method === "POST" && !b) {
        const e = {
          external_event_id: nextExtId++,
          external_event_name: body.external_event_name || body.name || "New external event",
          external_event_description: body.external_event_description || body.description || "",
          external_event_location: body.external_event_location || body.location || "TBC",
          external_event_date: body.external_event_date ? new Date(body.external_event_date).toISOString() : iso(30, 0),
          external_event_time: body.external_event_time && !isNaN(new Date(body.external_event_time)) ? new Date(body.external_event_time).toISOString() : iso(30, 12),
          external_event_max_number_of_attendees: Number(body.external_event_max_number_of_attendees) || 100,
          external_event_number_of_attendees: 0,
          external_event_ticket_amount: body.external_event_ticket_amount || "Free",
          external_event_category: EXT_CAT.includes(body.external_event_category) ? body.external_event_category : "NETWORKING",
          external_event_organizer: body.external_event_organizer || "",
          external_event_corganizer: body.external_event_corganizer || "",
          external_event_manager: body.external_event_manager || "",
          external_event_speaker: body.external_event_speaker || "",
        };
        externalEvents = [...externalEvents, e];
        return ok(e, 201);
      }
      if (method === "POST" && (c === "signup" || c === "unfollow")) {
        const e = find(id);
        if (!e) return notFound();
        if (c === "signup") {
          if (e.external_event_number_of_attendees >= e.external_event_max_number_of_attendees) return ok({ error: "Event is full" }, 400);
          e.external_event_number_of_attendees += 1;
        } else e.external_event_number_of_attendees = Math.max(0, e.external_event_number_of_attendees - 1);
        return ok(e);
      }
      if (method === "PUT") {
        externalEvents = externalEvents.map((e) => (e.external_event_id === id ? { ...e, ...body, external_event_id: id } : e));
        return ok(find(id) || {});
      }
      if (method === "DELETE") {
        externalEvents = externalEvents.filter((e) => e.external_event_id !== id);
        return ok({ message: "Deleted" });
      }
      break;
    }

    /* ----------------------------------------------------- image management */
    case "image-management": {
      if (method === "GET" && !b) return ok(images);
      if (method === "GET") return images.find((i) => i.id === id) ? ok(images.find((i) => i.id === id)) : notFound();
      if (method === "POST") {
        const row = {
          id: nextImageId++,
          eventName: body.eventName,
          eventType: body.eventType || "Internal",
          position: Number(body.position) || 1,
          URL: IMG("event_template.png"),
          brightness: 100,
          saturation: 100,
          blur: 0,
          inversion: 0,
        };
        images.push(row);
        return ok(row, 201);
      }
      if (method === "PUT") {
        images = images.map((i) => (i.id === id ? { ...i, ...body, id } : i));
        return ok(images.find((i) => i.id === id) || {});
      }
      if (method === "DELETE") {
        images = images.filter((i) => i.id !== id);
        return ok({ message: "Deleted" });
      }
      break;
    }

    /* ---------------------------------------------------------------- clubs */
    case "clubs": {
      if (method === "GET" && !b) return ok(clubs);
      if (method === "GET") return clubs.find((x) => x.club_id === id) ? ok(clubs.find((x) => x.club_id === id)) : notFound("Club not found");
      return ok({ message: "OK (demo)" });
    }
    case "club-contacts": {
      if (method === "GET") return ok(contacts[scopeClub(id) || id] || {});
      const cid = scopeClub(body.club_id);
      contacts[cid] = { ...(contacts[cid] || {}), phone: body.phone, email: body.email, instagram: body.instagram, whatsapp: body.whatsapp };
      return ok(contacts[cid], 201);
    }
    case "club-memberships": {
      if (b === "user" && method === "GET") return ok(memberships.filter((m) => m.userId === num(c)).map((m) => m.clubId));
      if (b === "details") return ok(memberships.filter((m) => m.userId === num(c)).map((m) => ({ clubId: m.clubId, joinedAt: m.joinedAt })));
      if (b === "leave") {
        memberships = memberships.filter((m) => !(m.userId === Number(body.userId) && m.clubId === Number(body.clubId)));
        return ok({ message: "Left club successfully" });
      }
      if (method === "POST") {
        if (memberships.some((m) => m.userId === Number(body.userId) && m.clubId === Number(body.clubId))) return ok({ error: "Already a member" }, 400);
        memberships.push({ userId: Number(body.userId), clubId: Number(body.clubId), joinedAt: new Date().toISOString() });
        return ok({ message: "Joined club successfully" }, 201);
      }
      break;
    }

    /* ----------------------------------------------------- committee members */
    case "committee-members": {
      if (method === "GET" && !b) return ok(members);
      if (b === "by-user") {
        const m = members.find((x) => x.user_id === num(c));
        return m ? ok(m) : ok({});
      }
      if (b === "by-club") return ok(members.filter((x) => x.club_id === scopeClub(num(c))));
      if (method === "POST") {
        const m = mkMember(nextMemberId++, Number(body.user_id), body.committee_member_name, body.committee_member_email, body.committee_member_position, Number(body.club_id), body.committee_member_description || "", []);
        members.push(m);
        return ok({ message: "Created", data: m }, 201);
      }
      if (method === "DELETE") {
        members = members.filter((x) => x.committee_member_id !== id);
        return ok({ message: "Deleted" });
      }
      if (method === "GET") return members.find((x) => x.committee_member_id === id) ? ok(members.find((x) => x.committee_member_id === id)) : notFound();
      break;
    }
    case "committee-member-permissions": {
      if (b === "all-permissions") return ok(ALL_PERMS);
      const m = members.find((x) => x.committee_member_id === id);
      if (method === "PUT") {
        if (m) m.permissions = (body.permissions || []).map((permission) => ({ permission }));
        return ok({ message: "Updated" });
      }
      return ok(m ? m.permissions : []);
    }

    /* ------------------------------------------------------- role openings */
    case "role-openings": {
      const visible = () => (committeeOnly() && inCommitteeArea() ? roleOpenings.filter((r) => r.club_id === PAWS) : roleOpenings);
      if (method === "GET" && !b) return ok(visible().map(roleWithCount));
      if (method === "GET") return roleOpenings.find((r) => r.role_opening_id === id) ? ok(roleWithCount(roleOpenings.find((r) => r.role_opening_id === id))) : notFound();
      if (method === "POST") {
        const r = {
          role_opening_id: nextRoleId++,
          club_id: scopeClub(body.club_id) || PAWS,
          position: body.position || "New role",
          description: body.description || "",
          due_date: body.due_date ? new Date(body.due_date).toISOString() : iso(14, 23),
          status: "ONGOING",
          eligibility_criteria: body.eligibility_criteria || "",
          thumbnail_url: IMG("edit_role.jpg"),
        };
        roleOpenings.push(r);
        return ok(roleWithCount(r), 201);
      }
      if (method === "PUT") {
        const i = roleOpenings.findIndex((r) => r.role_opening_id === id);
        if (i >= 0) roleOpenings[i] = { ...roleOpenings[i], ...body, role_opening_id: id };
        return ok(roleOpenings[i] ? roleWithCount(roleOpenings[i]) : {});
      }
      if (method === "DELETE") {
        const i = roleOpenings.findIndex((r) => r.role_opening_id === id);
        if (i >= 0) roleOpenings.splice(i, 1);
        return ok({ message: "Deleted" });
      }
      break;
    }
    case "role-opening-registrations": {
      if (method === "GET") return ok(registrations);
      if (method === "POST") {
        const r = {
          role_opening_registration_id: nextRegId++,
          role_opening_id: Number(body.role_opening_id),
          user_id: Number(body.user_id) || 2,
          user_name: body.user_name,
          user_phone: body.user_phone,
          user_email: body.user_email,
          applicant_suitability: body.applicant_suitability,
          applicant_cv_url: "/demo/newsletter.pdf",
          status: "PENDING",
          created_at: new Date().toISOString(),
        };
        registrations.push(r);
        return ok(r, 201);
      }
      if (method === "PUT") {
        registrations = registrations.map((r) => (r.role_opening_registration_id === id ? { ...r, status: body.status || r.status } : r));
        return ok(registrations.find((r) => r.role_opening_registration_id === id) || {});
      }
      break;
    }

    /* -------------------------------------------------------- budget tracker */
    case "budgetRoute":
    case "budgets": {
      if (b === "club") {
        const cid = scopeClub(num(c)) || 1;
        return ok({ id: cid * 10, club_id: cid, totalAmount: budgets[cid] || 10000, fiscalYear: "2026/27" });
      }
      if (b === "current") return ok({ id: PAWS * 10, club_id: PAWS, totalAmount: budgets[PAWS], fiscalYear: "2026/27" });
      if (method === "PUT") {
        const cid = Math.round(id / 10);
        if (body.totalAmount) budgets[cid] = Number(body.totalAmount);
        return ok({ id, club_id: cid, totalAmount: budgets[cid] });
      }
      return ok(Object.entries(budgets).map(([cid, totalAmount]) => ({ id: Number(cid) * 10, club_id: Number(cid), totalAmount })));
    }
    case "bt_dashboardRoute": {
      const cid = scopeClub(num(query.club_id));
      return ok(dashboard(cid));
    }
    case "club-stats": {
      const cid = scopeClub(num(query.club_id)) || PAWS;
      return ok(clubStats(cid));
    }
    case "bt_eventRoute": {
      const cid = scopeClub(num(query.club_id));
      if (b === "filter") {
        const status = c;
        return ok(btFor(cid).filter((x) => status === "all" || x.status === status).sort((p, q) => new Date(q.iso) - new Date(p.iso)).map(fmtBT));
      }
      if (b === "search") {
        const needle = (query.query || "").toLowerCase();
        return ok(btFor(cid).filter((x) => x.name.toLowerCase().includes(needle)).map(fmtBT));
      }
      if (method === "GET" && !b) return ok(btFor(cid).sort((p, q) => new Date(q.iso) - new Date(p.iso)).map(fmtBT));
      if (method === "GET") {
        const x = btEvents.find((e) => e.id === id);
        return x ? ok(fmtBT(x)) : notFound("BTevent not found");
      }
      if (method === "POST") {
        const club_id = scopeClub(num(body.club_id)) || PAWS;
        const categories = (body.categories || []).map((k) => ({ name: String(k.name).toLowerCase(), amount: Number(k.amount) || 0 }));
        const added = categories.reduce((s, k) => s + k.amount, 0);
        const spent = btFor(club_id).reduce((s, e) => s + btTotal(e), 0);
        const budget = budgets[club_id] || 10000;
        if (spent + added > budget) return ok({ message: `Event expenses would exceed budget. Available: AED ${(budget - spent).toFixed(2)}`, available: budget - spent, budgetLimit: budget }, 400);
        const d = new Date(body.date);
        const x = { id: nextBtId++, name: body.name, iso: isNaN(d) ? new Date().toISOString() : d.toISOString(), status: body.status || "ONGOING", description: body.description || "", club_id, general_event_id: body.general_event_id || null, categories };
        btEvents.push(x);
        return ok(fmtBT(x), 201);
      }
      if (method === "PUT") {
        const x = btEvents.find((e) => e.id === id);
        if (!x) return notFound();
        const categories = Array.isArray(body.categories) ? body.categories.map((k) => ({ name: String(k.name).toLowerCase(), amount: Number(k.amount) || 0 })) : x.categories;
        const club_id = x.club_id;
        const others = btFor(club_id).filter((e) => e.id !== id).reduce((s, e) => s + btTotal(e), 0);
        const added = categories.reduce((s, k) => s + k.amount, 0);
        const budget = budgets[club_id] || 10000;
        if (others + added > budget) return ok({ message: `Updated expenses would exceed budget. Available: AED ${(budget - others).toFixed(2)}`, available: budget - others, budgetLimit: budget }, 400);
        x.name = body.name || x.name;
        x.status = body.status || x.status;
        x.description = body.description ?? x.description;
        x.categories = categories.filter((k) => k.amount > 0 || categories.length);
        if (body.date) {
          const d = new Date(body.date);
          if (!isNaN(d)) x.iso = d.toISOString();
        }
        return ok(fmtBT(x));
      }
      if (method === "DELETE") {
        btEvents = btEvents.filter((e) => e.id !== id);
        return ok({ message: "BTevent deleted successfully", id });
      }
      break;
    }
    case "update_expRoute":
    case "expenses":
    case "categories":
      return ok(method === "GET" ? [] : { message: "OK (demo)" });

    default:
      break;
  }

  console.warn("[demo api] unhandled", method, "/" + path);
  return ok(method === "GET" ? [] : { message: "OK (demo)" });
}

/* ------------------------------------------------------------------ install */
export function installMockApi() {
  if (!DEMO || typeof window === "undefined" || window.__unihubMock) return;
  window.__unihubMock = true;

  const realFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url || String(input);
    let u;
    try {
      u = new URL(url, window.location.href);
    } catch {
      return realFetch(input, init);
    }
    const sameOrigin = u.origin === window.location.origin;
    const isLocal = /^(localhost|127\.0\.0\.1)$/.test(u.hostname);
    const apiLike = sameOrigin ? u.pathname === "/api" || u.pathname.startsWith("/api/") : isLocal;
    if (!apiLike) return realFetch(input, init);

    const method = String(init.method || (typeof input !== "string" && input.method) || "GET").toUpperCase();
    const path = u.pathname.replace(/^\/api(?=\/|$)/, "");
    const query = Object.fromEntries(u.searchParams.entries());
    const body = await parseBody(init, typeof input === "string" ? null : input);
    await new Promise((r) => setTimeout(r, 60));
    let res;
    try {
      res = handle(method, path, query, body);
    } catch (e) {
      console.error("[demo api] error", e);
      res = { status: 500, data: { message: String(e) } };
    }
    return new Response(JSON.stringify(res.data), { status: res.status, headers: { "Content-Type": "application/json" } });
  };

  // Images drawn onto canvases use `${apiUrl}${path}`; point those at the files shipped with the site.
  try {
    const proto = HTMLImageElement.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, "src");
    const fix = (v) =>
      typeof v === "string"
        ? v
            .replace(/^(?:https?:\/\/[^/]+)?\/api(?=\/(?:assets|demo|uploads)\/)/, "")
            .replace(/^https?:\/\/localhost:\d+(?=\/(?:assets|demo|uploads)\/)/, "")
        : v;
    Object.defineProperty(proto, "src", {
      ...desc,
      set(v) {
        desc.set.call(this, fix(v));
      },
    });
  } catch (e) {
    console.warn("[demo api] image patch skipped", e);
  }
}
