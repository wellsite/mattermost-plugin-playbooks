import React, {FC, useState} from 'react';
import {useSelector} from 'react-redux';

import styled from 'styled-components';

import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';
import General from 'mattermost-redux/constants/general';

import UpgradeTimelineSvg from 'src/components/assets/upgrade_timeline_svg';
import {PrimaryButton} from 'src/components/assets/buttons';
import {getAdminAnalytics} from 'src/selectors';

import {requestTrialLicense, postMessageToAdmins} from 'src/client';

enum ActionState {
    Uninitialized,
    Loading,
    Error,
    Success,
}

const TimelineUpgradePlaceholder : FC = () => {
    const currentUser = useSelector(getCurrentUser);
    const isCurrentUserAdmin = isSystemAdmin(currentUser.roles);
    const [actionState, setActionState] = useState(ActionState.Uninitialized);

    const analytics = useSelector(getAdminAnalytics);
    const serverTotalUsers = analytics?.TOTAL_USERS || 0;

    const requestLicense = async () => {
        if (actionState === ActionState.Loading) {
            return;
        }

        setActionState(ActionState.Loading);

        const requestedUsers = Math.max(serverTotalUsers, 30);
        const response = await requestTrialLicense(requestedUsers);
        if (response.error) {
            setActionState(ActionState.Error);
        } else {
            setActionState(ActionState.Success);
        }
    };

    const notifyAdmins = async () => {
        if (actionState === ActionState.Loading) {
            return;
        }

        setActionState(ActionState.Loading);

        const message = `@${currentUser.username} requested access to create more playbooks in Incident Collaboration.`;
        await postMessageToAdmins(message);
        setActionState(ActionState.Success);
    };

    type HandlerType = undefined | (() => (Promise<void> | void));

    let buttonText = 'Notify Administrator';
    let handleClick : HandlerType = notifyAdmins;

    if (isCurrentUserAdmin) {
        handleClick = requestLicense;
        buttonText = 'Start trial';
    }

    return (
        <UpgradeWrapper>
            <UpgradeTimelineSvg/>
            <UpgradeContent>
                <UpgradeHeader>
                    <Title>{'Keep all your incident events in one place'}</Title>
                    <HelpText>{'Make retros easy. Your timeline includes all the events in your incident, separated by type, and downloadable for offline review.'}</HelpText>
                </UpgradeHeader>
                <PrimaryButton
                    onClick={handleClick}
                >
                    {buttonText}
                </PrimaryButton>
            </UpgradeContent>
        </UpgradeWrapper>
    );
};

const isSystemAdmin = (roles: string): boolean => {
    const rolesArray = roles.split(' ');
    return rolesArray.includes(General.SYSTEM_ADMIN_ROLE);
};

const useUpgradeModalVisibility = (initialState: boolean): [boolean, () => void, () => void] => {
    const [isModalShown, setShowModal] = useState(initialState);

    const showUpgradeModal = () => {
        setShowModal(true);
    };
    const hideUpgradeModal = () => {
        setShowModal(false);
    };

    return [isModalShown, showUpgradeModal, hideUpgradeModal];
};

const UpgradeContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 30px;
    margin-top: -330px;
`;

const CenteredRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const Title = styled(CenteredRow)`
    text-align: center;
    margin-bottom: 8px;

    font-weight: 600;
    font-size: 24px;
    color: rgba(var(--center-channel-color-rgb), 1);
`;

const HelpText = styled(CenteredRow)`
    text-align: center;
    font-weight: 400;
    font-size: 12px;
    color: var(--center-channel-color);
`;

const UpgradeHeader = styled.div`
    margin-bottom: 14px;
`;

const UpgradeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export default TimelineUpgradePlaceholder;
