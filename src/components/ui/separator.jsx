import * as React from "react"

const Separator = React.forwardRef(({ orientation = "horizontal", style, ...props }, ref) => (
  <div
    ref={ref}
    style={{
      background: "#1f1f1f",
      ...(orientation === "horizontal" ? { height: "1px", width: "100%" } : { width: "1px", height: "100%" }),
      flexShrink: 0,
      ...style,
    }}
    {...props}
  />
))
Separator.displayName = "Separator"

export { Separator }
