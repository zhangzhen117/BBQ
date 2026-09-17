// ============================================================
//  CRUNCH Group BBQ — event list
//  This is the ONLY file you need to edit to add a new BBQ.
//
//  Copy a block, fill in the fields, commit, push. The page decides
//  by itself which event is "next" and which are "past" from the
//  dates, so the order in this list does not matter.
//
//  Fields:
//    id        unique slug, usually YYYY-MM-DD-place (also the photo folder name)
//    title     name shown on the card
//    start     "YYYY-MM-DDTHH:MM" local (Providence) time
//    end       "YYYY-MM-DDTHH:MM" local time (optional, defaults to start + 4 h)
//    location  human-readable place
//    mapUrl    link to Google Maps (optional)
//    notes     free text: what to bring, parking, rain plan... (optional)
//    cover     one image used as the big picture on the "Next BBQ" card (optional)
//    photos    list of image paths for the gallery (optional; [] for upcoming)
//    attendees list of names shown as "Who came" (optional)
//
//  Template for an upcoming BBQ (uncomment and edit):
//  {
//    id: "2027-06-20-colt-state-park",
//    title: "Summer BBQ 2027",
//    start: "2027-06-20T12:00",
//    end: "2027-06-20T16:00",
//    location: "Colt State Park, Bristol, RI",
//    mapUrl: "https://maps.google.com/?q=Colt+State+Park+Bristol+RI",
//    notes: "Bring a side dish or dessert. Grill, meat and drinks provided.",
//    cover: "assets/img/hero.jpg",
//    photos: []
//  },
// ============================================================

window.BBQ_EVENTS = [
  {
    id: "2026-09-16-colt-state-park",
    title: "Colt State Park BBQ — September 2026",
    start: "2026-09-16T16:00",
    end: "2026-09-16T19:30",
    location: "Colt State Park, Bristol, RI",
    mapUrl: "https://maps.google.com/?q=Colt+State+Park+Bristol+RI",
    notes: "Back at Colt State Park, this time at site 4. Skewers over a wood fire, and we stayed for the sunset over Narragansett Bay.",
    cover: "photos/2026-09-16-colt-state-park/01-site-4-crew.jpg",
    photos: [
      "photos/2026-09-16-colt-state-park/01-site-4-crew.jpg",
      "photos/2026-09-16-colt-state-park/02-plates-up.jpg",
      "photos/2026-09-16-colt-state-park/03-skewer-prep.jpg",
      "photos/2026-09-16-colt-state-park/04-skewers-on-the-fire.jpg",
      "photos/2026-09-16-colt-state-park/05-sunset-over-the-bay.jpg"
    ],
    attendees: [
      "Alan John Varghese",
      "Filippo Sturiale",
      "Han Zhang",
      "Kyriacos Georgiou",
      "Qixuan Wang",
      "Shanqing Liu",
      "Stefano Montemagno",
      "Zhen Zhang"
    ]
  },
  {
    id: "2026-09-07-colt-state-park",
    title: "Labor Day BBQ 2026",
    start: "2026-09-07T12:00",
    end: "2026-09-07T16:00",
    location: "Colt State Park, Bristol, RI",
    mapUrl: "https://maps.google.com/?q=Colt+State+Park+Bristol+RI",
    notes: "Grill #12 by the water on Narragansett Bay. Sausages, ribs and a lot of smoke.",
    cover: "photos/2026-09-07-colt-state-park/01-grill-crew.jpg",
    photos: [
      "photos/2026-09-07-colt-state-park/01-grill-crew.jpg",
      "photos/2026-09-07-colt-state-park/02-at-the-grill.jpg",
      "photos/2026-09-07-colt-state-park/03-picnic-table.jpg",
      "photos/2026-09-07-colt-state-park/04-sausages.jpg"
    ],
    attendees: [
      "Zhen Zhang",
      "Shanqing Liu",
      "Kyriacos Georgiou",
      "Juan Diego Toscano",
      "Chenxi Wu",
      "Jaemin Oh",
      "Alan John Varghese",
      "Qile Jiang"
    ]
  }
];
