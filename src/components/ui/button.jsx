import * as React from "react"

const Button = React.forwardRef(({ className, variant, size, style, ...props }, ref) => {
  return (
    <button
      ref={ref}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        borderRadius: "6px", fontSize: "14px", fontWeight: 500,
        cursor: "pointer", border: "none", padding: "8px 16px",
        background: "#fff", color: "#000", transition: "opacity 0.15s ease",
        ...style,
      }}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
