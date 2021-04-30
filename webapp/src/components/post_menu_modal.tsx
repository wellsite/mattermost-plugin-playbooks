// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {FC} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {hidePostMenuModal} from 'src/actions';

import {isPostMenuModalVisible} from 'src/selectors';

import UpgradeModal from 'src/components/backstage/upgrade_modal';

const PostMenuModal: FC = () => {
    const dispatch = useDispatch();
    const show = useSelector(isPostMenuModalVisible);

    return (
        <UpgradeModal
            show={show}
            onHide={() => dispatch(hidePostMenuModal())}
        />
    );
};

export default PostMenuModal;
