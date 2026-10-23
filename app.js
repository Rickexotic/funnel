const projects = [
  {
    proyecto: "Belong",
    cliente: "Belong",
    venta: 120000000,
    probabilidad: 90,
    cierre: "2026-11-30"
  },
  {
    proyecto: "MUV",
    cliente: "Metro de Santiago",
    venta: 85000000,
    probabilidad: 75,
    cierre: "2026-11-15"
  },
  {
    proyecto: "Iplacex",
    cliente: "Iplacex",
    venta: 45000000,
    probabilidad: 45,
    cierre: "2026-12-10"
  },
  {
    proyecto: "AMB",
    cliente: "AMB",
    venta: 12000000,
    probabilidad: 15,
    cierre: "2027-01-15"
  }
];

const racersEl = document.getElementById("racers");
const tooltip = document.getElementById("tooltip");

function money(v) {
  return new Intl.NumberFormat("es-CL").format(v);
}

function renderKPIs(data) {
  const total = data.reduce((a, b) => a + b.venta, 0);

  const weighted = data.reduce(
    (a, b) => a + (b.venta * b.probabilidad) / 100,
    0
  );

  const avg = data.reduce((a, b) => a + b.probabilidad, 0) / data.length;

  document.getElementById("kpis").innerHTML = `
    <div class="kpi">
      <div class="kpi-value">$${money(total)}</div>
      <div class="kpi-label">Pipeline</div>
    </div>

    <div class="kpi">
      <div class="kpi-value">${avg.toFixed(0)}%</div>
      <div class="kpi-label">Probabilidad Promedio</div>
    </div>

    <div class="kpi">
      <div class="kpi-value">$${money(weighted)}</div>
      <div class="kpi-label">Pipeline Ponderado</div>
    </div>

    <div class="kpi">
      <div class="kpi-value">${data.length}</div>
      <div class="kpi-label">Oportunidades</div>
    </div>
  `;
}

function renderTable(data) {
  const body = document.getElementById("tableBody");
  body.innerHTML = "";

  data.forEach((p) => {
    body.innerHTML += `
      <tr>
        <td><input value="${p.proyecto}"></td>
        <td><input value="${p.cliente}"></td>
        <td><input type="number" value="${p.venta}"></td>
        <td><input type="number" value="${p.probabilidad}"></td>
        <td><input type="date" value="${p.cierre}"></td>
      </tr>
    `;
  });
}

function tableData() {
  const rows = document.querySelectorAll("#tableBody tr");

  return [...rows].map((r) => {
    const c = r.querySelectorAll("input");

    return {
      proyecto: c[0].value,
      cliente: c[1].value,
      venta: Number(c[2].value) || 0,
      probabilidad: Number(c[3].value) || 0,
      cierre: c[4].value
    };
  });
}

/** Espaciado responsive: más juntos en desktop y móvil */
function getRaceLayout() {
  const isMobile = window.innerWidth <= 768;
  return {
    topStart: isMobile ? 52 : 62,
    rowGap: isMobile ? 76 : 86,
    leftPadding: 8,
    rightPadding: 170 // reserva espacio para la imagen al final
  };
}

/** Tooltip cerca del elemento y siempre dentro de pantalla */
function placeTooltip(pageX, pageY) {
  const margin = 8;
  const offset = 10;

  tooltip.style.display = "block";
  tooltip.style.visibility = "hidden"; // medir sin parpadeo

  const tw = tooltip.offsetWidth || 180;
  const th = tooltip.offsetHeight || 90;

  let x = pageX + offset;
  let y = pageY + offset;

  const maxX = window.scrollX + window.innerWidth - tw - margin;
  const maxY = window.scrollY + window.innerHeight - th - margin;

  if (x > maxX) x = pageX - tw - offset;
  if (y > maxY) y = pageY - th - offset;

  if (x < window.scrollX + margin) x = window.scrollX + margin;
  if (y < window.scrollY + margin) y = window.scrollY + margin;

  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
  tooltip.style.visibility = "visible";
}

function setTooltipContent(p) {
  tooltip.innerHTML = `
    <strong>${p.proyecto}</strong>
    <hr style="margin:8px 0">
    <b>Cliente:</b> ${p.cliente}<br>
    <b>Venta:</b> $${money(p.venta)}<br>
    <b>Probabilidad:</b> ${p.probabilidad}%<br>
    <b>Cierre:</b> ${p.cierre}
  `;
}

function renderRace(data) {
  racersEl.innerHTML = "";

  const sorted = [...data].sort((a, b) => b.probabilidad - a.probabilidad);
  const { topStart, rowGap, leftPadding, rightPadding } = getRaceLayout();

  sorted.forEach((p, index) => {
    const racer = document.createElement("div");
    racer.className = "racer";

    const isDonkey = index === sorted.length - 1;
    const image = isDonkey
      ? "assets/burro.png"
      : `assets/caballo${Math.min(index + 1, 3)}.png`;

    racer.innerHTML = `
      <div class="bubble">${p.proyecto}</div>
      <img src="${image}">
    `;

    racer.style.top = `${topStart + index * rowGap}px`;
    racer.style.left = `${leftPadding}px`;

    racersEl.appendChild(racer);

    setTimeout(() => {
      const width = racersEl.offsetWidth;
      const usable = Math.max(40, width - rightPadding - leftPadding);
      racer.style.left = `${leftPadding + (usable * p.probabilidad) / 100}px`;
    }, 50);

    // Desktop: mouse
    racer.addEventListener("mousemove", (e) => {
      setTooltipContent(p);
      placeTooltip(e.pageX, e.pageY);
    });

    racer.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });

    // Móvil: touch
    racer.addEventListener(
      "touchstart",
      (e) => {
        const t = e.touches[0];
        setTooltipContent(p);
        placeTooltip(t.pageX, t.pageY);
      },
      { passive: true }
    );

    racer.addEventListener(
      "touchmove",
      (e) => {
        const t = e.touches[0];
        placeTooltip(t.pageX, t.pageY);
      },
      { passive: true }
    );

    racer.addEventListener("touchend", () => {
      tooltip.style.display = "none";
    });
  });

  renderKPIs(sorted);
}

document.getElementById("addRowBtn").addEventListener("click", () => {
  document.getElementById("tableBody").innerHTML += `
    <tr>
      <td><input></td>
      <td><input></td>
      <td><input type="number"></td>
      <td><input type="number"></td>
      <td><input type="date"></td>
    </tr>
  `;
});

document.getElementById("updateBtn").addEventListener("click", () => {
  renderRace(tableData());
});

window.addEventListener("resize", () => {
  renderRace(tableData());
});

renderTable(projects);
renderRace(projects);
