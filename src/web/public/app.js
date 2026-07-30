// Global App State
let activeMetrica = 'ponderado';
let currentTab = 'tab-ranking';
let chartRanking = null;
let chartEquidade = null;
let chartDonut = null;
let chartCompBar = null;
let chartUF = null;
let searchTimeout = null;

// Register Chart.js DataLabels plugin if available
if (typeof ChartDataLabels !== 'undefined') {
    Chart.register(ChartDataLabels);
}

document.addEventListener('DOMContentLoaded', () => {
    loadMetadata();
    loadAllData();
});

async function loadMetadata() {
    try {
        const res = await fetch('/api/meta');
        const data = await res.json();
        
        const ufSelect = document.getElementById('filter-uf');
        ufSelect.innerHTML = data.ufs.map(uf => `<option value="${uf}">${uf}</option>`).join('');
    } catch (e) {
        console.error('Error loading metadata:', e);
    }
}

function setMetrica(metrica) {
    activeMetrica = metrica;
    const btnPond = document.getElementById('btn-metrica-pond');
    const btnSimp = document.getElementById('btn-metrica-simp');

    if (metrica === 'ponderado') {
        btnPond.className = 'flex-1 px-3 py-2 text-xs font-bold rounded-l-lg border border-slate-300 bg-brand-700 text-white transition';
        btnSimp.className = 'flex-1 px-3 py-2 text-xs font-bold rounded-r-lg border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 transition';
    } else {
        btnSimp.className = 'flex-1 px-3 py-2 text-xs font-bold rounded-r-lg border border-slate-300 bg-brand-700 text-white transition';
        btnPond.className = 'flex-1 px-3 py-2 text-xs font-bold rounded-l-lg border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 transition';
    }

    loadAllData();
}

function switchTab(tabId) {
    currentTab = tabId;
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('border-brand-600', 'text-brand-700');
        btn.classList.add('border-transparent', 'text-slate-500');
    });

    const activeBtn = document.getElementById('btn-' + tabId);
    if (activeBtn) {
        activeBtn.classList.remove('border-transparent', 'text-slate-500');
        activeBtn.classList.add('border-brand-600', 'text-brand-700');
    }

    // Trigger chart resize if needed
    if (tabId === 'tab-ranking' && chartRanking) chartRanking.resize();
    if (tabId === 'tab-equidade' && chartEquidade) chartEquidade.resize();
    if (tabId === 'tab-distribuicao') {
        if (chartDonut) chartDonut.resize();
        if (chartCompBar) chartCompBar.resize();
    }
    if (tabId === 'tab-uf' && chartUF) chartUF.resize();
}

function getFilters() {
    const disc = document.getElementById('filter-disc').value;
    const uf = document.getElementById('filter-uf').value;
    const rede = document.getElementById('filter-rede').value;
    return { disc, uf, rede, metrica: activeMetrica };
}

async function loadAllData() {
    const filters = getFilters();
    const query = new URLSearchParams(filters).toString();

    // Update export button link
    document.getElementById('btn-export-csv').href = `/api/export?${query}`;

    // Parallel fetch for endpoints
    const [descRes, eqRes, ufRes, tableRes] = await Promise.all([
        fetch(`/api/descritores?${query}`).then(r => r.json()),
        fetch(`/api/equidade?${query}`).then(r => r.json()),
        fetch(`/api/ufs?${query}`).then(r => r.json()),
        fetch(`/api/tabela?${query}`).then(r => r.json())
    ]);

    renderKPIs(descRes.kpis);
    renderRankingChart(descRes.descritores);
    renderEquidadeChart(eqRes);
    renderDistribuicaoCharts(descRes.descritores);
    renderUFChart(ufRes);
    renderTable(tableRes.rows);
}

