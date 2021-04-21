import React, {FC} from 'react';
import styled from 'styled-components';

const UpgradeBadge: FC = () => <Icon/>;

const Icon = styled.i`
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--online-indicator);
`;

export default UpgradeBadge;
