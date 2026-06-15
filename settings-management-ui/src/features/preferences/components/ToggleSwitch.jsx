function ToggleSwitch({
  enabled,
  onChange,
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`
        w-14 h-8 rounded-full transition relative
        ${enabled
          ? "bg-blue-600"
          : "bg-slate-300"}
      `}
    >

      <div
        className={`
          w-6 h-6 bg-white rounded-full absolute top-1 transition
          ${enabled
            ? "left-7"
            : "left-1"}
        `}
      />

    </button>
  );
}

export default ToggleSwitch;