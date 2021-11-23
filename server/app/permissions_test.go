package app_test

import (
	"testing"

	"github.com/mattermost/mattermost-plugin-playbooks/server/app"
	"github.com/mattermost/mattermost-server/v6/model"
	"github.com/mattermost/mattermost-server/v6/plugin/plugintest"
	"github.com/stretchr/testify/require"

	pluginapi "github.com/mattermost/mattermost-plugin-api"
)

func TestGetRequesterInfo(t *testing.T) {
	t.Run("non-admin user, no session id", func(t *testing.T) {
		pluginAPI := &plugintest.API{}
		client := pluginapi.NewClient(pluginAPI, &plugintest.Driver{})

		userID := model.NewId()
		sessionID := ""

		user := model.User{
			Id: userID,
		}

		pluginAPI.On("HasPermissionTo", userID, model.PermissionManageSystem).Return(false)
		pluginAPI.On("GetUser", userID).Return(&user, nil)

		requesterInfo, err := app.GetRequesterInfo(userID, sessionID, client)
		require.NoError(t, err)
		require.Equal(t, userID, requesterInfo.UserID)
		require.False(t, requesterInfo.IsAdmin)
		require.False(t, requesterInfo.IsGuest)

		pluginAPI.AssertExpectations(t)
	})

	t.Run("non-admin user, session id [no sudo]", func(t *testing.T) {
		pluginAPI := &plugintest.API{}
		client := pluginapi.NewClient(pluginAPI, &plugintest.Driver{})

		userID := model.NewId()
		sessionID := model.NewId()

		user := model.User{
			Id: userID,
		}

		pluginAPI.On("HasPermissionTo", userID, model.PermissionManageSystem).Return(false)
		pluginAPI.On("GetUser", userID).Return(&user, nil)

		requesterInfo, err := app.GetRequesterInfo(userID, sessionID, client)
		require.NoError(t, err)
		require.Equal(t, userID, requesterInfo.UserID)
		require.False(t, requesterInfo.IsAdmin)
		require.False(t, requesterInfo.IsGuest)

		pluginAPI.AssertExpectations(t)
	})

	t.Run("guest user, no session id", func(t *testing.T) {
		pluginAPI := &plugintest.API{}
		client := pluginapi.NewClient(pluginAPI, &plugintest.Driver{})

		userID := model.NewId()
		sessionID := ""

		user := model.User{
			Id:    userID,
			Roles: model.SystemGuestRoleId,
		}

		pluginAPI.On("HasPermissionTo", userID, model.PermissionManageSystem).Return(false)
		pluginAPI.On("GetUser", userID).Return(&user, nil)

		requesterInfo, err := app.GetRequesterInfo(userID, sessionID, client)
		require.NoError(t, err)
		require.Equal(t, userID, requesterInfo.UserID)
		require.False(t, requesterInfo.IsAdmin)
		require.True(t, requesterInfo.IsGuest)

		pluginAPI.AssertExpectations(t)
	})

	t.Run("guest user, session id", func(t *testing.T) {
		pluginAPI := &plugintest.API{}
		client := pluginapi.NewClient(pluginAPI, &plugintest.Driver{})

		userID := model.NewId()
		sessionID := model.NewId()

		user := model.User{
			Id:    userID,
			Roles: model.SystemGuestRoleId,
		}

		pluginAPI.On("HasPermissionTo", userID, model.PermissionManageSystem).Return(false)
		pluginAPI.On("GetUser", userID).Return(&user, nil)

		requesterInfo, err := app.GetRequesterInfo(userID, sessionID, client)
		require.NoError(t, err)
		require.Equal(t, userID, requesterInfo.UserID)
		require.False(t, requesterInfo.IsAdmin)
		require.True(t, requesterInfo.IsGuest)

		pluginAPI.AssertExpectations(t)
	})

	t.Run("admin user, no session id", func(t *testing.T) {
		pluginAPI := &plugintest.API{}
		client := pluginapi.NewClient(pluginAPI, &plugintest.Driver{})

		userID := model.NewId()
		sessionID := ""

		user := model.User{
			Id: userID,
		}

		pluginAPI.On("HasPermissionTo", userID, model.PermissionManageSystem).Return(true)
		pluginAPI.On("GetUser", userID).Return(&user, nil)
		pluginAPI.On("KVGet", app.MakeSudoKey(sessionID)).Return(nil, nil)

		requesterInfo, err := app.GetRequesterInfo(userID, sessionID, client)
		require.NoError(t, err)
		require.Equal(t, userID, requesterInfo.UserID)
		require.False(t, requesterInfo.IsAdmin)
		require.False(t, requesterInfo.IsGuest)

		pluginAPI.AssertExpectations(t)
	})

	t.Run("admin user, session id, no sudo", func(t *testing.T) {
		pluginAPI := &plugintest.API{}
		client := pluginapi.NewClient(pluginAPI, &plugintest.Driver{})

		userID := model.NewId()
		sessionID := model.NewId()

		user := model.User{
			Id: userID,
		}

		pluginAPI.On("HasPermissionTo", userID, model.PermissionManageSystem).Return(true)
		pluginAPI.On("GetUser", userID).Return(&user, nil)
		pluginAPI.On("KVGet", app.MakeSudoKey(sessionID)).Return([]byte("false"), nil)

		requesterInfo, err := app.GetRequesterInfo(userID, sessionID, client)
		require.NoError(t, err)
		require.Equal(t, userID, requesterInfo.UserID)
		require.False(t, requesterInfo.IsAdmin)
		require.False(t, requesterInfo.IsGuest)

		pluginAPI.AssertExpectations(t)
	})

	t.Run("admin user, session id, sudo", func(t *testing.T) {
		pluginAPI := &plugintest.API{}
		client := pluginapi.NewClient(pluginAPI, &plugintest.Driver{})

		userID := model.NewId()
		sessionID := model.NewId()

		user := model.User{
			Id: userID,
		}

		pluginAPI.On("HasPermissionTo", userID, model.PermissionManageSystem).Return(true)
		pluginAPI.On("GetUser", userID).Return(&user, nil)
		pluginAPI.On("KVGet", app.MakeSudoKey(sessionID)).Return([]byte("true"), nil)

		requesterInfo, err := app.GetRequesterInfo(userID, sessionID, client)
		require.NoError(t, err)
		require.Equal(t, userID, requesterInfo.UserID)
		require.True(t, requesterInfo.IsAdmin)
		require.False(t, requesterInfo.IsGuest)

		pluginAPI.AssertExpectations(t)
	})
}

