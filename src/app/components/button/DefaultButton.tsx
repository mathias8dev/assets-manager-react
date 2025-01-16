import React, {ButtonHTMLAttributes, ReactNode} from 'react';
import Ripples from "@/app/components/createRipples";

interface DefaultButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary';
    fullWidth?: boolean;
    size?: 'small' | 'medium' | 'large';
}

const DefaultButton: React.FC<DefaultButtonProps> = ({
                                                         children,
                                                         variant = 'primary',
                                                         fullWidth = false,
                                                         size = 'medium',
                                                         style,
                                                         ...props
                                                     }) => {
    const getSizeStyles = (): React.CSSProperties => {
        switch (size) {
            case 'small':
                return {padding: '6px 10px', fontSize: '0.875rem'};
            case 'large':
                return {padding: '10px 16px', fontSize: '1.125rem'};
            default:
                return {padding: '8px 12px', fontSize: '1rem'};
        }
    };

    const getVariantStyles = (): React.CSSProperties => {
        switch (variant) {
            case 'secondary':
                return {
                    backgroundColor: 'white',
                    color: '#2f82d6',
                    border: '1px solid #2f82d6',
                } as React.CSSProperties;
            default:
                return {
                    backgroundColor: '#2f82d6',
                    color: 'white',
                    border: 'none',
                } as React.CSSProperties;
        }
    };

    const baseStyles: React.CSSProperties = {
        borderRadius: 4,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.2s, opacity 0.2s',
        width: fullWidth ? '100%' : 'auto',
        ...getSizeStyles(),
        ...getVariantStyles(),
        ...style
    };

    return (
        <>
            <Ripples style={{
                display: fullWidth ? 'block' : 'inline-block',
                width: fullWidth ? '100%' : 'max-content',
            }}>
                <button
                    style={baseStyles}
                    {...props}
                >
                    {children}
                </button>
            </Ripples>
        </>

    );
};

// Example usage:
export const DefaultButtonExample: React.FC = () => {
    return (
        <div style={{display: 'flex', gap: '1rem', flexDirection: 'column'}}>
            <DefaultButton onClick={() => console.log('clicked')}>
                Sélectionner ce media
            </DefaultButton>

            <DefaultButton variant="secondary" size="small">
                Secondary Button
            </DefaultButton>

            <DefaultButton size="large" fullWidth>
                Full Width Button
            </DefaultButton>

            <DefaultButton disabled>
                Disabled Button
            </DefaultButton>
        </div>
    );
};

export default DefaultButton;