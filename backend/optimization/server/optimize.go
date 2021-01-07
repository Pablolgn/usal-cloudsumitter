package server

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"math"
	"math/rand"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/fogleman/fauxgl"
	"github.com/fogleman/pack3d/pack3d"
)

const (
	bvhDetail           = 8
	annealingIterations = 2000000
)

func timed(name string) func() {
	if len(name) > 0 {
		fmt.Printf("%s... ", name)
	}
	start := time.Now()
	return func() {
		fmt.Println(time.Since(start))
	}
}

//DownloadFile is ....
func DownloadFile(filepath string, url string) error {

	// Get the data
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Create the file
	out, err := os.Create(filepath)
	if err != nil {
		return err
	}
	defer out.Close()

	// Write the body to file
	_, err = io.Copy(out, resp.Body)
	return err
}

//UploadFile ...
func UploadFile(filename string, url string) error {

	file, err := os.Open("./files_to_optimize/" + filename)

	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("files", filepath.Base(file.Name()))

	if err != nil {
		return err
	}

	io.Copy(part, file)
	writer.Close()
	request, err := http.NewRequest("POST", url, body)

	if err != nil {
		return err
	}

	request.Header.Add("Content-Type", writer.FormDataContentType())
	client := &http.Client{}

	response, err := client.Do(request)

	if err != nil {
		return err
	}
	defer response.Body.Close()

	return err

}

func startOptimize(modelsArray []Print) string {
	var done func()

	rand.Seed(time.Now().UTC().UnixNano())

	model := pack3d.NewModel()
	ok := false
	var totalVolume float64

	for _, arg := range modelsArray {

		count, err := strconv.Atoi(arg.NumberOfFiles)
		done = timed(fmt.Sprintf("loading mesh %s", arg.FileName))

		fileURL := "http://51.105.248.212/api/models/Uploaded_models/" + arg.FileName
		err = DownloadFile("./files_to_optimize/"+arg.FileName, fileURL)
		if err != nil {
			panic(err)
		}

		mesh, err := fauxgl.LoadMesh("./files_to_optimize/" + arg.FileName)
		if err != nil {
			panic(err)
		}
		done()

		fmt.Print("adeaed")

		totalVolume += mesh.BoundingBox().Volume()
		size := mesh.BoundingBox().Size()
		fmt.Printf("  %d triangles\n", len(mesh.Triangles))
		fmt.Printf("  %g x %g x %g\n", size.X, size.Y, size.Z)

		done = timed("centering mesh")
		mesh.Center()
		done()

		done = timed("building bvh tree")
		model.Add(mesh, bvhDetail, count)
		ok = true
		done()
	}

	if !ok {
		fmt.Println("Usage: pack3d N1 mesh1.stl N2 mesh2.stl ...")
		fmt.Println(" - Packs N copies of each mesh into as small of a volume as possible.")
		fmt.Println(" - Runs forever, looking for the best packing.")
		fmt.Println(" - Results are written to disk whenever a new best is found.")
		return "failed"
	}

	side := math.Pow(totalVolume, 1.0/3)
	model.Deviation = side / 32

	best := 1e9
	counter := 0
	today := time.Now()

	for {

		model = model.Pack(annealingIterations, nil)
		score := model.Energy()
		counter++

		if score < best {
			best = score
			done = timed("writing mesh")
			model.Mesh().SaveSTL(fmt.Sprintf("./files_to_optimize/OP-%s.stl", today.Format("15:04:05")))
			done()
		}

		model.Reset()
		if counter == 7 {

			fileName := fmt.Sprintf("OP-%s.stl", today.Format("15:04:05"))
			fileURL := "http://51.105.248.212/api/models/upload"

			err := UploadFile(fileName, fileURL)
			if err != nil {
				panic(err)
			}

			return (fileName)
		}

	}

}
