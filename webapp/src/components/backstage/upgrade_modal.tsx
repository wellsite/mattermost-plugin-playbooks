import React, {FC} from 'react';

import styled from 'styled-components';

import GenericModal from 'src/components/widgets/generic_modal';

const Placeholder = styled.div`
    display: grid;
    place-items: center;
    width: 400px;
    height: 200px;
    font-size: 26px;
`;

interface Props {
    show: boolean
    onHide: () => void;
}

const UpgradeModal: FC<Props> = (props: Props) => {
    return (
        <GenericModal
            id={'id'}
            show={props.show}
            modalHeaderText={'Buy!'}
            onHide={props.onHide}
            confirmButtonText={'Buy!'}
            cancelButtonText={'Be a bad customer and not buy :('}
            handleCancel={props.onHide}
            handleConfirm={props.onHide}
        >
            <Placeholder>
                {'BUY!'}
            </Placeholder>
        </GenericModal>
    );
};

export default UpgradeModal;
