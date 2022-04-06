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

func (r *metricConfigResolver) Target() *float64 {
	if r.PlaybookMetricConfig.Target.Valid {
		floatValue := float64(r.PlaybookMetricConfig.Target.ValueOrZero())
		return &floatValue
	} else {
		return nil
	}
}
