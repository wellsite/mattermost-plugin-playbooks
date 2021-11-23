package app

import (
	"fmt"
	"time"

	pluginapi "github.com/mattermost/mattermost-plugin-api"
	"github.com/pkg/errors"
)

// sudoExpiry configures the sudo bit to expire after 30 minutes.
var sudoExpiry = 30 * time.Minute

// makeSudoKey namespaces the key used with the kv store (already namespaced to the plugin).
func makeSudoKey(sessionID string) string {
	return fmt.Sprintf("sudo-%s", sessionID)
}

// HasSudo checks if the given session has the sudo bit applied.
//
// By default, Playbooks strives to give administrators a user experience that matches other users.
// For example, while they have access to all playbooks and runs, it's not desirable to force them
// to see everything in every user interface.
//
// This sudo bit is used to give administrators their full privileges, remembering the session id
// for subsequent API calls. It should never be used alone to grant privileges, but always paired
// with the corresponding IsAdmin check:
//
//   if app.IsAdmin(userID, pluginAPI) && app.HasSudo(sessionID, pluginAPI) {
//       // return unrestricted results for an admin
//   } else {
//       // treat the user like a non-admin
//   }
//
// In the future, if this prototype proves successful, we may promote this idea directly into the
// server, with sessions having their own sudo-like bit.
func HasSudo(sessionID string, pluginAPI *pluginapi.Client) bool {
	var hasSudo bool
	if err := pluginAPI.KV.Get(makeSudoKey(sessionID), &hasSudo); err != nil {
		return false
	}

	return hasSudo
}

// SetSudo applies the sudo bit to the given session id.
func SetSudo(sessionID string, pluginAPI *pluginapi.Client) error {
	hasSudo := true

	_, err := pluginAPI.KV.Set(makeSudoKey(sessionID), &hasSudo, pluginapi.SetExpiry(sudoExpiry))
	if err != nil {
		return errors.Wrapf(err, "failed to sudo for session %s", sessionID)
	}

	return nil
}

// DropSudo drops any sudo bit, reporting no error if the sudo bit was not held in the first place.
func DropSudo(sessionID string, pluginAPI *pluginapi.Client) error {
	err := pluginAPI.KV.Delete(makeSudoKey(sessionID))
	if err != nil {
		return errors.Wrapf(err, "failed to drop sudo for session %s", sessionID)
	}

	return nil
}
