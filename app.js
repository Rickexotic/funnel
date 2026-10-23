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

function money(v){

    return new Intl.NumberFormat(
        "es-CL"
    ).format(v);

}

function renderKPIs(data){

    const total =
        data.reduce((a,b)=>a+b.venta,0);

    const weighted =
        data.reduce(
            (a,b)=>
            a + (b.venta*b.probabilidad/100),
            0
        );

    const avg =
        data.reduce((a,b)=>a+b.probabilidad,0)
        / data.length;

    document.getElementById("kpis").innerHTML = `

    <div class="kpi">
        <div class="kpi-value">
            $${money(total)}
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
            Probabilidad Promedio
        </div>
    </div>

    <div class="kpi">
        <div class="kpi-value">
            $${money(weighted)}
        </div>
        <div class="kpi-label">
            Pipeline Ponderado
        </div>
    </div>

    <div class="kpi">
        <div class="kpi-value">
            ${data.length}
        </div>
        <div class="kpi-label">
            Oportunidades
        </div>
    </div>

    `;
}

function renderTable(data){

    const body =
        document.getElementById("tableBody");

    body.innerHTML = "";

    data.forEach(p=>{

        body.innerHTML += `

        <tr>

            <td><input value="${p.proyecto}"></td>

            <td><input value="${p.cliente}"></td>

            <td><input value="${p.venta}"></td>

            <td><input value="${p.probabilidad}"></td>

            <td><input value="${p.cierre}"></td>

        </tr>

        `;
    });
}

function tableData(){

    const rows =

        document.querySelectorAll(
            "#tableBody tr"
        );

    return [...rows].map(r=>{

        const c =
            r.querySelectorAll("input");

        return{

            proyecto:c[0].value,
            cliente:c[1].value,
            venta:Number(c[2].value),
            probabilidad:Number(c[3].value),
            cierre:c[4].value

        };

    });

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

        const isDonkey =
            index === sorted.length-1;

        const image =
            isDonkey
            ? "assets/burro.png"
            : `assets/caballo${Math.min(index+1,3)}.png`;

        racer.innerHTML = `

        <div class="bubble">

            ${p.proyecto}

        </div>

        <img src="${image}">

        `;

        racer.style.top =
            (80 + index*110) + "px";

        racer.style.left = "0px";

        racersEl.appendChild(racer);

        setTimeout(()=>{

            const width =
                racersEl.offsetWidth;

            racer.style.left =
                ((width-260)
                * p.probabilidad/100)
                +"px";

        },50);

        racer.addEventListener(
            "mousemove",
            e=>{

                tooltip.style.display =
                    "block";

                tooltip.style.left =
                    e.pageX+15+"px";

                tooltip.style.top =
                    e.pageY+15+"px";

                tooltip.innerHTML = `

                <strong>${p.proyecto}</strong>

                <hr style="margin:10px 0">

                <b>Cliente:</b>
                ${p.cliente}<br>

                <b>Venta:</b>
                $${money(p.venta)}<br>

                <b>Probabilidad:</b>
                ${p.probabilidad}%<br>

                <b>Cierre:</b>
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

document
.getElementById("addRowBtn")
.addEventListener("click",()=>{

    document
    .getElementById("tableBody")
    .innerHTML += `

    <tr>

        <td><input></td>
        <td><input></td>
        <td><input></td>
        <td><input></td>
        <td><input></td>

    </tr>

    `;
});

document
.getElementById("updateBtn")
.addEventListener("click",()=>{

    renderRace(tableData());

});

renderTable(projects);
renderRace(projects);
