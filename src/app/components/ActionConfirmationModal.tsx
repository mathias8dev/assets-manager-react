import React, {useState} from 'react';
import {Button, Input, Modal, Text} from "rsuite";


type ActionConfirmationProps = {
    isOpen?: boolean;
    title?: string;
    descriptionIntro?: string;
    ctaLabel?: string;
    expectedText?: string;
    onClose?: () => void;
    onConfirm?: () => void;
}

const ActionConfirmationModal: React.FC<ActionConfirmationProps> = ({
                                                                        isOpen = false,
                                                                        title = "Veuillez confirmer votre action",
                                                                        descriptionIntro = "Pour confirmer votre action, saisissez",
                                                                        expectedText = "supprimer définitivement",
                                                                        ctaLabel = "Confirmer",
                                                                        onClose,
                                                                        onConfirm
                                                                    }) => {
    const [confirmText, setConfirmText] = useState('');

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Text>
                    {descriptionIntro} <span
                    style={{fontStyle: "italic", fontWeight: 600}}>{expectedText}</span> dans le champ
                    de saisie de texte.
                </Text>

                <div style={{marginTop: 15}}>
                    <Input
                        style={{width: "99%", margin: "auto"}}
                        value={confirmText}
                        onChange={(value) => setConfirmText(value)}
                        placeholder={expectedText}
                    />
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div style={{display: "flex", justifyContent: "flex-end", gap: 8}}>
                    <Button appearance="subtle" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button
                        appearance={"primary"}
                        disabled={confirmText !== expectedText}
                        onClick={onConfirm}
                    >
                        {ctaLabel}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ActionConfirmationModal;