package server

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func setupRouter() *gin.Engine {

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	r.Use(cors.Default())

	r.StaticFS("/api/models/Uploaded_models", http.Dir("./Uploaded_models"))

	r.GET("api/models", func(c *gin.Context) {

		x := make([]string, 0)

		files, err := ioutil.ReadDir("./Uploaded_models/")
		if err != nil {
			log.Fatal(err)
		}

		for _, file := range files {
			x = append(x, file.Name())
		}

		c.JSON(http.StatusOK, x)
	})

	r.POST("api/models/upload", func(c *gin.Context) {

		// Multipart form

		form, err := c.MultipartForm()
		if err != nil {
			c.String(http.StatusBadRequest, fmt.Sprintf("get form err: %s", err.Error()))
			return
		}
		files := form.File["files"]

		for _, file := range files {
			filename := filepath.Base(file.Filename)
			if err := c.SaveUploadedFile(file, "Uploaded_models/"+filename); err != nil {
				c.String(http.StatusBadRequest, fmt.Sprintf("upload file err: %s", err.Error()))
				return
			}
		}
	})

	r.DELETE("api/models/delete/:name", func(c *gin.Context) {

		name := c.Param("name")
		err := os.Remove("./Uploaded_models/" + name)

		if err != nil {
			fmt.Println(err)
			return
		}

	})

	r.POST("api/models/printupload/:filename", func(c *gin.Context) {

		fileName := c.Param("filename")
		fileURL := "http://mini3dfactory.duckdns.org:3008/api/files/local"

		err := UploadFile(fileName+".stl", fileURL)
		if err != nil {
			fmt.Println(err)
			return
		}

		err = SliceFile(fileName, fileURL)
		if err != nil {
			fmt.Println(err)
			return
		}

	})

	r.GET("api", func(c *gin.Context) {
		c.String(http.StatusOK, "API ready for receive request")
	})

	r.NoRoute(func(c *gin.Context) {
		c.String(http.StatusOK, "Ready for receive request")
	})

	return r
}

//UploadFile ...
func UploadFile(filename string, URL string) error {

	file, err := os.Open("./Uploaded_models/" + filename)

	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	//Create form
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	//Create file field form
	part, err := writer.CreateFormFile("file", filepath.Base(file.Name()))
	if err != nil {
		return err
	}
	io.Copy(part, file)

	//Create print field form
	lPrint, err := writer.CreateFormField("print")
	if err != nil {
		return err
	}
	lPrint.Write([]byte("false"))

	//Create select field form
	lSel, err := writer.CreateFormField("select")
	if err != nil {
		return err
	}
	lSel.Write([]byte("true"))

	writer.Close()

	request, err := http.NewRequest("POST", URL, body)

	request.Header.Add("X-Api-Key", "563B1324B68D4D2191461F586C724BC9")
	request.Header.Add("Content-Type", writer.FormDataContentType())
	client := &http.Client{}

	response, err := client.Do(request)

	fmt.Print(response.Status)
	if err != nil {
		return err
	}
	defer response.Body.Close()

	return err

}

//SliceFile ...
func SliceFile(filename string, URL string) error {

	slicer := map[string]interface{}{
		"command": "slice",
		"slicer":  "curalegacy",
		"gcode":   filename + ".gcode",
		"profile": "et4",
		"print":   true,
	}
	slicerData, _ := json.Marshal(slicer)
	fmt.Println(string(slicerData))

	client := &http.Client{}
	FileURL := URL + "/" + filename + ".stl"

	fmt.Println(FileURL)

	req, err := http.NewRequest("POST", FileURL, bytes.NewBuffer(slicerData))

	if err != nil {
		fmt.Println(err)
	}

	req.Header.Add("X-Api-Key", "22B571A9BEB745FB90329839DAB201F7")
	req.Header.Add("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
	}
	defer resp.Body.Close()

	fmt.Println(resp.Status)

	return err
}
