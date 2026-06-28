import { useState } from "react";

// A password input with just a show/hide eye toggle - no requirements popover.
// Used on Login page where password validation rules don't need to be shown.
function SimplePasswordField({ label = "Password", name = "password", value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <div className="position-relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          className="form-control pe-5"
          value={value}
          onChange={onChange}
          autoComplete="current-password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="btn position-absolute top-0 end-0 h-100 border-0 bg-transparent"
          style={{ padding: "0 12px" }}
          tabIndex={-1}
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
              <path
                d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line x1="1" y1="1" x2="23" y2="23" stroke="#6b7280" strokeWidth="2" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
              <path
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default SimplePasswordField;