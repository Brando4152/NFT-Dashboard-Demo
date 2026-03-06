import * as React from "react"

const Badge = React.forwardRef(({ style, children, ...props }, ref) => (
  <span
    ref={ref}
    style={{
      display: "inline-flex", alignItems: "center",
      borderRadius: "100px", padding: "2px 8px",
      fontSize: "11px", fontWeight: 600,
      background: "rgba(255,255,255,0.08)",
      color: "rgba(255,255,255,0.7)",
      border: "1px solid rgba(255,255,255,0.1)",
      ...style,
    }}
    {...props}
  >
    {children}
  </span>
))
Badge.displayName = "Badge"

export { Badge }
