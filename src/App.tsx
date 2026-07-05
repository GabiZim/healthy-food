import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { FOOD_GROUP_OPTIONS } from './foods';
import type { Food, FoodStatus } from './types';
import {
  STATUS_LABELS,
  STATUS_ORDER,
  WEEK_TARGET,
  buildDefaultFoods,
  createFood,
  formatNumber,
  getFoodWeight,
  getWeekHistory,
  getWeightedSum,
  normalizeText,
  runChecks,
  sanitizeFoods
} from './utils';

const STORAGE_KEY = 'healthy-food-tracker-v1';

const statusClass: Record<FoodStatus, string> = {
  genutzt: 'status-used',
  vorhanden: 'status-available',
  zukaufen: 'status-buy',
  spaeter: 'status-later'
};

runChecks();

function App() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodGroup, setNewFoodGroup] = useState(FOOD_GROUP_OPTIONS[0]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | FoodStatus>('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setFoods(buildDefaultFoods());
      return;
    }

    try {
      setFoods(sanitizeFoods(JSON.parse(saved)));
    } catch {
      setFoods(buildDefaultFoods());
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foods));
  }, [foods]);

  const weightedSum = useMemo(() => getWeightedSum(foods), [foods]);
  const progress = Math.min((weightedSum / WEEK_TARGET) * 100, 100);
  const history = useMemo(() => getWeekHistory(foods, 6), [foods]);

  const counts = useMemo(() => {
    return STATUS_ORDER.reduce((acc, status) => {
      acc[status] = foods.filter((food) => food.status === status).length;
      return acc;
    }, {} as Record<FoodStatus, number>);
  }, [foods]);

  const filteredFoods = useMemo(() => {
    const query = search.toLowerCase().trim();
    return foods.filter((food) => {
      if (query && !food.name.toLowerCase().includes(query) && !food.group.toLowerCase().includes(query)) return false;
      if (statusFilter !== 'all' && food.status !== statusFilter) return false;
      if (groupFilter !== 'all' && food.group !== groupFilter) return false;
      return true;
    });
  }, [foods, search, statusFilter, groupFilter]);

  const groupedFoods = useMemo(() => {
    const groups = filteredFoods.reduce((acc, food) => {
      if (!acc[food.group]) acc[food.group] = [];
      acc[food.group].push(food);
      return acc;
    }, {} as Record<string, Food[]>);

    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b, 'de'))
      .map(([group, items]) => ({
        group,
        items: items.sort((a, b) => a.name.localeCompare(b.name, 'de'))
      }));
  }, [filteredFoods]);

  function addFood() {
    const name = normalizeText(newFoodName);
    if (!name) return;

    const duplicate = foods.some((food) => food.name.toLowerCase() === name.toLowerCase() && food.group === newFoodGroup);
    if (duplicate) {
      setNewFoodName('');
      return;
    }

    setFoods((current) => [createFood(name, newFoodGroup), ...current]);
    setNewFoodName('');
  }

  function updateStatus(id: string, status: FoodStatus) {
    setFoods((current) =>
      current.map((food) => {
        if (food.id !== id) return food;
        return {
          ...food,
          status,
          usedAt: status === 'genutzt' ? new Date().toISOString() : food.usedAt
        };
      })
    );
  }

  function removeFood(id: string) {
    setFoods((current) => current.filter((food) => food.id !== id));
  }

  function resetToDefault() {
    const ok = window.confirm('Soll die Liste wirklich auf den Anfangszustand zurueckgesetzt werden? Deine lokalen Aenderungen gehen verloren.');
    if (!ok) return;
    setFoods(buildDefaultFoods());
  }

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Aktuelle Woche</p>
          <h1>Healthy Food Tracker</h1>
          <p className="hero-text">Nutze jede Woche mindestens 3 gewichtete gesunde Lebensmittel.</p>
        </div>
        <div className="score-box">
          <span className="score">{formatNumber(weightedSum)} / {WEEK_TARGET}</span>
          <span className="score-label">gewichtete Punkte</span>
        </div>
        <div className="progress-track" aria-label="Wochenfortschritt">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="stats-grid">
        {STATUS_ORDER.map((status) => (
          <button
            key={status}
            type="button"
            className={`stat-card ${statusClass[status]} ${statusFilter === status ? 'active-filter' : ''}`}
            onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
          >
            <span>{STATUS_LABELS[status]}</span>
            <strong>{counts[status] ?? 0}</strong>
          </button>
        ))}
      </section>

      <section className="panel add-panel">
        <h2>Lebensmittel hinzufuegen</h2>
        <div className="add-grid">
          <input
            value={newFoodName}
            onChange={(event) => setNewFoodName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') addFood();
            }}
            placeholder="z. B. Birne"
          />
          <select value={newFoodGroup} onChange={(event) => setNewFoodGroup(event.target.value)}>
            {FOOD_GROUP_OPTIONS.map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
          <button type="button" className="primary-button" onClick={addFood}>
            <Plus size={18} /> Hinzufuegen
          </button>
        </div>
      </section>

      <section className="panel filters-panel">
        <h2>Filtern und suchen</h2>
        <div className="filter-grid">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Suche nach Lebensmittel oder Gruppe" />
          <select value={groupFilter} onChange={(event) => setGroupFilter(event.target.value)}>
            <option value="all">Alle Gruppen</option>
            {FOOD_GROUP_OPTIONS.map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | FoodStatus)}>
            <option value="all">Alle Status</option>
            {STATUS_ORDER.map((status) => (
              <option key={status} value={status}>{STATUS_LABELS[status]}</option>
            ))}
          </select>
          <button type="button" className="secondary-button" onClick={resetToDefault}>
            <RotateCcw size={16} /> Zuruecksetzen
          </button>
        </div>
      </section>

      <section className="content-grid">
        <div className="groups-list">
          {groupedFoods.length === 0 ? (
            <div className="empty-state">Keine Lebensmittel gefunden. Bitte Filter oder Suche pruefen.</div>
          ) : (
            groupedFoods.map(({ group, items }) => {
              const collapsed = collapsedGroups[group];
              return (
                <article key={group} className="group-card">
                  <button
                    type="button"
                    className="group-header"
                    onClick={() => setCollapsedGroups((current) => ({ ...current, [group]: !current[group] }))}
                  >
                    <span>{collapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}</span>
                    <strong>{group}</strong>
                    <em>{items.length}</em>
                  </button>
                  {!collapsed && (
                    <div className="food-list">
                      {items.map((food) => (
                        <div key={food.id} className={`food-row ${statusClass[food.status]}`}>
                          <div className="food-main">
                            <span className="food-name">{food.name}</span>
                            <span className="food-meta">Gewicht: {formatNumber(getFoodWeight(food.group))}</span>
                          </div>
                          <div className="food-actions">
                            {STATUS_ORDER.map((status) => (
                              <button
                                key={status}
                                type="button"
                                className={`status-button ${food.status === status ? 'selected' : ''}`}
                                title={STATUS_LABELS[status]}
                                onClick={() => updateStatus(food.id, status)}
                              >
                                {STATUS_LABELS[status].slice(0, 1)}
                              </button>
                            ))}
                            <button type="button" className="icon-button" onClick={() => removeFood(food.id)} aria-label="Loeschen">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>

        <aside className="panel history-panel">
          <h2>Wochenhistorie</h2>
          <div className="history-list">
            {history.map((week) => {
              const weekProgress = Math.min((week.sum / WEEK_TARGET) * 100, 100);
              return (
                <div key={week.key} className="history-item">
                  <div className="history-top">
                    <span>{week.label}</span>
                    <strong>{formatNumber(week.sum)}</strong>
                  </div>
                  <div className="mini-progress">
                    <div style={{ width: `${weekProgress}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </section>
    </main>
  );
}

export default App;
