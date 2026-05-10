const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const countries = {
    India: { avgIncome: 300000, top10: 1200000, currency: "₹", usdRate: 0.012 },
    USA: { avgIncome: 70000, top10: 200000, currency: "$", usdRate: 1 },
    Germany: { avgIncome: 50000, top10: 130000, currency: "€", usdRate: 1.08 },
    UK: { avgIncome: 35000, top10: 100000, currency: "£", usdRate: 1.27 },
    Japan: { avgIncome: 4500000, top10: 12000000, currency: "¥", usdRate: 0.0067 },
    Canada: { avgIncome: 60000, top10: 150000, currency: "C$", usdRate: 0.74 },
    Australia: { avgIncome: 65000, top10: 160000, currency: "A$", usdRate: 0.65 },
    Brazil: { avgIncome: 40000, top10: 120000, currency: "R$", usdRate: 0.20 },
    China: { avgIncome: 120000, top10: 400000, currency: "¥", usdRate: 0.14 },
    "South Africa": { avgIncome: 200000, top10: 700000, currency: "R", usdRate: 0.053 },
};

const GLOBAL_AVG_USD = 10000;

function calculate() {

    const countryName = document.getElementById("country").value;
    const incomeRaw = document.getElementById("income").value;

    if (!countryName) {
        alert("Please select a country.");
        return;
    }
    if (!incomeRaw || Number(incomeRaw) <= 0) {
        alert("Please enter a valid income amount.");
        return;
    }

    const income = Number(incomeRaw);
    const data = countries[countryName];

    showLoader();
    setTimeout(function () {
        hideLoader();
        showResults(income, countryName, data);
    }, 1300);
}

function getCountryPercentile(income, data) {
    if (income >= data.top10) return 95;
    if (income >= data.avgIncome * 2) return 80;
    if (income >= data.avgIncome * 1.5) return 68;
    if (income >= data.avgIncome) return 55;
    if (income >= data.avgIncome * 0.7) return 40;
    if (income >= data.avgIncome * 0.4) return 25;
    return 15;
}

function getGlobalPercentile(incomeUSD) {
    if (incomeUSD >= GLOBAL_AVG_USD * 10) return 98;
    if (incomeUSD >= GLOBAL_AVG_USD * 5) return 90;
    if (incomeUSD >= GLOBAL_AVG_USD * 2) return 75;
    if (incomeUSD >= GLOBAL_AVG_USD) return 55;
    if (incomeUSD >= GLOBAL_AVG_USD * 0.5) return 35;
    if (incomeUSD >= GLOBAL_AVG_USD * 0.2) return 20;
    return 10;
}

function getLifestyle(incomeUSD) {
    if (incomeUSD >= 100000) return { label: "Elite 🏆", sub: "Top global wealth bracket" };
    if (incomeUSD >= 50000) return { label: "Upper Class 💎", sub: "Well above global average" };
    if (incomeUSD >= 20000) return { label: "Upper-Mid 🌟", sub: "Comfortable global lifestyle" };
    if (incomeUSD >= 10000) return { label: "Middle Class 🏡", sub: "Around the global median" };
    if (incomeUSD >= 3000) return { label: "Lower-Mid 🌱", sub: "Below global average" };
    return { label: "Developing 🌍", sub: "Significant economic challenge" };
}

function countUp(element, endValue, suffix, duration) {
    let current = 0;
    const frames = Math.round(duration / (1000 / 60));
    const step = endValue / frames;

    const timer = setInterval(function () {
        current += step;
        if (current >= endValue) {
            current = endValue;
            clearInterval(timer);
        }
        element.textContent = Math.round(current) + suffix;
    }, 1000 / 60);
}

function showResults(income, countryName, data) {

    const incomeUSD = income * data.usdRate;
    const globalPct = getGlobalPercentile(incomeUSD);
    const countryPct = getCountryPercentile(income, data);
    const lifestyle = getLifestyle(incomeUSD);
    const usaEquiv = Math.round(incomeUSD * 1.1);

    countUp(document.getElementById("global-rank"), globalPct, "%", 1100);
    document.getElementById("global-sub").textContent =
        "Richer than " + globalPct + "% of the world";

    countUp(document.getElementById("country-rank"), countryPct, "%", 1100);
    document.getElementById("country-sub").textContent =
        "Top " + (100 - countryPct) + "% in " + countryName;

    document.getElementById("lifestyle-val").textContent = lifestyle.label;
    document.getElementById("lifestyle-sub").textContent = lifestyle.sub;

    document.getElementById("power-val").textContent = "$" + usaEquiv.toLocaleString();
    document.getElementById("power-sub").textContent = "USA equivalent (PPP)";

    document.querySelectorAll(".stat-card").forEach(function (card, index) {
        card.classList.remove("visible");
        setTimeout(function () {
            card.classList.add("visible");
        }, index * 110);
    });

    buildStory(income, incomeUSD, countryName, data, globalPct);

    const section = document.getElementById("results-section");
    section.style.display = "flex";

    setTimeout(function () {
        section.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 200);
}

function buildStory(income, incomeUSD, countryName, data, globalPct) {

    const phonesPerMonth = Math.floor((income / 12) / (1000 / data.usdRate));

    const coffeePerDay = Math.floor((income / 365) / (2 / data.usdRate));

    const avgMonthly = Math.round(data.avgIncome / 12).toLocaleString();

    let compCountry = "a low-income nation";
    if (incomeUSD >= 60000) compCountry = "Switzerland";
    else if (incomeUSD >= 40000) compCountry = "Germany";
    else if (incomeUSD >= 20000) compCountry = "Spain";
    else if (incomeUSD >= 10000) compCountry = "China";
    else if (incomeUSD >= 5000) compCountry = "Brazil";

    const items = [
        "🌍 You earn more than <strong>" + globalPct + "% of all people on Earth.</strong>",
        "📱 Your monthly income could buy roughly <strong>" + (phonesPerMonth > 0 ? phonesPerMonth : "less than one") + " flagship smartphone" + (phonesPerMonth !== 1 ? "s" : "") + "</strong> every month.",
        "☕ Your daily budget allows around <strong>" + coffeePerDay + " cups of coffee</strong> per day.",
        "🏙️ The average earner in " + countryName + " takes home <strong>" + data.currency + avgMonthly + " per month.</strong>",
        "🌐 Your income is comparable to the average salary in <strong>" + compCountry + ".</strong>",
        "✨ Globally you are classified as <strong>" + (incomeUSD >= 20000 ? "upper-middle class or higher." : "lower-to-middle class.") + "</strong>",
    ];

    const container = document.getElementById("story-text");
    container.innerHTML = "";

    items.forEach(function (text) {
        const div = document.createElement("div");
        div.className = "story-item";
        div.innerHTML = text;
        container.appendChild(div);
    });
}

function showLoader() {
    document.getElementById("loader").style.display = "flex";
    document.getElementById("results-section").style.display = "none";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

document.getElementById("income").addEventListener("keydown", function (e) {
    if (e.key === "Enter") calculate();
});