export default function DataTableToolbar({ onSearch, children }: { onSearch: (q: string) => void; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        aria-label="Search"
        placeholder="Search…"
        className="input w-full sm:w-72"
        onChange={(e) => onSearch(e.target.value)}
      />
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </div>
  );
}