func TestGetCommandRequesterInfo(t *testing.T) {
	t.Run("non-admin user", func(t *testing.T) {
		pluginAPI := &plugintest.API{}
		client := pluginapi.NewClient(pluginAPI, &plugintest.Driver{})

		userID := model.NewId()

		user := model.User{
			Id: userID,
		}

		pluginAPI.On("HasPermissionTo", userID, model.PermissionManageSystem).Return(false)
		pluginAPI.On("GetUser", userID).Return(&user, nil)

		requesterInfo, err := app.GetCommandRequesterInfo(userID, client)
		require.NoError(t, err)
		require.Equal(t, userID, requesterInfo.UserID)
		require.False(t, requesterInfo.IsAdmin)
		require.False(t, requesterInfo.IsGuest)

		pluginAPI.AssertExpectations(t)
	})

	t.Run("guest user", func(t *testing.T) {
		pluginAPI := &plugintest.API{}
		client := pluginapi.NewClient(pluginAPI, &plugintest.Driver{})

		userID := model.NewId()

		user := model.User{
			Id:    userID,
			Roles: model.SystemGuestRoleId,
		}

		pluginAPI.On("HasPermissionTo", userID, model.PermissionManageSystem).Return(false)
		pluginAPI.On("GetUser", userID).Return(&user, nil)

		requesterInfo, err := app.GetCommandRequesterInfo(userID, client)
		require.NoError(t, err)
		require.Equal(t, userID, requesterInfo.UserID)
		require.False(t, requesterInfo.IsAdmin)
		require.True(t, requesterInfo.IsGuest)

		pluginAPI.AssertExpectations(t)
	})

	t.Run("admin user", func(t *testing.T) {
		pluginAPI := &plugintest.API{}
		client := pluginapi.NewClient(pluginAPI, &plugintest.Driver{})

		userID := model.NewId()

		user := model.User{
			Id: userID,
		}

		pluginAPI.On("HasPermissionTo", userID, model.PermissionManageSystem).Return(true)
		pluginAPI.On("GetUser", userID).Return(&user, nil)

		requesterInfo, err := app.GetCommandRequesterInfo(userID, client)
		require.NoError(t, err)
		require.Equal(t, userID, requesterInfo.UserID)
		require.True(t, requesterInfo.IsAdmin)
		require.False(t, requesterInfo.IsGuest)

		pluginAPI.AssertExpectations(t)
	})
}
