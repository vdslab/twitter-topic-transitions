export function HorizontalField({ label, children }) {
  return (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label className="label">{label}</label>
      </div>
      <div className="field-body">{children}</div>
    </div>
  );
}
