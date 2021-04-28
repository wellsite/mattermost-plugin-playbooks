package api

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	pluginapi "github.com/mattermost/mattermost-plugin-api"
	"github.com/mattermost/mattermost-plugin-incident-collaboration/server/bot"
)

type BotHandler struct {
	pluginAPI *pluginapi.Client
	poster    bot.Poster
}

func NewBotHandler(router *mux.Router, api *pluginapi.Client, poster bot.Poster) *BotHandler {
	handler := &BotHandler{
		pluginAPI: api,
		poster:    poster,
	}

	botRouter := router.PathPrefix("/bot").Subrouter()
	botRouter.HandleFunc("/notify-admins", handler.notifyAdmins).Methods(http.MethodPost)

	return handler
}

type messagePayload struct {
	Message string `json:"message"`
}

func (h *BotHandler) notifyAdmins(w http.ResponseWriter, r *http.Request) {
	var payload messagePayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		HandleErrorWithCode(w, http.StatusBadRequest, "unable to decode message", err)
		return
	}

	if err := h.poster.NotifyAdmins(payload.Message); err != nil {
		HandleError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
}
