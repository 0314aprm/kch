package api

import (
	"fmt"
	"net/http"
	"time"

	"test.kch/db"
	"test.kch/model"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
)

func loginUser(user *model.User) (string, error) {
	// Create token
	token := jwt.New(jwt.SigningMethodHS256)

	// Set claims
	claims := token.Claims.(jwt.MapClaims)
	claims["id"] = user.ID
	claims["username"] = user.Username
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	// Generate encoded token and send it as response.
	return token.SignedString([]byte("secret"))
}

func Signup(c echo.Context) error {
	username := c.FormValue("username")
	password := c.FormValue("password")

	db := db.DbManager()
	user := model.User{}
	count := 0
	err := db.Where("username = ?", username).First(&user).Count(&count).Error
	fmt.Println(err)
	if count != 0 {
		return echo.ErrUnauthorized
	}

	user = model.User{
		Name:     username,
		Username: username,
		Password: password,
	}
	err = db.Create(&user).Error
	if err != nil {
		return echo.ErrUnauthorized
	}

	t, err := loginUser(&user)
	if err != nil {
		return echo.ErrUnauthorized
	}

	return c.JSON(http.StatusOK, map[string]string{
		"token": t,
	})
}

func Login(c echo.Context) error {
	username := c.FormValue("username")
	password := c.FormValue("password")

	user := new(model.User)
	db := db.DbManager()
	err := db.Where("username = ? AND password = ?", username, password).First(user).Error
	if err != nil {
		return echo.ErrUnauthorized
	}

	t, err := loginUser(user)
	if err != nil {
		return echo.ErrUnauthorized
	}

	return c.JSON(http.StatusOK, map[string]string{
		"token": t,
	})
}

func getJWTClaims(c echo.Context) jwt.MapClaims {
	user := c.Get("user").(*jwt.Token)
	fmt.Println("heyyyyy", user)
	return user.Claims.(jwt.MapClaims)
}

func Me(c echo.Context) error {
	claims := getJWTClaims(c)
	return c.JSON(http.StatusOK, claims)
}
