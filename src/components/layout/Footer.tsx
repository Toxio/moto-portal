export function Footer() {
  return (
    <footer className="bg-secondary/30 mt-auto border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="text-accent mb-2 text-lg font-bold">La Moto</h3>
            <p className="text-muted text-sm">Мотобарахолка для байкеров Украины и Европы</p>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold">Партнёры</h4>
            <div className="flex flex-wrap gap-2">
              {['MotoOil', 'RideGear', 'TrackDay UA'].map((p) => (
                <span key={p} className="text-muted rounded bg-white/5 px-3 py-1 text-xs">
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="gradient-border text-muted rounded-lg p-4 text-center text-xs">
              Рекламный блок — спонсорские баннеры
            </div>
          </div>
        </div>
        <p className="text-muted mt-6 text-center text-xs">
          © 2026 La Moto. Frontend MVP на mock-данных.
        </p>
      </div>
    </footer>
  );
}
