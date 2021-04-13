import React, {FC, useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import styled from 'styled-components';

import {Team} from 'mattermost-redux/types/teams';

import {clientFetchPlaybooksCount} from 'src/client';

import PlaybookEdit from 'src/components/backstage/playbook_edit';
import GenericModal from 'src/components/widgets/generic_modal';

import {isE20LicensedOrDevelopment} from 'src/license';

interface Props {
    currentTeam: Team
    onClose: () => void
}

const Placeholder = styled.div`
    display: grid;
    place-items: center;
    width: 400px;
    height: 200px;
    font-size: 26px;
`;

export const NewPlaybook: FC<Props> = (props: Props) => {
    const isLicensed = useSelector(isE20LicensedOrDevelopment);
    const numPlaybooks = usePlaybookCount(props.currentTeam.id);

    return (
        <>
            <GenericModal
                id={'id'}
                show={!isLicensed && numPlaybooks > 0}
                modalHeaderText={'Buy!'}
                onHide={props.onClose}
                confirmButtonText={'Buy!'}
                cancelButtonText={'Be a bad customer and not buy :('}
                handleCancel={props.onClose}
                handleConfirm={props.onClose}
            >
                <Placeholder>
                    {'BUY!'}
                </Placeholder>
            </GenericModal>
            <PlaybookEdit
                currentTeam={props.currentTeam}
                onClose={props.onClose}
                isNew={true}
            />
        </>
    );
};

const usePlaybookCount = (teamID: string) => {
    const [playbookCount, setPlaybookCount] = useState(0);

    useEffect(() => {
        const fetchNumPlaybooks = async () => {
            const response = await clientFetchPlaybooksCount(teamID);
            setPlaybookCount(response.count);
        };

        fetchNumPlaybooks();
    }, [teamID]);

    return playbookCount;
};
