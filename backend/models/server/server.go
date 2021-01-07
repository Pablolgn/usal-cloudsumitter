package server

import (
	"github.com/gin-gonic/gin"
)

var router *gin.Engine

func init() {
	router = setupRouter()
}

// StartServer is ...
func StartServer() {
	port := "3002"
	router.Run(":" + port)
}
