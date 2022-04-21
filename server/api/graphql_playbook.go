package api

import (
	"github.com/mattermost/mattermost-plugin-playbooks/server/app"
)

type playbookResolver struct {
	app.Playbook
}

func (r *playbookResolver) DeleteAt() float64 {
	return float64(r.Playbook.DeleteAt)
}

func (r *playbookResolver) RetrospectiveReminderIntervalSeconds() float64 {
	return float64(r.Playbook.RetrospectiveReminderIntervalSeconds)
}

func (r *playbookResolver) Metrics() []*metricConfigResolver {
	metricConfigResolvers := make([]*metricConfigResolver, 0, len(r.Playbook.Metrics))
	for _, metricConfig := range r.Playbook.Metrics {
		metricConfigResolvers = append(metricConfigResolvers, &metricConfigResolver{metricConfig})
	}

	return metricConfigResolvers
}

type metricConfigResolver struct {
	app.PlaybookMetricConfig
}

func (r *metricConfigResolver) Target() *int32 {
	if r.PlaybookMetricConfig.Target.Valid {
		intvalue := int32(r.PlaybookMetricConfig.Target.ValueOrZero())
		return &intvalue
	} else {
		return nil
	}
}
