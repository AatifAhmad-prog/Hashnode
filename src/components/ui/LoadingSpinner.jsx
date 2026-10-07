export default function LoadingSpinner({ label = "Loading…" }) {
  return <div className="inline-loader"><div className="spinner spinner-small" /><span>{label}</span></div>;
}