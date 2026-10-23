const projects = [

{
    proyecto:"Belong",
    cliente:"Belong",
    venta:120000000,
    probabilidad:90,
    cierre:"2026-11-30"
},

{
    proyecto:"MUV",
    cliente:"Metro de Santiago",
    venta:85000000,
    probabilidad:75,
    cierre:"2026-11-15"
},

{
    proyecto:"Iplacex",
    cliente:"Iplacex",
    venta:45000000,
    probabilidad:45,
    cierre:"2026-12-10"
},

{
    proyecto:"AMB",
    cliente:"AMB",
    venta:12000000,
    probabilidad:15,
    cierre:"2027-01-15"
}

];

const racersEl = document.getElementById("racers");
const tooltip = document.getElementById("tooltip");
const dataInput = document.getElementById("dataInput");

dataInput.value = projects.map(p =>
`${p.proyecto};${p.cliente};${p.venta};${p.probabilidad};${p.cierre}`
).join("\n");

function formatMoney(v){

    return new Intl.NumberFormat(
        "es-CL"
    ).format(v);

}

function renderKPIs(data){

    const total =
        data.reduce((a,b)=>a+b.venta,0);

    const weighted =
        data.reduce(
            (a,b)=>a + (b.venta * b.probabilidad/100),
            0
        );

    const avg =
        data.reduce((a,b)=>a+b.probabilidad,0)
        / data.length;

    document.getElementById("kpis").innerHTML = `

    <div class="kpi">
        <div class="kpi-value">
            $${formatMoney(total)}
        </div>
        <div class="kpi-label">
            Pipeline
        </div>
    </div>

    <div class="kpi">
        <div class="kpi-value">
            ${avg.toFixed(0)}%
        </div>
        <div class="kpi-label">
            Probabilidad
        </div>
    </div>

    <div class="kpi">
        <div class="kpi-value">
            $${formatMoney(weighted)}
        </div>
        <div class="kpi-label">
            Weighted
        </div>
    </div>

    <div class="kpi">
        <div class="kpi-value">
            ${data.length}
        </div>
        <div class="kpi-label">
            Proyectos
        </div>
    </div>

    `;
}

function renderRace(data){

    racersEl.innerHTML = "";

    const sorted =
        [...data]
        .sort(
            (a,b)=>
            b.probabilidad-a.probabilidad
        );

    sorted.forEach((p,index)=>{

        const racer =
            document.createElement("div");

        racer.className = "racer";

        const isLast =
            index === sorted.length-1;

        const animal =
            isLast
            ? "assets/burro.png"
            : `assets/caballo${Math.min(index+1,3)}.png`;

        racer.innerHTML = `

            <div class="bubble">
                ${p.proyecto}
            </div>

            ${animal}

        `;

        const y =
            80 + (index*90);

        racer.style.top =
            y + "px";

        racer.style.left = "0px";

        racersEl.appendChild(racer);

        setTimeout(()=>{

            const width =
                racersEl.clientWidth;

            racer.style.left =
                ((width-220) *
                p.probabilidad /100) + "px";

        },100);

        racer.addEventListener(
            "mousemove",
            e=>{

                tooltip.style.display =
                    "block";

                tooltip.style.left =
                    e.pageX + 15 + "px";

                tooltip.style.top =
                    e.pageY + 15 + "px";

                tooltip.innerHTML = `

                    <strong>${p.proyecto}</strong>
                    <hr>

                    Cliente:
                    ${p.cliente}<br>

                    Venta:
                    $${formatMoney(p.venta)}<br>

                    Probabilidad:
                    ${p.probabilidad}%<br>

                    Cierre:
                    ${p.cierre}

                `;

            }
        );

        racer.addEventListener(
            "mouseleave",
            ()=>{

                tooltip.style.display =
                    "none";

            }
        );

    });

    renderKPIs(sorted);
}

renderRace(projects);

document
.getElementById("updateBtn")
.addEventListener(
    "click",
    ()=>{

        const rows =
            dataInput.value
            .trim()
            .split("\n");

        const data =
            rows.map(r=>{

                const c =
                    r.split(";");

                return {

                    proyecto:c[0],
                    cliente:c[1],
                    venta:Number(c[2]),
                    probabilidad:Number(c[3]),
                    cierre:c[4]

                };

            });

        renderRace(data);

    }
);
