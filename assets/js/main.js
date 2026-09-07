/* CRUNCH Group BBQ — page logic (no dependencies) */
(function () {
  "use strict";

  const events = (window.BBQ_EVENTS || []).slice();
  const now = new Date();

  // ---------- helpers ----------
  const parse = (s) => new Date(s); // "YYYY-MM-DDTHH:MM" is parsed as local time
  const pad = (n) => String(n).padStart(2, "0");
  const fmtDate = (d) => d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const fmtShortDate = (d) => d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  const fmtTime = (d) => d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icsStamp = (d) => d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + "00Z";
  const endOf = (ev) => ev.end ? parse(ev.end) : new Date(parse(ev.start).getTime() + 4 * 3600 * 1000);

  function googleCalUrl(ev) {
    const p = new URLSearchParams({
      action: "TEMPLATE",
      text: ev.title,
      dates: icsStamp(parse(ev.start)) + "/" + icsStamp(endOf(ev)),
      details: ev.notes || "",
      location: ev.location || ""
    });
    return "https://calendar.google.com/calendar/render?" + p.toString();
  }

  function icsText(ev) {
    const lines = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//CRUNCH BBQ//EN", "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:" + ev.id + "@crunch-bbq",
      "DTSTAMP:" + icsStamp(new Date()),
      "DTSTART:" + icsStamp(parse(ev.start)),
      "DTEND:" + icsStamp(endOf(ev)),
      "SUMMARY:" + ev.title,
      "LOCATION:" + (ev.location || ""),
      "DESCRIPTION:" + (ev.notes || "").replace(/\n/g, "\\n") + (ev.mapUrl ? "\\nMap: " + ev.mapUrl : ""),
      "END:VEVENT", "END:VCALENDAR"
    ];
    return lines.join("\r\n");
  }

  function downloadIcs(ev) {
    const blob = new Blob([icsText(ev)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = ev.id + ".ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  // ---------- next event ----------
  const upcoming = events.filter((e) => endOf(e) >= now).sort((a, b) => parse(a.start) - parse(b.start));
  const past = events.filter((e) => endOf(e) < now).sort((a, b) => parse(b.start) - parse(a.start));

  const nextEl = document.getElementById("next-event");
  if (!upcoming.length) {
    nextEl.className = "empty";
    nextEl.innerHTML = "No BBQ scheduled yet. Check back when the weather warms up! ☀️";
  } else {
    const ev = upcoming[0];
    const start = parse(ev.start), end = endOf(ev);
    nextEl.classList.toggle("has-cover", !!ev.cover);
    nextEl.innerHTML =
      (ev.cover ? `<div class="next-cover" style="background-image:url('${esc(ev.cover)}')"></div>` : "") +
      `<div class="next-body">
        <span class="badge">Upcoming</span>${ev.placeholder ? '<span class="badge badge-sample">Sample</span>' : ""}
        <h3>${esc(ev.title)}</h3>
        <ul class="meta">
          <li><span class="ico">📅</span><span>${esc(fmtDate(start))}</span></li>
          <li><span class="ico">🕓</span><span>${esc(fmtTime(start))} – ${esc(fmtTime(end))}</span></li>
          <li><span class="ico">📍</span><span>${ev.mapUrl ? `<a href="${esc(ev.mapUrl)}" target="_blank" rel="noopener">${esc(ev.location)}</a>` : esc(ev.location)}</span></li>
        </ul>
        ${ev.notes ? `<p class="notes">${esc(ev.notes)}</p>` : ""}
        <div class="countdown" id="countdown"></div>
        <div class="actions">
          <button class="btn btn-primary" id="btn-ics">📆 Add to calendar (.ics)</button>
          <a class="btn btn-outline" href="${googleCalUrl(ev)}" target="_blank" rel="noopener">Google Calendar</a>
          ${ev.mapUrl ? `<a class="btn btn-outline" href="${esc(ev.mapUrl)}" target="_blank" rel="noopener">🗺️ Map</a>` : ""}
        </div>
      </div>`;
    document.getElementById("btn-ics").addEventListener("click", () => downloadIcs(ev));

    const cd = document.getElementById("countdown");
    function tick() {
      const diff = start - new Date();
      if (diff <= 0) {
        cd.innerHTML = (new Date() <= end) ? '<div class="cd-unit"><b>🔥</b><span>happening now</span></div>' : "";
        return;
      }
      const d = Math.floor(diff / 86400000), h = Math.floor(diff / 3600000) % 24, m = Math.floor(diff / 60000) % 60, s = Math.floor(diff / 1000) % 60;
      cd.innerHTML = [[d, "days"], [h, "hours"], [m, "min"], [s, "sec"]]
        .map(([v, l]) => `<div class="cd-unit"><b>${v}</b><span>${l}</span></div>`).join("");
    }
    tick(); setInterval(tick, 1000);
  }

  // ---------- past events + galleries ----------
  const pastEl = document.getElementById("past-events");
  // Also show further-future events (beyond the next one) in the past list? No: list them under the next card instead.
  if (upcoming.length > 1) {
    const more = upcoming.slice(1).map((e) => `<li>${esc(fmtShortDate(parse(e.start)))} — ${esc(e.title)} @ ${esc(e.location)}</li>`).join("");
    nextEl.insertAdjacentHTML("afterend", `<p class="notes" style="margin-top:14px">Also coming up:</p><ul class="notes">${more}</ul>`);
  }

  const allPhotos = []; // flat list for the lightbox: {src, caption}
  if (!past.length) {
    pastEl.innerHTML = '<div class="empty">No past BBQs yet. The first one will show up here with photos.</div>';
  } else {
    pastEl.innerHTML = past.map((ev) => {
      const start = parse(ev.start);
      const photos = ev.photos || [];
      const tiles = photos.map((src) => {
        const idx = allPhotos.push({ src, caption: ev.title + " · " + fmtShortDate(start) }) - 1;
        return `<button class="tile" data-idx="${idx}" aria-label="Open photo"><img src="${esc(src)}" alt="${esc(ev.title)} photo" loading="lazy"></button>`;
      }).join("");
      return `<article class="event" id="${esc(ev.id)}">
        <div class="event-head">
          <h3>${esc(ev.title)}</h3>
          <span class="event-date">${esc(fmtDate(start))}</span>
          ${ev.placeholder ? '<span class="badge badge-sample">Sample</span>' : ""}
        </div>
        <p class="event-loc">📍 ${ev.mapUrl ? `<a href="${esc(ev.mapUrl)}" target="_blank" rel="noopener">${esc(ev.location)}</a>` : esc(ev.location)}</p>
        ${ev.notes ? `<p class="event-notes">${esc(ev.notes)}</p>` : ""}
        ${photos.length ? `<div class="gallery">${tiles}</div>` : '<p class="no-photos">No photos uploaded yet.</p>'}
      </article>`;
    }).join("");
  }

  // ---------- lightbox ----------
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCap = document.getElementById("lb-caption");
  let current = -1;

  function show(i) {
    if (!allPhotos.length) return;
    current = (i + allPhotos.length) % allPhotos.length;
    lbImg.src = allPhotos[current].src;
    lbCap.textContent = allPhotos[current].caption + " (" + (current + 1) + "/" + allPhotos.length + ")";
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function hide() { lb.hidden = true; lbImg.src = ""; document.body.style.overflow = ""; }

  pastEl.addEventListener("click", (e) => {
    const t = e.target.closest(".tile");
    if (t) show(Number(t.dataset.idx));
  });
  document.getElementById("lb-close").addEventListener("click", hide);
  document.getElementById("lb-prev").addEventListener("click", () => show(current - 1));
  document.getElementById("lb-next").addEventListener("click", () => show(current + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) hide(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") hide();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
  });
  // swipe
  let sx = null;
  lb.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (sx == null) return;
    const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
  });
})();
