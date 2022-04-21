import {gql} from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
};

export type Checklist = {
    __typename?: 'Checklist';
    id: Scalars['String'];
    items: Array<ChecklistItem>;
    title: Scalars['String'];
};

export type ChecklistItem = {
    __typename?: 'ChecklistItem';
    assigneeID: Scalars['String'];
    command: Scalars['String'];
    description: Scalars['String'];
    id: Scalars['String'];
    state: Scalars['String'];
    title: Scalars['String'];
};

export type Member = {
    __typename?: 'Member';
    roles: Array<Scalars['String']>;
    userID: Scalars['String'];
};

export type Mutation = {
    __typename?: 'Mutation';
    updatePlaybook: Scalars['String'];
};

export type MutationUpdatePlaybookArgs = {
    id: Scalars['String'];
    updates: PlaybookUpdates;
};

export type NewMember = {
    roles: Array<Scalars['String']>;
    userID: Scalars['String'];
};

export type Playbook = {
    __typename?: 'Playbook';
    broadcastChannelIDs: Array<Scalars['String']>;
    broadcastEnabled: Scalars['Boolean'];
    categorizeChannelEnabled: Scalars['Boolean'];
    categoryName: Scalars['String'];
    channelNameTemplate: Scalars['String'];
    checklists: Array<Checklist>;
    createPublicPlaybookRun: Scalars['Boolean'];
    defaultOwnerEnabled: Scalars['Boolean'];
    defaultOwnerID: Scalars['String'];
    defaultPlaybookAdminRole: Scalars['String'];
    defaultPlaybookMemberRole: Scalars['String'];
    defaultRunAdminRole: Scalars['String'];
    defaultRunMemberRole: Scalars['String'];
    deleteAt: Scalars['Float'];
    description: Scalars['String'];
    id: Scalars['String'];
    invitedGroupIDs: Array<Scalars['String']>;
    invitedUserIDs: Array<Scalars['String']>;
    members: Array<Member>;
    metrics: Array<PlaybookMetricConfig>;
    public: Scalars['Boolean'];
    retrospectiveEnabled: Scalars['Boolean'];
    retrospectiveReminderIntervalSeconds: Scalars['Float'];
    retrospectiveTemplate: Scalars['String'];
    runSummaryTemplate: Scalars['String'];
    runSummaryTemplateEnabled: Scalars['Boolean'];
    signalAnyKeywords: Array<Scalars['String']>;
    signalAnyKeywordsEnabled: Scalars['Boolean'];
    teamID: Scalars['String'];
    title: Scalars['String'];
    webhookOnCreationURLs: Array<Scalars['String']>;
    webhookOnStatusUpdateEnabled: Scalars['Boolean'];
    webhookOnStatusUpdateURLs: Array<Scalars['String']>;
};

export type PlaybookMetricConfig = {
    __typename?: 'PlaybookMetricConfig';
    description: Scalars['String'];
    id: Scalars['String'];
    target?: Maybe<Scalars['Int']>;
    title: Scalars['String'];
    type: Scalars['String'];
};

export type PlaybookUpdates = {
    broadcastChannelIDs?: InputMaybe<Array<Scalars['String']>>;
    broadcastEnabled?: InputMaybe<Scalars['Boolean']>;
    categorizeChannelEnabled?: InputMaybe<Scalars['Boolean']>;
    categoryName?: InputMaybe<Scalars['String']>;
    channelNameTemplate?: InputMaybe<Scalars['String']>;
    createPublicPlaybookRun?: InputMaybe<Scalars['Boolean']>;
    defaultOwnerEnabled?: InputMaybe<Scalars['Boolean']>;
    defaultOwnerID?: InputMaybe<Scalars['String']>;
    description?: InputMaybe<Scalars['String']>;
    inviteUsersEnabled?: InputMaybe<Scalars['Boolean']>;
    invitedGroupIDs?: InputMaybe<Array<Scalars['String']>>;
    invitedUserIDs?: InputMaybe<Array<Scalars['String']>>;
    public?: InputMaybe<Scalars['Boolean']>;
    retrospectiveEnabled?: InputMaybe<Scalars['Boolean']>;
    retrospectiveReminderIntervalSeconds?: InputMaybe<Scalars['Float']>;
    retrospectiveTemplate?: InputMaybe<Scalars['String']>;
    runSummaryTemplate?: InputMaybe<Scalars['String']>;
    runSummaryTemplateEnabled?: InputMaybe<Scalars['Boolean']>;
    signalAnyKeywords?: InputMaybe<Array<Scalars['String']>>;
    signalAnyKeywordsEnabled?: InputMaybe<Scalars['Boolean']>;
    title?: InputMaybe<Scalars['String']>;
    webhookOnCreationEnabled?: InputMaybe<Scalars['Boolean']>;
    webhookOnCreationURLs?: InputMaybe<Array<Scalars['String']>>;
    webhookOnStatusUpdateEnabled?: InputMaybe<Scalars['Boolean']>;
    webhookOnStatusUpdateURLs?: InputMaybe<Array<Scalars['String']>>;
};

export type Query = {
    __typename?: 'Query';
    playbook?: Maybe<Playbook>;
};

export type QueryPlaybookArgs = {
    id: Scalars['String'];
};

export type PlaybookQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type PlaybookQuery = { __typename?: 'Query', playbook?: { __typename?: 'Playbook', id: string, title: string, description: string, public: boolean, team_id: string, delete_at: number, default_playbook_member_role: string, invited_user_ids: Array<string>, broadcast_channel_ids: Array<string>, webhook_on_creation_urls: Array<string>, checklists: Array<{ __typename?: 'Checklist', id: string, title: string, items: Array<{ __typename?: 'ChecklistItem', id: string, title: string, description: string, state: string, assigneeID: string, command: string }> }>, members: Array<{ __typename?: 'Member', roles: Array<string>, user_id: string }> } | null };

export const PlaybookDocument = gql`
    query Playbook($id: String!) {
  playbook(id: $id) {
    id
    title
    description
    team_id: teamID
    public
    delete_at: deleteAt
    default_playbook_member_role: defaultPlaybookMemberRole
    invited_user_ids: invitedUserIDs
    broadcast_channel_ids: broadcastChannelIDs
    webhook_on_creation_urls: webhookOnCreationURLs
    checklists {
      id
      title
      items {
        id
        title
        description
        state
        assigneeID
        command
      }
    }
    members {
      user_id: userID
      roles
    }
  }
}
    `;

/**
 * __usePlaybookQuery__
 *
 * To run a query within a React component, call `usePlaybookQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlaybookQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlaybookQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePlaybookQuery(baseOptions: Apollo.QueryHookOptions<PlaybookQuery, PlaybookQueryVariables>) {
    const options = {...defaultOptions, ...baseOptions};
    return Apollo.useQuery<PlaybookQuery, PlaybookQueryVariables>(PlaybookDocument, options);
}
export function usePlaybookLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlaybookQuery, PlaybookQueryVariables>) {
    const options = {...defaultOptions, ...baseOptions};
    return Apollo.useLazyQuery<PlaybookQuery, PlaybookQueryVariables>(PlaybookDocument, options);
}
export type PlaybookQueryHookResult = ReturnType<typeof usePlaybookQuery>;
export type PlaybookLazyQueryHookResult = ReturnType<typeof usePlaybookLazyQuery>;
export type PlaybookQueryResult = Apollo.QueryResult<PlaybookQuery, PlaybookQueryVariables>;

export interface PossibleTypesResultData {
    possibleTypes: {
        [key: string]: string[]
    }
}
const result: PossibleTypesResultData = {
    possibleTypes: {},
};
export default result;
