package server

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Print is the content of the array the file name and the number
type Print struct {
	FileName      string `json:"name"`
	NumberOfFiles string `json:"number"`
}

func setupRouter() *gin.Engine {

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	r.Use(cors.Default())

	r.POST("api/optimize", func(c *gin.Context) {

		var f []Print
		if err := c.BindJSON(&f); err != nil {
			return
		}
		c.String(http.StatusOK, startOptimize(f))

	})

	r.GET("api", func(c *gin.Context) {
		c.String(http.StatusOK, "API ready for receive request")
	})

	r.NoRoute(func(c *gin.Context) {
		c.String(http.StatusOK, "Ready for receive request")
	})

	return r
}
