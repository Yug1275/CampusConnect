// Theme-aware style generators for auth forms - call with the current
// theme's color object (from themeColors.js) to get the right style.

export const getInputStyle = (colors) => ({
  backgroundColor: colors.inputBg,
  borderColor: colors.inputBorder,
  color: colors.textPrimary,
  borderRadius: "8px",
  padding: "10px 14px",
  fontSize: "0.92rem",
});

export const getReadonlyInputStyle = (colors) => ({
  ...getInputStyle(colors),
  backgroundColor: colors.inputReadonlyBg,
});

export const getLabelStyle = (colors) => ({
  color: colors.textSecondary,
  fontSize: "0.85rem",
  fontWeight: 600,
  marginBottom: "6px",
});

export const primaryButtonStyle = {
  backgroundColor: "#2563eb",
  border: "none",
  borderRadius: "8px",
  padding: "11px 0",
  fontWeight: 600,
  fontSize: "0.95rem",
  transition: "background-color 0.15s ease",
};

export const getLinkStyle = (colors) => ({
  color: colors.linkColor,
  fontWeight: 600,
  textDecoration: "none",
});

export const getAlertSuccessStyle = (colors) => ({
  backgroundColor: colors.alertSuccessBg,
  border: `1px solid ${colors.alertSuccessBorder}`,
  color: colors.alertSuccessText,
  borderRadius: "8px",
  fontSize: "0.88rem",
});

export const getAlertErrorStyle = (colors) => ({
  backgroundColor: colors.alertErrorBg,
  border: `1px solid ${colors.alertErrorBorder}`,
  color: colors.alertErrorText,
  borderRadius: "8px",
  fontSize: "0.88rem",
});