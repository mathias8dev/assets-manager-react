import React from "react";
import {Text} from "rsuite";

interface MetadataFieldProps {
    label: string;
    value: string | number | undefined;
}

const MetadataField: React.FC<MetadataFieldProps> = ({label, value}) => {
    if (!value) return null;

    return (
        <Text size="sm" weight="semibold">
            <span>{label}:</span> <span style={{fontWeight: "normal", wordWrap: "break-word",}}>{value}</span>
        </Text>
    );
};

export default MetadataField;
