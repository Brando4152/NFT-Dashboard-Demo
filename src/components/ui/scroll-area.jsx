import * as React from "react"

const ScrollArea = React.forwardRef(({ style, children, ...props }, ref) => (
  <div
    ref={ref}
    style={{
      overflow: "auto",
      position: "relative",
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
))
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }
