import * as React from 'react'

interface PortalProps {
  children: React.ReactNode
  container?: React.ReactElement
}

declare const Portal: React.ComponentType<PortalProps>

export default Portal
