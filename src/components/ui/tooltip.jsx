import * as React from "react"

const TooltipProvider = ({ children }) => <>{children}</>

const TooltipContext = React.createContext({})

const Tooltip = ({ children }) => {
  const [open, setOpen] = React.useState(false)
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div style={{ position: "relative", display: "inline-flex" }}>
        {children}
      </div>
    </TooltipContext.Provider>
  )
}

const TooltipTrigger = React.forwardRef(({ children, asChild, ...props }, ref) => {
  const { setOpen } = React.useContext(TooltipContext)
  return (
    <div
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{ display: "inline-flex" }}
      {...props}
    >
      {children}
    </div>
  )
})
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef(({ children, style, ...props }, ref) => {
  const { open } = React.useContext(TooltipContext)
  if (!open) return null
  return (
    <div
      ref={ref}
      style={{
        position: "absolute", bottom: "calc(100% + 6px)", left: "50%",
        transform: "translateX(-50%)", zIndex: 999,
        background: "#1c1c1c", border: "1px solid #2a2a2a",
        borderRadius: "6px", padding: "5px 10px",
        fontSize: "12px", color: "#f0f0f0",
        whiteSpace: "nowrap", pointerEvents: "none",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
})
TooltipContent.displayName = "TooltipContent"

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent }
