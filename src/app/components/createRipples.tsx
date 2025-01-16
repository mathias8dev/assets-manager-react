import React, {useCallback, useEffect, useState} from 'react';

interface RipplesProps {
    during?: number;
    color?: string;
    onClick?: (ev: React.MouseEvent<HTMLDivElement>) => void;
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

interface RippleStyle extends React.CSSProperties {
    id: number;
}

const defaultProps: Required<Omit<RipplesProps, 'children'>> = {
    during: 600,
    color: 'rgba(0, 0, 0, 0.2)',
    style: {},
    onClick: () => {
    },
    className: ''
};

const Ripples: React.FC<RipplesProps> = (props) => {
    const {during, color, onClick, className, children} = {...defaultProps, ...props};
    const [ripples, setRipples] = useState<RippleStyle[]>([]);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        // Clean up ripples after animation
        const timeouts = ripples.map(ripple => {
            return setTimeout(() => {
                setRipples(prevRipples =>
                    prevRipples.filter(r => r.id !== ripple.id)
                );
            }, during);
        });

        return () => {
            timeouts.forEach(timeout => clearTimeout(timeout));
        };
    }, [ripples, during]);

    const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        const elem = event.currentTarget;
        const rect = elem.getBoundingClientRect();

        const left = event.clientX - rect.left;
        const top = event.clientY - rect.top;
        const width = Math.max(left, elem.clientWidth - left);
        const height = Math.max(top, elem.clientHeight - top);
        const size = Math.sqrt(width * width + height * height) * 2;

        const newRipple: RippleStyle = {
            id: counter,
            position: 'absolute',
            left: left - size / 2,
            top: top - size / 2,
            width: size,
            height: size,
            borderRadius: '50%',
            background: color,
            animationDuration: `${during}ms`,
            transform: 'scale(0)',
            animation: 'ripple-effect 600ms ease-out',
            pointerEvents: 'none'  // Ensure ripples don't interfere with clicks
        };

        setRipples(prev => [...prev, newRipple]);
        setCounter(prev => prev + 1);
        onClick?.(event);
    }, [color, during, onClick, counter]);

    return (
        <div
            className={`ripples-container ${className}`}
            onClick={handleClick}
            style={{
                position: 'relative',
                overflow: 'hidden',
                display: 'inline-block',
                ...props.style
            }}
        >
            {children}
            {ripples.map(style => (
                <div key={style.id} style={style}/>
            ))}
            <style>
                {`
          @keyframes ripple-effect {
            to {
              transform: scale(2);
              opacity: 0;
            }
          }
        `}
            </style>
        </div>
    );
};

export const createRipples = (customDefaultProps?: Partial<RipplesProps>) => {
    const Component = (props: RipplesProps) => (
        <Ripples {...{...customDefaultProps, ...props}} />
    );

    Component.displayName = 'Ripples';
    return Component;
};

export default Ripples;