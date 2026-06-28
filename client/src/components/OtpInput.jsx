import { useRef } from "react";

// Reusable 6-digit OTP input made of separate boxes
function OtpInput({ value, onChange }) {
  const inputsRef = useRef([]);

  // value is a 6-character string, e.g. "123456" or "12_456" while typing
  const digits = value.split("");
  while (digits.length < 6) digits.push("");

  const handleChange = (index, e) => {
    const inputVal = e.target.value;

    // Only allow a single digit
    if (!/^[0-9]?$/.test(inputVal)) return;

    const newDigits = [...digits];
    newDigits[index] = inputVal;
    onChange(newDigits.join(""));

    // Move focus to next box if a digit was entered
    if (inputVal && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move focus to previous box on backspace if current box is empty
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      onChange(pasted);
      inputsRef.current[5].focus();
    }
    e.preventDefault();
  };

  return (
    <div className="d-flex justify-content-between mb-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="form-control text-center mx-1"
          style={{ width: "45px", height: "50px", fontSize: "1.25rem" }}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}

export default OtpInput;