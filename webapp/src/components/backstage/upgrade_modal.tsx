import React, {FC, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import styled from 'styled-components';

import {getLicenseConfig} from 'mattermost-redux/actions/general';

import GenericModal from 'src/components/widgets/generic_modal';
import UpgradeIllustrationSvg from 'src/components/assets/upgrade_illustration_svg';
import Spinner from 'src/components/assets/icons/spinner';
import UpgradeSuccessIllustrationSvg from 'src/components/assets/upgrade_success_illustration_svg';
import {requestTrialLicense} from 'src/client';

import {getAdminAnalytics} from 'src/selectors';

interface Props {
    show: boolean
    onHide: () => void;
}

const UpgradeModal: FC<Props> = (props: Props) => {
    const analytics = useSelector(getAdminAnalytics);
    const serverTotalUsers = analytics?.TOTAL_USERS || 0;

    enum TrialState {
        Uninitialized,
        Loading,
        Error,
        Success,
    }

    const [trialState, setTrialState] = useState(TrialState.Uninitialized);

    const requestLicense = async () => {
        if (trialState === TrialState.Loading) {
            return;
        }

        setTrialState(TrialState.Loading);

        const requestedUsers = Math.max(serverTotalUsers, 30);
        const response = await requestTrialLicense(requestedUsers);
        if (response.error) {
            setTrialState(TrialState.Error);
        } else {
            setTrialState(TrialState.Success);
        }
    };

    type HandlerType = undefined | (() => (Promise<void> | void));

    let illustration = <UpgradeIllustrationSvg/>;
    let titleText = 'Playbook limit reached';
    let helpText = 'The free tier is limited to 1 Playbook. Upgrade to create & use more Playbooks.';
    let confirmButtonText : React.ReactNode = 'Start Trial';
    let cancelButtonText : React.ReactNode = 'Not Right Now';
    let handleConfirm : HandlerType = requestLicense;
    let handleCancel : HandlerType = props.onHide;

    if (trialState === TrialState.Success) {
        illustration = <UpgradeSuccessIllustrationSvg/>;
        titleText = 'Thank you';
        helpText = 'You are now on a free trial of our E20 license.';
        confirmButtonText = 'Done';
        handleConfirm = props.onHide;
        // eslint-disable-next-line no-undefined
        handleCancel = undefined;
    }

    if (trialState === TrialState.Loading) {
        cancelButtonText = <Spinner/>;
        // eslint-disable-next-line no-undefined
        handleConfirm = undefined;
        handleCancel = () => { /*do nothing*/ };
    }

    return (
        <SizedGenericModal
            id={'id'}
            show={props.show}
            modalHeaderText={''}
            onHide={props.onHide}
            confirmButtonText={confirmButtonText}
            cancelButtonText={cancelButtonText}
            handleCancel={handleCancel}
            handleConfirm={handleConfirm}
            autoCloseOnConfirmButton={false}
        >
            <Content>
                <IllustrationWrapper>
                    {illustration}
                </IllustrationWrapper>
                <Header>
                    <Title>{titleText}</Title>
                    <HelpText>{helpText}</HelpText>
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
