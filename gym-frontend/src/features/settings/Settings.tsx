import PageHeader from '../../components/PageHeader';
import { useTheme } from '../../hooks/useTheme';

/**
 * Settings page placeholder. Provides a theme toggle.
 */
export default function Settings() {
  const { theme, toggle } = useTheme();
  return (
    <div>
      <PageHeader title="Settings" />
      <div className="card max-w-md">
        <h2 className="mb-2 text-lg font-semibold">Theme</h2>
        <div className="flex items-center gap-3">
          <span>Current mode: {theme}</span>
          <button className="btn" onClick={toggle}>
            Toggle Theme
          </button>
        </div>
      </div>
    </div>
  );
}