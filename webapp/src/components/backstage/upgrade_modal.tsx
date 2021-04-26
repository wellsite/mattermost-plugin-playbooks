import React, {FC} from 'react';

import styled from 'styled-components';

import GenericModal from 'src/components/widgets/generic_modal';
import UpgradeIllustrationSvg from 'src/components/assets/upgrade_illustration_svg';

interface Props {
    show: boolean
    onHide: () => void;
}

const UpgradeModal: FC<Props> = (props: Props) => {
    return (
        <SizedGenericModal
            id={'id'}
            show={props.show}
            modalHeaderText={''}
            onHide={props.onHide}
            confirmButtonText={'Upgrade Mattermost Cloud'}
            cancelButtonText={'Not Right Now'}
            handleCancel={props.onHide}
            handleConfirm={props.onHide}
        >
            <Content>
                <IllustrationWrapper>
                    <UpgradeIllustrationSvg/>
                </IllustrationWrapper>
                <Header>
                    <Title>{'Playbook limit reached'}</Title>
                    <HelpText>{'The free tier is limited to 1 Playbook. Upgrade to create & use more Playbooks.'}</HelpText>
                </Header>
            </Content>
        </SizedGenericModal>
    );
};

const Content = styled.div`
    display: flex;
    flex-direction: column;
`;

const CenteredRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const IllustrationWrapper = styled(CenteredRow)`
    height: 156px;
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 96px;
    padding-top: 16px;
`;

const Title = styled(CenteredRow)`
    display: grid;
    align-content: center;
    height: 32px;
    margin-bottom: 8px;

    font-weight: 600;
    font-size: 24px;
    color: rgba(var(--center-channel-color-rgb), 1);
`;

const HelpText = styled(CenteredRow)`
    display: grid;
    align-content: center;
    height: 24px;

    font-weight: 400;
    font-size: 12px;
    color: var(--center-channel-color);
`;

const SizedGenericModal = styled(GenericModal)`
    width: 512px;
    height: 404px;
    padding: 0;

    .GenericModal__header {
        min-height: 48px;
    }

    .modal-content {
        padding: 0;
    }

    &&& .close {
        color: rgba(var(--center-channel-color-rgb), 0.56);
    }

    .GenericModal__button.confirm {
        padding: 13px 20px;
    }

    .modal-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 72px;
        margin-bottom: 32px;
        padding: 0;
    }
`;

export default UpgradeModal;
