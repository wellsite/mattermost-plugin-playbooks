import React, {FC} from 'react';

import {Team} from 'mattermost-redux/types/teams';

import PlaybookEdit from 'src/components/backstage/playbook_edit';
import UpgradeModal from 'src/components/widgets/generic_modal';

import {useAllowPlaybookCreation} from 'src/hooks';

interface Props {
    currentTeam: Team
    onClose: () => void
}

export const NewPlaybook: FC<Props> = (props: Props) => {
    const allowPlaybookCreation = useAllowPlaybookCreation(props.currentTeam.id);

    return (
        <>
            <UpgradeModal
                show={!allowPlaybookCreation}
            />
            <PlaybookEdit
                currentTeam={props.currentTeam}
                onClose={props.onClose}
                isNew={true}
            />
        </>
    );
};
