// src/components/StarRating.jsx
export function StarDisplay({ rating, size = 'sm' }) {
  const stars = [1, 2, 3, 4, 5];
  const sz = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-xl';
  return (
    <div className={`flex items-center gap-0.5 ${sz}`}>
      {stars.map(s => (
        <span key={s} className={s <= Math.round(rating) ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </div>
  );
}

export function StarInput({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={`text-2xl transition-transform hover:scale-110 ${s <= value ? 'star-filled' : 'star-empty'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
