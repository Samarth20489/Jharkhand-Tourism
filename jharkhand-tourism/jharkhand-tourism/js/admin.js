function adminClient() {
  return window.supabaseClient || (typeof supabaseClient !== "undefined" ? supabaseClient : null);
}

let bookingsCache = [];
let hotelsCache = [];
let usersCache = [];
let bookingsChart = null;

function escapeCsvValue(value) {
  const str = String(value ?? "");
  return `"${str.replace(/"/g, '""')}"`;
}

function switchAdminView(target) {
  document.querySelectorAll(".admin-view").forEach((el) => {
    el.style.display = el.id === `${target}View` ? "block" : "none";
  });
  document.querySelectorAll(".admin-nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.view === target);
  });
}

async function fetchDashboardStats() {
  const client = adminClient();
  const [bookingsRes, hotelsRes] = await Promise.all([
    client.from("bookings").select("*"),
    client.from("hotels").select("*").eq("active", true),
  ]);

  bookingsCache = bookingsRes.data || [];
  hotelsCache = hotelsRes.data || [];

  const pending = bookingsCache.filter((b) => b.status === "pending").length;
  document.getElementById("totalBookingsStat").textContent = String(bookingsCache.length);
  document.getElementById("pendingBookingsStat").textContent = String(pending);
  document.getElementById("totalHotelsStat").textContent = String(hotelsCache.length);

  renderRecentBookings();
  renderBookingChart();
}

function renderRecentBookings() {
  const rows = (bookingsCache || []).slice(0, 5).map((b) => `
    <tr>
      <td>${b.id || "-"}</td>
      <td>${b.full_name || "-"}</td>
      <td>${b.hotel_name || "-"}</td>
      <td>${b.status || "pending"}</td>
      <td>${new Date(b.created_at || Date.now()).toLocaleDateString()}</td>
    </tr>
  `).join("");
  document.getElementById("recentBookingsBody").innerHTML = rows || '<tr><td colspan="5">No bookings yet.</td></tr>';
}

function renderBookingChart() {
  const map = {};
  for (let i = 29; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    map[key] = 0;
  }
  bookingsCache.forEach((b) => {
    const key = (b.created_at || "").slice(0, 10);
    if (map[key] !== undefined) map[key] += 1;
  });

  const labels = Object.keys(map);
  const values = Object.values(map);
  const ctx = document.getElementById("bookingsChart");
  if (!ctx || typeof Chart === "undefined") return;
  if (bookingsChart) bookingsChart.destroy();

  bookingsChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Bookings",
        data: values,
        borderColor: "#c9a84c",
        backgroundColor: "rgba(201,168,76,.2)",
        tension: 0.3,
        fill: true,
      }],
    },
  });
}

function bookingRowTemplate(b) {
  return `
    <tr>
      <td>${b.id || "-"}</td>
      <td>${b.full_name || "-"}</td>
      <td>${b.hotel_name || "-"}</td>
      <td>${b.place_name || "-"}</td>
      <td>${b.check_in || "-"}</td>
      <td>${b.check_out || "-"}</td>
      <td>${b.travelers || 1}</td>
      <td><span class="status-badge status-${b.status || "pending"}">${b.status || "pending"}</span></td>
      <td>${new Date(b.created_at || Date.now()).toLocaleDateString()}</td>
      <td>
        <select class="status-select" data-booking-id="${b.id}">
          <option value="pending" ${(b.status || "pending") === "pending" ? "selected" : ""}>pending</option>
          <option value="confirmed" ${b.status === "confirmed" ? "selected" : ""}>confirmed</option>
          <option value="cancelled" ${b.status === "cancelled" ? "selected" : ""}>cancelled</option>
        </select>
      </td>
    </tr>
  `;
}

function renderBookingsTable(filter = "") {
  const q = filter.toLowerCase();
  const filtered = bookingsCache.filter((b) =>
    (b.full_name || "").toLowerCase().includes(q) || (b.hotel_name || "").toLowerCase().includes(q)
  );
  const body = document.getElementById("bookingsTableBody");
  body.innerHTML = filtered.map(bookingRowTemplate).join("") || '<tr><td colspan="10">No bookings found.</td></tr>';

  body.querySelectorAll(".status-select").forEach((select) => {
    select.addEventListener("change", async () => {
      const id = select.dataset.bookingId;
      const status = select.value;
      const client = adminClient();
      await client.from("bookings").update({ status }).eq("id", id);
      await loadBookings();
    });
  });
}

async function loadBookings() {
  const client = adminClient();
  const { data } = await client.from("bookings").select("*").order("created_at", { ascending: false });
  bookingsCache = data || [];
  renderBookingsTable(document.getElementById("bookingSearch").value || "");
}

