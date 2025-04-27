package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type PlaceResult struct {
	Name                string   `json:"name"`
	Rating              float64  `json:"rating"`
	Vicinity            string   `json:"vicinity"`
	Types               []string `json:"types"`
	BusinessStatus      string   `json:"business_status,omitempty"`
	Icon                string   `json:"icon,omitempty"`
	IconBackgroundColor string   `json:"icon_background_color,omitempty"`
	IconMaskBaseURI     string   `json:"icon_mask_base_uri,omitempty"`
	OpeningHours        struct {
		OpenNow bool `json:"open_now,omitempty"`
	} `json:"opening_hours,omitempty"`
	PlaceID  string `json:"place_id,omitempty"`
	PlusCode struct {
		CompoundCode string `json:"compound_code,omitempty"`
		GlobalCode   string `json:"global_code,omitempty"`
	} `json:"plus_code,omitempty"`
	UserRatingsTotal int `json:"user_ratings_total,omitempty"`
	Geometry         struct {
		Location struct {
			Lat float64 `json:"lat"`
			Lng float64 `json:"lng"`
		} `json:"location"`
		Viewport struct {
			Northeast struct {
				Lat float64 `json:"lat"`
				Lng float64 `json:"lng"`
			} `json:"northeast"`
			Southwest struct {
				Lat float64 `json:"lat"`
				Lng float64 `json:"lng"`
			} `json:"southwest"`
		} `json:"viewport"`
	} `json:"geometry,omitempty"`
}
type GooglePlacesResponse struct {
	HTMLAttributions []string      `json:"html_attributions"`
	NextPageToken    string        `json:"next_page_token,omitempty"`
	Results          []PlaceResult `json:"results"`
}

func getNearbyRestaurants(lat, lng float64, radius int) ([]PlaceResult, error) {
	apiKey := os.Getenv("GOOGLE_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("API key is not set")
	}
	url := fmt.Sprintf("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=%f,%f&radius=%d&type=restaurant&key=%s", lat, lng, radius, apiKey)
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()
	var placesResponse GooglePlacesResponse
	err = json.NewDecoder(resp.Body).Decode(&placesResponse)
	if err != nil {
		return nil, err
	}
	return placesResponse.Results, nil
}

func restaurantsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Content-Type", "application/json")
	lat, _ := strconv.ParseFloat(r.URL.Query().Get("lat"), 64)
	lng, _ := strconv.ParseFloat(r.URL.Query().Get("lng"), 64)
	radius, _ := strconv.Atoi(r.URL.Query().Get("radius"))
	if lat == 0 || lng == 0 || radius == 0 {
		http.Error(w, "Missing or invalid parameters", http.StatusBadRequest)
		return
	}
	restaurants, err := getNearbyRestaurants(lat, lng, radius)
	if err != nil {
		log.Printf("Error getting restaurants: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(restaurants)
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}
	apiKey := os.Getenv("GOOGLE_API_KEY")
	if apiKey == "" {
		log.Println("Warning: GOOGLE_API_KEY environment variable is not set")
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "8085"
	}
	http.HandleFunc("/restaurants", restaurantsHandler)
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)
	serverAddr := ":" + port
	log.Printf("Server running on http://localhost%s", serverAddr)
	log.Fatal(http.ListenAndServe(serverAddr, nil))
}
