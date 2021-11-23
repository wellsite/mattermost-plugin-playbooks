package api

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/mattermost/mattermost-plugin-playbooks/server/app"
	"github.com/mattermost/mattermost-plugin-playbooks/server/bot"
	"github.com/mattermost/mattermost-plugin-playbooks/server/config"
	"github.com/mattermost/mattermost-server/v6/plugin"
	"github.com/sirupsen/logrus"

	pluginapi "github.com/mattermost/mattermost-plugin-api"
)

// SudoHandler is the API handler for /sudo
type SudoHandler struct {
	*ErrorHandler
	pluginAPI *pluginapi.Client
	log       bot.Logger
	config    config.Service
}

// NewSudoHandler returns a new sudo api handler
func NewSudoHandler(router *mux.Router, api *pluginapi.Client, log bot.Logger, configService config.Service) *SudoHandler {
	handler := &SudoHandler{
		ErrorHandler: &ErrorHandler{log: log},
		pluginAPI:    api,
		log:          log,
		config:       configService,
	}

	sudoRouter := router.PathPrefix("/sudo").Subrouter()
	sudoRouter.HandleFunc("", handler.getSudo).Methods(http.MethodGet)
	sudoRouter.HandleFunc("", handler.setSudo).Methods(http.MethodPost)
	sudoRouter.HandleFunc("", handler.dropSudo).Methods(http.MethodDelete)

	return handler
}

type SudoStatus struct {
	HasSudo bool `json:"has_sudo"`
}

func getSessionIDFromRequest(r *http.Request) string {
	pluginContext, ok := r.Context().Value(ContextKeyPluginContext).(*plugin.Context)
	if !ok {
		logrus.Warnf("no plugin context available")
		return ""
	}

	return pluginContext.SessionId
}

func (h *SudoHandler) getSudo(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("Mattermost-User-ID")
	sessionID := getSessionIDFromRequest(r)

	var sudoStatus SudoStatus
	if app.IsAdmin(userID, h.pluginAPI) && app.HasSudo(sessionID, h.pluginAPI) {
		sudoStatus.HasSudo = true
	}

	ReturnJSON(w, &sudoStatus, http.StatusOK)
}

func (h *SudoHandler) setSudo(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("Mattermost-User-ID")
	sessionID := getSessionIDFromRequest(r)

	if !app.IsAdmin(userID, h.pluginAPI) {
		h.HandleErrorWithCode(w, http.StatusBadRequest, "not an admin", nil)
		return
	}

	err := app.SetSudo(sessionID, h.pluginAPI)
	if err != nil {
		h.HandleErrorWithCode(w, http.StatusInternalServerError, "failed to set sudo", err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *SudoHandler) dropSudo(w http.ResponseWriter, r *http.Request) {
	sessionID := getSessionIDFromRequest(r)

	err := app.DropSudo(sessionID, h.pluginAPI)
	if err != nil {
		h.HandleErrorWithCode(w, http.StatusInternalServerError, "failed to drop sudo", err)
		return
	}

	w.WriteHeader(http.StatusOK)
}
