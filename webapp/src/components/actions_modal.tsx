// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useIntl} from 'react-intl';

import styled from 'styled-components';

import Icon from '@mdi/react';
import {mdiLightningBoltOutline} from '@mdi/js';

import {hideActionsModal} from 'src/actions';
import {isActionsModalVisible} from 'src/selectors';
import GenericModal, {ModalSubheading} from 'src/components/widgets/generic_modal';
import {Toggle} from 'src/components/backstage/playbook_edit/automation/toggle';
import MarkdownTextbox from 'src/components/markdown_textbox';

const ActionsModal = () => {
    const {formatMessage} = useIntl();
    const dispatch = useDispatch();
    const show = useSelector(isActionsModalVisible);

    const [welcomeActionEnabled, setWelcomeActionEnabled] = useState(false);
    const [welcomeActionMsg, setWelcomeActionMsg] = useState('');

    const onHide = () => dispatch(hideActionsModal());
    const onSave = () => {/*nothing to see here*/};

    const header = (
        <Header>
            <ActionsIcon
                path={mdiLightningBoltOutline}
                size={1.6}
            />
            <div>
                {formatMessage({defaultMessage: 'Channel Actions'})}
                <ModalSubheading>
                    {formatMessage({defaultMessage: 'Channel actions allow you to automate activities for this channel'})}
                </ModalSubheading>
            </div>
        </Header>
    );

    return (
        <GenericModal
            id={'channel-actions-modal'}
            modalHeaderText={header}
            show={show}
            onHide={onHide}
            handleCancel={onHide}
            handleConfirm={onSave}
            confirmButtonText={formatMessage({defaultMessage: 'Save'})}
            cancelButtonText={formatMessage({defaultMessage: 'Cancel'})}
            isConfirmDisabled={false}
            isConfirmDestructive={false}
            autoCloseOnCancelButton={true}
            autoCloseOnConfirmButton={true}
            enforceFocus={true}
        >
            <Trigger title={formatMessage({defaultMessage: 'When a user joins the channel'})}>
                <Action
                    title={formatMessage({defaultMessage: 'Send an ephemeral welcome message to the user'})}
                    enabled={welcomeActionEnabled}
                    onToggle={() => setWelcomeActionEnabled((s: boolean) => !s)}
                >
                    {welcomeActionEnabled &&
                    <MarkdownTextbox
                        value={welcomeActionMsg}
                        setValue={setWelcomeActionMsg}
                        id={'channel-actions-modal_welcome-msg'}
                        hideHelpText={true}
                    />
                    }
                </Action>
            </Trigger>
        </GenericModal>
    );
};

const Header = styled.div`
    display: flex;
    flex-direction: row;
`;

const ActionsIcon = styled(Icon)`
    color: rgba(var(--center-channel-color-rgb), 0.56);
    margin-right: 14px;
    margin-top: 2px;
`;

interface TriggerProps {
    title: string;
    children: React.ReactNode;
}

const Trigger = (props: TriggerProps) => {
    const {formatMessage} = useIntl();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <TriggerContainer>
            <TriggerHeader>
                <TriggerLegend>
                    <TriggerLabel>{formatMessage({defaultMessage: 'Trigger'})}</TriggerLabel>
                    <TriggerTitle>{props.title}</TriggerTitle>
                </TriggerLegend>
                <TriggerButtons>
                    <TrashIcon className='icon-trash-can-outline icon-16'/>
                    <ChevronIcon
                        open={!collapsed}
                        onClick={() => setCollapsed((c) => !c)}
                    />
                </TriggerButtons>
            </TriggerHeader>
            {!collapsed &&
            <TriggerBody>
                {props.children}
            </TriggerBody>
            }
        </TriggerContainer>
    );
};

const TriggerContainer = styled.fieldset`
    border: 1px solid rgba(var(--center-channel-color-rgb), 0.16);
    box-sizing: border-box;

    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
`;

const TriggerHeader = styled.div`
    background: rgba(var(--center-channel-color-rgb), 0.04);

    display: flex;
    flex-direction: row;
    justify-content: space-between;

    padding: 12px 20px;
    padding-right: 27px;
`;

const TriggerLegend = styled.legend`
    display: flex;
    flex-direction: column;
    border: none;
    margin: 0;
`;

const TriggerLabel = styled.span`
    font-size: 11px;
    color: rgba(var(--center-channel-color-rgb), 0.64);
    text-transform: uppercase;
`;

const TriggerTitle = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: var(--center-channel-color);
    margin-top: 2px;
`;

const TriggerButtons = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const TrashIcon = styled.button`
    color: var(--dnd-indicator);
    margin-right: 18px;
    padding: 0;

    background: none;
    border: none;
`;

const ChevronIcon = ({open, onClick}: {open: boolean, onClick: () => void}) => (
    <ChevronIconI className={`icon-${open ? 'chevron-down' : 'chevron-left'} icon-16`} onClick={onClick}/>
);

const ChevronIconI = styled.i`
    cursor: pointer;
`;

const TriggerBody = styled.div`
    padding: 24px;
`;

interface ActionProps {
    title: string;
    enabled: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

const Action = (props: ActionProps) => {
    return (
        <ActionWrapper>
            <ActionContainer onClick={props.onToggle}>
                <ActionTitle>{props.title}</ActionTitle>
                <ActionToggle
                    isChecked={props.enabled}
                    onChange={props.onToggle}
                />
            </ActionContainer>
            {props.children &&
            <ActionChildrenContainer>
                {props.children}
            </ActionChildrenContainer>
            }
        </ActionWrapper>
    );
};

const ActionWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const ActionContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    cursor: pointer;
`;

const ActionTitle = styled.label`
    font-weight: normal;
    font-size: 14px;
    cursor: pointer;
`;

const ActionToggle = styled(Toggle)`
    margin: 0;
    cursor: pointer;
`;

const ActionChildrenContainer = styled.div`
    margin-top: 12px;
`;

export default ActionsModal;
