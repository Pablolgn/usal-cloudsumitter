package server

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

//State ...
type State struct {
	Job      Job
	Status   string `json:"state"`
	Progress Progress
}

//Job ...
type Job struct {
	File struct {
		Name   string `json:"name"`
		Origin string `json:"origin"`
		Size   int64  `json:"size"`
		Date   int64  `json:"date"`
	}
	Filament struct {
		Tool0 struct {
			Length float64 `json:"length"`
			Volume float64 `json:"volume"`
		}
	}
	User string `json:"user"`
}

//Progress ...
type Progress struct {
	Printime     int64   `json:"printTime"`
	PrintimeLeft int64   `json:"printTimeLeft"`
	Completion   float64 `json:"completion"`
}

func setupRouter() *gin.Engine {

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	r.Use(cors.Default())

	//Return the state of the printer
	r.GET("api/communication/state", func(c *gin.Context) {

		client := &http.Client{}

		req, err := http.NewRequest("GET", "http://mini3dfactory.duckdns.org:3008/api/job", nil)

		if err != nil {
			fmt.Println(err)
			return
		}

		req.Header.Set("X-Api-Key", "22B571A9BEB745FB90329839DAB201F7")
		resp, err := client.Do(req)
		if err != nil {
			fmt.Println(err)
			return
		}
		defer resp.Body.Close()

		state := State{}
		json.NewDecoder(resp.Body).Decode(&state)

		c.JSON(http.StatusOK, state)

	})

	//Cancel the model that it's printing
	r.GET("api/communication/cancel", func(c *gin.Context) {

		client := &http.Client{}

		values := map[string]interface{}{
			"command": "cancel",
		}
		jsonValue, _ := json.Marshal(values)

		req, err := http.NewRequest("POST", "http://mini3dfactory.duckdns.org:3008/api/job", bytes.NewBuffer(jsonValue))

		if err != nil {
			fmt.Println(err)
			return
		}

		req.Header.Add("X-Api-Key", "22B571A9BEB745FB90329839DAB201F7")
		req.Header.Add("Content-Type", "application/json")
		resp, err := client.Do(req)
		if err != nil {
			fmt.Println(err)
			return
		}

		c.JSON(http.StatusOK, resp)

	})

	//Pause the model that it's printing
	r.GET("api/communication/pause", func(c *gin.Context) {

		client := &http.Client{}

		values := map[string]interface{}{
			"command": "pause",
			"action":  "toggle",
		}
		jsonValue, _ := json.Marshal(values)

		req, err := http.NewRequest("POST", "http://mini3dfactory.duckdns.org:3008/api/job", bytes.NewBuffer(jsonValue))

		if err != nil {
			fmt.Println(err)
			return
		}

		req.Header.Add("X-Api-Key", "22B571A9BEB745FB90329839DAB201F7")
		req.Header.Add("Content-Type", "application/json")
		resp, err := client.Do(req)
		if err != nil {
			fmt.Println(err)
			return
		}
		defer resp.Body.Close()

		c.JSON(http.StatusOK, resp)
	})

	r.GET("api/communication/zmove/:number", func(c *gin.Context) {

		number := c.Param("number")

		client := &http.Client{}

		n, err := strconv.Atoi(number)

		if err != nil {
			fmt.Println(err)
			return
		}

		values := map[string]interface{}{
			"command": "jog",
			"z":       n,
		}
		jsonValue, _ := json.Marshal(values)

		req, err := http.NewRequest("POST", "http://mini3dfactory.duckdns.org:3008/api/printer/printhead", bytes.NewBuffer(jsonValue))

		if err != nil {
			fmt.Println(err)
			return
		}

		req.Header.Add("X-Api-Key", "22B571A9BEB745FB90329839DAB201F7")
		req.Header.Add("Content-Type", "application/json")
		resp, err := client.Do(req)
		if err != nil {
			fmt.Println(err)
			return
		}
		defer resp.Body.Close()

		c.String(http.StatusOK, "ok")
	})

	r.GET("api", func(c *gin.Context) {
		c.String(http.StatusOK, "API ready for receive request")
	})

	r.NoRoute(func(c *gin.Context) {
		c.String(http.StatusOK, "Ready for receive request")
	})

	return r

}
