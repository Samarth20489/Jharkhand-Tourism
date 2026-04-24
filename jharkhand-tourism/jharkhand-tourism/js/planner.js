const SUPABASE_FUNCTION_URL = "https://qdxdwrpljyejupksredi.supabase.co/functions/v1/plan-trip";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkeGR3cnBsanllanVwa3NyZWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzI4ODQsImV4cCI6MjA5MjQ0ODg4NH0.V1vYMiqOHhAM1UpvocLa_p0I95X6nQlLCdoAYI1pDXs";

const loadingMessages = [
  "Consulting local experts...",
  "Checking road conditions to Betla...",
  "Finding the best dhabas on route...",
  "Calculating Hundru Falls visit timing...",
  "Almost ready - finalising your plan...",
];

document.addEventListener("DOMContentLoaded", () => {
  const tags = document.querySelectorAll(".tag");
  const form = document.getElementById("plannerForm");
  const resetBtn = document.getElementById("resetBtn");

  tags.forEach((btn) => {
    btn.addEventListener("click", () => btn.classList.toggle("active"));
  });

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      generatePlan();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetPlanner);
  }
});

function cycleLoadingMessages() {
  let i = 0;
  return setInterval(() => {
    const el = document.getElementById("loadingText");
    if (el) el.textContent = loadingMessages[i % loadingMessages.length];
    i += 1;
  }, 1800);
}

async function generatePlan() {
  const location = document.getElementById("location").value.trim();
  const budget = Number(document.getElementById("budget").value);
  const days = Number(document.getElementById("days").value);
  const travelers = Number(document.getElementById("travelers").value);
  const travelStyle = document.getElementById("travelStyle").value;
  const interests = [...document.querySelectorAll(".tag.active")].map((b) => b.dataset.value);

  if (!location) return showError("Please enter your current city.");
  if (!budget || budget < 500) return showError("Minimum budget is ₹500.");
  if (days < 1 || days > 14) return showError("Please enter between 1 and 14 days.");
  if (travelers < 1 || travelers > 20) return showError("Please enter between 1 and 20 travelers.");
  if (interests.length === 0) return showError("Please select at least one interest.");

  document.getElementById("plannerForm").style.display = "none";
  document.getElementById("plannerResult").style.display = "none";
  document.getElementById("plannerLoading").style.display = "flex";
  const msgInterval = cycleLoadingMessages();

  try {
    const response = await fetch(SUPABASE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ location, budget, days, travelers, travelStyle, interests }),
    });

    const plan = await response.json();
    if (!response.ok) throw new Error(plan?.error || `API error: ${response.status}`);

    clearInterval(msgInterval);
    renderPlan(plan);
  } catch (err) {
    clearInterval(msgInterval);
    showError("Something went wrong. Please try again in a moment.");
    console.error(err);
    document.getElementById("plannerLoading").style.display = "none";
    document.getElementById("plannerForm").style.display = "block";
  }
}

function renderPlan(plan) {
  document.getElementById("plannerLoading").style.display = "none";

  const bb = plan.budgetBreakdown || {};
  const days = Array.isArray(plan.days) ? plan.days : [];
  const mustKnow = Array.isArray(plan.mustKnow) ? plan.mustKnow : [];

  const html = `
    <div class="plan-header">
      <h2>${plan.tripTitle || "Jharkhand Trip Plan"}</h2>
      <p class="plan-summary">${plan.summary || ""}</p>
      <div class="entry-route"><strong>🚂 How to reach:</strong> ${plan.entryRoute || ""}</div>
    </div>

    <div class="budget-card">
      <h3>Budget Breakdown</h3>
      <div class="budget-grid">
        ${renderBudgetRow("🚌 Transport", bb.transport)}
        ${renderBudgetRow("🏨 Accommodation", bb.accommodation)}
        ${renderBudgetRow("🍽️ Food", bb.food)}
        ${renderBudgetRow("🎟️ Activities", bb.activities)}
        ${renderBudgetRow("🧾 Miscellaneous", bb.miscellaneous)}
      </div>
      <div class="budget-total">
        <span>Total Estimated Cost</span>
        <span>₹${Number(bb.total || 0).toLocaleString("en-IN")}</span>
      </div>
    </div>

    <div class="days-section">
      <h3>Day-by-Day Itinerary</h3>
      ${days.map((d) => renderDay(d)).join("")}
    </div>

    ${renderMustKnow(mustKnow)}

    <div class="best-time">
      <strong>🗓️ Best time to visit:</strong> ${plan.bestTimeToVisit || ""}
    </div>
  `;

  document.getElementById("resultContent").innerHTML = html;
  document.getElementById("plannerResult").style.display = "block";
  document.getElementById("plannerResult").scrollIntoView({ behavior: "smooth" });
}

function renderBudgetRow(label, amount) {
  return `
    <div class="budget-row">
      <span>${label}</span>
      <span>₹${Number(amount || 0).toLocaleString("en-IN")}</span>
    </div>`;
}

function renderDay(d) {
  return `
    <div class="day-card">
      <div class="day-header">
        <span class="day-number">Day ${d.day}</span>
        <span class="day-title">${d.title}</span>
        <span class="day-cost">₹${Number(d.estimatedDayCost || 0).toLocaleString("en-IN")}</span>
      </div>
      <div class="day-locations">📍 ${(d.locations || []).join(" → ")}</div>
      <div class="day-schedule">
        <div class="schedule-item"><span>🌅 Morning</span><p>${d.morning || ""}</p></div>
        <div class="schedule-item"><span>☀️ Afternoon</span><p>${d.afternoon || ""}</p></div>
        <div class="schedule-item"><span>🌆 Evening</span><p>${d.evening || ""}</p></div>
      </div>
      <div class="day-details">
        <div class="detail-chip">🏨 ${d.accommodation || ""}</div>
        <div class="detail-chip">🍽️ ${d.meals || ""}</div>
        <div class="detail-chip">🚗 ${d.transport || ""}</div>
      </div>
      <div class="local-tip">💡 Local tip: ${d.localTip || ""}</div>
    </div>`;
}

function renderMustKnow(tips) {
  return `
    <div class="must-know">
      <h3>⚠️ Must Know Before You Go</h3>
      <ul>${tips.map((t) => `<li>${t}</li>`).join("")}</ul>
    </div>`;
}

function showError(msg) {
  alert(msg);
}

function resetPlanner() {
  document.getElementById("plannerResult").style.display = "none";
  document.getElementById("plannerForm").style.display = "block";
  document.getElementById("plannerForm").scrollIntoView({ behavior: "smooth" });
}
