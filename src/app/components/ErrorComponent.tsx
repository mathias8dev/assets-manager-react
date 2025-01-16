import DefaultButton from "@/app/components/button/DefaultButton";
import * as React from "react";


export type ErrorComponentProps = {
    imageSrc?: string
    description?: string
    onReload?: () => void
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
                                                           imageSrc = "/cells.png",
                                                           description = "Une erreur est survenue en récupérant les médias du serveur",
                                                           onReload
                                                       }) => {
    return (
        <>
            <div style={{
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                height: "100%",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <img src={imageSrc} alt="image not found" style={{width: 200}}/>
                <p>{description}</p>
                <DefaultButton onClick={onReload} size={"small"} variant={"secondary"}
                               style={{padding: "8px 32px"}}>Réessayer</DefaultButton>
            </div>
        </>
    )
}

export default ErrorComponent