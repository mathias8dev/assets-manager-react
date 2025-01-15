import React, {useState} from "react";
import "./SelectComponent.css"

// Types for options
type Option = {
    value: string;
    label: string;
};

type SelectComponentProps = {
    options: Option[];
    placeholder?: string;
    onSelect?: (value: string) => void;
    defaultValue?: string;
};

const SelectComponent: React.FC<SelectComponentProps> = ({
                                                             options,
                                                             onSelect,
                                                             defaultValue,
                                                         }) => {
    const [selectedValue, setSelectedValue] = useState<string | undefined>(defaultValue);


    const handleOptionSelect = (value: string) => {
        setSelectedValue(value);
        onSelect?.(value);
    };


    return (
        <div
            className={"select-component"}
        >
            {/* Select Field */}
            <select
                defaultValue={selectedValue}
                style={{
                    appearance: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                }}
                onChange={(e) => handleOptionSelect(e.currentTarget.value)}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

        </div>
    );
};


// Example usage
export const SelectComponentDemo = () => {
    const handleSelect = (value: string) => {
        console.log("Selected value:", value);
    };

    return (
        <div style={{padding: "20px"}}>
            <SelectComponent
                options={[
                    {value: "option1", label: "Option 1"},
                    {value: "option2", label: "Option 2"},
                    {value: "option3", label: "Option 3"},
                ]}
                placeholder="Choose an option"
                onSelect={handleSelect}
            />
        </div>
    );
};

export default SelectComponent;
