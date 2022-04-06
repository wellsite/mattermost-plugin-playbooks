import {PlaybookQuery, PlaybookQueryHookResult, usePlaybookQuery} from 'src/graphql/generated_types';

export type FullPlaybook = PlaybookQuery['playbook']

export const usePlaybook = (id: string): [FullPlaybook, PlaybookQueryHookResult] => {
    const result = usePlaybookQuery({
        variables: {
            id,
        },
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
    });

    let playbook = result.data?.playbook;
    playbook = playbook === null ? undefined : playbook; //eslint-disable-line no-undefined

    return [playbook, result];
};

