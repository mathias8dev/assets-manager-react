import React from 'react'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

const withAttrs = <P, Element = HTMLDivElement>(
    Component: React.ComponentType<P>,
    // eslint-disable-next-line react/display-name
) => (props: P & Omit<React.HTMLAttributes<Element>, 'style'>) => (
    <Component {...props} />
)

export default withAttrs