function renderKPIs(kpis) {
    if (!kpis || !kpis.media_geral) return;

    document.getElementById('kpi-media').innerText = `${kpis.media_geral.toFixed(1)}%`;
    document.getElementById('kpi-desc-count').innerText = `${kpis.total_descritores} descritores avaliados`;

    document.getElementById('kpi-top-val').innerText = `${kpis.top_descritor.pct.toFixed(1)}%`;
    document.getElementById('kpi-top-label').innerText = `${kpis.top_descritor.codigo} · ${kpis.top_descritor.disc}`;

    document.getElementById('kpi-worst-val').innerText = `${kpis.worst_descritor.pct.toFixed(1)}%`;
    document.getElementById('kpi-worst-label').innerText = `${kpis.worst_descritor.codigo} · ${kpis.worst_descritor.disc}`;

    document.getElementById('kpi-criticos').innerText = kpis.criticos_count;
    const pctCrit = ((kpis.criticos_count * 100.0) / kpis.total_descritores).toFixed(1);
    document.getElementById('kpi-criticos-sub').innerText = `${pctCrit}% das habilidades`;

    document.getElementById('kpi-respostas').innerText = kpis.total_respostas.toLocaleString('pt-BR');
}

// ─── Chart 1: Ranking por Descritor ──────────────────────────────────────────
// BUG FIX: tooltip uses context.dataIndex to directly retrieve the correct item
// from the sorted array — no label-text matching, so D14 LP and D14 MT always
// show their own correct value regardless of which discipline is active.
function renderRankingChart(items) {
    const ctx = document.getElementById('chart-ranking').getContext('2d');
    
    // Sort ascending so largest bar is at the top of horizontal chart
    const sorted = [...items].sort((a, b) => a.pct - b.pct);

    // Include discipline abbreviation to make labels visually distinct when showing Todos
    const labels = sorted.map(item => {
        const discAbbr = item.DS_DISCIPLINA === 'Língua Portuguesa' ? 'LP' : 'MT';
        const descShort = item.descricao.length > 42 ? item.descricao.substring(0, 42) + '…' : item.descricao;
        return `${item.CO_DESCRITOR} (${discAbbr}) — ${descShort}`;
    });

    const values = sorted.map(item => item.pct);
    
    const bgColors = sorted.map(item => {
        if (item.pct < 40.0) return '#e63946';
        if (item.pct < 70.0) return '#f4a261';
        return '#2a9d8f';
    });

    const container = document.getElementById('ranking-chart-container');
    container.style.height = `${Math.max(550, sorted.length * 26)}px`;

    if (chartRanking) chartRanking.destroy();

    chartRanking = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: bgColors,
                borderRadius: 4,
                barThickness: 16
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: true,
                    callbacks: {
                        title: (contexts) => {
                            // INDEX-BASED — guarantees correct data for every bar
                            const item = sorted[contexts[0].dataIndex];
                            return `${item.CO_DESCRITOR} · ${item.DS_DISCIPLINA}`;
                        },
                        label: (context) => {
                            // INDEX-BASED — no label lookup at all
                            const item = sorted[context.dataIndex];
                            return [
                                `📖 ${item.descricao}`,
                                `✅ Acerto: ${item.pct.toFixed(1)}%`,
                                `📊 Respostas: ${item.TOTAL_RESPOSTAS.toLocaleString('pt-BR')}`
                            ];
                        }
                    }
                },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: (val) => `${val.toFixed(1)}%`,
                    font: { weight: '700', size: 10 },
                    color: '#475569'
                }
            },
            scales: {
                x: {
                    min: 0,
                    max: Math.min(100, (values.length > 0 ? Math.max(...values) : 50) + 12),
                    grid: { color: '#f1f5f9' },
                    ticks: { callback: v => v + '%', font: { size: 11 } }
                },
                y: {
                    grid: { display: false },
                    ticks: { font: { size: 10, family: 'Inter' } }
                }
            }
        }
    });
}

// ─── Chart 2: Equidade (Pública vs Privada Diverging Gap) ───────────────────────
function renderEquidadeChart(data) {
    if (!data || !data.items) return;

    document.getElementById('eq-avg-gap').innerText = `+${data.avg_gap.toFixed(1)} pp`;
    if (data.top_gap) {
        document.getElementById('eq-top-code').innerText = `${data.top_gap.CO_DESCRITOR} (${data.top_gap.DS_DISCIPLINA})`;
        document.getElementById('eq-top-gap').innerText = `+${data.top_gap.gap.toFixed(1)} pp`;
    }
    if (data.min_gap) {
        document.getElementById('eq-min-code').innerText = `${data.min_gap.CO_DESCRITOR} (${data.min_gap.DS_DISCIPLINA})`;
        document.getElementById('eq-min-gap').innerText = `+${data.min_gap.gap.toFixed(1)} pp`;
    }

    const ctx = document.getElementById('chart-equidade').getContext('2d');
    const items = [...data.items].reverse(); // ascending gap order for bottom-up

    const labels = items.map(item => `${item.CO_DESCRITOR} — ${item.descricao.substring(0, 40)}…`);
    const gaps = items.map(item => item.gap);
    const bgColors = gaps.map(g => g >= 0 ? '#0d9488' : '#e63946');

    if (chartEquidade) chartEquidade.destroy();

    chartEquidade = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Vantagem da Privada (pp)',
                data: gaps,
                backgroundColor: bgColors,
                borderRadius: 4,
                barThickness: 14
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: (ctx) => {
                            const item = items[ctx[0].dataIndex];
                            return `${item.CO_DESCRITOR} (${item.DS_DISCIPLINA})`;
                        },
                        label: (ctx) => {
                            const item = items[ctx.dataIndex];
                            return [
                                `Pública: ${item.Pública.toFixed(1)}%`,
                                `Privada: ${item.Privada.toFixed(1)}%`,
                                `Vantagem Privada (Gap): +${item.gap.toFixed(1)} pp`
                            ];
                        }
                    }
                },
                datalabels: {
                    anchor: v => v.value >= 0 ? 'end' : 'start',
                    align: v => v.value >= 0 ? 'end' : 'start',
                    formatter: v => `+${v.toFixed(1)} pp`,
                    font: { weight: 'bold', size: 9 },
                    color: '#0f766e'
                }
            },
            scales: {
                x: {
                    grid: { color: '#f1f5f9' },
                    ticks: { callback: v => v + ' pp' }
                },
                y: {
                    grid: { display: false },
                    ticks: { font: { size: 10 } }
                }
            }
        }
    });
}

// ─── Chart 3: Distribuição por Faixas (Donut + Comp Bar) ───────────────────────
function renderDistribuicaoCharts(items) {
    let crit = 0, inter = 0, adeq = 0;
    let lpCounts = { crit: 0, inter: 0, adeq: 0 };
    let mtCounts = { crit: 0, inter: 0, adeq: 0 };

    items.forEach(item => {
        if (item.pct < 40.0) {
            crit++;
            if (item.DS_DISCIPLINA === 'Língua Portuguesa') lpCounts.crit++;
            else mtCounts.crit++;
        } else if (item.pct < 70.0) {
            inter++;
            if (item.DS_DISCIPLINA === 'Língua Portuguesa') lpCounts.inter++;
            else mtCounts.inter++;
        } else {
            adeq++;
            if (item.DS_DISCIPLINA === 'Língua Portuguesa') lpCounts.adeq++;
            else mtCounts.adeq++;
        }
    });

    // Donut
    const ctxDonut = document.getElementById('chart-donut').getContext('2d');
    if (chartDonut) chartDonut.destroy();

    chartDonut = new Chart(ctxDonut, {
        type: 'doughnut',
        data: {
            labels: ['Crítico (<40%)', 'Intermediário (40-70%)', 'Adequado (>70%)'],
            datasets: [{
                data: [crit, inter, adeq],
                backgroundColor: ['#e63946', '#f4a261', '#2a9d8f']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                datalabels: {
                    formatter: (val, ctx) => {
                        const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                        const pct = ((val * 100) / total).toFixed(0);
                        return val > 0 ? `${val} (${pct}%)` : '';
                    },
                    color: '#fff',
                    font: { weight: 'bold', size: 11 }
                }
            }
        }
    });

    // Comp Bar
    const ctxComp = document.getElementById('chart-comp-bar').getContext('2d');
    if (chartCompBar) chartCompBar.destroy();

    chartCompBar = new Chart(ctxComp, {
        type: 'bar',
        data: {
            labels: ['Crítico', 'Intermediário', 'Adequado'],
            datasets: [
                {
                    label: 'Língua Portuguesa',
                    data: [lpCounts.crit, lpCounts.inter, lpCounts.adeq],
                    backgroundColor: '#14b8a6'
                },
                {
                    label: 'Matemática',
                    data: [mtCounts.crit, mtCounts.inter, mtCounts.adeq],
                    backgroundColor: '#0f766e'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    font: { weight: 'bold', size: 10 }
                }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                x: { grid: { display: false } }
            }
        }
    });
}

// ─── Chart 4: Geografia por UF ──────────────────────────────────────────────────
function renderUFChart(data) {
    if (!data || !data.ufs) return;

    const ctx = document.getElementById('chart-uf').getContext('2d');
    const ufs = data.ufs;

    const labels = ufs.map(u => u.NM_UF);
    const values = ufs.map(u => u.pct);

    if (chartUF) chartUF.destroy();

    chartUF = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Taxa de Acerto (%)',
                data: values,
                backgroundColor: '#14b8a6',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: v => v.toFixed(1) + '%',
                    font: { weight: 'bold', size: 9 },
                    color: '#0f766e'
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 9 }, maxRotation: 45, minRotation: 45 }
                },
                y: {
                    min: 0,
                    max: Math.min(100, Math.max(...values) + 10),
                    grid: { color: '#f1f5f9' },
                    ticks: { callback: v => v + '%' }
                }
            }
        }
    });
}

// ─── Table & Search ─────────────────────────────────────────────────────────────
function renderTable(rows) {
    const tbody = document.getElementById('table-body');
    if (!rows || rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="px-4 py-8 text-center text-slate-400">Nenhum registro encontrado.</td></tr>`;
        return;
    }

    tbody.innerHTML = rows.map(r => `
        <tr class="hover:bg-slate-50 transition">
            <td class="px-4 py-2.5 font-bold text-slate-900">${r.DS_DISCIPLINA}</td>
            <td class="px-4 py-2.5 font-bold text-brand-700">${r.CO_DESCRITOR}</td>
            <td class="px-4 py-2.5 text-slate-700">${r.DS_HABILIDADE}</td>
            <td class="px-4 py-2.5 text-slate-600">${r.NM_UF}</td>
            <td class="px-4 py-2.5 text-slate-600">${r.TP_REDE}</td>
            <td class="px-4 py-2.5 text-right font-mono text-slate-600">${r.TOTAL_RESPOSTAS.toLocaleString('pt-BR')}</td>
            <td class="px-4 py-2.5 text-right font-mono text-slate-600">${r.TOTAL_ACERTOS.toLocaleString('pt-BR')}</td>
            <td class="px-4 py-2.5 text-right font-bold text-slate-800">${r.PCT_ACERTO.toFixed(1)}%</td>
            <td class="px-4 py-2.5 text-right font-bold text-brand-800">${r.PCT_ACERTO_PONDERADO.toFixed(1)}%</td>
        </tr>
    `).join('');
}

function debounceSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        const queryStr = document.getElementById('search-input').value;
        const filters = getFilters();
        filters.search = queryStr;
        const res = await fetch(`/api/tabela?${new URLSearchParams(filters).toString()}`);
        const data = await res.json();
        renderTable(data.rows);
    }, 300);
}
