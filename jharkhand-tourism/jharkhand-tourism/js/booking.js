function getBookingParams() {
  const params = new URLSearchParams(window.location.search);
  const rawPrice = Number(params.get("price"));
  return {
    hotel: params.get("hotel") || "Selected Hotel",
    place: params.get("place") || "Jharkhand",
    price: Number.isFinite(rawPrice) && rawPrice > 0 ? rawPrice : 1500,
  };
}

function calcNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function money(value) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function showError(message) {
  const box = document.getElementById("bookingError");
  if (!box) return;
  box.textContent = message;
  box.style.display = "block";
}

function clearError() {
  const box = document.getElementById("bookingError");
  if (!box) return;
  box.textContent = "";
  box.style.display = "none";
}

function renderSummary(baseRate) {
  const travelers = Number(document.getElementById("travelers").value || 1);
  const checkIn = document.getElementById("checkin").value;
  const checkOut = document.getElementById("checkout").value;
  const nights = calcNights(checkIn, checkOut);
  const subtotal = nights * travelers * baseRate;
  const taxes = subtotal * 0.12;
  const total = subtotal + taxes;

  document.getElementById("sumCheckIn").textContent = checkIn || "-";
  document.getElementById("sumCheckOut").textContent = checkOut || "-";
  document.getElementById("sumNights").textContent = String(nights);
  document.getElementById("sumTravelers").textContent = String(travelers);
  document.getElementById("sumRate").textContent = money(baseRate);
  document.getElementById("sumSubtotal").textContent = money(subtotal);
  document.getElementById("sumTaxes").textContent = money(taxes);
  document.getElementById("sumTotal").textContent = money(total);
}

function showSuccess(payload) {
  document.getElementById("bookingLayout").style.display = "none";
  document.getElementById("successSummary").innerHTML = `
    <p><strong>Booking ID:</strong> ${payload.id || "Generated"}</p>
    <p><strong>Hotel:</strong> ${payload.hotel_name}</p>
    <p><strong>Place:</strong> ${payload.place_name}</p>
    <p><strong>Check-in:</strong> ${payload.check_in}</p>
    <p><strong>Check-out:</strong> ${payload.check_out}</p>
    <p><strong>Travelers:</strong> ${payload.travelers}</p>
  `;
  const text = encodeURIComponent(`I booked ${payload.hotel_name} at Jharkhand Tourism`);
  document.getElementById("waShareBtn").href = `https://wa.me/917999999999?text=${text}`;
  document.getElementById("bookingSuccess").style.display = "block";
}

function bindTravelerStepper(baseRate) {
  document.getElementById("travelerMinus").addEventListener("click", () => {
    const input = document.getElementById("travelers");
    input.value = String(Math.max(1, Number(input.value || 1) - 1));
    renderSummary(baseRate);
  });
  document.getElementById("travelerPlus").addEventListener("click", () => {
    const input = document.getElementById("travelers");
    input.value = String(Math.min(20, Number(input.value || 1) + 1));
    renderSummary(baseRate);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  // Wait for supabaseClient to be ready
  let attempts = 0;
  while (!window.supabaseClient && attempts < 20) {
    await new Promise(r => setTimeout(r, 100));
    attempts++;
  }

  if (!window.supabaseClient) {
    showError("Connection error. Please refresh the page.");
    return;
  }

  const { hotel, place, price } = getBookingParams();
  document.getElementById("bookingHotelName").textContent = hotel;
  document.getElementById("bookingPlaceName").textContent = place;
  document.getElementById("summaryHotelName").textContent = hotel;
  document.getElementById("summaryPlaceName").textContent = place;
  document.getElementById("bookingWhatsAppBtn").href =
    `https://wa.me/917999999999?text=${encodeURIComponent(`I want to book ${hotel}`)}`;

  bindTravelerStepper(price);
  ["travelers", "checkin", "checkout"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => renderSummary(price));
  });
  renderSummary(price);

  document.getElementById("bookingForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const travelers = Number(document.getElementById("travelers").value);
    const specialRequests = document.getElementById("specialRequests").value.trim();
    const nights = calcNights(checkin, checkout);

    if (!fullName || !email || !phone || !checkin || !checkout)
      return showError("Please fill all required fields.");
    if (travelers < 1 || travelers > 20)
      return showError("Travelers must be between 1 and 20.");
    if (nights < 1)
      return showError("Check-out date must be after check-in date.");

    const button = document.getElementById("submitBookingBtn");
    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span> Booking...';

    const bookingData = {
      name: fullName,
      email,
      phone,
      hotel_name: hotel,
      place: place,
      check_in: checkin,
      check_out: checkout,
      travelers,
      status: "pending",
    };

    try {
      const { data, error } = await window.supabaseClient
        .from("bookings")
        .insert([bookingData])
        .select()
        .single();
      if (error) throw error;
      showSuccess(data);
    } catch (err) {
      showError("Booking failed: " + (err.message || "Please try again."));
    } finally {
      button.disabled = false;
      button.textContent = "Confirm Booking →";
    }
  });
});
