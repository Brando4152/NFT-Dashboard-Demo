import * as React from "react"

const DropdownMenuContext = React.createContext({})

const DropdownMenu = ({ children }) => {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef(null)

  React.useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={ref} style={{ position: "relative", display: "inline-flex" }}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

const DropdownMenuTrigger = React.forwardRef(({ children, asChild, ...props }, ref) => {
  const { setOpen } = React.useContext(DropdownMenuContext)
  return (
    <div ref={ref} onClick={() => setOpen(o => !o)} style={{ display: "inline-flex", cursor: "pointer" }} {...props}>
      {children}
    </div>
  )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef(({ children, style, align = "start", ...props }, ref) => {
  const { open } = React.useContext(DropdownMenuContext)
  if (!open) return null
  return (
    <div
      ref={ref}
      style={{
        position: "absolute", top: "calc(100% + 4px)",
        ...(align === "end" ? { right: 0 } : { left: 0 }),
        zIndex: 999, minWidth: "160px",
        background: "#161616", border: "1px solid #1f1f1f",
        borderRadius: "8px", padding: "4px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef(({ children, style, onClick, ...props }, ref) => {
  const { setOpen } = React.useContext(DropdownMenuContext)
  return (
    <div
      ref={ref}
      onClick={() => { onClick?.(); setOpen(false) }}
      style={{
        padding: "7px 10px", borderRadius: "6px",
        fontSize: "13px", color: "#f0f0f0",
        cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
        transition: "background 0.15s ease",
        ...style,
      }}
      onMouseEnter={e => e.currentTarget.style.background = "#1c1c1c"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      {...props}
    >
      {children}
    </div>
  )
})
DropdownMenuItem.displayName = "DropdownMenuItem"

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }
