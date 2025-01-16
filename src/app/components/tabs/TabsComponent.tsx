import React, {createContext, ReactNode, useContext, useState} from 'react';

interface TabsContextType {
    activeKey: string;
    setActiveKey: (key: string) => void;
    appearance: 'subtle' | 'default' | 'basic';
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
    children: ReactNode;
    defaultActiveKey: string;
    appearance: 'subtle' | 'default' | 'basic';
}

interface TabProps {
    children: ReactNode;
    eventKey: string;
    title: string;
}

const Tab: React.FC<TabProps> = ({children, eventKey}) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('Tab must be used within Tabs');

    if (context.activeKey !== eventKey) return null;
    return <div>{children}</div>;
};

const isTabElement = (child: React.ReactElement): child is React.ReactElement<TabProps> => {
    return child.type === Tab;
};

const TabsComponent: React.FC<TabsProps> = ({
                                                children,
                                                defaultActiveKey,
                                                appearance = 'default'
                                            }) => {
    const [activeKey, setActiveKey] = useState(defaultActiveKey);

    const getTabStyle = (isActive: boolean): React.CSSProperties => {
        const baseStyle: React.CSSProperties = {
            padding: '8px 10px 9px',
            cursor: 'pointer',
        };

        if (appearance === 'default') {
            return {
                ...baseStyle,
                ...(isActive && {
                    marginBottom: '-1px',
                    borderRadius: '4px 4px 0 0',
                    border: '1px solid #a4a9b3',
                    borderBottomColor: 'white',
                    backgroundColor: 'white',
                    color: '#006edc'
                })
            };
        }

        // Subtle appearance
        return {
            ...baseStyle,
            ...(isActive && {
                borderBottom: '2px solid #006edc',
                color: '#006edc'
            })
        };
    };

    const tabs = React.Children.toArray(children)
        .filter((child): child is React.ReactElement<TabProps> =>
            React.isValidElement(child) && isTabElement(child)
        )
        .map(child => ({
            eventKey: child.props.eventKey,
            title: child.props.title,
        }));


    return (
        <TabsContext.Provider value={{activeKey, setActiveKey, appearance}}>
            <div style={{
                marginTop: 8,
                borderBottom: appearance === 'default' ? '1px solid #a4a9b3' : '1px solid #e5e5e5'
            }}>
                <div style={{display: 'flex', userSelect: 'none'}}>
                    {tabs?.map((tab) => (
                        tab && (
                            <div
                                key={tab.eventKey}
                                style={getTabStyle(activeKey === tab.eventKey)}
                                onClick={() => setActiveKey(tab.eventKey)}
                            >
                                {tab.title}
                            </div>
                        )
                    ))}
                </div>
            </div>
            {children}
        </TabsContext.Provider>
    );
};

// Create compound component
const Tabs = Object.assign(TabsComponent, {
    Tab: Tab
});

// Example usage:
export const TabsExample: React.FC = () => {
    return (
        <div>
            <h3>Default Appearance</h3>
            <Tabs defaultActiveKey="1" appearance="default">
                <Tabs.Tab eventKey="1" title="Tab 1">
                    <div>Content 1</div>
                </Tabs.Tab>
                <Tabs.Tab eventKey="2" title="Tab 2">
                    <div>Content 2</div>
                </Tabs.Tab>
            </Tabs>

            <h3>Subtle Appearance</h3>
            <Tabs defaultActiveKey="1" appearance="subtle">
                <Tabs.Tab eventKey="1" title="Tab 1">
                    <div>Content 1</div>
                </Tabs.Tab>
                <Tabs.Tab eventKey="2" title="Tab 2">
                    <div>Content 2</div>
                </Tabs.Tab>
            </Tabs>

            <h3>Basic Appearance</h3>
            <Tabs defaultActiveKey="1" appearance="basic">
                <Tabs.Tab eventKey="1" title="Tab 1">
                    <div>Content 1</div>
                </Tabs.Tab>
                <Tabs.Tab eventKey="2" title="Tab 2">
                    <div>Content 2</div>
                </Tabs.Tab>
            </Tabs>
        </div>
    );
};

export default Tabs;