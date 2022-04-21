package api

import (
	"context"
	"strings"

	"github.com/pkg/errors"
)

type RootResolver struct{}

func (r *RootResolver) Playbook(ctx context.Context, args struct {
	Id string
}) (*playbookResolver, error) {
	c, err := getContext(ctx)
	if err != nil {
		return nil, err
	}
	playbookID := args.Id
	userID := c.r.Header.Get("Mattermost-User-ID")

	if err := c.permissions.PlaybookView(userID, playbookID); err != nil {
		c.log.Warnf("public error message: %v; internal details: %v", "Not authorized", err)
		return nil, errors.New("Not authorized")
	}

	playbook, err := c.playbookService.Get(playbookID)
	if err != nil {
		return nil, err
	}

	return &playbookResolver{playbook}, nil
}

func (r *RootResolver) UpdatePlaybook(ctx context.Context, args struct {
	Id      string
	Updates struct {
		Title                                *string
		Description                          *string
		Public                               *bool
		CreatePublicPlaybookRun              *bool
		InvitedUserIDs                       *[]string
		InvitedGroupIDs                      *[]string
		InviteUsersEnabled                   *bool
		DefaultOwnerID                       *string
		DefaultOwnerEnabled                  *bool
		BroadcastChannelIDs                  *[]string
		BroadcastEnabled                     *bool
		WebhookOnCreationURLs                *[]string
		WebhookOnCreationEnabled             *bool
		RetrospectiveReminderIntervalSeconds *float64
		RetrospectiveTemplate                *string
		RetrospectiveEnabled                 *bool
		WebhookOnStatusUpdateURLs            *[]string
		WebhookOnStatusUpdateEnabled         *bool
		SignalAnyKeywords                    *[]string
		SignalAnyKeywordsEnabled             *bool
		CategorizeChannelEnabled             *bool
		CategoryName                         *string
		RunSummaryTemplateEnabled            *bool
		RunSummaryTemplate                   *string
		ChannelNameTemplate                  *string
	}
}) (string, error) {
	c, err := getContext(ctx)
	if err != nil {
		return "", err
	}
	setmap := map[string]interface{}{}
	addToSetmap(setmap, "Title", args.Updates.Title)
	addToSetmap(setmap, "Description", args.Updates.Description)
	addToSetmap(setmap, "Public", args.Updates.Public)
	addToSetmap(setmap, "CreatePublicPlaybookRun", args.Updates.CreatePublicPlaybookRun)
	addConcatToSetmap(setmap, "ConcatenatedInvitedUserIDs", args.Updates.InvitedUserIDs)

	if len(setmap) > 0 {
		if err := c.playbookStore.GraphqlUpdate(args.Id, setmap); err != nil {
			return "", err
		}
	}

	return args.Id, nil
}

func addToSetmap[T any](setmap map[string]interface{}, name string, value *T) {
	if value != nil {
		setmap[name] = *value
	}
}

func addConcatToSetmap(setmap map[string]interface{}, name string, value *[]string) {
	if value != nil {
		setmap[name] = strings.Join(*value, ",")
	}
}

func (_ *RootResolver) Thing() *testResolver {
	return &testResolver{
		Test{Thing: "thing", OtherThing: "otherthing"},
	}
}

type Test struct {
	Thing      string
	OtherThing string
}

type testResolver struct {
	Test
}

func (_ *testResolver) OtherThing() string { return "modified" }

/*func (h *GraphQLHandler) Playbooks(ctx context.Context, args struct {
	TeamID string
}) ([]playbook, error) {
	header, ok := ctx.Value(ctxKey{}).(http.Header)
	if !ok {
		return nil, errors.New("header not in context")
	}
	userID := header.Get("Mattermost-User-ID")
	reqInfo, err := app.GetRequesterInfo(userID, h.pluginAPI)
	if err != nil {
		return nil, errors.Wrap(err, "unable to get requester info")
	}
	appPB, err := h.playbookService.GetPlaybooksForTeam(reqInfo, args.TeamID, app.PlaybookFilterOptions{Page: 0, PerPage: 10})
	if err != nil {
		return nil, errors.Wrap(err, "unable to get playbooks")
	}
	apiPB := make([]playbook, len(appPB.Items))
	for i := range appPB.Items {
		apiPB[i] = playbook{appPB.Items[i]}
		fmt.Println(appPB.Items[i].Checklists)
	}
	return apiPB, nil
}*/