async function renderHotelsTable() {
  const client = adminClient();
  const { data } = await client.from("hotels").select("*").order("created_at", { ascending: false });
  hotelsCache = data || [];
  const body = document.getElementById("hotelsTableBody");
  body.innerHTML = hotelsCache.map((h) => `
    <tr>
      <td>${h.hotel_name || "-"}</td>
      <td>${h.place || "-"}</td>
      <td>${h.rating || "-"}</td>
      <td>${h.min_price || 0} - ${h.max_price || 0}</td>
      <td>${h.phone || "-"}</td>
      <td>${h.active ? "Yes" : "No"}</td>
      <td>
        <button class="admin-mini-btn" data-edit-hotel="${h.id}">Edit</button>
        <button class="admin-mini-btn danger" data-delete-hotel="${h.id}">Delete</button>
      </td>
    </tr>
  `).join("") || '<tr><td colspan="7">No hotels found.</td></tr>';

  body.querySelectorAll("[data-edit-hotel]").forEach((btn) => {
    btn.addEventListener("click", () => openHotelModal(btn.dataset.editHotel));
  });
  body.querySelectorAll("[data-delete-hotel]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await client.from("hotels").update({ active: false }).eq("id", btn.dataset.deleteHotel);
      await renderHotelsTable();
      await fetchDashboardStats();
    });
  });
}

function openHotelModal(hotelId = "") {
  const modal = document.getElementById("hotelModal");
  const form = document.getElementById("hotelForm");
  form.reset();
  document.getElementById("hotelId").value = "";

  if (hotelId) {
    const hotel = hotelsCache.find((h) => String(h.id) === String(hotelId));
    if (hotel) {
      document.getElementById("hotelId").value = hotel.id;
      document.getElementById("hotelName").value = hotel.hotel_name || "";
      document.getElementById("hotelPlace").value = hotel.place || "";
      document.getElementById("hotelRating").value = hotel.rating || 3;
      document.getElementById("hotelMinPrice").value = hotel.min_price || 0;
      document.getElementById("hotelMaxPrice").value = hotel.max_price || 0;
      document.getElementById("hotelPhone").value = hotel.phone || "";
      document.getElementById("hotelImage").value = hotel.image_url || "";
      document.getElementById("hotelActive").checked = Boolean(hotel.active);
    }
  }
  modal.style.display = "flex";
}

async function submitHotelForm(e) {
  e.preventDefault();
  const client = adminClient();
  const id = document.getElementById("hotelId").value;
  const payload = {
    hotel_name: document.getElementById("hotelName").value.trim(),
    place: document.getElementById("hotelPlace").value,
    rating: Number(document.getElementById("hotelRating").value),
    min_price: Number(document.getElementById("hotelMinPrice").value),
    max_price: Number(document.getElementById("hotelMaxPrice").value),
    phone: document.getElementById("hotelPhone").value.trim(),
    image_url: document.getElementById("hotelImage").value.trim(),
    active: document.getElementById("hotelActive").checked,
  };

  if (id) {
    await client.from("hotels").update(payload).eq("id", id);
  } else {
    await client.from("hotels").insert([payload]);
  }

  document.getElementById("hotelModal").style.display = "none";
  await renderHotelsTable();
  await fetchDashboardStats();
}

function exportBookingsCSV() {
  const rows = [
    ["Booking ID", "Tourist Name", "Hotel", "Place", "Check-in", "Check-out", "Travelers", "Status", "Date"],
    ...bookingsCache.map((b) => [
      b.id, b.full_name, b.hotel_name, b.place_name, b.check_in, b.check_out, b.travelers, b.status, b.created_at,
    ]),
  ];
  const csv = rows.map((r) => r.map(escapeCsvValue).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bookings.csv";
  a.click();
  URL.revokeObjectURL(url);
}

async function initAdminPage() {
  // Wait for supabaseClient
  let attempts = 0;
  while (!window.supabaseClient && attempts < 20) {
    await new Promise(r => setTimeout(r, 100));
    attempts++;
  }

  document.querySelectorAll(".admin-nav-link").forEach((link) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const view = link.dataset.view;
      switchAdminView(view);
      if (view === "bookings") await loadBookings();
      if (view === "hotels") await renderHotelsTable();
    });
  });

  document.getElementById("bookingSearch").addEventListener("input", (e) => {
    renderBookingsTable(e.target.value);
  });
  document.getElementById("exportCsvBtn").addEventListener("click", exportBookingsCSV);
  document.getElementById("addHotelBtn").addEventListener("click", () => openHotelModal());
  document.getElementById("hotelForm").addEventListener("submit", submitHotelForm);
  document.getElementById("hotelModalClose").addEventListener("click", () => {
    document.getElementById("hotelModal").style.display = "none";
  });

  switchAdminView("dashboard");
  await fetchDashboardStats();
  await loadBookings();
}

window.addEventListener("DOMContentLoaded", initAdminPage);
