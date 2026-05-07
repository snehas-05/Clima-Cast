export default function ToggleSwitch({ checked = false, onChange, id }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-14 h-8 bg-outline-variant/50 rounded-full peer
        peer-checked:after:translate-x-full peer-checked:after:border-white
        after:content-[''] after:absolute after:top-[4px] after:left-[4px]
        after:bg-white after:border-gray-300 after:border after:rounded-full
        after:h-6 after:w-6 after:transition-all peer-checked:bg-primary" />
    </label>
  );
}
