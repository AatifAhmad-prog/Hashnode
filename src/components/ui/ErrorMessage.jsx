export default function ErrorMessage({ message = "Something went wrong." }) {
  return (
    <div className="error-card">
      <span>!</span>
      <div>
        <strong>Unable to load this</strong>
        <p>{message}</p>
      </div>
    </div>
  );
}