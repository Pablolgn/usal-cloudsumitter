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
	port := "3004"
	router.Run(":" + port)
}
